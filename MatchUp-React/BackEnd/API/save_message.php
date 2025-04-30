<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once "../Core/config.php";

$data = json_decode(file_get_contents("php://input"), true);


if (!isset($data['from'], $data['to'], $data['text']) || empty(trim($data['text']))) {
   
    echo json_encode(["success" => false, "message" => "Missing or invalid fields"]);
    exit;
}

$stmt = $pdo->prepare("INSERT INTO messages (sender, receiver, message, send_at, seen) VALUES (?, ?, ?, ?, 0)");
$stmt->execute([
    $data['from'],
    $data['to'],
    $data['text'],
    date('Y-m-d H:i:s')
]);

echo json_encode(["success" => true]);