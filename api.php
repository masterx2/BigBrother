<?php
class Api {
	function __construct() {
        $connecton = new MongoClient();
        $db = $connecton->bigbrother;
        $this->online = $db->online;
	}
	function getData($from, $to) {
        $data = $this->online->aggregate(['$match' => [ 'start' => [ '$gte' => new MongoDate($from) ],
                                                        'end' => [ '$lt' => new MongoDate($to) ]]
                                         ],
                                         ['$group' => ['_id' => '$user_id',
                                                       'timeline' => [ '$push' => [ 'start' => '$start',
                                                                                    'end' => '$end',
                                                                                    'status' => '$status']],
                                                       'timemarks' => ['$sum' => 1]
                                                       ]
                                         ]);
        $this->jsonOut($data['result']);
	}
	private function jsonOut($data) {
	    error_reporting(0);
	    header('Content-type: application/json');
	    header('Cache-Control: no-cache');
	    header('Pragma: no-cache');
	    ob_clean();
	    echo(json_encode($data));
	}
}
$loggerApi = new Api();
$loggerApi->getData(strtotime($_GET['from']),strtotime($_GET['to']));
?>