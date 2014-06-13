<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Online Logger</title>
        <script type="text/javascript" src="http://yandex.st/jquery/2.0.3/jquery.min.js"></script>
        <script type="text/javascript" src="js/bootstrap.js"></script>
        <script type="text/javascript" src="js/moment.js"></script>
        <script type="text/javascript" src="js/main.js"></script>
        <link rel="stylesheet" href="css/bootstrap.css">
        <link rel="stylesheet" href="css/style.css">
    </head>
    <body>
        <div class="navbar navbar-fixed-top bg-primary navbar-default" role="navigation">
            <div class="container">
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <a class="navbar-brand" href="#">The BigBrother</a>
                </div>
                <div class="collapse navbar-collapse">
                    <ul class="nav navbar-nav">
                        <li class="active"><a href="#">Summary</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                    <img class="logos pull-right" src="img/mongodb-logo.png" alt="MongoDB Database"/>
                    <img class="logos pull-right" src="img/redis-logo.png" alt="Redis"/>
                </div>
            </div>
        </div>
        <div class="container" id="main">
            <div class="row">
                <div class="col-lg-12">
                    <div id="display"></div>
                </div>
            </div>
        </div>
    </body>
</html>