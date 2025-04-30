<?php

$host='localhost';
$dbname='matchupdb';
$user='root';
$pass='';

try{
    $pdo=new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4",$user,$pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    session_start();

}catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
};
