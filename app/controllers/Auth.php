<?php
class Auth extends Controller {
  private $userModel;

  public function __construct(){
    $this->userModel = $this->model('User');
  }

  public function login(){
    // Check for POST
    if($_SERVER['REQUEST_METHOD'] == 'POST'){
      // Process form
      // Sanitize POST data
      $_POST = filter_input_array(INPUT_POST, FILTER_SANITIZE_STRING);
      
      // Init data
      $data = [
        'username' => trim($_POST['username']), // Can be email or username, logic below assumes email for now or needs adjustment
        'password' => trim($_POST['password']),
        'username_err' => '',
        'password_err' => ''
      ];

      // Validate Email/Username
      if(empty($data['username'])){
        $data['username_err'] = 'Vui lòng nhập email hoặc tên người dùng';
      }

      // Validate Password
      if(empty($data['password'])){
        $data['password_err'] = 'Vui lòng nhập mật khẩu';
      }

      // Check for user/email
      if($this->userModel->findUserByEmail($data['username']) || $this->userModel->findUserByUsername($data['username'])){
        // User found
      } else {
        // User not found
        $data['username_err'] = 'Không tìm thấy người dùng';
      }

      // Make sure errors are empty
      if(empty($data['username_err']) && empty($data['password_err'])){
        // Validated
        // Check and set logged in user
        // Note: Login method in model currently expects email. 
        // We need to handle if user entered username. 
        // For simplicity, let's assume the input name="username" but user can enter email.
        // We might need to adjust User model to find by either.
        
        // Let's try to login with email first
        $loggedInUser = $this->userModel->login($data['username'], $data['password']);
        
        // If failed, maybe they entered username? 
        // The current User::login takes email. 
        // Let's update User::login to handle this or just stick to email for now?
        // The form says "Tên người dùng hoặc Email".
        
        // Let's just pass the input to login, and update User::login to check both or find the email first.
        // Actually, let's just find the user row first by either email or username, then verify password.
        
        // Refined approach:
        // 1. Find user by email OR username
        // 2. Verify password
        
        // But User::login currently does query by email.
        // Let's update User::login to be smarter or do it here.
        
        // Let's stick to the plan: call login.
        // I will update User::login to accept identifier (email or username)
        
        if($loggedInUser){
          // Create Session
          $this->createUserSession($loggedInUser);
        } else {
          $data['password_err'] = 'Mật khẩu không đúng';
          $this->view('auth/login', $data);
        }
      } else {
        // Load view with errors
        $this->view('auth/login', $data);
      }

    } else {
      // Init data
      $data = [
        'username' => '',
        'password' => '',
        'username_err' => '',
        'password_err' => ''
      ];

      // Load view
      $this->view('auth/login', $data);
    }
  }

  public function createUserSession($user){
    $_SESSION['user_id'] = $user->id;
    $_SESSION['user_email'] = $user->email;
    $_SESSION['user_name'] = $user->first_name;
    $_SESSION['user_avatar'] = $user->avatar;
    $_SESSION['user_role'] = $user->role;
    header('location: ' . URLROOT . '/home');
  }

  public function logout(){
    unset($_SESSION['user_id']);
    unset($_SESSION['user_email']);
    unset($_SESSION['user_name']);
    unset($_SESSION['user_avatar']);
    unset($_SESSION['user_role']);
    session_destroy();
    header('location: ' . URLROOT . '/auth/login');
  }

  public function register(){
    // Check for POST
    if($_SERVER['REQUEST_METHOD'] == 'POST'){
      // Process form
      
      // Sanitize POST data
      $_POST = filter_input_array(INPUT_POST, FILTER_SANITIZE_STRING);

      // Init data
      $data = [
        'first_name' => trim($_POST['firstName']),
        'last_name' => trim($_POST['lastName']),
        'email' => trim($_POST['email']),
        'username' => trim($_POST['username']),
        'password' => trim($_POST['password']),
        'confirm_password' => trim($_POST['confirm_password']),
        'dob' => trim($_POST['birthdate']),
        'gender' => trim($_POST['gender']),
        'first_name_err' => '',
        'last_name_err' => '',
        'email_err' => '',
        'username_err' => '',
        'password_err' => '',
        'confirm_password_err' => '',
        'dob_err' => ''
      ];

      // Validate Email
      if(empty($data['email'])){
        $data['email_err'] = 'Vui lòng nhập email';
      } else {
        // Check email
        if($this->userModel->findUserByEmail($data['email'])){
          $data['email_err'] = 'Email đã được đăng ký';
        }
      }

      // Validate Name
      if(empty($data['first_name'])){
        $data['first_name_err'] = 'Vui lòng nhập tên';
      }
      if(empty($data['last_name'])){
        $data['last_name_err'] = 'Vui lòng nhập họ';
      }

      // Validate Username
      if(empty($data['username'])){
        $data['username_err'] = 'Vui lòng nhập tên người dùng';
      } else {
        if($this->userModel->findUserByUsername($data['username'])){
          $data['username_err'] = 'Tên người dùng đã tồn tại';
        }
      }

      // Validate Password
      if(empty($data['password'])){
        $data['password_err'] = 'Vui lòng nhập mật khẩu';
      } elseif(strlen($data['password']) < 6){
        $data['password_err'] = 'Mật khẩu phải có ít nhất 6 ký tự';
      }

      // Validate Confirm Password
      if(empty($data['confirm_password'])){
        $data['confirm_password_err'] = 'Vui lòng xác nhận mật khẩu';
      } else {
        if($data['password'] != $data['confirm_password']){
          $data['confirm_password_err'] = 'Mật khẩu xác nhận không khớp';
        }
      }

      // Make sure errors are empty
      if(empty($data['email_err']) && empty($data['first_name_err']) && empty($data['password_err']) && empty($data['username_err']) && empty($data['confirm_password_err'])){
        // Validated
        
        // Hash Password
        $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);

        // Register User
        if($this->userModel->register($data)){
          // Redirect to login
          header('location: ' . URLROOT . '/auth/login');
        } else {
          die('Something went wrong');
        }

      } else {
        // Load view with errors
        $this->view('auth/register', $data);
      }

    } else {
      // Init data
      $data = [
        'first_name' => '',
        'last_name' => '',
        'email' => '',
        'username' => '',
        'password' => '',
        'confirm_password' => '',
        'dob' => '',
        'first_name_err' => '',
        'last_name_err' => '',
        'email_err' => '',
        'username_err' => '',
        'password_err' => '',
        'confirm_password_err' => '',
        'dob_err' => ''
      ];

      // Load view
      $this->view('auth/register', $data);
    }
  }


}
