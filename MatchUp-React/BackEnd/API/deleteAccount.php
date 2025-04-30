<?php


header("Access-Control-Allow-Origin: http://localhost:5173");  
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");   
header("Access-Control-Allow-Headers: Content-Type, Authorization"); 
header("Access-Control-Allow-Credentials: true");


require_once "../Core/config.php";

if($_SERVER['REQUEST_METHOD']==="POST"){

    $data=json_decode(file_get_contents("php://input"),true);
    
    $user=isset($data['username'])?$data['username']:"";

    
    $stmt=$pdo->prepare("DELETE FROM users WHERE username=?");
    $stmt->execute([$user]);

    session_unset();    
    session_destroy();

    echo json_encode(["success"=>true]);
    exit;
    

}else{
    echo json_encode(["success"=>false,"error"=>"Could not delete account"]);
    exit;
}