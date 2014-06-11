<?php
require '/var/www/online/lib/Curl.class.php';

class Vk {
	public function __construct() {
		$this->curl = new Curl();
		$this->curl->setOpt(CURLOPT_SSL_VERIFYPEER, FALSE);
		$this->vkapi_url = 'https://api.vk.com/method/';
	}
	public function request($method, $params) {
		$url = $this->vkapi_url.$method;
		$this->curl->get($url, $params);
		if ($this->curl->error) {return 0; } else {
			return json_decode($this->curl->response, true)['response'];
		}
	}
	public function jsonOut($data) {
		error_reporting(0);
    	header('Content-type: application/json');
    	header('Cache-Control: no-cache');
    	header('Pragma: no-cache');
    	ob_clean();
    	echo(json_encode($data));
	}
};