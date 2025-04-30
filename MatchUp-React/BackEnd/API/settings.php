<?php
header("Access-Control-Allow-Origin: http://localhost:5173"); 
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
require_once "../Core/config.php";

if($_SERVER['REQUEST_METHOD']==='POST'){
    $data=json_decode(file_get_contents("php://input"),true);

    if($data['option']==="AUTH"){
        $user=$data['username'];
        $pass=$data['password'];

        try{
        $stmt=$pdo->prepare("SELECT password FROM users WHERE username=?");
        $stmt->execute([$user]);
        $info=$stmt->fetch(PDO::FETCH_ASSOC);
        if(password_verify($pass,$info['password'])){
            echo json_encode(["success"=>true]);
            exit;
        }
        else{
            echo json_encode(["success"=>false,"error"=>"Password did not match"]);
            exit;
        }}catch(PDOException $e){
            echo json_encode(["success"=>false,"error"=>$e->getMessage()]);
            exit;
        }
    }
    else if($data['option']==='FETCH'){
        $user=$data['username'];

        try{
            $stmt=$pdo->prepare("SELECT u.email AS email,p.age AS age,p.bio AS bio,pr.personality AS personality,pr.match_distance AS match_distance,
            ad.city AS city,ad.country AS country FROM users AS u
            LEFT JOIN profile AS p
                ON u.username=p.username
            LEFT JOIN preference AS pr
                ON p.username=pr.username
            LEFT JOIN address_info AS ad
                ON u.username=ad.username
            WHERE u.username=?");
            $stmt->execute([$user]);
            $info=$stmt->fetch(PDO::FETCH_ASSOC);

            echo json_encode(["success"=>true,"info"=>$info]);
            
        }catch(PDOException $e){
            echo json_encode(["success"=>false,"error"=>$e->getMessage()]);
            exit;
        }

    }
}