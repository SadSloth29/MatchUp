<?php
header("Access-Control-Allow-Origin: http://localhost:5173"); 
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once "../Core/config.php";

if (isset($_SESSION["logged_in"]) && $_SESSION["logged_in"] === true) {
    
   
    echo json_encode(["success" => true, "username" => $_SESSION["username"]]);
    
    
} else {
    
    echo json_encode(["success"=>false,"error" => "User is not logged in"]);
    exit;
}