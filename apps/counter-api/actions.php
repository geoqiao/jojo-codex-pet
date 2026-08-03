<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, max-age=0');
header('X-Content-Type-Options: nosniff');

const MAX_ACTION_BODY_BYTES = 2048;
const ACTION_EVENT_TYPES = [
    'install_command_copy_success' => true,
    'install_deeplink_click' => true,
];
const ACTION_METHODS = [
    'bash' => true,
    'powershell' => true,
    'npx' => true,
    'codex' => true,
];
const ACTION_LOCALES = [
    'en' => true,
    'zh-CN' => true,
];

function respond(int $status, array $payload): never
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
    exit;
}

function loadReleasedIds(): array
{
    $path = __DIR__ . '/released-pet-ids.json';
    $json = is_file($path) ? @file_get_contents($path) : false;
    $ids = $json === false ? null : json_decode($json, true);

    if (!is_array($ids) || array_is_list($ids) === false) {
        respond(503, ['error' => 'catalog_unavailable']);
    }

    $allowed = [];
    foreach ($ids as $id) {
        if (!is_string($id) || preg_match('/^part-[0-9]{2}-[a-z0-9-]+$/', $id) !== 1) {
            respond(503, ['error' => 'catalog_unavailable']);
        }
        $allowed[$id] = true;
    }

    return $allowed;
}

function actionStoragePaths(): array
{
    $override = getenv('JOJO_ACTIONS_STORAGE_DIR');
    $domainsMarker = DIRECTORY_SEPARATOR . 'domains' . DIRECTORY_SEPARATOR;
    $domainsOffset = strpos(__DIR__, $domainsMarker);
    $accountRoot = $domainsOffset === false ? dirname(__DIR__, 4) : substr(__DIR__, 0, $domainsOffset);
    $root = is_string($override) && $override !== '' ? $override : $accountRoot;

    if (!is_dir($root) || !is_writable($root)) {
        respond(503, ['error' => 'actions_unavailable']);
    }

    return [
        'data' => $root . '/.jojo-codex-pet-actions.json',
        'lock' => $root . '/.jojo-codex-pet-actions.lock',
    ];
}

function validLandingPath(string $path, string $locale, string $petId): bool
{
    if ($locale === 'en') {
        return $path === '/install/' || $path === "/pets/{$petId}/";
    }

    return $path === '/zh-CN/install/' || $path === "/zh-CN/pets/{$petId}/";
}

function validEventMethod(string $eventType, string $method): bool
{
    if ($eventType === 'install_deeplink_click') {
        return $method === 'codex';
    }

    return $eventType === 'install_command_copy_success'
        && in_array($method, ['bash', 'powershell', 'npx'], true);
}

function actionKey(array $entry): string
{
    return implode('|', [
        $entry['day'],
        $entry['event_type'],
        $entry['pet_id'],
        $entry['method'],
        $entry['locale'],
        $entry['landing_path'],
    ]);
}

function validDay(string $day): bool
{
    $date = DateTimeImmutable::createFromFormat('!Y-m-d', $day, new DateTimeZone('UTC'));
    return $date !== false && $date->format('Y-m-d') === $day;
}

function readActionStore(string $path, array $allowedIds): array
{
    if (!is_file($path)) {
        return [];
    }

    $json = @file_get_contents($path);
    if ($json === false || trim($json) === '') {
        throw new RuntimeException('Unable to read a non-empty action store.');
    }

    $store = json_decode($json, true);
    if (!is_array($store) || array_is_list($store)) {
        throw new RuntimeException('Action store is invalid JSON.');
    }

    $expectedFields = ['count', 'day', 'event_type', 'landing_path', 'locale', 'method', 'pet_id', 'updated_at'];
    sort($expectedFields);

    foreach ($store as $key => $entry) {
        if (!is_string($key) || !is_array($entry) || array_is_list($entry)) {
            throw new RuntimeException('Action store contains an invalid entry.');
        }

        $fields = array_keys($entry);
        sort($fields);
        if ($fields !== $expectedFields) {
            throw new RuntimeException('Action store contains unexpected fields.');
        }

        if (
            !is_string($entry['day'])
            || !validDay($entry['day'])
            || !is_string($entry['event_type'])
            || !isset(ACTION_EVENT_TYPES[$entry['event_type']])
            || !is_string($entry['pet_id'])
            || !isset($allowedIds[$entry['pet_id']])
            || !is_string($entry['method'])
            || !isset(ACTION_METHODS[$entry['method']])
            || !is_string($entry['locale'])
            || !isset(ACTION_LOCALES[$entry['locale']])
            || !is_string($entry['landing_path'])
            || !validLandingPath($entry['landing_path'], $entry['locale'], $entry['pet_id'])
            || !validEventMethod($entry['event_type'], $entry['method'])
            || !is_int($entry['count'])
            || $entry['count'] < 1
            || !is_string($entry['updated_at'])
            || actionKey($entry) !== $key
        ) {
            throw new RuntimeException('Action store contains an invalid entry.');
        }
    }

    return $store;
}

