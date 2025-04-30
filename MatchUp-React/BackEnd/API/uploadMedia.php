<?php
header("Access-Control-Allow-Origin: http://localhost:5173"); 
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");
require_once "../Core/config.php";

if($_SERVER['REQUEST_METHOD']==="POST"){
    $data=json_decode(file_get_contents("php://input"),true);
 
    if(!isset($data['post_id']) || !isset($data['type']) || !isset($data['url']) || !isset($data['action'])){
        echo json_encode(["success"=>false,"error"=>"missing parameters"]);
    }

    $id=$data['post_id'];
    $type=$data['type'];
    $url=$data['url'];
    $action=$data['action'];
    
    if($type==="image"){
        $media="images(post_id,img_url)";
    }
    else{
        $media="videos(post_id,video_url)";
    }

    if(!$url && $action==='update'){
        echo json_encode(["success"=>true]);
        exit;
    }

    if($action==="insert"){
        try{
        $stmt=$pdo->prepare("INSERT INTO $media VALUES (?,?)");
        $stmt->execute([$id,$url]);

        echo json_encode(["success"=>true]);
    }catch(PDOException $e){
        echo json_encode(["success"=>false,"error"=>$e->getMessage()]);
    }
    }
    else if($action==="update" && $type==="image"){
        try{
        $stmt=$pdo->prepare("UPDATE images SET img_url=? WHERE post_id=?");
        $stmt->execute([$url,$id]);

        echo json_encode(["success"=>true]);
    }catch(PDOException $e){
        echo json_encode(["success"=>false,"error"=>$e->getMessage()]);
    }
    }
    else if($action==="update" && $type==="video"){
        try{
        $stmt=$pdo->prepare("UPDATE videos SET video_url=? WHERE post_id=?");
        $stmt->execute([$url,$id]);

        echo json_encode(["success"=>true]);
    }catch(PDOException $e){
        echo json_encode(["success"=>false,"error"=>$e->getMessage()]);
    }
    }


}
else{
    echo json_encode(["success"=>false,"error"=>"Error processing request"]);
}