<?php
require '../Core/vendor/autoload.php';

use Cloudinary\Configuration\Configuration;
use Cloudinary\Api\Upload\UploadApi;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../Core');
$dotenv->load();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

Configuration::instance([
    'cloud' => [
        'cloud_name' => $_ENV['CLOUDINARY_CLOUD_NAME'],
        'api_key' => $_ENV['CLOUDINARY_API'],
        'api_secret' => $_ENV['CLOUDINARY_SECRET']
    ],
    'url' => [
        'secure' => true
    ]
]);

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (!isset($_FILES["file"])) {
        echo json_encode(["error" => "No file uploaded"]);
        exit;
    }

    try {
        $file = $_FILES["file"]["tmp_name"];
        $mimeType = mime_content_type($file);

        
        $resourceType = strpos($mimeType, 'video') !== false ? 'video' : 'image';

        
        $upload = (new UploadApi())->upload($file, [
            "folder" => "user_uploads",
            "resource_type" => $resourceType
        ]);

        echo json_encode([
            "success" => "File uploaded successfully",
            "fileUrl" => $upload["secure_url"]
        ]);
    } catch (Exception $e) {
        echo json_encode(["error" => "Upload failed: " . $e->getMessage()]);
    }
}
?>
