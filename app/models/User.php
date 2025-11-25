<?php
class User {
  private $db;

  public function __construct(){
    $this->db = new Database;
  }

  // Register User
  public function register($data){
    $this->db->query('INSERT INTO users (first_name, last_name, email, username, password, dob, role) VALUES(:first_name, :last_name, :email, :username, :password, :dob, "customer")');
    // Bind values
    $this->db->bind(':first_name', $data['first_name']);
    $this->db->bind(':last_name', $data['last_name']);
    $this->db->bind(':email', $data['email']);
    $this->db->bind(':username', $data['username']);
    $this->db->bind(':password', $data['password']);
    $this->db->bind(':dob', $data['dob']);

    // Execute
    if($this->db->execute()){
      return true;
    } else {
      return false;
    }
  }

  // Login User
  public function login($emailOrUsername, $password){
    $this->db->query('SELECT * FROM users WHERE email = :emailOrUsername OR username = :emailOrUsername');
    $this->db->bind(':emailOrUsername', $emailOrUsername);

    $row = $this->db->single();

    if($row){
        $hashed_password = $row->password;
        if(password_verify($password, $hashed_password)){
            return $row;
        } else {
            return false;
        }
    } else {
        return false;
    }
  }

  // Get User by ID
  public function getUserById($id){
    $this->db->query('SELECT * FROM users WHERE id = :id');
    $this->db->bind(':id', $id);

    $row = $this->db->single();

    return $row;
  }

  // Get games owned by user
  public function getGamesByUserId($id){
    $this->db->query('SELECT g.* FROM games g 
                      JOIN library_games lg ON g.id = lg.game_id 
                      JOIN libraries l ON lg.library_id = l.id 
                      WHERE l.user_id = :id');
    $this->db->bind(':id', $id);

    return $this->db->resultSet();
  }

  // Update Avatar
  public function updateAvatar($id, $avatar){
    $this->db->query('UPDATE users SET avatar = :avatar WHERE id = :id');
    $this->db->bind(':avatar', $avatar);
    $this->db->bind(':id', $id);

    if($this->db->execute()){
      return true;
    } else {
      return false;
    }
  }

  // Find user by email
  public function findUserByEmail($email){
    $this->db->query('SELECT * FROM users WHERE email = :email');
    $this->db->bind(':email', $email);

    $row = $this->db->single();

    // Check row
    if($this->db->rowCount() > 0){
      return true;
    } else {
      return false;
    }
  }

  // Find user by username
  public function findUserByUsername($username){
    $this->db->query('SELECT * FROM users WHERE username = :username');
    $this->db->bind(':username', $username);

    $row = $this->db->single();

    // Check row
    if($this->db->rowCount() > 0){
      return true;
    } else {
      return false;
    }
  }
}
