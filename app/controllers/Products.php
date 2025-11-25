<?php
class Products extends Controller {
  public function __construct(){
    // Load Product Model
  }

  public function index(){
    $data = [
      'title' => 'Games'
    ];

    $this->view('products/index', $data);
  }
}
