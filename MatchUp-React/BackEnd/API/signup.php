<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
require_once '../Core/config.php';

error_reporting(E_ALL);
ini_set('display_errors', 1);

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



if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $data = json_decode(file_get_contents('php://input'), true);

    $username=$data["username"];
    $email = filter_var($data["email"], FILTER_VALIDATE_EMAIL);
    $password = $data["password"];
    $age = isset($data['age']) ? $data['age'] : '';
    $gender = isset($data['gender']) ? $data['gender'] : '';
    $interested= isset($data['interested']) ? $data['interested'] : '';
    $bio = isset($data['bio']) ? $data['bio'] : '';
    $city=isset($data['city'])? $data['city'] :'';
    $country=isset($data['country'])? $data['country'] :'';
    $lat=isset($data['lat']) ? $data['lat']:'';
    $lon=isset($data['lon']) ? $data['lon']:'';

    if (!$email || !$password || !$username) {
        echo json_encode(["error" => "Invalid input"]);
        exit;
    }

    if($age<18)
    {
        echo json_encode(["error"=>"Must be 18 Years Old"]);
        exit;
    }

    $stmt=$pdo->prepare("SELECT * FROM users WHERE username=?");
    $stmt->execute([$username]);
    if ($stmt->rowCount() > 0) {
        echo json_encode(["error" => "Username already exists"]);
        exit;
    }
    
    if (!validate_Password($password)) {
        echo json_encode(["error" => "Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character."]);
        exit;
    }

    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);



    try {
        $stmt = $pdo->prepare("INSERT INTO users (username,email, password) VALUES (?, ?, ?)");
        $stmt->execute([$username, $email, $hashedPassword]);
        $stmt_profile=$pdo->prepare("INSERT INTO profile(username,age,gender,bio,interested_in)
        VALUES(?, ?, ?, ?, ?)");
        $stmt_profile->execute([$username,$age,$gender,$bio,$interested]);
        $stmt_location=$pdo->prepare("INSERT INTO address_info(username,city,country,latitude,longitute) VALUES(?,?,?,?,?)");
        $stmt_location->execute([$username,$city,$country,$lat,$lon]);

        echo json_encode(["success" => "User registered successfully"]);
    } catch (PDOException $e) {
        echo json_encode(["error" => "Registration failed: " . $e->getMessage()]);
    }
}

