<?php
header("Access-Control-Allow-Origin: http://localhost:5173"); 
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
require_once "../Core/config.php";
if($_SERVER['REQUEST_METHOD']==='POST'){
    $data=json_decode(file_get_contents("php://input"),true);

    
    $user=$data['username'];

    if($data['action']==='check'){
       $stmt=$pdo->prepare("SELECT COUNT(*) AS count FROM interest_own WHERE username=?");
       $stmt->execute([$user]);
       $count = $stmt->fetchColumn();
       echo json_encode(["success"=>true,"count" => (int)$count]);
    }
    else{
        $pq1=$data['pq1'];
        $pq2=$data['pq2'];
        $pq3=$data['pq3'];
        $pq4=$data['pq4'];
        $pq5=$data['pq5'];
        $oq1=$data['oq1'];
        $oq2=$data['oq2'];
        $oq3=$data['oq3'];
        $oq4=$data['oq4'];
        $oq5=$data['oq5'];
    try{
        $stmt=$pdo->prepare("INSERT INTO interest_partner(username,q1,q2,q3,q4,q5) VALUES(?,?,?,?,?,?);");
        $stmt->execute([$user,$pq1,$pq2,$pq3,$pq4,$pq5]);
        $stmt1=$pdo->prepare("INSERT INTO interest_own(username,q1,q2,q3,q4,q5) VALUES(?,?,?,?,?,?);");
        $stmt1->execute([$user,$oq1,$oq2,$oq3,$oq4,$oq5]);
        echo json_encode(["success"=>true]);
        exit;

    }catch(PDOException $e){
       echo json_encode(["success"=>false,"error"=>$e->getMessage()]);
       exit;
    }
}


}
else{
    echo json_encode(["success"=>false,"error"=>"Could not process connection"]);
    exit;
}