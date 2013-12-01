<?php

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

require_once __DIR__.'/../vendor/autoload.php';

$app = new Silex\Application();

$app->register(new Silex\Provider\DoctrineServiceProvider(), array(
    'db.options' => array(
        'driver'   => 'pdo_sqlite',
        'path'     => __DIR__.'/app.db',
    ),
));

$app->get('/api/tags', function() use ($app) {
    $sql = "SELECT id, name, count(at.tag_id) as counter FROM tags t
            LEFT JOIN answers_tags at ON (t.id = at.tag_id)
            GROUP BY name
            ORDER BY counter DESC, name ASC";

    $tags = $app['db']->fetchAll($sql);

    return $app->json($tags);
});

$app->post('/api/tags', function(Request $request) use ($app) {
    $data = json_decode($request->getContent(), true);

    $sql = "INSERT INTO tags (name) VALUES(:name)";
    $stmt = $app['db']->prepare($sql);
    $stmt->bindValue(':name', $data['name'], PDO::PARAM_STR);

    $result = $stmt->execute();

    $tagId = $app['db']->lastInsertId();

    if($result) {
        $response = array(
            'status' => 'ok',
            'id' => $tagId,
        );
    } else {
        $response = array(
            'status' => 'error',
        );
    }

    return $app->json($response);
});

$app->get('/api/languages', function() use ($app) {
    $sql = "SELECT * from languages ORDER BY name ASC";
    $tags = $app['db']->fetchAll($sql);

    return $app->json($tags);
});

$app->post('/api/answers', function(Request $request) use ($app) {
    $data = json_decode($request->getContent(), true);

    $languageId = $data['languageId'];
    $tagIds = $data['tagIds'];
    $opinion = $data['opinion'];

    if(empty($data['tagIds'])) {

        return  $app->json(array('status' => 'error'), 412);
    }

    $sql = "INSERT INTO answers (language_id, opinion, ip) VALUES(:languageId, :opinion, :ip)";
    $stmt = $app['db']->prepare($sql);

    $stmt->bindValue(':languageId', $languageId, PDO::PARAM_INT);
    $stmt->bindValue(':opinion', $opinion, PDO::PARAM_STR);
    $stmt->bindValue(':ip', $_SERVER['REMOTE_ADDR'], PDO::PARAM_STR);

    $result = $stmt->execute();

    if(!$result) {
        return $app->json(array('status' => 'error'));
    }

    $answerId = $app['db']->lastInsertId();

    $sql = "INSERT INTO answers_tags (answer_id, tag_id) VALUES(:answerId, :tagId)";
    $stmt = $app['db']->prepare($sql);

    foreach($tagIds as $tagId) {
        $stmt->bindValue(':answerId', $answerId, PDO::PARAM_INT);
        $stmt->bindValue(':tagId', $tagId, PDO::PARAM_INT);

        $result = $stmt->execute();
    }

    $response = array(
        'status' => ($result) ? 'ok': 'error',
    );

    return $app->json($response);
});

//$app['debug'] = true;
$app->run();