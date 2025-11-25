<?php
class Users extends Controller {
  private $userModel;

  public function __construct(){
    if(!isset($_SESSION['user_id'])){
      header('location: ' . URLROOT . '/auth/login');
    }
    $this->userModel = $this->model('User');
  }

  public function profile(){
    $data = [
      'user' => $this->userModel->getUserById($_SESSION['user_id']),
      'games' => $this->userModel->getGamesByUserId($_SESSION['user_id'])
    ];

    $this->view('users/profile', $data);
  }

  public function upload_avatar(){
    if($_SERVER['REQUEST_METHOD'] == 'POST'){
      // Check if file was uploaded without errors
      if(isset($_FILES["avatar"]) && $_FILES["avatar"]["error"] == 0){
        $allowed = array("jpg" => "image/jpg", "jpeg" => "image/jpeg", "gif" => "image/gif", "png" => "image/png");
        $filename = $_FILES["avatar"]["name"];
        $filetype = $_FILES["avatar"]["type"];
        $filesize = $_FILES["avatar"]["size"];
    
        // Verify file extension
        $ext = pathinfo($filename, PATHINFO_EXTENSION);
        if(!array_key_exists($ext, $allowed)) die("Error: Please select a valid file format.");
    
        // Verify file size - 5MB maximum
        $maxsize = 5 * 1024 * 1024;
        if($filesize > $maxsize) die("Error: File size is larger than the allowed limit.");
    
        // Verify MYME type of the file
        if(in_array($filetype, $allowed)){
          // Check whether file exists before uploading it
          $new_filename = uniqid() . "." . $ext;
          $upload_path = "assets/uploads/" . $new_filename;

          if(move_uploaded_file($_FILES["avatar"]["tmp_name"], "../public/" . $upload_path)){
            // Update database
            if($this->userModel->updateAvatar($_SESSION['user_id'], $new_filename)){
                // Update session
                $_SESSION['user_avatar'] = $new_filename;
                header('location: ' . URLROOT . '/users/profile');
            } else {
                die("Error: Could not update database.");
            }
          } else {
            die("Error: There was a problem uploading your file. Please try again."); 
          }
        } else {
          die("Error: There was a problem uploading your file. Please try again."); 
        }
      } else {
        die("Error: " . $_FILES["avatar"]["error"]);
      }
    }
  }
}
