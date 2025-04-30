<?php
header("Access-Control-Allow-Origin: http://localhost:5173"); 
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
require_once "../Core/config.php";

if($_SERVER['REQUEST_METHOD']==="POST"){
    $data=json_decode(file_get_contents("php://input"),true);

    if(!isset($data['content']) || !isset($data['type']) || !isset($data['username'])){
        echo json_encode(["success"=>false,"error"=>"Missing Parameters"]);
        exit;
    }

    $content=$data['content'];
    $type=$data['type'];
    $user=$data['username'];

    try{
        $stmt=$pdo->prepare("INSERT INTO posts(posted_by,post_content,post_type) VALUES(?,?,?)");
        $stmt->execute([$user,$content,$type]);

        $get=$pdo->prepare("SELECT post_id FROM posts WHERE posted_by=? ORDER BY post_id DESC");
        $get->execute([$user]);
        $postId=$get->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(["success"=>true,"postId"=>$postId]);
    }catch(PDOException $e){
        echo json_encode(["success"=>false,"error"=>$e->getMessage()]);
    }
}
else{
        echo json_encode(["success"=>false,"error"=>"Error Inserting Post"]);
} 