<?php
/* ============================================================
   Jayesh Portfolio — PRODUCTION BUILD
   Generates an optimized, SEO-ready deployable site in dist/.

   Usage:  php build.prod.php   (also: npm run build)

   What it does:
     - Merges partials/*.html and injects a full SEO head
       (title, description, keywords, canonical, Open Graph,
       Twitter, theme-color, JSON-LD structured data)
     - Minifies HTML (comments + whitespace collapsing)
     - Minifies CSS  (scanner-based, string/comment safe)
     - Minifies JS   (scanner-based, strips comments safely)
     - Copies only referenced, optimized images
     - Writes sitemap.xml, robots.txt, .nojekyll
     - Copies CNAME if one exists at the repo root
   ============================================================ */

error_reporting(E_ALL);
ini_set('display_errors', '1');

const ROOT   = __DIR__ . DIRECTORY_SEPARATOR;
const DIST   = ROOT . 'dist' . DIRECTORY_SEPARATOR;
const SITE_URL = 'https://jayesh-official.github.io/portfolio/';
const SITE_TITLE = 'Jayesh Mangaroliya | PHP / Laravel Backend Developer';
const SITE_DESC  = 'Portfolio of a PHP / Laravel backend developer specializing in scalable APIs, microservices, databases and high-performance web applications.';
const SITE_KEYWORDS = 'PHP, Laravel, Backend Developer, REST API, MySQL, Vue.js, PostgreSQL, Redis, AWS, Digital Ocean, Microservices, Web Developer, Portfolio, Jayesh Mangaroliya, Ahmedabad';
const SITE_AUTHOR  = 'Jayesh Mangaroliya';
const OG_IMAGE = SITE_URL . 'img/avatar.png';
const TODAY = '2026-09-15';

$order = ['header', 'hero', 'about', 'skills', 'experience', 'projects', 'certifications', 'laracon', 'contact', 'footer'];

/* ------------ directory prep ------------ */
if (!is_dir(DIST) && !mkdir(DIST, 0777, true)) { fwrite(STDERR, "[build] cannot create dist/\n"); exit(1); }
foreach (['css', 'js', 'img', 'img/certificates', 'img/laracon'] as $d) {
    $path = DIST . $d;
    if (!is_dir($path) && !mkdir($path, 0777, true)) { fwrite(STDERR, "[build] cannot create dist/$d\n"); exit(1); }
}

/* ------------ clean previous build ------------ */
$clean = function ($dir) use (&$clean) {
    foreach (glob(rtrim($dir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . '*') ?: [] as $f) {
        if (is_dir($f)) { $clean($f); } elseif (is_file($f)) { unlink($f); }
    }
};
foreach (['css', 'js', 'img'] as $d) { $clean(DIST . $d); }
foreach (glob(DIST . '.*') ?: [] as $f) { if (is_file($f)) unlink($f); }

/* ------------ body from partials ------------ */
$body = '';
foreach ($order as $name) {
    $file = ROOT . 'partials' . DIRECTORY_SEPARATOR . $name . '.html';
    if (!is_file($file)) { fwrite(STDERR, "[build] ERROR: missing $file\n"); exit(1); }
    $body .= file_get_contents($file) . "\n\n";
}

/* ------------ SEO head ------------ */
$ogImage = OG_IMAGE;
$canonical = SITE_URL;

$siteTitle  = SITE_TITLE;
$siteDesc   = SITE_DESC;
$siteKw     = SITE_KEYWORDS;
$siteAuthor = SITE_AUTHOR;

$jsonLd = <<<JSON
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Jayesh Mangaroliya",
  "url": "{$canonical}",
  "image": "{$ogImage}",
  "jobTitle": "PHP / Laravel Backend Developer",
  "description": "{$siteDesc}",
  "email": "mailto:hello@jayesh.dev",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Ahmedabad",
    "addressRegion": "Gujarat",
    "addressCountry": "IN"
  },
  "sameAs": [
    "https://www.linkedin.com/in/jayesh",
    "https://github.com/jayesh"
  ],
  "alumniOf": [
    { "@type": "CollegeOrUniversity", "name": "Gujarat Technological University" },
    { "@type": "CollegeOrUniversity", "name": "Saurashtra University" }
  ],
  "knowsAbout": ["PHP", "Laravel", "MySQL", "PostgreSQL", "REST APIs", "Vue.js", "Redis", "AWS", "Microservices"]
}
JSON;

