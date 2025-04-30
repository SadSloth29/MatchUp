<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once "../Core/config.php";

if($_SERVER['REQUEST_METHOD']==="POST"){

    $data=json_decode(file_get_contents("php://input"),true);

    if (!isset($data['post_id'])) {
        echo json_encode(["success" => false, "error" => "Post ID is required"]);
        exit;
    }

    $post_id=$data['post_id'];
    

   

    try{
        $stmt=$pdo->prepare("DELETE FROM posts WHERE post_id=?");
        $stmt->execute([$post_id]);

        echo json_encode(["success"=>true]);
    }catch(PDOException $e){
        echo json_encode(["success"=>false,"error"=>$e->getMessage()]);
    }
}
else{
    echo json_encode(["success"=>false,"error"=>"Could Not Delete Post"]);
}