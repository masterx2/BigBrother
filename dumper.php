#!/usr/bin/env php
<?php
// Prepare Redis
$r = new Redis();
$r->connect('localhost',6379);
// Prepare Mongo
$connecton = new MongoClient();
$db = $connecton->bigbrother;
$online = $db->online;

$now = new DateTime();
$keys = $r->keys('*');
$users = [];
foreach($keys as $key) { // Iterate User
    $timemarks = $r->hGetAll($key);
    $count = count($timemarks);
    if ($count % 2 != 0) {
        end($timemarks); $last_key = key($timemarks);reset($timemarks);
        $last_state = $timemarks[$last_key];
        $timemarks[$now->getTimestamp()] = 1 - $last_state;
    }
    $timemarks_keys = array_keys($timemarks);
    for ($i=0;$i<=$count-2;$i++) { // Iterate Timeline
        $mark_one = $timemarks_keys[$i];
        $mark_two = $timemarks_keys[$i+1];
        $result = $online->insert(['user_id' => (int)$key,
                         'start' => new MongoDate($mark_one),
                         'end' => new MongoDate($mark_two),
                         'status' => (int)$timemarks[$mark_one],
                         'duration' => $mark_two - $mark_one
                        ]);
    }
}
$r->flushAll();