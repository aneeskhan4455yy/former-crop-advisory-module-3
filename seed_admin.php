<?php

declare(strict_types=1);

require __DIR__ . '/config.php';

$passwordHash = password_hash('anees123', PASSWORD_DEFAULT);
$stmt = db()->prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), role = VALUES(role)');
$stmt->execute(['Admin User', 'anees123@gmail.com', $passwordHash, 'admin']);
echo 'Admin account seeded successfully.';
