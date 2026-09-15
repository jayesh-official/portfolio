<?php
/* ============================================================
   Jayesh Portfolio — section merge tool
   Rebuilds index.html from partials/*.html so you can edit
   each section in its own file, then regenerate the main file.

   Usage:  php build.php   (or double-click build.bat)
   ============================================================ */

error_reporting(E_ALL);
ini_set('display_errors', '1');

const ROOT = __DIR__ . DIRECTORY_SEPARATOR;

$order = ['header', 'hero', 'about', 'skills', 'experience', 'projects', 'certifications', 'laracon', 'contact', 'footer'];

$body = '';
foreach ($order as $name) {
    $file = ROOT . 'partials' . DIRECTORY_SEPARATOR . $name . '.html';
    if (!is_file($file)) {
        fwrite(STDERR, "[build] ERROR: missing $file\n");
        exit(1);
    }
    $body .= file_get_contents($file) . "\n\n";
}

$html = '<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Portfolio of a PHP / Laravel backend developer specializing in scalable APIs, microservices, databases and high-performance web applications." />
  <meta name="author" content="Jayesh Mangaroliya" />
  <title>Jayesh Mangaroliya | PHP / Laravel Backend Developer</title>

  <link rel="icon" type="image/svg+xml" href="img/favicon.svg" />
  <link rel="icon" type="image/png" sizes="32x32" href="img/favicon.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="img/apple-touch-icon.png" />

  <!-- Bootstrap 5 -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
  <!-- Font Awesome -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />

  <link rel="stylesheet" href="css/style.css" />
</head>
<body>
' . rtrim($body) . "\n\n  <!-- Bootstrap 5 bundle -->
  <script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js\"></script>
  <!-- App -->
  <script src=\"js/main.js\"></script>
</body>
</html>
";

if (file_put_contents(ROOT . 'index.html', $html) === false) {
    fwrite(STDERR, "[build] ERROR: cannot write index.html\n");
    exit(1);
}
echo '[build] OK — index.html regenerated from ' . count($order) . " sections.\n";