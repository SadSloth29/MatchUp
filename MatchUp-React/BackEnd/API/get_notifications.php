<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "../Core/config.php";

$user_id = $_GET['user_id'] ?? null;

if ($user_id) {
    $stmt = $pdo->prepare("
        SELECT id, type, created_at 
        FROM notifications 
        WHERE user_id = ? AND created_at >= NOW() - INTERVAL 1 DAY 
        ORDER BY created_at DESC
    ");
    $stmt->execute([$user_id]);
    $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["success" => true, "notifications" => $notifications]);
} else {
    echo json_encode(["success" => false, "error" => "Missing user_id"]);
}
