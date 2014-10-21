var app;
$(function() {
    app = new Core();
    $('#update').click(function(){
        app.load($('#start').val(), $('#end').val());
    })
});
function Core(){
    var t = this;
    t.init = function(){
        t.prepare();
        t.log('Core Activated');
        t.log('Loading Initial Data');
        var now = new Date(),
            minusDay = new Date(now.getTime()-864e5),
            plusDay = new Date(now.getTime()+864e5);

        $('#start').val(minusDay.toPicker());
        $('#end').val(plusDay.toPicker());

        t.load(minusDay.toPicker(), plusDay.toPicker());
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
        display.empty();
        for(var user_index=0;user_index < count;user_index++) {
            var user_id = data[user_index]._id,
                user = users.filter(function(user){return user.uid == user_id})[0];
            display.append(t.generateUser(user, data[user_index]));
        }
    };

    t.generateUser = function(user, data){

        var statusClass = { 1: 'online', 0: 'offline'};

        var userRow = $('<div>').addClass('user-row'),
            userTitle = $('<div>').addClass('user-title').text(user.first_name+' '+user.last_name),
            userTimeline = $('<div>').addClass('user-timeline');

        var timeLineWidth = 870,
            timePeriodSec = (t.to - t.from) / 1e3,
            secPerPixel = timeLineWidth / timePeriodSec,
            timeItemsCount = data.timeline.length;
        t.log(timePeriodSec);

        for (var i=0;i<timeItemsCount;i++){
            var itemWidth = data.timeline[i].duration * secPerPixel,
                status = data.timeline[i].status,
                title = new Date(data.timeline[i].start['sec']*1e3).logStamp()+
                    ' '+new Date(data.timeline[i].end['sec']*1e3).logStamp();
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
        t.from = from.toDate();
        t.to = to.toDate();
        t.log('Load Period from: '+from+' to:'+to);
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
        $.fn.datetimepicker.dates['ru'] = {
            days: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"],
            daysShort: ["Вск", "Пнд", "Втр", "Срд", "Чтв", "Птн", "Суб", "Вск"],
            daysMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
            months: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
            monthsShort: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
            today: "Сегодня",
            suffix: [],
            meridiem: []
        };
        $('.datetimepicker').datetimepicker({
            format: 'dd-mm-yyyy hh:ii',
            autoclose: true,
            weekStart: 1,
            todayBtn: 'linked',
            todayHighlight: true,
            pickerPosition: 'bottom-right',
            language: 'ru'
        });

        t.DEBUG = true;
        Date.prototype.rusDate = function (){
            var rawMonth = this.getMonth()+1;
            if (rawMonth < 10) { var month = '0'+rawMonth} else {var month = rawMonth}
            return this.getDate() + '-' + month + '-' + this.getFullYear();
        };
        Date.prototype.logStamp = function(){
            return '['+this.rusDate()+' '+this.getHours()+':'+this.getMinutes()+
                ':'+this.getSeconds()+'.'+this.getMilliseconds()+']';
        };
        Date.prototype.toPicker = function(){
            return this.rusDate()+' '+this.getHours()+':'+this.getMinutes();
        };
        String.prototype.toDate = function() {
            var parts = this.split(' '),
                date = parts[0],
                time = parts[1],
                dateparts = date.split('-'),
                timeparts = time.split(':');
            return new Date(dateparts[2],parseInt(dateparts[1])-1,dateparts[0],timeparts[0],timeparts[1]);
        }
    };
    t.init();
}