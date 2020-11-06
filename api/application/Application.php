<?php

require_once('DB/DataBase.php');
require_once('Post/Post.php');

class Application {
    function __construct() {
        $db = new DataBase();
        $this->post = new Post($db);
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
        if($params['code'] == "12345") { //Захардкодил как черт
            if($params['title'] && $params['text'] && $params['userId']) {
                return $this->post->createPost($params['title'], $params['text'], $params['userId']);
            }
        }
    }
}