$(function() {
	moment.lang('ru');
	updateRuler();
	$.ajax({
		url: document.URL + 'api.php',
		dataType: 'json',
		data: {
			'action': 'users',
		},
		success: function (data) {
			processUsers(data);
		}
	})

	$(window).scroll(function () {
		if ($(document).scrollTop() >= 80) {
			$('#ruler').css({
				'position': 'fixed',
				'top': '0'
				});
		} else {
			$('#ruler').css({
				'position': 'inherit'
			});
		}
	})

});

function findCollisions() {
	$('.timeitem').each(function (i,v) {
		if(collision($(v), $('#activeruler'))) {
			$(v).addClass('onruler')
		} else {
			$(v).removeClass('onruler')
		}
	})
	$('.timeitem.online.onruler').parent().parent().addClass('ruleronline').removeClass('ruleroffline');
	$('.timeitem.offline.onruler').parent().parent().addClass('ruleroffline').removeClass('ruleronline');
}

function updateRuler () {
	var start = moment().startOf('day').format('X');
	var now = moment().format('X');
	var period = now - start;
	console.log(period);
	var vod = period / 1000;
	var rulerId = $("#ruler")[0];
	var draw = rulerId.getContext("2d");
	draw.font="10px Arial";
	for (i=0;i<=1000;i++) {
	    scale = i * 10 ;
	    draw.moveTo(scale, 50);
	    if (i % 6){
	        h=40;
	    } else {
	        h=30;
	        if (i > 0) {
	        	draw.fillText(moment().startOf('day').seconds(Math.floor(scale*vod)).format('H:mm'),scale-10,20);
	        }
	    };
	    draw.lineTo(scale, h);
	    draw.lineWidth = 1;
	    draw.stroke();
	}
}

function processUsers (data) {
	for (var i = data.length - 1; i >= 0; i--) {
		$.ajax({
			url: document.URL + 'api.php',
			dataType: 'json',
			data: {
				'action': 'getuser',
				'uid' : data[i],
				'from': moment().startOf('day').format('X'),
				'to': moment().endOf('day').format('X')
			},
			success: function (data) {
					addUser(data);
			}
		})
	}
}

function addUser (data) {
	var secondwidth = 1000 / (moment().format('X') - moment().startOf('day').format('X'));
	statclass = {
		'1': 'online',
		'0': 'offline'
	};
	userData = processUserData(data);
	if (userData) {
		userid  = userData[0];
		timeline = userData[1];
		$('#content').append('<div class="user" id="'+userid+'">');
		fillUser(userid);
		$('#'+userid).append('<div class="timeline '+statclass[timeline[timeline.length-1]['online']]+'">')
		console.log(userData);
		for (var i = 0; i <= timeline.length-1 ; i++) {
			var width = Math.floor(timeline[i]['time'] * secondwidth);
			$('#'+userid+' > div.timeline').append('<div class="timeitem '+
				statclass[timeline[i]['online']]+'" style="width: '+
				width+'px" title="From: '+secConv(timeline[i]['from'])+' To: '+secConv(timeline[i]['to'])+'">&nbsp;&nbsp;'+
				moment().startOf('day').seconds(timeline[i]['time']).format('H:mm')+'</div>');
		};
		$('#'+userid).append('</div>');
		$('#content').append('</div>');
	}
}

function fillUser (uid) {
	$.ajax({
		url: "https://api.vk.com/method/users.get",
		dataType: 'jsonp',
		data: {
			'user_ids': uid,
			'fields': 'status,online,online_mobile,photo_50,photo_100'
		},
		success: function (data) {
			$('#'+uid).prepend('<div class="name">'+
				data['response'][0]['first_name']+' '+
				data['response'][0]['last_name']+
				'</div>')
		}
	})
};

function processUserData (data) {
	process = [];
	var start = moment().startOf('day').format('X');
	if (data.length > 0) {
		data.unshift({
			'ctime' : start,
			'uid' : data[0]['uid'],
			'online' : 1 - data[0]['online']});
		for (var i = 0; i <= data.length - 1; i++) {
			var first = data[i]['ctime'];
			if (i == data.length - 1) {
			var second = moment().format('X');
			} else {
			var second = data[i+1]['ctime'];
			}
			//console.log(data[i]['uid']+'=>'+data[i]['online']+':'+moment().startOf('day').seconds(second-first).format('H:mm:ss'));
			process.push({
				'online': data[i]['online'],
				'time': second-first,
				'from': first,
				'to': second,
			});
		}
	return [data[0]['uid'], process];
	}
}

function secConv (sec) {
	return moment(sec*1000).format('H:mm:ss');
}

function collision($div1, $div2) {
      var x1 = $div1.offset().left;
      var y1 = $div1.offset().top;
      var h1 = $div1.outerHeight(true);
      var w1 = $div1.outerWidth(true);
      var b1 = y1 + h1;
      var r1 = x1 + w1;
      var x2 = $div2.offset().left;
      var y2 = $div2.offset().top;
      var h2 = $div2.outerHeight(true);
      var w2 = $div2.outerWidth(true);
      var b2 = y2 + h2;
      var r2 = x2 + w2;

      if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
      return true;
    }

    function keyDown(e) {
	if (e.keyCode == 37) {
		$('#activeruler').css({'left': $('#activeruler').css('left').slice(0,-2) - 2});
		if (parseInt($('#activeruler').css('left').slice(0,-2)) < 176) {$('#activeruler').css({'left': '1176px'});};
	};
	if (e.keyCode == 39) {
		$('#activeruler').css({'left': parseInt($('#activeruler').css('left').slice(0,-2)) + 2});
		if (parseInt($('#activeruler').css('left').slice(0,-2)) > 1176) {$('#activeruler').css({'left': '176px'});};	
	};
	if (String.fromCharCode(e.keyCode) == " ") {
	};
};

function keyUp(e) {
	findCollisions();
};