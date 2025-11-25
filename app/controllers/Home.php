<?php
class Home extends Controller {
  public function __construct(){
  }

  public function index(){
    $data = [
      'title' => 'Welcome'
    ];

    $this->view('home/index', $data);
  }
}
