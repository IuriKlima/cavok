<?php
/**
 * Cavok Avionics - Script de Exportação XML alternativo
 * 
 * Este script contorna o bloqueio 403 do WAF/LiteSpeed
 * gerando o XML de exportação do WordPress diretamente.
 * 
 * IMPORTANTE: Delete este arquivo após usar a exportação!
 * 
 * Uso: https://cavokavionics.com.br/cavok-export-xml.php?key=cavok2026export
 */

// ========== SEGURANÇA ==========
// Chave secreta para proteger o acesso ao script
$SECRET_KEY = 'cavok2026export';

if (!isset($_GET['key']) || $_GET['key'] !== $SECRET_KEY) {
    http_response_code(403);
    die('Acesso negado. Chave de segurança inválida.');
}

// ========== CARREGAR WORDPRESS ==========
define('ABSPATH', __DIR__ . '/');

// Desabilitar qualquer output prematuro
ob_start();

// Carregar o WordPress
require_once(ABSPATH . 'wp-load.php');

// Verificar se o usuário está logado e é admin (camada extra de segurança)
if (!is_user_logged_in() || !current_user_can('export')) {
    ob_end_clean();
    http_response_code(403);
    die('Você precisa estar logado como administrador no WordPress para usar este script.');
}

// Carregar as funções de exportação do WordPress
require_once(ABSPATH . 'wp-admin/includes/export.php');

ob_end_clean();

// ========== PARÂMETROS DE EXPORTAÇÃO ==========
// Tipo de conteúdo: 'all', 'post', 'page', 'product' (WooCommerce), ou qualquer post_type
$content_type = isset($_GET['content']) ? sanitize_text_field($_GET['content']) : 'all';

// Configurar argumentos de exportação
$args = array();

if ($content_type !== 'all') {
    $args['content'] = $content_type;
}

// Filtros opcionais
if (isset($_GET['category'])) {
    $args['category'] = intval($_GET['category']);
}

if (isset($_GET['start_date'])) {
    $args['start_date'] = sanitize_text_field($_GET['start_date']);
}

if (isset($_GET['end_date'])) {
    $args['end_date'] = sanitize_text_field($_GET['end_date']);
}

if (isset($_GET['status'])) {
    $args['status'] = sanitize_text_field($_GET['status']);
}

// ========== GERAR E ENVIAR O XML ==========
$sitename = sanitize_key(get_bloginfo('name'));
if (!empty($sitename)) {
    $sitename .= '.';
}

$date = date('Y-m-d');
$filename = $sitename . 'WordPress.' . $date . '.xml';

// Headers para download do arquivo
header('Content-Description: File Transfer');
header('Content-Disposition: attachment; filename=' . $filename);
header('Content-Type: text/xml; charset=' . get_option('blog_charset'), true);

// Gerar o XML de exportação
export_wp($args);

exit;
