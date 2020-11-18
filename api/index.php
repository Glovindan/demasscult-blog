<?php
error_reporting(-1);

require_once('application/Application.php');

function router($params) {
    
    $method = $params['method'];
    if ($method) {
        $app = new Application();
        switch ($method) { 
            case 'login': return $app->login($params);
            case 'logout': return $app->logout($params);
            case 'registration': return $app->registration($params);
            
            case 'getPostById': return $app->getPostById($params);
            case 'getLastPosts': return $app->getLastPosts($params);
            case 'getLastPostId': return $app->getLastPostId($params);
            case 'createPost': return $app->createPost($params);

            case 'getUserByPostId': return $app->getUserByPostId($params);
            case 'getUserPermissionsByToken': return $app->getUserPermissionsByToken($params);
            default: return false;
        }
    }
    return false;
}

function answer($data) {
    if ($data) {
        return array(
            'result' => 'ok',
            'data' => $data
        );
    }
    return array(
        'result' => 'error',
        'error' => array(
            'code' => 9000,
            'text' => 'unknown error'
        ),
        'data' => $data
    );
}

echo json_encode(answer(router($_GET)));