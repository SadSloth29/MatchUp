<?php
header("Access-Control-Allow-Origin: http://localhost:5173"); 
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");
require_once "../Core/config.php";
session_start();
if($_SERVER['REQUEST_METHOD']==="POST"){
    $data=json_decode(file_get_contents("php://input"),true);

    $username=$data['username'];
    $pfp=$data['profile_pic'];

    if (!$username || !$pfp) {
        echo json_encode(["error" => "Missing required fields"]);
        exit;
    }

    try{
        $stmt=$pdo->prepare("INSERT INTO profile_pic (img_url, username) VALUES (?, ?) 
        ON DUPLICATE KEY UPDATE img_url = VALUES(img_url)");
        $stmt->execute([$pfp,$username]);

        echo json_encode(["success"=>true]);
    }catch(PDOException $e){
        echo json_encode(["success"=>false,"error"=>$e->getMessage()]);
    }
}
else{
    echo json_encode(["success"=>false,"error"=>"Could not complete request"]);
}