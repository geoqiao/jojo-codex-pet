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

function storagePaths(): array
{
    $override = getenv('JOJO_COUNTER_STORAGE_DIR');
    $root = is_string($override) && $override !== '' ? $override : dirname(__DIR__, 5);

    if (!is_dir($root) || !is_writable($root)) {
        respond(503, ['error' => 'counter_unavailable']);
    }

    return [
        'data' => $root . '/.jojo-codex-pet-views.json',
        'lock' => $root . '/.jojo-codex-pet-views.lock',
    ];
}

function readStore(string $path): array
{
    if (!is_file($path)) {
        return [];
    }

    $json = file_get_contents($path);
    if ($json === false || trim($json) === '') {
        return [];
    }

    $store = json_decode($json, true);
    if (!is_array($store)) {
        throw new RuntimeException('Counter store is invalid JSON.');
    }

    foreach ($store as $id => $entry) {
        if (
            !is_string($id)
            || !is_array($entry)
            || !isset($entry['count'], $entry['updated_at'])
            || !is_int($entry['count'])
            || $entry['count'] < 0
            || !is_string($entry['updated_at'])
        ) {
            throw new RuntimeException('Counter store contains an invalid entry.');
        }
    }

    return $store;
}

function writeStore(string $path, array $store): void
{
    $directory = dirname($path);
    $temporary = tempnam($directory, '.jojo-pet-views-');
    if ($temporary === false) {
        throw new RuntimeException('Unable to create a temporary counter file.');
    }

    try {
        $json = json_encode($store, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR);
        if (file_put_contents($temporary, $json . PHP_EOL) === false) {
            throw new RuntimeException('Unable to write the counter store.');
        }
        @chmod($temporary, 0600);
        if (!rename($temporary, $path)) {
            throw new RuntimeException('Unable to replace the counter store.');
        }
    } finally {
        if (is_file($temporary)) {
            @unlink($temporary);
        }
    }
}

function withStoreLock(int $mode, callable $operation): mixed
{
    $paths = storagePaths();
    $handle = @fopen($paths['lock'], 'c');
    if (is_resource($handle)) {
        @chmod($paths['lock'], 0600);
    }
    if ($handle === false || !flock($handle, $mode)) {
        if (is_resource($handle)) {
            fclose($handle);
        }
        throw new RuntimeException('Unable to lock the counter store.');
    }

    try {
        return $operation($paths['data']);
    } finally {
        flock($handle, LOCK_UN);
        fclose($handle);
    }
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

    try {
        $store = withStoreLock(LOCK_SH, fn (string $path): array => readStore($path));
        $counts = array_fill_keys($requested, 0);
        foreach ($requested as $id) {
            if (isset($store[$id])) {
                $counts[$id] = $store[$id]['count'];
            }
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
        $count = withStoreLock(LOCK_EX, function (string $path) use ($petId): int {
            $store = readStore($path);
            $count = ($store[$petId]['count'] ?? 0) + 1;
            $store[$petId] = [
                'count' => $count,
                'updated_at' => gmdate(DATE_ATOM),
            ];
            writeStore($path, $store);
            return $count;
        });
        respond(200, ['pet_id' => $petId, 'count' => $count]);
    } catch (Throwable $error) {
        error_log('JoJo page counter write failed: ' . $error->getMessage());
        respond(503, ['error' => 'counter_unavailable']);
    }
}

header('Allow: GET, POST');
respond(405, ['error' => 'method_not_allowed']);
