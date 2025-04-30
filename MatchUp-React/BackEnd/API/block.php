<?php


header("Access-Control-Allow-Origin: http://localhost:5173");  
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");   
header("Access-Control-Allow-Headers: Content-Type, Authorization"); 
header("Access-Control-Allow-Credentials: true");


require_once "../Core/config.php";

if($_SERVER['REQUEST_METHOD']==="POST"){

    $data=json_decode(file_get_contents("php://input"),true);

    if(!isset($data['username']) || !isset($data['blocked_by']) || !isset($data['action'])){
        echo json_encode(["success"=>false,"error"=>"Missing parameters"]);
        exit;
    }

    $user=$data['username'];
    $blocked_by=$data['blocked_by'];
    $action=$data['action'];

    if($action==="insert"){
        try{
            $stmt=$pdo->prepare("INSERT INTO blocklist(blocked_by,blocked_user) VALUES (?,?)");
            $stmt->execute([$blocked_by,$user]);

            echo json_encode(["success"=>true]);
            exit;
        }catch(PDOException $e){
            echo json_encode(["success"=>false,"error"=>$e->getMessage()]);
            exit;
        }
    }

    if($action==="check"){
        try{
            $stmt=$pdo->prepare("SELECT (SELECT COUNT(*) FROM blocklist WHERE blocked_by=? AND blocked_user=?) AS blocked1,(SELECT COUNT(*) FROM blocklist WHERE blocked_by=? AND
            blocked_user=?) AS blocked2 FROM blocklist");
            $stmt->execute([$user,$blocked_by,$blocked_by,$user]);
            $info=$stmt->fetch(PDO::FETCH_ASSOC);
            
            
            echo json_encode(["success"=>true,"info"=>$info]);
            exit;
        }catch(PDOException $e){
            echo json_encode(["success"=>false,"error"=>$e->getMessage()]);
        }
    }
    if($action==="remove"){
        try{
            $stmt=$pdo->prepare("DELETE FROM blocklist WHERE blocked_user=? AND blocked_by=?");
            $stmt->execute([$user,$blocked_by]);

            echo json_encode(["success"=>true]);
            exit;
        }catch(PDOException $e){
            echo json_encode(["success"=>false,"error"=>$e->getMessage()]);
            exit;
        }
    }
}