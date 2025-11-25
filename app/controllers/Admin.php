<?php
class Admin extends Controller {
  public function __construct(){
    // Check if admin
  }

  public function index(){
    $data = [
      'title' => 'Admin Dashboard'
    ];

    $this->view('admin/index', $data);
  }
}
