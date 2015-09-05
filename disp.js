var videodata = null;
var vids = [];
var keys = [];
var currentPlayer = 1;
var cue = 2;
var apikey = "AIzaSyDoifBGT5_1FYCWBzmxrJ4miY25jFKliqY";
var videoTimer = null;
var disqus_identifier = "85324";
var first_video_paid = "http://www.youtube.com/v/hRK7PVJFbS8";
var fifth_video_paid = "";
var video_history = [];
var current_video = first_video_paid;
var previous_video = current_video;
var stop_nav = false;

var getVideoIndex = function(min, max) {
var vindex = Math.round( (Math.random() * (max - min) + min) );
if (video_history.contains(vindex)) {
	vindex = getVideoIndex(min, max);
} else { 
	video_history.push(vindex); 
}
return vindex;
}

var toggleComments = function() {
	$('div#disqus_panel').toggle();
}

var setChatThread = function(vi) {
    if (DISQUS.reset) {
    	disqus_identifier = keys[vi];
    	DISQUS.reset({reload: true});
    	window.scrollTo(0,0);
    }
}

var popIndex = function(v,arrs) {
vids = jQuery.grep(arrs, function(value) {
  return value != v;
});
}

var getVids = function(video) {
if (stop_nav) return;
if (videoTimer) clearTimeout(videoTimer);

stop_nav = true;

var complete = function () {
	stop_nav = false;
	$(_player).show();
    $(_cue).attr('src', '');
 }

if (!video) {
var vindex = getVideoIndex(0,vids.length);
video = vids[vindex];
window.setTimeout(function(){setChatThread(vindex)}, 5000);
}

//set the current video 
//youtube format must be 
//http://www.youtube.com/v/VIDEOID
previous_video = current_video;
current_video = video;

if (/youtube\.com/i.test(video)) {
var videoid = video.split('\/v\/');
videoid = videoid[1].split('?')[0];
var opts = "&controls=0&iv_load_policy=3&showinfo=0&modestbranding=1&origin=woahdope.com";
opts = opts + "&hd=1&cc_load_policy=0&version=3&loop=1";
//video = "http://www.youtube.com/embed/" + videoid;
video = "//www.youtube.com/embed/"+videoid+"?playlist="+videoid+"&autoplay=1&rel=0";
}

if (currentPlayer===1) {
currentPlayer = 2;
cue = 1;
} else {
currentPlayer = 1;
cue = 2;
}

var _player = "#player"+currentPlayer;
var _cue = "#player"+cue;

$(_player).attr('src', video);
 
$(_player).delay(500).fadeIn(5000, "swing", null);
$(_cue).fadeOut(6000, "swing", complete);

var timr = checkDuration(video);
if (videoTimer) clearTimeout(videoTimer);
videoTimer = window.setTimeout(getVids, (timr));

}


var checkDuration = function(video) {
var timr = 77777;

if (/youtube/i.test(video)) {
var videoid = video.split('\/embed\/');
videoid = videoid[1].split('?')[0];

$.ajax({
type: 'GET',
url: 'https://www.googleapis.com/youtube/v3/videos?id='+videoid+'&part=contentDetails&key='+apikey,
async: false,
jsonpCallback: 'jsonCallback',
contentType: "application/json",
dataType: 'jsonp',
success: function(data)
{
var json = ((data.items[0].contentDetails.duration));

array=json.match(/(\d+)(?=[MHS])/ig)||[]; 

var formatted=array.map(function(item){
    if(item.length<2) return '0'+item;
    return item;
}).join(':');

var hms = "00:"+formatted;
var a = hms.split(':'); //split it at the colons

// minutes are worth 60 seconds. Hours are worth 60 minutes.
var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);

if (parseInt(seconds)<=80) {
timr = ((seconds-10) * 1000);  //if time is less than 90 seconds adjust timer
}

},

error: function(e)
{
   //console.log(e.message);
}
});

}

return timr;

}

/**
 * Array.prototype.[method name] allows you to define/overwrite an objects method
 * needle is the item you are searching for
 * this is a special variable that refers to "this" instance of an Array.
 * returns true if needle is in the array, and false otherwise
 */
Array.prototype.contains = function ( needle ) {
   for (i in this) {
       if (this[i] == needle) return true;
   }
   return false;
}

var toggleStealth = function() {
	var stealthTitle = 'World Data  Map';
	var wdTitle = 'Woah Dope Mixtape';
	if (window.document.title===wdTitle)  { window.document.title = stealthTitle; } else {  window.document.title = wdTitle; }
	$('.stealth').toggle();
}


