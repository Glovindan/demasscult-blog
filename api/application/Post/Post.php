<?php

class Post {

    function __construct($db) {
        $this->db = $db;
    }

    public function getPostById($postId) {
        return $this->db->getPostById($postId);
    }
    public function getLastPosts($postId, $postCount) {
        return $this->db->getLastPosts($postId, $postCount);
    }
    public function getLastPostId() { 
        return $this->db->getLastPostId();
    }
    public function createPost($title,$text,$userId) {
        return $this->db->createPost($title,$text,$userId);
    }
}