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
        $permissions = $this->getUserPermissionsById($userId);
        if ($permissions->allowCreatePost) {
            $query = 'INSERT 
                    INTO blog_post(post_title,post_text,user_id)
                    VALUES ("'.$title.'","'.$text.'","'.$userId.'");';                    
            $result = $this->conn->query($query);
            return true;
        } else {
            return false;
        }
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

    public function getUserByLogin($login) {
        $query = 'SELECT * FROM blog_user WHERE user_name="' . $login . '"';
        $result = $this->conn->query($query);
        return $result->fetch_object();
    }

    public function getUserByLoginPassword($login, $password) {
        $query = 'SELECT * 
                  FROM blog_user 
                  WHERE user_name="' . $login . '" AND user_password="'.$password.'"';
        $result = $this->conn->query($query);
        return $result->fetch_object();
    }

    public function setUserByLoginPassword($login, $password) {
        $query = "INSERT INTO blog_user (user_name, user_password, role_id, token ) 
                  VALUES ('" . $login . "', '" . $password . "', '1','')";
        $this->conn->query($query);
        return true;
    }

    public function getUserByToken($token) {
        $query = 'SELECT * FROM blog_user WHERE token="'.$token.'"';
        $result = $this->conn->query($query);
        return $result->fetch_object();
    }

    public function updateToken($id, $token) {
        $query = 'UPDATE blog_user SET token="'.$token.'" WHERE user_id='.$id;
        $this->conn->query($query);
        return true;
    }

    public function getUserByPostId($id) {
        $query = 'SELECT user_id,user_name,role_id FROM blog_user WHERE user_id IN
        (SELECT user_id FROM blog_post WHERE post_id = "'.$id.'")';
        $result = $this->conn->query($query);
        return $result->fetch_object();
    }

    public function getUserPermissionsById($userId) {
        $query = 'SELECT * FROM blog_role WHERE role_id in (SELECT role_id FROM blog_user WHERE user_id = "'.$userId.'")';
        $result = $this->conn->query($query);
        return $result->fetch_object();
    }

    public function getUserPermissionsByToken($token) {
        $query = 'SELECT * FROM blog_role WHERE role_id in (SELECT role_id FROM blog_user WHERE token = "'.$token.'")';
        $result = $this->conn->query($query);
        return $result->fetch_object();
    }
}