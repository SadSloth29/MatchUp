<?php


header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once "../Core/config.php";

if($_SERVER['REQUEST_METHOD']==='GET' && isset($_GET["query"])){
    

    $query = "%" . $_GET["query"] . "%";

    try{
        $stmt=$pdo->prepare("SELECT u.Username AS username,i.img_url AS profile_image FROM users AS u LEFT JOIN profile_pic as i 
        ON u.username=i.username
        WHERE u.username LIKE ?");
        $stmt->execute([$query]);
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["success" => true, "users" => $users]);
    }catch(PDOException $e){
        echo json_encode(["success"=> false,"error"=> $e->getMessage()]);
    }

}
else{
        echo json_encode(["success"=> false,"error"=> "Invalid Request"]);
}