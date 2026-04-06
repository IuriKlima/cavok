<?php
/**
 * Plugin Name: Secure Core File Blocker
 * Plugin URI: https://ceodesign.com.br
 * Description: Enhances WordPress security by blocking access to core files and disabling right-click.
 * Version: 1.1
 * Author: CEO Design
 * Author URI: https://ceodesign.com.br
 */

// Evita o acesso direto ao plugin.
if (!defined('ABSPATH')) {
    exit;
}

class SecureCoreFileBlocker {
    public function __construct() {
        add_action('admin_init', [$this, 'check_htaccess_rules']);
        add_action('admin_menu', [$this, 'add_settings_page']);
        add_action('admin_init', [$this, 'register_settings']);
        add_action('wp_footer', [$this, 'disable_right_click']);
        register_deactivation_hook(__FILE__, [$this, 'remove_htaccess_rules']);
    }

    /**
     * Verifica e adiciona regras ao .htaccess se necessário.
     */
    public function check_htaccess_rules() {
        $htaccess_path = ABSPATH . '.htaccess';
        $rules = $this->get_security_rules();

        if (file_exists($htaccess_path) && is_writable($htaccess_path)) {
            $current_htaccess = file_get_contents($htaccess_path);
            if (strpos($current_htaccess, '# BEGIN Secure Core File Blocker') === false) {
                $new_htaccess = $rules . "\n" . $current_htaccess;
                file_put_contents($htaccess_path, $new_htaccess);
            }
        }
    }

    /**
     * Remove regras ao desativar o plugin.
     */
    public function remove_htaccess_rules() {
        $htaccess_path = ABSPATH . '.htaccess';
        $rules_start = '# BEGIN Secure Core File Blocker';
        $rules_end = '# END Secure Core File Blocker';

        if (file_exists($htaccess_path) && is_writable($htaccess_path)) {
            $current_htaccess = file_get_contents($htaccess_path);
            $pattern = '/' . preg_quote($rules_start, '/') . '.*?' . preg_quote($rules_end, '/') . '\n/s';
            $updated_htaccess = preg_replace($pattern, '', $current_htaccess);
            file_put_contents($htaccess_path, $updated_htaccess);
        }
    }

    /**
     * Regras de segurança a serem adicionadas ao .htaccess.
     */
    private function get_security_rules() {
        $block_wp_config = get_option('block_wp_config', 'yes');

        $rules = "# BEGIN Secure Core File Blocker\n";
        
        if ($block_wp_config === 'yes') {
            $rules .= "<Files wp-config.php>\n    order allow,deny\n    deny from all\n</Files>\n";
        }

        $rules .= "<Files .htaccess>\n    order allow,deny\n    deny from all\n</Files>\n";

        $rules .= "<IfModule mod_rewrite.c>\n    RewriteEngine On\n    RewriteRule ^wp-admin/includes/ - [F,L]\n    RewriteRule !^wp-includes/.*\.php$ - [S=3]\n    RewriteRule ^wp-includes/[^/]+\.php$ - [F,L]\n    RewriteRule ^wp-includes/js/tinymce/langs/.+\.php - [F,L]\n    RewriteRule ^wp-includes/theme-compat/ - [F,L]\n</IfModule>\n";

        $rules .= "# END Secure Core File Blocker\n";

        return $rules;
    }

    /**
     * Adiciona uma página de configurações ao menu do WordPress.
     */
    public function add_settings_page() {
        add_options_page(
            'Secure Core File Blocker Settings',
            'Secure File Blocker',
            'manage_options',
            'secure-file-blocker',
            [$this, 'render_settings_page']
        );
    }

    /**
     * Renderiza a página de configurações.
     */
    public function render_settings_page() {
        ?>
        <div class="wrap">
            <h1>Secure Core File Blocker</h1>
            <form method="post" action="options.php">
                <?php
                settings_fields('secure_file_blocker');
                do_settings_sections('secure_file_blocker');
                submit_button();
                ?>
            </form>
        </div>
        <?php
    }

    /**
     * Registra as configurações do plugin.
     */
    public function register_settings() {
        register_setting('secure_file_blocker', 'block_wp_config');

        add_settings_section(
            'main_section',
            'Configurações Principais',
            null,
            'secure_file_blocker'
        );

        add_settings_field(
            'block_wp_config',
            'Bloquear wp-config.php',
            function () {
                $value = get_option('block_wp_config', 'yes');
                echo '<input type="checkbox" name="block_wp_config" value="yes"' . checked($value, 'yes', false) . '> Ativar';
            },
            'secure_file_blocker',
            'main_section'
        );
    }

    /**
     * Desabilita o clique com o botão direito no site.
     */
    public function disable_right_click() {
        echo '<script type="text/javascript">
            document.addEventListener("contextmenu", function(e) {
                e.preventDefault();
            });
        </script>';
    }
}

new SecureCoreFileBlocker();
