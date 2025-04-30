<?php
header("Access-Control-Allow-Origin: http://localhost:5173"); 
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");
require_once "../Core/config.php";

if($_SERVER['REQUEST_METHOD']==="POST"){
   $data=json_decode(file_get_contents("php://input"),true);

   if(!isset($data['post_id']) || !isset($data['content']) || !isset($data['post_type'])){
       json_encode(["success"=>false,"error"=>"missing parameters"]);
   }
    
   $post_id=$data['post_id'];
   $content=$data['content'];
   $type=$data['post_type'];

   try{
    $stmt=$pdo->prepare("UPDATE posts SET post_content=?,post_type=? WHERE post_id=? ");
    $stmt->execute([$content,$type,$post_id]);

    echo json_encode(["success"=>true]);
   }catch(PDOException $e){
    echo json_encode(["success"=>false,"error"=>$e->getMessage()]);
   }


}
else{
    echo json_encode(["success"=>false,"error"=>"Could not Update the Post"]);
}