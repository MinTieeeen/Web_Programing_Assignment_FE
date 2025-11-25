<?php
// Load Config
require_once 'config/config.php';

// Start Session
session_start();

// Autoload Core Libraries
spl_autoload_register(function($className){
  require_once 'core/' . $className . '.php';
});
