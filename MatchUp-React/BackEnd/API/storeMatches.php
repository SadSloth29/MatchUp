<?php
header("Access-Control-Allow-Origin: http://localhost:5173"); 
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
require_once "../Core/config.php";

if($_SERVER['REQUEST_METHOD']==='POST'){
    $data = json_decode(file_get_contents("php://input"), true);


    $username1 = $data["username1"];
    $matches = $data["matches"];
   
    foreach($matches as $match){
        $username2=$match['username2'];
        $percentage=$match['matchPercentage'];
        $distance=$match['distance'];

        $stmt = $pdo->prepare("SELECT * FROM swipes WHERE (user1 = ? AND user2 = ?)");
        $stmt->execute([$username1,$username2]);
        $rows=$stmt->fetch(PDO::FETCH_ASSOC);
        if ($rows === false) {
            
        $insert = $pdo->prepare("INSERT INTO matches (user1, user2, percentage,distance) VALUES (?, ?, ?, ?)");
        $insert->execute( [$username1, $username2, $percentage,$distance]);
        
        
        }

    }
    echo json_encode(["success"=>true]);
    exit;
   

}