<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once "../Core/config.php";
require_once "../Core/mailer.php";

date_default_timezone_set('Asia/Dhaka');

if($_SERVER['REQUEST_METHOD']=== "POST"){
    $data=json_decode(file_get_contents('php://input'),true);

    $email=$data['email'];
    $password=$data['password'];

    

    if (!$email || !$password) {
        echo json_encode(["error" => "Email and password required"]);
        exit;
    }

    try{
        $stmt=$pdo->prepare("SELECT username,email,password FROM users WHERE email=?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if($user && password_verify($password,$user['password'])){
            $otp = rand(100000, 999999);
            $expires_at = date("Y-m-d H:i:s", strtotime("+10 minutes"));

            $stmt = $pdo->prepare("UPDATE users SET otp_code = ?, otp_expires_at = ? WHERE email = ?");
            $stmt->execute([$otp, $expires_at, $user["email"]]);

            if (Mailer::sendOTP($email, $otp)) {
                echo json_encode(["success" => "OTP sent to your email", "email" => $user["email"],"username"=> $user["username"]]);
            } else {
                echo json_encode(["error" => "Failed to send OTP"]);
            }

        }else {
            echo json_encode(["error" => "Invalid credentials"]);
        }
        

    }catch (PDOException $e) {
        echo json_encode(["error" => "Login failed: " . $e->getMessage()]);
    }
}