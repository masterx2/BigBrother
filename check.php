<?php
require 'lib/Vk.class.php';
$user = 258212;

$vk = new Vk();
$now = new DateTime();
$r = new Redis();
$r->connect('localhost','6379');

$states = [ 1 => 'online', 0 => 'offline' ];

$friends = $vk->request('friends.get',  array(
	'user_id' => $user,
	'fields' => 'online'
	)
);

foreach ($friends as $friend) {
    $user_timeline = $r->hGetAll($friend['user_id']); // Get All Keys(Timemarks)
    if ($user_timeline) {
        echo 'Update User State...'.PHP_EOL;
        end($user_timeline); $lastkey = key($user_timeline); // Get Last Timemark Key
        $last_user_state = $r->hGet($friend['user_id'], $lastkey); // Get Last State
        // Check for stateChange
        if ($friend['online'] != $last_user_state) { // If Changed Update User Hash
            echo 'User: '.$friend['first_name'].' '.$friend['last_name']
                .' changed state on ['.$this->states[$friend['online']].']'.PHP_EOL;
            $r->hSet($friend['user_id'], $now->getTimestamp(), $friend['online']);
        }
    } else {
        echo 'User not found...creating with UID['.$friend['uid'].']'.PHP_EOL;
        $r->hSet($friend['user_id'], $now->getTimestamp(), $friend['online']);
    }
}