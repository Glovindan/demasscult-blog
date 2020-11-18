<?php

require_once('DB/DataBase.php');
require_once('Post/Post.php');
require_once('User/User.php');

class Application {
    function __construct() {
        $db = new DataBase();
        $this->post = new Post($db);
        $this->user = new User($db);
    }

    public function getPostById($params) {
        if($params['postId']) {
            return $this->post->getPostById($params['postId']);
        }
    }
    public function getLastPosts($params) {
        if($params['postId'] && $params['postCount']) {
            return $this->post->getLastPosts($params['postId'],$params['postCount']);
        }
    }
    
    public function getLastPostId() { 
        return $this->post->getLastPostId();
    }
    public function createPost($params) {
        if($params['title'] && $params['text'] && $params['token']) {
            return $this->post->createPost($params['title'], $params['text'], $params['token']);
        } else {
            return false;
        }
    }
    public function getUserByPostId($params) {
        if($params['id']) { //Захардкодил как черт
            return $this->user->getUserByPostId($params['id']);
        }
    }
    public function getUserPermissionsByToken($params) {
        if($params['token']) { //Захардкодил как черт
            return $this->user->getUserPermissionsByToken($params['token']);
        }
    }

    public function login($params) {
        if ($params['login'] && $params['password']) {
            return $this->user->login($params['login'], $params['password']);
        }
        return false;
    }

    public function logout($params) {
        if ($params['token']) {
            return $this->user->logout($params['token']);
        }
        return false;
    }

    public function registration($params) {
        if ($params['login'] && $params['password']) {
            return $this->user->registration($params['login'], $params['password']);
        }
        return false;
    }
}