$head = <<<HEAD
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>{$siteTitle}</title>
<meta name="description" content="{$siteDesc}" />
<meta name="keywords" content="{$siteKw}" />
<meta name="author" content="{$siteAuthor}" />
<meta name="robots" content="index, follow" />
<meta name="theme-color" content="#0b1226" />
<link rel="canonical" href="{$canonical}" />

<meta property="og:type" content="website" />
<meta property="og:site_name" content="{$siteAuthor}" />
<meta property="og:title" content="{$siteTitle}" />
<meta property="og:description" content="{$siteDesc}" />
<meta property="og:url" content="{$canonical}" />
<meta property="og:image" content="{$ogImage}" />
<meta property="og:image:type" content="image/png" />
<meta property="og:locale" content="en_IN" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="{$siteTitle}" />
<meta name="twitter:description" content="{$siteDesc}" />
<meta name="twitter:image" content="{$ogImage}" />

<link rel="icon" type="image/svg+xml" href="img/favicon.svg" />
<link rel="icon" type="image/png" sizes="32x32" href="img/favicon.png" />
<link rel="apple-touch-icon" sizes="180x180" href="img/apple-touch-icon.png" />

<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin />
<link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="css/style.min.css" />

<script type="application/ld+json">{$jsonLd}</script>
HEAD;

$html = "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n$head\n</head>\n<body>\n" . rtrim($body)
    . "\n\n  <script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js\"></script>\n"
    . "  <script src=\"js/main.min.js\"></script>\n</body>\n</html>\n";

/* ------------ minifiers ------------ */

function minify_css($css) {
    $n = strlen($css);
    $out = '';
    $i = 0;
    $pending = false;
    while ($i < $n) {
        $c = $css[$i];
        if ($c === '/' && $i + 1 < $n && $css[$i + 1] === '*') {
            $end = strpos($css, '*/', $i + 2);
            $i = ($end === false) ? $n : $end + 2;
            continue;
        }
        if ($c === '"' || $c === "'") {
            $q = $c;
            $out .= $c;
            $i++;
            while ($i < $n) {
                $ch = $css[$i];
                $out .= $ch;
                if ($ch === '\\' && $i + 1 < $n) { $out .= $css[$i + 1]; $i += 2; continue; }
                if ($ch === $q) { $i++; break; }
                $i++;
            }
            $pending = false;
            continue;
        }
        if ($c === ' ' || $c === "\t" || $c === "\r" || $c === "\n") {
            $pending = true;
            $i++;
            continue;
        }
        if (strpos('{}:;>,+~', $c) !== false) {
            $out = rtrim($out);
            $out .= $c;
            $pending = false;
            $i++;
            continue;
        }
        if ($pending && $out !== '') {
            $out .= ' ';
        }
        $out .= $c;
        $pending = false;
        $i++;
    }
    $out = str_replace(';}', '}', $out);
    return trim($out);
}

function minify_js($js) {
    $n = strlen($js);
    $out = '';
    $i = 0;
    while ($i < $n) {
        $c = $js[$i];
        if ($c === '/' && $i + 1 < $n && ($js[$i + 1] === '/' || $js[$i + 1] === '*')) {
            $multi = ($js[$i + 1] === '*');
            $end = $multi ? strpos($js, '*/', $i + 2) : strpos($js, "\n", $i + 2);
            $i = ($end === false) ? $n : ($multi ? $end + 2 : $end);
            if ($multi && $end === false) break;
            continue;
        }
        if ($c === '"' || $c === "'" || $c === '`') {
            $q = $c;
            $out .= $c;
            $i++;
            while ($i < $n) {
                $ch = $js[$i];
                $out .= $ch;
                if ($ch === '\\' && $i + 1 < $n) { $out .= $js[$i + 1]; $i += 2; continue; }
                if ($ch === $q) { $i++; break; }
                if (($q === '`') && $ch === '$' && $i + 1 < $n && $js[$i + 1] === '{') {
                    // copy interpolation verbatim
                    $depth = 1;
                    $i++;
                    $out .= '{';
                    while ($i < $n && $depth > 0) {
                        $ch2 = $js[$i];
                        $out .= $ch2;
                        if ($ch2 === '{') $depth++;
                        elseif ($ch2 === '}') $depth--;
                        elseif ($ch2 === '"' || $ch2 === "'" || $ch2 === '`') {
                            $qq = $ch2;
                            $i++;
                            while ($i < $n) {
                                $c2 = $js[$i];
                                $out .= $c2;
                                if ($c2 === '\\' && $i + 1 < $n) { $out .= $js[$i + 1]; $i += 2; continue; }
                                if ($c2 === $qq) { $i++; break; }
                                $i++;
                            }
                            continue;
                        }
                        $i++;
                    }
                    continue;
                }
                $i++;
            }
            continue;
        }
        $out .= $c;
        $i++;
    }
    $lines = preg_split("/\r\n|\r|\n/", $out);
    $clean = [];
    foreach ($lines as $line) {
        $line = rtrim($line);
        if (trim($line) === '') continue;
        $clean[] = ltrim($line);
    }
    return implode("\n", $clean) . "\n";
}

