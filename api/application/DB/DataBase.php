<?php

class DataBase {
    function __construct() {
        $conf = parse_ini_file('config.ini');
        $this->conn = new mysqli($conf['mysql_host'],$conf['mysql_user'],$conf['mysql_password'], $conf['mysql_database']);
        if ($this->conn->connect_errno) {
            printf("Не удалось подключиться: %s\n", $conn->connect_error);
            exit();
        }
    }

    function __destruct() {
        $this->conn->close();
    }

    public function getPostById($postId) {
        $query = 'SELECT *
                    FROM blog_post 
                    WHERE post_id="'.$postId.'"';
        $result = $this->conn->query($query);
        return $result->fetch_object();
    }

    public function createPost($title,$text,$userId) {
        $query = 'INSERT 
                    INTO blog_post(post_title,post_text,user_id)
                    VALUES ("'.$title.'","'.$text.'","'.$userId.'");';                    
        $result = $this->conn->query($query);
        return true;
    }

    public function getLastPostId() {
        $query = '  SELECT post_id 
                    FROM blog_post
                    ORDER BY post_id DESC
                    LIMIT 1';
        $result = $this->conn->query($query);
        return $result->fetch_object();
    }
    
    public function getLastPosts($postId, $postCount) {
        $query = 'SELECT * FROM blog_post
        WHERE post_id < '.$postId.' and post_id IN (SELECT post_id
        FROM blog_post 
        ORDER BY post_id DESC)
        ORDER BY post_id DESC
        LIMIT '.$postCount.'';
                    
        $result = $this->conn->query($query);
        return mysqli_fetch_all($result, MYSQLI_ASSOC);
        
    }
}