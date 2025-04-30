<?php


header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once "../Core/config.php";

if($_SERVER['REQUEST_METHOD']==="GET" && isset($_GET["username"]) && isset($_GET["location"])){

    $username=$_GET["username"];
    $location=$_GET["location"];
    $loggedInUser = isset($_GET["loggedUser"]) ? $_GET["loggedUser"] : null;
    

    try{
        if($location==='profile'){
        $stmt=$pdo->prepare("SELECT u.username AS username,i.img_url AS profile_pic,p.post_id AS post_id,
        p.posted_by AS posted_by,p.post_type AS post_type,p.post_content AS content,im.img_url AS img,
        v.video_url AS vid,(SELECT COUNT(*) FROM likes WHERE post_id=p.post_id AND liked_by=?) AS liked FROM users AS u
        LEFT JOIN profile_pic AS i
            ON u.username=i.username
        LEFT JOIN posts AS p
            ON u.username=p.posted_by
        LEFT JOIN images AS im
            ON p.post_id=im.post_id
        LEFT JOIN videos AS v
            ON p.post_id=v.post_id
        LEFT JOIN likes AS l
            ON p.post_id=l.post_id
        WHERE u.username=?
        ORDER BY post_id ASC
        ");
        $stmt->execute([$loggedInUser,$username]);
        $posts=$stmt->fetchALL(PDO::FETCH_ASSOC);
        
        

        echo json_encode(["success" => true, "posts" => $posts]);
        exit;
        
        }else if($location==="feed"){
            $stmt=$pdo->prepare("SELECT f.following AS username,pfp.img_url AS profile_pic,p.post_id AS post_id,
        p.posted_by AS posted_by,p.post_type AS post_type,p.post_content AS content,im.img_url AS img,
        v.video_url AS vid,(SELECT COUNT(*) FROM likes WHERE post_id=p.post_id AND liked_by=?) AS liked FROM posts AS p
        LEFT JOIN follows AS f
            ON p.posted_by=f.following
        LEFT JOIN profile_pic AS pfp
            ON p.posted_by=pfp.username
        LEFT JOIN images AS im
            ON p.post_id=im.post_id
        LEFT JOIN videos AS v
            ON p.post_id=v.post_id
        LEFT JOIN likes AS l
            ON p.post_id=l.post_id
        WHERE f.follower=? AND p.created_at >= CURDATE();
        ORDER BY p.created_at DESC");
         $stmt->execute([$username,$username]);
         $posts=$stmt->fetchAll(PDO::FETCH_ASSOC);
         echo json_encode(["success"=>true,"posts"=>$posts]);
         exit;
        }
       
       
    }catch (PDOException $e) {
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
        exit;
    }

}else {
    echo json_encode(["success" => false, "error" => "Invalid Request"]);
    exit;
}