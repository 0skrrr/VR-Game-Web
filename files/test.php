<?php
/**
 * Erasmus+ Project Contact & Feedback Form Handler with SQLite Integration
 * Project Reference: 2025-1-CZ01-KA220-VET-000352944
 *
 * Handles POST submissions, stores inquiries in the SQLite database,
 * and routes notifications to the lead coordinator.
 */

// Enable error reporting during development (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Set headers for JSON response and security
header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');

// Configuration
$coordinator_email = "24061ok@creativehill.cz"; // Update with actual coordinator email
$project_reference = "2025-1-CZ01-KA220-VET-000352944";
$db_path = __DIR__ . '/testchc.sqlite'; // Adjust path to your SQLite database file if necessary

// Response array template
$response = [
    'success' => false,
    'message' => ''
];

// Verify request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    $response['message'] = 'Method not allowed.';
    echo json_encode($response);
    exit;
}

// Sanitize and validate input data
$name        = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
$email       = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
$institution = filter_input(INPUT_POST, 'institution', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
$subject     = filter_input(INPUT_POST, 'subject', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
$message     = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
$honeypot    = filter_input(INPUT_POST, 'website', FILTER_SANITIZE_FULL_SPECIAL_CHARS); // Anti-spam bot trap

// Check Honeypot field (if filled, it's a bot)
if (!empty($honeypot)) {
    http_response_code(400);
    $response['message'] = 'Spam detected.';
    echo json_encode($response);
    exit;
}

// Validate required fields
if (empty($name) || empty($email) || empty($subject) || empty($message)) {
    http_response_code(400);
    $response['message'] = 'Please fill in all required fields.';
    echo json_encode($response);
    exit;
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    $response['message'] = 'Invalid email address provided.';
    echo json_encode($response);
    exit;
}

// 1. Save submission to SQLite Database using PDO
try {
    $pdo = new PDO("sqlite:" . $db_path);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

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

} catch (PDOException $e) {
    // Log database error internally if needed, and return a clean error to the user
    http_response_code(500);
    $response['message'] = 'Database error: Unable to save your inquiry at this moment.';
    echo json_encode($response);
    exit;
}

// 2. Prepare and send email notification to the coordinator
$email_subject = "[Erasmus+ Inquiry - Ref: {$project_reference}] " . $subject;

$email_body  = "You have received a new message via the project website contact form.\n\n";
$email_body .= "--------------------------------------------------\n";
$email_body .= "Sender Name: {$name}\n";
$email_body .= "Sender Email: {$email}\n";
$email_body .= "Institution: " . (!empty($institution) ? $institution : 'Not specified') . "\n";
$email_body .= "Project Ref: {$project_reference}\n";
$email_body .= "--------------------------------------------------\n\n";
$email_body .= "Message:\n{$message}\n\n";
$email_body .= "--------------------------------------------------\n";
$email_body .= "Funded by the European Union.\n";

$headers  = "From: no-reply@erasmus-vet-project.eu\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

$mail_sent = mail($coordinator_email, $email_subject, $email_body, $headers);

// Respond back to the frontend/client
if ($mail_sent) {
    http_response_code(200);
    $response['success'] = true;
    $response['message'] = 'Thank you! Your message has been successfully saved and routed to the project coordinator.';
} else {
    // Note: The entry is safely stored in SQLite even if the mail server fails
    http_response_code(200);
    $response['success'] = true;
    $response['message'] = 'Thank you! Your message has been recorded in our system, though email notification was delayed.';
}

echo json_encode($response);