<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Online Logger</title>
	<link rel="stylesheet" href="css/style.css">
	<link href='http://fonts.googleapis.com/css?family=Ubuntu&subset=latin,cyrillic-ext' rel='stylesheet' type='text/css'>
	<script type="text/javascript" src="http://yandex.st/jquery/2.0.3/jquery.min.js"></script>
	<script type="text/javascript" src="js/moment.js"></script>
	<script type="text/javascript" src="js/async.js"></script>
	<script type="text/javascript" src="js/main.js"></script>
</head>
<body onkeydown="keyDown(event)" onkeyup="keyUp(event)">
	<div id="wrap">
		<div id="head">Big Brother</div>
		<div id="container">
			<div id="activeruler"></div>
			<canvas id="ruler" width="1002" height="50"></canvas>
			<div id="content"></div>
		</div>
	</div>
</body>
</html>

