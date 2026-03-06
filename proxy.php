<?php
/**
 * proxy.php — Proxy SkySignage API
 * Placez ce fichier à la RACINE de votre site : www.acces-immobilier.com/proxy.php
 * 
 * Il contourne le problème CORS en faisant la requête côté serveur.
 */

// Sécurité : on autorise uniquement votre propre domaine
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Cache-Control: max-age=300"); // Cache 5 minutes pour éviter de surcharger l'API

$apiUrl = "https://apim.skysignage.com/WCF/connector/d12a2a90-f1f7-59b0-a8ca-247e2907debf/78ecd32d-d37c-5628-8ab1-70a2792afb18?subscription-key=3a826b2799bd491aae7814f41351a46a";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 15);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Accept: application/json',
    'User-Agent: REMAX-AccesImmobilier/1.0'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error    = curl_error($ch);
curl_close($ch);

if ($error || $httpCode !== 200) {
    http_response_code(502);
    echo json_encode([
        "success" => false,
        "error"   => "Impossible de joindre l'API SkySignage",
        "detail"  => $error ?: "HTTP $httpCode"
    ]);
    exit;
}

echo $response;
