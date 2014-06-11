#!/usr/bin/php

<?php
require '/var/www/online/lib/Vk.class.php';
require '/var/www/online/lib/safemysql.class.php';

$tabl = 'online';
$opts = array(
    'user'    => 'root',
    'pass'    => 'sqlsadizm',
    'db'      => 'main',
);

$db = new SafeMySQL($opts);

$user = 258212;
$vk = new Vk();

$friends = $vk->request('friends.get',  array(
	'user_id' => $user,
	'fields' => 'online'
	)
);

foreach ($friends as $key => $value) {
	$response = $db->getRow('select * from online where uid = ?i order by ctime desc limit 1', $value['uid']);
	if (!$response) {
		$db->query('insert into online(uid,online) values(?i, ?i)',
			$value['uid'], $value['online']);
	} else {
		if ($response['online'] != $value['online']) {
			$db->query('insert into online(uid,online) values(?i, ?i)',
				$value['uid'], $value['online']);
		}
	}
}
?>
