<?php
// ============ SESSION VERIFICATION ============

require_once 'config.php';

// Check if user session exists
if (isset($_SESSION['user_id'])) {
    $userId = $_SESSION['user_id'];
    
    // Fetch user data from database
    $stmt = $conn->prepare("SELECT id, firstName, lastName, email, company FROM users WHERE id = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        echo json_encode([
            'success' => true,
            'loggedIn' => true,
            'user' => [
                'id' => $user['id'],
                'name' => $user['firstName'] . ' ' . $user['lastName'],
                'email' => $user['email'],
                'company' => $user['company']
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'loggedIn' => false]);
    }
    
    $stmt->close();
} else {
    // Check for remember me cookie (if auth token exists)
    if (isset($_COOKIE['auth_token']) && isset($_COOKIE['user_email'])) {
        $token = $_COOKIE['auth_token'];
        $email = $_COOKIE['user_email'];
        
        // Verify token in database
        $stmt = $conn->prepare("SELECT id, firstName, lastName, email, company FROM users WHERE auth_token = ? AND email = ?");
        $stmt->bind_param("ss", $token, $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            // Set session
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_email'] = $user['email'];
            $_SESSION['user_name'] = $user['firstName'] . ' ' . $user['lastName'];
            
            echo json_encode([
                'success' => true,
                'loggedIn' => true,
                'user' => [
                    'id' => $user['id'],
                    'name' => $user['firstName'] . ' ' . $user['lastName'],
                    'email' => $user['email'],
                    'company' => $user['company']
                ]
            ]);
        } else {
            // Token invalid, clear cookies
            setcookie('auth_token', '', time() - 3600, "/");
            setcookie('user_email', '', time() - 3600, "/");
            echo json_encode(['success' => false, 'loggedIn' => false]);
        }
        
        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'loggedIn' => false]);
    }
}

$conn->close();
?>
