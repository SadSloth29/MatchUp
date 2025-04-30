<?php
header("Access-Control-Allow-Origin: http://localhost:5173"); 
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
require_once "../Core/config.php";

if($_SERVER['REQUEST_METHOD']==="POST"){
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data["post_id"]) || !isset($data["action"])) {
        echo json_encode(["success" => false, "error" => "Missing parameters"]);
        exit;
    };

    $post_id=$data["post_id"];
    $user = $_SESSION["username"];
    $action=$data["action"];

    try{
        if($action==="like"){
            $stmt=$pdo->prepare("INSERT INTO likes(post_id,liked_by) VALUES(? , ?)");
            $stmt->execute([$post_id,$user]);

        }
        else{
            $stmt=$pdo->prepare("DELETE FROM likes WHERE post_id=? AND liked_by=?");
            $stmt->execute([$post_id,$user]);
        }
        echo json_encode(["success" => true]);
    }catch(PDOException $e){
        echo json_encode(["success"=>false,"error"=>$e->getMessage()]);
    }

    
}
else {
    echo json_encode(["success" => false, "error" => "Invalid request"]);
}