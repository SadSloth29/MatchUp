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
        $stmt=$pdo->prepare("SELECT o.username AS partner,o.q1 AS q1,o.q2 AS q2,o.q3 AS q3,o.q4 AS q4,o.q5 AS q5
        ,d.latitude AS latitude
        ,d.longitute AS longitute FROM interest_own AS o
        LEFT JOIN address_info AS d
            ON o.username=d.username 
        WHERE o.username!=?");
        $stmt->execute([$user]);
        $others=$stmt->fetchAll(PDO::FETCH_ASSOC);
        $stmt1=$pdo->prepare("SELECT o.username AS partner,o.q1 AS q1,o.q2 AS q2,o.q3 AS q3,o.q4 AS q4,o.q5 AS q5
        ,d.latitude AS latitude
        ,d.longitute AS longitute,pr.match_distance AS match_distance FROM interest_partner AS o
        LEFT JOIN address_info AS d
            ON o.username=d.username
        LEFT JOIN preference AS pr
            ON o.username=pr.username 
        WHERE o.username=?");
        $stmt1->execute([$user]);
        $own=$stmt1->fetch(PDO::FETCH_ASSOC);

        echo json_encode(["success"=>true,"others"=>$others,"own"=>$own]);
        exit;

    }catch(PDOException $e){
        echo json_encode(["success"=>false,"error"=>$e->getMessage()]);
        exit;
    }
}