function writeActionStore(string $path, array $store, ?callable $writeFile = null): void
{
    ksort($store);
    $directory = dirname($path);
    $temporary = @tempnam($directory, '.jojo-pet-actions-');
    if ($temporary === false) {
        throw new RuntimeException('Unable to create a temporary action file.');
    }

    try {
        $json = json_encode($store, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR);
        $contents = $json . PHP_EOL;
        $writer = $writeFile ?? static fn (string $file, string $data): int|false => @file_put_contents($file, $data);
        $written = $writer($temporary, $contents);
        if (!is_int($written) || $written !== strlen($contents)) {
            throw new RuntimeException('Unable to write the complete action store.');
        }
        @chmod($temporary, 0600);
        if (!@rename($temporary, $path)) {
            throw new RuntimeException('Unable to replace the action store.');
        }
    } finally {
        if (is_file($temporary)) {
            @unlink($temporary);
        }
    }
}

function withActionStoreLock(callable $operation): mixed
{
    $paths = actionStoragePaths();
    $handle = @fopen($paths['lock'], 'c');
    if (is_resource($handle)) {
        @chmod($paths['lock'], 0600);
    }
    if ($handle === false || !flock($handle, LOCK_EX)) {
        if (is_resource($handle)) {
            fclose($handle);
        }
        throw new RuntimeException('Unable to lock the action store.');
    }

    try {
        return $operation($paths['data']);
    } finally {
        flock($handle, LOCK_UN);
        fclose($handle);
    }
}

if (defined('JOJO_ACTIONS_FUNCTIONS_ONLY') && JOJO_ACTIONS_FUNCTIONS_ONLY === true) {
    return;
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method !== 'POST') {
    header('Allow: POST');
    respond(405, ['error' => 'method_not_allowed']);
}

$contentLength = $_SERVER['CONTENT_LENGTH'] ?? null;
if (is_string($contentLength) && ctype_digit($contentLength) && (int) $contentLength > MAX_ACTION_BODY_BYTES) {
    respond(413, ['error' => 'body_too_large']);
}

$rawBody = @file_get_contents('php://input', false, null, 0, MAX_ACTION_BODY_BYTES + 1);
if ($rawBody === false || strlen($rawBody) > MAX_ACTION_BODY_BYTES) {
    respond(413, ['error' => 'body_too_large']);
}

$payload = json_decode($rawBody, true);
if (!is_array($payload) || array_is_list($payload)) {
    respond(400, ['error' => 'invalid_payload']);
}

$eventType = isset($payload['event_type']) && is_string($payload['event_type']) ? $payload['event_type'] : '';
$petId = isset($payload['pet_id']) && is_string($payload['pet_id']) ? $payload['pet_id'] : '';
$actionMethod = isset($payload['method']) && is_string($payload['method']) ? $payload['method'] : '';
$locale = isset($payload['locale']) && is_string($payload['locale']) ? $payload['locale'] : '';
$landingPath = isset($payload['landing_path']) && is_string($payload['landing_path']) ? $payload['landing_path'] : '';

if (!isset(ACTION_EVENT_TYPES[$eventType])) {
    respond(400, ['error' => 'invalid_event_type']);
}
if (!isset(ACTION_METHODS[$actionMethod]) || !validEventMethod($eventType, $actionMethod)) {
    respond(400, ['error' => 'invalid_method']);
}
if (!isset(ACTION_LOCALES[$locale])) {
    respond(400, ['error' => 'invalid_locale']);
}

$allowedIds = loadReleasedIds();
if (!isset($allowedIds[$petId])) {
    respond(400, ['error' => 'unknown_pet']);
}
if (!validLandingPath($landingPath, $locale, $petId)) {
    respond(400, ['error' => 'invalid_landing_path']);
}

$entry = [
    'day' => gmdate('Y-m-d'),
    'event_type' => $eventType,
    'pet_id' => $petId,
    'method' => $actionMethod,
    'locale' => $locale,
    'landing_path' => $landingPath,
];

try {
    withActionStoreLock(function (string $path) use ($entry, $allowedIds): void {
        $store = readActionStore($path, $allowedIds);
        $key = actionKey($entry);
        $store[$key] = [
            ...$entry,
            'count' => ($store[$key]['count'] ?? 0) + 1,
            'updated_at' => gmdate(DATE_ATOM),
        ];
        writeActionStore($path, $store);
    });
    respond(200, ['accepted' => true]);
} catch (Throwable $error) {
    error_log('JoJo action counter write failed: ' . $error->getMessage());
    respond(503, ['error' => 'actions_unavailable']);
}
