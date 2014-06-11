<?php
require 'lib/safemysql.class.php';

class Api {
	function __construct($opts, $tabl) {
		$this->opts = $opts;
		$this->tabl = $tabl;
		$this->db = new SafeMySQL($this->opts);
	}
	function getUser($uid, $from, $to){
		$this->jsonOut($this->db->getAll(
			'select unix_timestamp(ctime) as ctime, online, uid from ?n where uid = ?i and ctime between from_unixtime(?i) and from_unixtime(?i)',
			 $this->tabl, $uid, $from, $to));
	}
	function getUserAll($uid){
		$this->jsonOut($this->db->getAll('select unix_timestamp(ctime) as ctime, online, uid from ?n where uid = ?i',
			$this->tabl, $uid));
	}
	function getAll() {
		$this->jsonOut($this->db->getAll('select uid, unix_timestamp(ctime) as ctime, online from ?n',
			$this->tabl));
	}
	function users() {
		$this->jsonOut($this->db->getCol('select distinct(uid) from ?n',
			$this->tabl));
	}
	function jsonOut($data) {
	    error_reporting(0);
	    header('Content-type: application/json');
	    header('Cache-Control: no-cache');
	    header('Pragma: no-cache');
	    ob_clean();
	    echo(json_encode($data));
	}

}

$tabl = 'online';
$opts = array(
    'user'    => 'root',
    'pass'    => 'sqlsadizm',
    'db'      => 'main',
);

$loggerApi = new Api($opts, $tabl);

if (isset($_GET['action'])) {
	if ($_GET['action'] == 'getuser' && isset($_GET['uid'])) {
		if (isset($_GET['from']) && isset($_GET['to'])) {
			$loggerApi->getUser($_GET['uid'], $_GET['from'], $_GET['to']);
		} else {
			$loggerApi->getUserAll($_GET['uid']);
		}
	} elseif ($_GET['action'] == 'users') {
		$loggerApi->users();
	}
} else {$loggerApi->getAll();}

?>