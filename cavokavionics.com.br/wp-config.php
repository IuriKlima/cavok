<?php 
/**
* Note: This file may contain artifacts of previous malicious infection.
* However, the dangerous code has been removed, and the file is now safe to use.
*/
?>
<?php

/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/documentation/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'ceod9251_Cavok' );

/** Database username */
define( 'DB_USER', 'ceod9251_cavok' );

/** Database password */
define( 'DB_PASSWORD', '^oTPS(xCN?4FDsxF' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         '5nomyrgboc0tx9pq0cnqkj264k6fpgztwgndcudyv1vburv7asbfrantagmzywuz' );
define( 'SECURE_AUTH_KEY',  'xj5o6ialp8yiubfzv889n3yor1991xj5rqsfuthlzl7acobdpffumo7mykyfllh8' );
define( 'LOGGED_IN_KEY',    'bie2nzo6drhhllwdrtlhke60n6vvcbybgna1veocaa54veb8ephdswbhz7rpgh6r' );
define( 'NONCE_KEY',        'b9niv64ek4b6e477yhqyzym6wdobjuvzga3yvegz2r3lddoxmiytidtjonntmtpr' );
define( 'AUTH_SALT',        'yhtyhkiavmxzcadzsnch8ersawczaglhw6gyghywc2tddzqowtanlcrqsgsp3jld' );
define( 'SECURE_AUTH_SALT', 'wj3jkzbykepl9gn9ki0vo317qhqhxlqaergrwigv3tktelijnqg6bc7ki6mlccyh' );
define( 'LOGGED_IN_SALT',   'dnroqnepqa29efbmhqtnysm5gkzx0pj6copblehurfw3ckqv6ejlzwtnzplwbsts' );
define( 'NONCE_SALT',       'im27pmmonpwoljsm3zoayaofgotxc8lfemcj5dpes3saizvei7oztx6cvgmsrksz' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wpqk_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/documentation/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



define('DISALLOW_FILE_EDIT', true);

define('CONCATENATE_SCRIPTS', false);

define( 'DISABLE_WP_CRON', true );
/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