function minify_html($html) {
    $html = preg_replace('/<!--(?!\[if\s).*?-->/s', '', $html);
    $html = preg_replace('/[ \t\r\n]+/', ' ', $html);
    return trim($html);
}

/* ------------ write optimized files ------------ */
$css = file_get_contents(ROOT . 'css/style.css');
file_put_contents(DIST . 'css/style.min.css', minify_css($css));

$js = file_get_contents(ROOT . 'js/main.js');
file_put_contents(DIST . 'js/main.min.js', minify_js($js));

file_put_contents(DIST . 'index.html', minify_html($html));

/* ------------ assets: only referenced, optimized images ------------ */
$imgMap = [
    'avatar.png'          => 'img/avatar.png',
    'avatar.webp'         => 'img/avatar.webp',
    'Jayesh_CV.pdf'       => 'img/Jayesh_CV.pdf',
    'favicon.svg'         => 'img/favicon.svg',
    'favicon.png'         => 'img/favicon.png',
    'apple-touch-icon.png' => 'img/apple-touch-icon.png',
];
for ($n = 1; $n <= 5; $n++)  $imgMap["certificates/$n.png"] = "img/certificates/$n.png";
for ($n = 1; $n <= 15; $n++) $imgMap["laracon/$n.jpg"]     = "img/laracon/$n.jpg";

foreach ($imgMap as $rel => $src) {
    $dest = DIST . 'img/' . $rel;
    if (!is_file(ROOT . $src)) { fwrite(STDERR, "[build] WARN: missing $src (skipped)\n"); continue; }
    copy(ROOT . $src, $dest);
}

/* ------------ seo / deploy files ------------ */
file_put_contents(DIST . 'sitemap.xml',
    "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
    . "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n"
    . "  <url>\n"
    . "    <loc>" . SITE_URL . "</loc>\n"
    . "    <lastmod>" . TODAY . "</lastmod>\n"
    . "    <changefreq>monthly</changefreq>\n"
    . "    <priority>1.0</priority>\n"
    . "  </url>\n"
    . "</urlset>\n");

file_put_contents(DIST . 'robots.txt',
    "User-agent: *\nAllow: /\n\nSitemap: " . SITE_URL . "sitemap.xml\n");

file_put_contents(DIST . '.nojekyll', '');

if (is_file(ROOT . 'CNAME')) {
    copy(ROOT . 'CNAME', DIST . 'CNAME');
    echo "[build] CNAME copied.\n";
}

$size = function ($dir) use (&$size) {
    $s = 0;
    foreach (glob(rtrim($dir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . '*') as $f) {
        if (is_dir($f)) {
            $s += $size($f);
        } elseif (is_file($f)) {
            $s += filesize($f);
        }
    }
    return $s;
};

echo "[build] OK — dist/ generated\n";
echo "[build]   index.html : " . round(filesize(DIST . 'index.html') / 1024, 1) . " KB\n";
echo "[build]   style.min.css : " . round(filesize(DIST . 'css/style.min.css') / 1024, 1) . " KB\n";
echo "[build]   main.min.js  : " . round(filesize(DIST . 'js/main.min.js') / 1024, 1) . " KB\n";
echo "[build]   images       : " . round($size(DIST . 'img') / 1024, 1) . " KB\n";