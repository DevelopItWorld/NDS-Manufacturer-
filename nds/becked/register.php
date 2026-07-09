<?php
// ============ USER REGISTRATION ============

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    die(json_encode(['success' => false, 'message' => 'Invalid request method']));
}

// Get POST data
$data = json_decode(file_get_contents("php://input"), true);

// Validate input
if (!isset($data['firstName']) || !isset($data['lastName']) || !isset($data['email']) || !isset($data['password'])) {
    die(json_encode(['success' => false, 'message' => 'Missing required fields']));
}

$firstName = sanitize($data['firstName']);
$lastName = sanitize($data['lastName']);
$email = sanitize($data['email']);
$company = sanitize($data['company'] ?? '');
$password = $data['password'];
$confirmPassword = $data['confirmPassword'] ?? '';

// Validation
if (empty($firstName) || empty($lastName) || empty($email) || empty($password)) {
    die(json_encode(['success' => false, 'message' => 'Please fill all required fields']));
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    die(json_encode(['success' => false, 'message' => 'Invalid email format']));
}

// Validate password
if (strlen($password) < 6) {
    die(json_encode(['success' => false, 'message' => 'Password must be at least 6 characters']));
}

if ($password !== $confirmPassword) {
    die(json_encode(['success' => false, 'message' => 'Passwords do not match']));
}

// Check if email already exists
$checkEmail = $conn->prepare("SELECT id FROM users WHERE email = ?");
$checkEmail->bind_param("s", $email);
$checkEmail->execute();
$result = $checkEmail->get_result();

if ($result->num_rows > 0) {
    die(json_encode(['success' => false, 'message' => 'Email already registered. Please login instead.']));
}

// Hash password
$hashedPassword = hashPassword($password);
$createdAt = date('Y-m-d H:i:s');

// Insert user into database
$stmt = $conn->prepare("INSERT INTO users (firstName, lastName, email, company, password, createdAt) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssssss", $firstName, $lastName, $email, $company, $hashedPassword, $createdAt);

if ($stmt->execute()) {
    $userId = $stmt->insert_id;
    
    // Create session
    $_SESSION['user_id'] = $userId;
    $_SESSION['user_email'] = $email;
    $_SESSION['user_name'] = $firstName . ' ' . $lastName;
    
    // Set cookie for remember me
    $token = generateToken();
    setcookie('auth_token', $token, time() + (86400 * 30), "/"); // 30 days
    
    // Update token in database
    $updateToken = $conn->prepare("UPDATE users SET auth_token = ? WHERE id = ?");
    $updateToken->bind_param("si", $token, $userId);
    $updateToken->execute();
    
    echo json_encode([
        'success' => true,
        'message' => 'Account created successfully',
        'user' => [
            'id' => $userId,
            'name' => $firstName . ' ' . $lastName,
            'email' => $email,
            'company' => $company
        ]
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Error creating account: ' . $conn->error]);
}

$stmt->close();
$checkEmail->close();
$conn->close();
?>
