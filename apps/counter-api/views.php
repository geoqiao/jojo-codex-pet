<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, max-age=0');
header('X-Content-Type-Options: nosniff');

function respond(int $status, array $payload): never
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
    exit;
}

function loadAllowedIds(): array
{
    $path = __DIR__ . '/catalog-ids.json';
    $json = is_file($path) ? file_get_contents($path) : false;
    $ids = $json === false ? null : json_decode($json, true);

    if (!is_array($ids)) {
        respond(503, ['error' => 'catalog_unavailable']);
    }

    return array_fill_keys($ids, true);
}

function connectDatabase(): PDO
{
    $configPath = __DIR__ . '/config.php';
    if (!is_file($configPath)) {
        respond(503, ['error' => 'counter_unavailable']);
    }

    $config = require $configPath;
    if (!is_array($config) || !isset($config['dsn'], $config['username'], $config['password'])) {
        respond(503, ['error' => 'counter_unavailable']);
    }

    try {
        return new PDO(
            $config['dsn'],
            $config['username'],
            $config['password'],
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ],
        );
    } catch (Throwable $error) {
        error_log('JoJo page counter database connection failed: ' . $error->getMessage());
        respond(503, ['error' => 'counter_unavailable']);
    }
}

function ensureSchema(PDO $database): void
{
    $database->exec(
        'CREATE TABLE IF NOT EXISTS pet_page_views ('
        . 'pet_id VARCHAR(96) NOT NULL PRIMARY KEY,'
        . 'view_count BIGINT UNSIGNED NOT NULL DEFAULT 0,'
        . 'updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
        . ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci',
    );
}

$allowedIds = loadAllowedIds();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    $rawIds = isset($_GET['ids']) && is_string($_GET['ids']) ? $_GET['ids'] : '';
    $requested = array_values(array_unique(array_filter(explode(',', $rawIds))));

    if ($requested === [] || count($requested) > 100) {
        respond(400, ['error' => 'invalid_ids']);
    }

    foreach ($requested as $id) {
        if (!isset($allowedIds[$id])) {
            respond(400, ['error' => 'unknown_pet']);
        }
    }

    $counts = array_fill_keys($requested, 0);
    $placeholders = implode(',', array_fill(0, count($requested), '?'));

    try {
        $database = connectDatabase();
        ensureSchema($database);
        $statement = $database->prepare(
            "SELECT pet_id, view_count FROM pet_page_views WHERE pet_id IN ($placeholders)",
        );
        $statement->execute($requested);
        foreach ($statement->fetchAll() as $row) {
            $counts[$row['pet_id']] = (int) $row['view_count'];
        }
        respond(200, ['counts' => $counts]);
    } catch (Throwable $error) {
        error_log('JoJo page counter read failed: ' . $error->getMessage());
        respond(503, ['error' => 'counter_unavailable']);
    }
}

if ($method === 'POST') {
    $rawBody = file_get_contents('php://input', false, null, 0, 2048);
    $payload = $rawBody === false ? null : json_decode($rawBody, true);
    $petId = is_array($payload) && isset($payload['pet_id']) && is_string($payload['pet_id'])
        ? $payload['pet_id']
        : '';

    if (!isset($allowedIds[$petId])) {
        respond(400, ['error' => 'unknown_pet']);
    }

    try {
        $database = connectDatabase();
        ensureSchema($database);
        $database->beginTransaction();
        $statement = $database->prepare(
            'INSERT INTO pet_page_views (pet_id, view_count) VALUES (?, 1) '
            . 'ON DUPLICATE KEY UPDATE view_count = view_count + 1',
        );
        $statement->execute([$petId]);
        $read = $database->prepare('SELECT view_count FROM pet_page_views WHERE pet_id = ?');
        $read->execute([$petId]);
        $count = (int) $read->fetchColumn();
        $database->commit();
        respond(200, ['pet_id' => $petId, 'count' => $count]);
    } catch (Throwable $error) {
        if (isset($database) && $database->inTransaction()) {
            $database->rollBack();
        }
        error_log('JoJo page counter write failed: ' . $error->getMessage());
        respond(503, ['error' => 'counter_unavailable']);
    }
}

header('Allow: GET, POST');
respond(405, ['error' => 'method_not_allowed']);
