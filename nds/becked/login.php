<?php
// ============ USER LOGIN ============

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    die(json_encode(['success' => false, 'message' => 'Invalid request method']));
}

// Get POST data
$data = json_decode(file_get_contents("php://input"), true);

// Validate input
if (!isset($data['email']) || !isset($data['password'])) {
    die(json_encode(['success' => false, 'message' => 'Email and password required']));
}

$email = sanitize($data['email']);
$password = $data['password'];
$rememberMe = $data['rememberMe'] ?? false;

// Validation
if (empty($email) || empty($password)) {
    die(json_encode(['success' => false, 'message' => 'Please fill all fields']));
}

// Fetch user from database
$stmt = $conn->prepare("SELECT id, firstName, lastName, company, password FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows == 0) {
    die(json_encode(['success' => false, 'message' => 'Email not found. Please sign up first.']));
}

$user = $result->fetch_assoc();

// Verify password
if (!verifyPassword($password, $user['password'])) {
    die(json_encode(['success' => false, 'message' => 'Incorrect password. Please try again.']));
}

// Create session
$_SESSION['user_id'] = $user['id'];
$_SESSION['user_email'] = $email;
$_SESSION['user_name'] = $user['firstName'] . ' ' . $user['lastName'];

// Generate and save auth token if remember me is checked
if ($rememberMe) {
    $token = generateToken();
    setcookie('auth_token', $token, time() + (86400 * 30), "/"); // 30 days
    setcookie('user_email', $email, time() + (86400 * 30), "/");
    
    // Update token in database
    $updateToken = $conn->prepare("UPDATE users SET auth_token = ? WHERE id = ?");
    $updateToken->bind_param("si", $token, $user['id']);
    $updateToken->execute();
}

echo json_encode([
    'success' => true,
    'message' => 'Login successful',
    'user' => [
        'id' => $user['id'],
        'name' => $user['firstName'] . ' ' . $user['lastName'],
        'email' => $email,
        'company' => $user['company']
    ]
]);

$stmt->close();
$conn->close();
?>
