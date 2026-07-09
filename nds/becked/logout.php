<?php
// ============ USER LOGOUT ============

require_once 'config.php';

// Destroy session
session_destroy();

// Clear cookies
setcookie('auth_token', '', time() - 3600, "/");
setcookie('user_email', '', time() - 3600, "/");

echo json_encode([
    'success' => true,
    'message' => 'Logged out successfully'
]);

$conn->close();
?>
