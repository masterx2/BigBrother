var app;
$(function() {
    app = new Core();
});
function Core(){
    var t = this;
    t.init = function(){
        t.prepare();
        t.log('Core Activated');
        t.log('Loading Initial Data');
        var now = new Date(),
            minusDay = new Date(now.getTime()-86400),
            plusDay = new Date(now.getTime()+86400);
        t.load('12-06-2014 20:00:00', '13-06-2014 20:00:00');
    };

    t.process = function(data, users){
        if (!users) {
            t.getUsersDetails(data);
        } else {
            t.render(data, users);
        }
    };

    t.render = function(data, users) {
        var display = $('#display'),
            count = data.length;
        for(var user_index=0;user_index < count;user_index++) {
            var user_id = data[user_index]._id,
                user = users.filter(function(user){return user.uid == user_id})[0];
            display.append(t.generateUser(user, data[user_index]));
        }
    };

    t.generateUser = function(user, data){

        var statusClass = { 1: 'online', 0: 'offline'};

        var userRow = $('<div></div>').addClass('user-row'),
            userTitle = $('<div></div>').addClass('user-title').text(user.first_name+' '+user.last_name),
            userTimeline = $('<div></div>').addClass('user-timeline');

        var timeLineWidth = 870,
            timePeriodSec = 86400,
            secPerPixel = timeLineWidth / timePeriodSec,
            timeItemsCount = data.timeline.length;

        for (var i=0;i<timeItemsCount;i++){
            var itemWidth = data.timeline[i].duration * secPerPixel,
                status = data.timeline[i].status,
                title = new Date(data.timeline[i].start['sec']*1e3).logStamp()+' '+new Date(data.timeline[i].end['sec']*1e3).logStamp();
                timeItem = $('<div></div>').css({width: itemWidth}).addClass(statusClass[status])
                    .attr('title',title);
            userTimeline.append(timeItem);
        }


        return userRow.append(userTitle).append(userTimeline);
    };

    t.getUsersDetails = function(data){
        var users = [];
        for(var i=0;i<data.length;i++){
            users.push(data[i]._id);
        }
        $.ajax({
            url: "https://api.vk.com/method/users.get",
            dataType: 'jsonp',
            data: {
                'user_ids': users,
                'fields': 'screen_name,timezone,sex,status,last_seen,online,online_mobile,photo_50, photo_100'
            },
            success: function (vkusers) {
                t.process(data, vkusers.response);
            }
        });
    };

    t.load = function(from, to){
        $.ajax({
            url: 'http://bigbrother.ru/api.php',
            dataType: 'json',
            data: {
                from: from,
                to: to
            },
            success: function (data) {
                t.process(data);
            }
        })
    };

    t.log = function(data){
        if (t.DEBUG) {
            var now = new Date();
            // console.log(now.logStamp()+' '+data);
            console.log(data);
        }
    };

    t.prepare = function(){
        moment.lang('ru');
        t.DEBUG = true;
        Date.prototype.rusDate = function () {
            return this.getDate() + '-' + (this.getMonth() + 1) + '-' + this.getFullYear();
        };
        Date.prototype.logStamp = function(){
            return '['+this.rusDate()+' '+this.getHours()+':'+this.getMinutes()+
                ':'+this.getSeconds()+'.'+this.getMilliseconds()+']';
        };
    };
    t.init();
}