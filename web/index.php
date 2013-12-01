<?php

require_once __DIR__.'/../vendor/autoload.php';

$app = new Silex\Application();

$app->register(new Silex\Provider\DoctrineServiceProvider(), array(
    'db.options' => array(
        'driver'   => 'pdo_sqlite',
        'path'     => __DIR__.'/app.db',
    ),
));

$app->get('/api/tags', function() use ($app) {
    $sql = "SELECT * from tags";
    $tags = $app['db']->fetchAll($sql);

    return $app->json($tags);
});

$app->get('/api/languages', function() use ($app) {
    $sql = "SELECT * from languages";
    $tags = $app['db']->fetchAll($sql);

    return $app->json($tags);
});

//$app['debug'] = true;
$app->run();