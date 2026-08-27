<?php

declare(strict_types=1);

session_start();
require __DIR__ . '/config.php';
header('Content-Type: application/json; charset=utf-8');

function response(array $data, int $status = 200): never
{
    http_response_code($status);
    echo json_encode($data);
    exit;
}

function input(): array
{
    return json_decode(file_get_contents('php://input'), true) ?: $_POST;
}

function csrf(): string
{
    return $_SESSION['csrf'] ??= bin2hex(random_bytes(32));
}

$action = $_GET['action'] ?? '';
if ($action === 'csrf') response(['csrf' => csrf()]);

if ($action === 'login' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = input();
    $stmt = db()->prepare('SELECT * FROM users WHERE email = ? LIMIT 1');
    $stmt->execute([trim((string)($data['email'] ?? ''))]);
    $user = $stmt->fetch();
    if (!$user || !password_verify((string)($data['password'] ?? ''), $user['password_hash'])) response(['error' => 'Invalid email or password.'], 401);
    session_regenerate_id(true);
    $_SESSION['user'] = ['id' => $user['id'], 'name' => $user['name'], 'role' => $user['role']];
    response(['user' => $_SESSION['user'], 'csrf' => csrf()]);
}

if ($action === 'logout') {
    $_SESSION = [];
    session_destroy();
    response(['ok' => true]);
}

if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') response(['error' => 'Admin login required.'], 403);
if (!hash_equals($_SESSION['csrf'] ?? '', $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '')) response(['error' => 'Invalid CSRF token.'], 419);

$data = input();
if ($action === 'create-user') {
    $stmt = db()->prepare('INSERT INTO users (name, email, password_hash, role, farm_name) VALUES (?, ?, ?, ?, ?)');
    $stmt->execute([trim($data['name']), trim($data['email']), password_hash($data['password'], PASSWORD_DEFAULT), $data['role'] ?? 'farmer', trim($data['farm_name'] ?? '')]);
    response(['id' => db()->lastInsertId()]);
}
if ($action === 'create-crop') {
    $stmt = db()->prepare('INSERT INTO crops (name, season, soil_type, water_requirement, application_instruction) VALUES (?, ?, ?, ?, ?)');
    $stmt->execute([$data['name'], $data['season'], $data['soil_type'], $data['water_requirement'], $data['application_instruction']]);
    response(['id' => db()->lastInsertId()]);
}
if ($action === 'update-crop') {
    $stmt = db()->prepare('UPDATE crops SET name=?, season=?, soil_type=?, water_requirement=?, application_instruction=? WHERE id=?');
    $stmt->execute([$data['name'], $data['season'], $data['soil_type'], $data['water_requirement'], $data['application_instruction'], (int)$data['id']]);
    response(['ok' => true]);
}
if ($action === 'delete-crop') {
    db()->prepare('DELETE FROM crops WHERE id=?')->execute([(int)$data['id']]);
    response(['ok' => true]);
}
if ($action === 'create-fertilizer') {
    $stmt = db()->prepare('INSERT INTO fertilizers (name, type, quantity, application_instruction) VALUES (?, ?, ?, ?)');
    $stmt->execute([$data['name'], $data['type'], $data['quantity'], $data['application_instruction']]);
    response(['id' => db()->lastInsertId()]);
}
if ($action === 'delete-fertilizer') {
    db()->prepare('DELETE FROM fertilizers WHERE id=?')->execute([(int)$data['id']]);
    response(['ok' => true]);
}
response(['error' => 'Unknown action.'], 404);
