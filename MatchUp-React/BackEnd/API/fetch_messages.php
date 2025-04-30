<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once "../Core/config.php";

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['from']) && isset($data['to'])) {
    $stmt = $pdo->prepare("
        SELECT sender AS `from`, receiver AS `to`, message AS text, send_at AS time 
        FROM messages 
        WHERE ((sender = ? AND receiver = ?) OR (sender = ? AND receiver = ?))
        AND send_at >= (NOW() - INTERVAL 1 DAY)
        ORDER BY send_at ASC
    ");
    $stmt->execute([$data['from'], $data['to'], $data['to'], $data['from']]);
    $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "messages" => $messages]);
} else {
    echo json_encode(["success" => false, "error" => "Missing required fields"]);
}