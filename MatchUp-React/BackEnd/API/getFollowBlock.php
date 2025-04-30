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
    $sort=$data['sort']==="ASC"? "ASC":"DESC";

    if($action==="follow"){
        try{
            $stmt=$pdo->prepare("SELECT pfp.username,pfp.img_url AS pfp_url,f.follower AS username,f.following FROM profile_pic
            AS pfp
            RIGHT JOIN follows AS f
                ON pfp.username=f.follower
            WHERE f.following=?
            ORDER by f.follower $sort");
            $stmt->execute([$username]);
            $followers=$stmt->fetchAll(PDO::FETCH_ASSOC);
            $stmt_following=$pdo->prepare("SELECT pfp.username,pfp.img_url AS pfp_url,f.follower,f.following AS username FROM profile_pic
            AS pfp
            RIGHT JOIN follows AS f
                ON pfp.username=f.following
            WHERE f.follower=?
            ORDER by f.following $sort");
            $stmt_following->execute([$username]);
            $following=$stmt_following->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode(["success"=>true,"followers"=>$followers,"following"=>$following]);
            exit;


        }catch(PDOException $e){
            echo json_encode(["success"=>false,"error"=>$e->getMessage()]);
        }
    }
    if($action==='block'){
        try{
            $stmt=$pdo->prepare("SELECT pfp.username,pfp.img_url AS pfp_url,b.blocked_user AS username FROM profile_pic
            AS pfp
            RIGHT JOIN blocklist AS b
                ON pfp.username=b.blocked_user
            WHERE b.blocked_by=?
            ORDER by b.blocked_user $sort");
            $stmt->execute([$username]);
            $blocked=$stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(["success"=>true,"blocked"=>$blocked]);
    }catch(PDOException $e){
               
    }
}
}