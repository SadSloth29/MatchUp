<?php
header("Access-Control-Allow-Origin: http://localhost:5173"); 
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
require_once "../Core/config.php";

if($_SERVER['REQUEST_METHOD']==="POST"){
    $data=json_decode(file_get_contents("php://input"),true);

    if(!isset($data['profile']) && !isset($data['action']) && !isset($data['follower'])){
        echo json_encode(["success"=>false,"error"=>"Missing Parameters"]);
    }

    $profile=$data['profile'];
    $action=$data['action'];
    $follower=$data['follower'];

    try{
        if($action==='follow'){
            $stmt=$pdo->prepare("INSERT INTO follows(follower,following) VALUES(?,?)");
            $stmt->execute([$follower,$profile]);
         }
         else{
            $stmt=$pdo->prepare("DELETE FROM follows WHERE follower=? AND following=?");
            $stmt->execute([$follower,$profile]);
        }
        echo json_encode(["success" => true]);
    }catch(PDOException $e){
        echo json_encode(["success"=>false,"error"=>$e->getMessage()]);
    }
}