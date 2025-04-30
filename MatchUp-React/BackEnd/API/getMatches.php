<?php
header("Access-Control-Allow-Origin: http://localhost:5173"); 
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
require_once "../Core/config.php";
if($_SERVER['REQUEST_METHOD']==='POST'){
    $data=json_decode(file_get_contents("php://input"),true);

    $user=$data['username'];

    try{
        $stmt=$pdo->prepare("SELECT m.user2 AS username,pfp.img_url AS url,m.percentage AS percentage,m.distance AS distance
        FROM matches AS m
        LEFT JOIN profile_pic AS pfp
            ON m.user2=pfp.username
        WHERE m.user1=?");
        $stmt->execute([$user]);
        $matches=$stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["success"=>true,"matches"=>$matches]);
        exit;

    }catch(PDOException $e){
        echo json_encode(["success"=>false,"error"=>$e->getMessage()]);
    }


}