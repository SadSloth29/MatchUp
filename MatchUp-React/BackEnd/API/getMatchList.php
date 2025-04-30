<?php


header("Access-Control-Allow-Origin: http://localhost:5173");  
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");   
header("Access-Control-Allow-Headers: Content-Type, Authorization"); 
header("Access-Control-Allow-Credentials: true");


require_once "../Core/config.php";

if($_SERVER['REQUEST_METHOD']==="POST"){
    $data=json_decode(file_get_contents("php://input"),true);

    $username=$data['username'];
    $action=$data['action'];
    $order=$data['orderby'];
    $sort=$data['sort']==="ASC"? "ASC":"DESC";

    if($action==='Matches'){
        $stmt=$pdo->prepare("SELECT s.user1,s.user2,cnt.user1,m,pfp.img_url AS profile_pic,pfp.username AS username FROM swipes AS s
        LEFT JOIN profile_pic AS pfp
            ON s.user2=pfp.username
        LEFT JOIN (SELECT user1,user2 AS m FROM swipes WHERE user2=?) AS cnt
            ON s.user2 = cnt.user1 AND s.user1 = cnt.m
        WHERE s.user1=? AND m IS NOT NULL ORDER BY username $sort");
        $stmt->execute([$username,$username,]);
        $all=$stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["success"=>true,"followers"=>$all]);
        exit;
    }
    else if($action==='Requests'){
        $stmt=$pdo->prepare("SELECT s.user1 AS username,acc,pfp.img_url AS profile_pic,pfp.username,m.percentage AS Percentage,m.distance AS Distance
        FROM swipes AS s
        LEFT JOIN profile_pic AS pfp
            ON s.user1=pfp.username
        LEFT JOIN matches AS m
            ON s.user1=m.user1 AND s.user2=m.user2
        LEFT JOIN (SELECT user1 AS acc,user2 FROM swipes WHERE user1=?) AS cnt
            ON s.user2=cnt.acc AND s.user1=cnt.user2
        WHERE s.user2=? AND acc IS NULL ORDER BY $order $sort");
        $stmt->execute([$username,$username]);
        $all=$stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["success"=>true,"followers"=>$all]);
        exit;
    }


}