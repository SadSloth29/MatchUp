<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../Core/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../Core');
$dotenv->load();

class mailer{
    public static function sendOTP($email,$otp)
    {
        $mail = new PHPMailer();
        try {
            
            
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->Port = 587;
            $mail->Username = $_ENV['GMAIL_USERNAME'];
            $mail->Password = $_ENV['GMAIL_PASSWORD'];
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;

            
            $mail->setFrom('sadmanmeliodas@gmail.com', 'MatchUp');
            $mail->addAddress($email);

            
            $mail->Subject = 'Your OTP Code';
            $mail->Body = "Your OTP code is: $otp";

            
            $mail->send();
            return true;
        } catch (Exception $e) {
            return false;
        }

    }
}

