<?php
/**
 * Erasmus+ VET Project Unified Backend Controller
 * Project Reference: 2025-1-CZ01-KA220-VET-000352944
 */

ob_start();

error_reporting(E_ALL);
ini_set('display_errors', 0);

// CORS Headers for Remote/Cross-Domain Connectivity
$allowed_origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '*';
header("Access-Control-Allow-Origin: " . $allowed_origin);
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    if (ob_get_length()) ob_clean();
    http_response_code(200);
    exit;
}

header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');

// Configuration
$coordinator_email = "24061ok@creativehill.cz";
$project_reference = "2025-1-CZ01-KA220-VET-000352944";
$db_path = __DIR__ . '/testchc.sqlite';

// Clean path routing
$request_path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if (isset($_SERVER['PATH_INFO'])) {
    $request_path .= $_SERVER['PATH_INFO'];
}
$method = $_SERVER['REQUEST_METHOD'];

// LOG incoming request
error_log("[API LOG] Incoming Request: Method = {$method}, Path = {$request_path}");

try {
    $pdo = new PDO("sqlite:" . $db_path);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    error_log("[API ERROR] Database connection failed: " . $e->getMessage());
    if (ob_get_length()) ob_clean();
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection error.']);
    exit;
}

// -----------------------------------------------------------------
// 1. CONTACT FORM SUBMISSION
// -----------------------------------------------------------------
if (strpos($request_path, 'test.php') !== false || strpos($request_path, '/api/contact') !== false) {
    if ($method !== 'POST') {
        if (ob_get_length()) ob_clean();
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
        exit;
    }

    $name        = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $email       = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $institution = filter_input(INPUT_POST, 'institution', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $subject     = filter_input(INPUT_POST, 'subject', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $message     = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $honeypot    = filter_input(INPUT_POST, 'website', FILTER_SANITIZE_FULL_SPECIAL_CHARS);

    if (!empty($honeypot)) {
        if (ob_get_length()) ob_clean();
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Spam detected.']);
        exit;
    }

    if (empty($name) || empty($email) || empty($subject) || empty($message)) {
        if (ob_get_length()) ob_clean();
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Please fill in all required fields.']);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        if (ob_get_length()) ob_clean();
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid email address provided.']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("
            INSERT INTO contact_inquiries (name, email, institution, subject, message, project_reference)
            VALUES (:name, :email, :institution, :subject, :message, :project_reference)
        ");
        $stmt->execute([
            ':name'              => $name,
            ':email'             => $email,
            ':institution'       => !empty($institution) ? $institution : null,
            ':subject'           => $subject,
            ':message'           => $message,
            ':project_reference' => $project_reference
        ]);
        error_log("[API LOG] Contact inquiry saved successfully for: {$email}");
    } catch (PDOException $e) {
        error_log("[API ERROR] Contact insert failed: " . $e->getMessage());
        if (ob_get_length()) ob_clean();
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database error: Unable to save your inquiry.']);
        exit;
    }

    $email_subject = "[Erasmus+ Inquiry - Ref: {$project_reference}] " . $subject;
    $email_body  = "Sender Name: {$name}\nSender Email: {$email}\nMessage:\n{$message}\n";
    $headers  = "From: no-reply@erasmus-vet-project.eu\r\nReply-To: {$email}\r\n";

    @mail($coordinator_email, $email_subject, $email_body, $headers);

    if (ob_get_length()) ob_clean();
    echo json_encode([
        'success' => true,
        'message' => 'Thank you! Your message has been successfully saved and routed.'
    ]);
    exit;
}

// -----------------------------------------------------------------
// 2. ADMIN LOGIN ENDPOINT (/api/login)
// -----------------------------------------------------------------
if (strpos($request_path, '/api/login') !== false) {
    if ($method !== 'POST') {
        if (ob_get_length()) ob_clean();
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
        exit;
    }

    $input = json_decode(file_get_contents('php://input'), true);
    $username = trim($input['username'] ?? '');
    $password = $input['password'] ?? '';

    $stmt = $pdo->prepare("SELECT id, password_hash FROM admin_users WHERE username = :username");
    $stmt->execute([':username' => $username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password_hash'])) {
        $token = bin2hex(random_bytes(32));
        $isSecure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || $_SERVER['SERVER_PORT'] == 443;

        setcookie('session_token', $token, [
            'expires' => time() + 86400,
            'path' => '/',
            'secure' => $isSecure,
            'httponly' => true,
            'samesite' => 'Strict'
        ]);

        error_log("[API LOG] Admin login successful for user: {$username}");
        if (ob_get_length()) ob_clean();
        echo json_encode(['success' => true, 'message' => 'Authentication successful.']);
    } else {
        error_log("[API LOG] Admin login failed for user: {$username}");
        if (ob_get_length()) ob_clean();
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid username or password.']);
    }
    exit;
}

// -----------------------------------------------------------------
// 3. SESSION CHECK ENDPOINT (/api/check-session)
// -----------------------------------------------------------------
if (strpos($request_path, '/api/check-session') !== false) {
    if (isset($_COOKIE['session_token']) && !empty($_COOKIE['session_token'])) {
        if (ob_get_length()) ob_clean();
        http_response_code(200);
        echo json_encode(['authenticated' => true]);
    } else {
        if (ob_get_length()) ob_clean();
        http_response_code(401);
        echo json_encode(['authenticated' => false]);
    }
    exit;
}

// -----------------------------------------------------------------
// 4. LOGOUT ENDPOINT (/api/logout)
// -----------------------------------------------------------------
if (strpos($request_path, '/api/logout') !== false) {
    setcookie('session_token', '', [
        'expires' => time() - 3600,
        'path' => '/',
        'httponly' => true,
        'samesite' => 'Strict'
    ]);

    if (ob_get_length()) ob_clean();
    echo json_encode(['success' => true, 'message' => 'Logged out successfully.']);
    exit;
}

// -----------------------------------------------------------------
// 5. INQUIRIES ENDPOINTS (GET & DELETE /api/inquiries)
// -----------------------------------------------------------------
if (strpos($request_path, 'inquiries') !== false) {
    if (!isset($_COOKIE['session_token']) || empty($_COOKIE['session_token'])) {
        error_log("[API SECURITY] Unauthorized access attempt to /api/inquiries");
        if (ob_get_length()) ob_clean();
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        exit;
    }

    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM contact_inquiries ORDER BY created_at DESC");
        if (ob_get_length()) ob_clean();
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        exit;
    }

    if ($method === 'DELETE') {
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $input['id'] ?? null;

        if (!$id) {
            if (ob_get_length()) ob_clean();
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Inquiry ID required for deletion.']);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM contact_inquiries WHERE id = :id");
        $stmt->execute([':id' => $id]);

        error_log("[API LOG] Contact inquiry deleted ID: {$id}");
        if (ob_get_length()) ob_clean();
        echo json_encode(['success' => true, 'message' => 'Inquiry deleted successfully.']);
        exit;
    }
}

// -----------------------------------------------------------------
// 6. ARTICLES ENDPOINTS (GET, POST, PUT, DELETE)
// -----------------------------------------------------------------
if (strpos($request_path, 'articles') !== false) {
    if ($method === 'GET') {
        error_log("[API LOG] Fetching all articles");
        $stmt = $pdo->query("SELECT * FROM articles ORDER BY created_at DESC");
        if (ob_get_length()) ob_clean();
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        exit;
    }

    if ($method === 'POST') {
        if (!isset($_COOKIE['session_token']) || empty($_COOKIE['session_token'])) {
            error_log("[API SECURITY] Unauthorized attempt to create article");
            if (ob_get_length()) ob_clean();
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Unauthorized']);
            exit;
        }

        $title = $_POST['title'] ?? '';
        $content = $_POST['content'] ?? '';
        $category = $_POST['category'] ?? 'feed';
        $image_url = '';

        if (empty($title) && empty($content)) {
            $rawInput = json_decode(file_get_contents('php://input'), true);
            $title = $rawInput['title'] ?? '';
            $content = $rawInput['content'] ?? '';
            $category = $rawInput['category'] ?? 'feed';
            $image_url = $rawInput['image_url'] ?? '';
        }

        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $uploadDir = __DIR__ . '/uploads/';
            if (!is_dir($uploadDir)) {
                @mkdir($uploadDir, 0755, true);
            }
            $fileName = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '', basename($_FILES['image']['name']));
            $targetPath = $uploadDir . $fileName;

            if (@move_uploaded_file($_FILES['image']['tmp_name'], $targetPath)) {
                $image_url = '/uploads/' . $fileName;
                error_log("[API LOG] Image uploaded successfully to: {$image_url}");
            } else {
                error_log("[API ERROR] Failed to move uploaded file to: {$targetPath}");
            }
        }

        $title = filter_var($title, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $content = filter_var($content, FILTER_SANITIZE_FULL_SPECIAL_CHARS);

        if (empty($title) || empty($content)) {
            if (ob_get_length()) ob_clean();
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Title and content are required.']);
            exit;
        }

        try {
            $stmt = $pdo->prepare("
                INSERT INTO articles (title, content, image_url, category, project_reference)
                VALUES (:title, :content, :image_url, :category, :project_reference)
            ");
            $stmt->execute([
                ':title' => $title,
                ':content' => $content,
                ':image_url' => $image_url,
                ':category' => $category,
                ':project_reference' => $project_reference
            ]);

            error_log("[API LOG] Article inserted successfully: '{$title}'");
            if (ob_get_length()) ob_clean();
            echo json_encode(['success' => true, 'message' => 'Article created successfully.']);
        } catch (PDOException $e) {
            error_log("[API ERROR] Article insert failed: " . $e->getMessage());
            if (ob_get_length()) ob_clean();
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Database error creating article.']);
        }
        exit;
    }

    if ($method === 'PUT' || $method === 'PATCH') {
        if (!isset($_COOKIE['session_token']) || empty($_COOKIE['session_token'])) {
            if (ob_get_length()) ob_clean();
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Unauthorized']);
            exit;
        }

        $input = json_decode(file_get_contents('php://input'), true);
        $id = $input['id'] ?? null;
        $title = filter_var($input['title'] ?? '', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $content = filter_var($input['content'] ?? '', FILTER_SANITIZE_FULL_SPECIAL_CHARS);

        if (!$id || empty($title) || empty($content)) {
            if (ob_get_length()) ob_clean();
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'ID, title, and content are required for update.']);
            exit;
        }

        $stmt = $pdo->prepare("UPDATE articles SET title = :title, content = :content WHERE id = :id");
        $stmt->execute([':title' => $title, ':content' => $content, ':id' => $id]);

        error_log("[API LOG] Article updated ID: {$id}");
        if (ob_get_length()) ob_clean();
        echo json_encode(['success' => true, 'message' => 'Article updated successfully.']);
        exit;
    }

    if ($method === 'DELETE') {
        if (!isset($_COOKIE['session_token']) || empty($_COOKIE['session_token'])) {
            if (ob_get_length()) ob_clean();
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Unauthorized']);
            exit;
        }

        $input = json_decode(file_get_contents('php://input'), true);
        $id = $input['id'] ?? null;

        if (!$id) {
            if (ob_get_length()) ob_clean();
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Article ID required for deletion.']);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM articles WHERE id = :id");
        $stmt->execute([':id' => $id]);

        error_log("[API LOG] Article deleted ID: {$id}");
        if (ob_get_length()) ob_clean();
        echo json_encode(['success' => true, 'message' => 'Article deleted successfully.']);
        exit;
    }
}

// Fallback for unmatched routes
error_log("[API WARNING] Endpoint not found: {$request_path}");
if (ob_get_length()) ob_clean();
http_response_code(404);
echo json_encode(['success' => false, 'message' => 'Endpoint not found.']);