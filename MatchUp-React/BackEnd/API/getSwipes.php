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
        $stmt=$pdo->prepare("SELECT s.user1,s.user2,pfp.img_url AS profile_Pic,pfp.username AS username FROM swipes AS s
        LEFT JOIN profile_pic AS pfp
            ON s.user2=pfp.username
        WHERE s.user1=?");
        $stmt->execute([$user]);
        $users=$stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["success"=>true,"users"=>$users]);
        exit;
    }catch(PDOException $e)
    {
        echo json_encode(["success"=>false,"error"=>$e->getMessage()]);
        exit;
    }

}