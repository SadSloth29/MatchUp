<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once "../Core/config.php";

$data = json_decode(file_get_contents("php://input"), true);
if(isset($data['from']) && isset($data['to']) && isset($data['time']) ){
    
    $stmt=$pdo->prepare("DELETE FROM messages WHERE sender=? AND receiver=? AND message=?");
    $stmt->execute([$data['from'],$data['to'],$data['text']]);
    echo json_encode(["success"=>true]);
    exit;

}else{
    echo json_encode(["success"=>false,"error"=>"Could not delete text"]);
    exit;
}
?>
