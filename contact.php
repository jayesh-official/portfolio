<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name    = htmlspecialchars(trim($_POST["name"]));
    $email   = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $subject = htmlspecialchars(trim($_POST["subject"]));
    $message = htmlspecialchars(trim($_POST["message"]));

    $to      = "jayeshmangaroliy13@gmail.com"; // Change to your email address
    $headers = "From: $name <$email>\r\nReply-To: $email\r\n";
    $body    = "Name: $name\nEmail: $email\nSubject: $subject\n\nMessage:\n$message";

    if (mail($to, $subject, $body, $headers)) {
        echo "<script>alert('Thank you for contacting us!');window.location.href='index.html';</script>";
    } else {
        echo "<script>alert('Sorry, your message could not be sent.');window.history.back();</script>";
    }
} else {
    header("Location: index.html");
    exit();
}
?>