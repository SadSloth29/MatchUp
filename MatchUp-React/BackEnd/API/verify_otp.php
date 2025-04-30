<?php
header("Access-Control-Allow-Origin: http://localhost:5173"); 
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once "../Core/config.php";

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if($_SERVER['REQUEST_METHOD']==="POST"){
    $user=json_decode(file_get_contents('php://input'),true);
    $email=$user['email'];
    $otp=$user['otp'];

    if (!$email || !$otp) {
        echo json_encode(["error" => "Missing required fields"]);
        exit;
    }

    try{
        $stmt=$pdo->prepare("SELECT username,otp_code,otp_expires_at FROM users WHERE email=?");
        $stmt->execute([$email]);
        $row=$stmt->fetch(PDO::FETCH_ASSOC);

        if ($row && $row["otp_code"] == $otp && strtotime($row["otp_expires_at"]) > time()){

            session_regenerate_id(true);
            $_SESSION["email"] = $email;
            $_SESSION["logged_in"] = true;
            $_SESSION["username"]=$row["username"];

            $stmt = $pdo->prepare("UPDATE users SET otp_code = NULL, otp_expires_at = NULL WHERE email = ?");
            $stmt->execute([$email]);

            echo json_encode(["success" => "Login successful","username"=>$row['username']]);
    }else {
        echo json_encode(["error" => "Invalid or expired OTP","email"=>$email]);
    }
    }catch (PDOException $e) {
        echo json_encode(["error" => "OTP verification failed: " . $e->getMessage()]);
    }


}