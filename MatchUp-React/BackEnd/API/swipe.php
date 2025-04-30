<?php
header("Access-Control-Allow-Origin: http://localhost:5173"); 
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
require_once "../Core/config.php";
if($_SERVER['REQUEST_METHOD']==='POST'){
    $data=json_decode(file_get_contents("php://input"),true);
    
    $username=$data['username'];
    $type=$data['type'];
    $user=$data['user'];

    if($type==="left"){
        $stmt=$pdo->prepare("INSERT INTO swipes(user1,user2) VALUES(?,?)");
        $stmt->execute([$user,$username]);
        echo json_encode(["success"=>true]);
        exit;

    }else if($type==='right'){
        $stmt=$pdo->prepare("DELETE FROM matches WHERE user1=? AND user2=?");
        $stmt->execute([$user,$username]);
        echo json_encode(["success"=>true]);
        exit;
    }

    


}else{
    echo json_encode(["success"=>false,"error"=>"Could not process connection"]);
}