<?php
header("Access-Control-Allow-Origin: http://localhost:5173"); 
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");
require_once "../Core/config.php";

function validate_Password($password){
    if(strlen($password)<8){
        return false;
    }
    if (!preg_match('/[A-Z]/', $password)) {
        return false; // Password must contain at least one uppercase letter
    }
    if (!preg_match('/[a-z]/', $password)) {
        return false; // Password must contain at least one lowercase letter
    }
    if (!preg_match('/[0-9]/', $password)) {
        return false; // Password must contain at least one digit
    }
    return true;
}

if($_SERVER['REQUEST_METHOD']==="POST"){
    $data=json_decode(file_get_contents("php://input"),true);

    if($data['option']==='user'){
        $email=filter_var($data['email'],FILTER_VALIDATE_EMAIL);
        $password=$data['password'];
        $user=$data['username'];

        
        if (empty($password)) {
            $stmt=$pdo->prepare("UPDATE users SET email=? WHERE username=?");
            $stmt->execute([$email,$user]);
            
            echo json_encode(["success"=>true]);
            exit;
        }
        else{
            if (!validate_Password($password)) {
                echo json_encode(["error" => "Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character."]);
                exit;
            }
            
            $hashedPassword=password_hash($password,PASSWORD_BCRYPT);
            $stmt=$pdo->prepare("UPDATE users SET email=?,password=? WHERE username=?");
            $stmt->execute([$email,$hashedPassword,$user]);
            
            echo json_encode(["success"=>true]);
            exit;

        }
        
    }
    else if($data['option']==='profile'){
        $user=$data['username'];
        $city=$data['city'];
        $country=$data['country'];
        $lat=$data['lat'];
        $lon=$data['lon'];
        $bio=$data['bio'];

        if($bio!==''){
            try{
                $stmt=$pdo->prepare("UPDATE profile SET bio=? WHERE username=?");
                $stmt->execute([$bio,$user]);
            
                echo json_encode(["success"=>true]);
                
            }catch(PDOException $e){
                echo json_encode(["success"=>false,"error"=>$e->getMessage()]);
                exit;
            }
        }
        if($city!==''){
            try{
                $stmt=$pdo->prepare("UPDATE address_info SET city=?,country=?,latitude=?,longitute=? WHERE username=?");
                $stmt->execute([$city,$country,$lat,$lon,$user]);
            
                echo json_encode(["success"=>true]);
                exit;
            }catch(PDOException $e){
                echo json_encode(["success"=>false,"error"=>$e->getMessage()]);
                exit;
            }
        }
    }
    else if($data['option']==='preference'){
        $user=$data['username'];
        $personality=$data['personality'];
        $md=$data['match_distance'];

        try{
            $stmt=$pdo->prepare("INSERT INTO preference (username, personality, match_distance)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE
            personality = VALUES(personality),
            match_distance = VALUES(match_distance)");
            $stmt->execute([$user,$personality,$md]);
        
            echo json_encode(["success"=>true]);
            exit;
        }catch(PDOException $e){
            echo json_encode(["success"=>false,"error"=>$e->getMessage()]);
        }

    }
}