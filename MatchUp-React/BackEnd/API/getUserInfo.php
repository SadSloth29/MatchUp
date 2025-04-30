<?php


header("Access-Control-Allow-Origin: http://localhost:5173");  
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");   
header("Access-Control-Allow-Headers: Content-Type, Authorization"); 
header("Access-Control-Allow-Credentials: true");


require_once "../Core/config.php";

if($_SERVER['REQUEST_METHOD']==="POST"){

    $data=json_decode(file_get_contents("php://input"),true);

    if(!isset($data['username']) || !isset($data['checking'])){
        echo json_encode(["success"=>false,"error"=>"Missing Parameters"]);
        exit;
    }

    $user=$data['username'];
    $follower=$data['checking'];

    try{
        $stmt=$pdo->prepare("SELECT p.username AS username,p.age AS age,p.gender AS gender
        ,p.bio AS bio,pfp.img_url AS img,pr.personality AS pers,pr.match_distance AS md,c.city AS city,c.country AS country,
        (SELECT COUNT(*) FROM follows WHERE following=? AND follower=?) AS follow FROM
        profile AS p LEFT JOIN profile_pic AS pfp
            ON p.username=pfp.username
        LEFT JOIN preference AS pr
            ON p.username=pr.username
        LEFT JOIN address_info AS c
            ON p.username=c.username
        WHERE p.username=?");
        $stmt->execute([$user,$follower,$user]);
        $result=$stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(["success"=>true,"info"=>$result]);
    }catch(PDOException $e){
        echo json_encode(["success"=>false,"error"=>$e->getMessage()]);
        exit;
    }
}
else{
    echo json_encode(["success"=>false,"error"=>"Error fetching info"]);
    exit;
}