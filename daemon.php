#!/usr/bin/env php
<?php
// Daemonize
$child_pid = pcntl_fork();if($child_pid){exit();};posix_setsid();

// STD redirects
$logdir = dirname(__FILE__).'/logs/';
ini_set('error_log',$logdir.'error.log');
fclose(STDIN);
fclose(STDOUT);
fclose(STDERR);
$STDIN = fopen('/dev/null', 'r');
$STDOUT = fopen($logdir.'daemon.log', 'ab');
$STDERR = fopen($logdir.'daemon.error.log', 'ab');

class DaemonClass {
    public $maxProcesses = 1;
    protected $stop_server = false;
    protected $currentJobs = array();

    public function __construct() {
        echo "Сonstructed daemon controller".PHP_EOL;
        pcntl_signal(SIGTERM, array($this, "childSignalHandler"));
        pcntl_signal(SIGCHLD, array($this, "childSignalHandler"));
    }

    public function
    run() {
        echo "Running daemon controller".PHP_EOL;
        while (!$this->stop_server) {
            while(count($this->currentJobs) >= $this->maxProcesses) {
                sleep(1);
                pcntl_signal_dispatch();
            }
            $this->launchJob();
        }
    }

    protected function launchJob() {
        $pid = pcntl_fork();
        if ($pid == -1) {
            error_log('Could not launch new worker, exiting');
            return false;
        }
        elseif ($pid) {
            $this->currentJobs[$pid] = true;
        }
        else {
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
                    end($user_timeline); $lastkey = key($user_timeline); // Get Last Timemark Key
                    $last_user_state = $r->hGet($friend['user_id'], $lastkey); // Get Last State
                    // Check for stateChange
                    if ($friend['online'] != $last_user_state) { // If Changed Update User Hash
                        echo '['.$now->format("d-m-Y H:i:s").'] '.$friend['first_name'].' '.$friend['last_name']
                            .' changed state to ['.$states[$friend['online']].']'.PHP_EOL;
                        $r->hSet($friend['user_id'], $now->getTimestamp(), $friend['online']);
                    }
                } else {
                    echo 'User not found...creating with UID['.$friend['uid'].']'.PHP_EOL;
                    $r->hSet($friend['user_id'], $now->getTimestamp(), $friend['online']);
                }
            }
            sleep(10);
            exit();
        }
        return true;
    }

    public function childSignalHandler($signo, $pid = null, $status = null) {
        switch($signo) {
            case SIGTERM:
                $this->stop_server = true;
                break;
            case SIGCHLD:
                if (!$pid) {
                    $pid = pcntl_waitpid(-1, $status, WNOHANG);
                }
                while ($pid > 0) {
                    if ($pid && isset($this->currentJobs[$pid])) {
                        unset($this->currentJobs[$pid]);
                    }
                    $pid = pcntl_waitpid(-1, $status, WNOHANG);
                }
                break;
            default:
        }
    }
}

$daemon = new DaemonClass();
$daemon->run();