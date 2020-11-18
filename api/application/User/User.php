<?php

class User {
    
    function __construct($db) {
        $this->db = $db;
    }


    public function login($login, $password) {
        $user = $this->db->getUserByLoginPassword($login, $password);
        if ($user) {
            $token = md5(rand() * 100000);
            $this->db->updateToken($user->user_id, $token);
            return array('token' => $token);
        }
        return false;
    }

    public function logout($token) {
        $user = $this->db->getUserByToken($token);
        if ($user) {
            $this->db->updateToken($user->user_id, null);
            return true;
        }
        return false;
    }

    public function registration($login, $password) {
        $user = $this->db->getUserByLogin($login);
        if (!$user) {
            return $this->db->setUserByLoginPassword($login, $password);
        }
        return false;
    }

    public function getUserByPostId($id) {
        $user = $this->db->getUserByPostId($id);
        if ($user) {
            return $user;
        }
        return false;
    }

    public function getUserPermissionsByToken($token) {
        $permissions = $user = $this->db->getUserPermissionsByToken($token);
        if ($permissions) {
            return $permissions;
        }
        return false;
    }
}