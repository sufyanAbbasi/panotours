var PANO_URL = "http://digitallibrary.vassar.edu/panorama_krpano_embed/";
var SOLR_URL = "http://dg02.vassar.edu:8080/solr/select";
var GOTHIC_NAMESPACE = "gothic:";
var ALL_GOTHIC = "dc.identifier:gothic*";
var PANO_TITLE = "dc.title_s:";
var ACTIVE_PANO = "mods.title_sort:*"; 
var ALL_PANOS = "+" + ALL_GOTHIC + " +" + ACTIVE_PANO;
var PANO_ID = "PID"; 
var PARENT_DIR = "PARENT_collection_s";
var panoIDList = []; 
var lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut posuere malesuada leo eget pellentesque. Praesent hendrerit tincidunt velit imperdiet commodo. "
			+ "In porttitor luctus justo sit amet ultricies. Sed vulputate velit ac feugiat iaculis. Nullam lacinia, elit quis pretium molestie, est purus accumsan orci,"
			+ "tristique lacinia neque ipsum nec libero. Maecenas pellentesque, magna id faucibus consequat, nisi libero pharetra nulla, in vehicula sapien nisi imperdiet justo."
			+ "Proin vestibulum purus quam, ut dictum elit interdum id. Curabitur ut pretium tortor. Duis vehicula aliquam quam egestas semper. Quisque bibendum nulla in commodo efficitur."
			+ "Vivamus vehicula ligula id consectetur feugiat.";
var map;

var posts = []; 

var totalNumPanos; 

function init(){
	resizeToWindow();
	// processPosts("https://api.myjson.com/bins/4xbsi");
	processSolrJSON(ALL_PANOS, processAllPanos);

	var timer = null; 
   	$('#search-bar').keyup(function(){
      	if ($('#search-bar').val() == ""){
        	clearInterval(timer); 
        	timer = null; 
        	searchAttributes(); 
      	}else if (timer == null) {
        	timer = setTimeout(function(){
        	searchAttributes()}, 50)}
   	}).keydown(function(){
      	if (timer) {
        	clearInterval(timer);
        	timer = null; 
    }
   	}).click(function(){
      	$(this).focus(); 

   	}).on("search", function(){
      	searchAttributes(); 
   	}); 

   	var searchMinButton = $('#search .min-button');
   	var searchDiv = $('#search');
   	var results = $(searchMinButton).siblings("#results");
   	var animationSpeed = 300;

	$(searchMinButton).click(function(){ 
		if ($(searchDiv).height() != 50){
			$(searchDiv).animate({height: 50}, {  
				duration: animationSpeed, 
				queue : true, 
			});
			$(searchMinButton).children().html("&#43");
		}else{
			$(searchDiv).animate({height: "50%"}, {
				duration: animationSpeed, 
				queue : true,
			});
			$(searchMinButton).children().html("&#8722");
		}
	});

	$('#search #search-bar').focus(function(){
		if($(searchDiv).height != 50){
			$(searchDiv).animate({height: "50%"}, animationSpeed);
			$(searchMinButton).children().html("&#8722");
			$(results).slideDown({  duration: animationSpeed, 
									queue : true});
		}
		
	})

	window.addEventListener('resize', function(){ 
        google.maps.event.trigger(map, 'resize'); 
        resizeToWindow();
      }, false);

}

function resizeToWindow(){
	
	var winWidth = $(window).width()

	if($('#left-sidebar').width() == parseInt($('#left-sidebar').css('min-width'), 10)){
		$('#search').css('margin-left', (parseInt($('#left-sidebar').css('min-width'), 10) + 10)); 
		$('.main-content').css('margin-left', 365); 
	}else{
		$('#search').css('margin-left', 'calc(25% + 10px)'); 
		$('.main-content').css('margin-left', 'calc(65%/2)');
	}
}

function searchAttributes(){
	 var str = $('#search-bar').val();   
	 if(str.length == 0){
	 	$('#results-list ul label').show(); 
	 	console.log("Show all panos.");
	 	$('#pano-showing-total').replaceWith('<span id="pano-showing-total">Showing: <span class="avoidWrapping">' + totalNumPanos + ' of ' + totalNumPanos + '</span></span>');
	 	return;
	 }
	 var wordList = str.split(" ") || [];
     var searchConditions = ALL_PANOS; 

     var allSpaces = true;

     for(var i = 0, len = wordList.length; i < len; i++){
     	if(wordList[i].length != 0){
     		searchConditions += " +" + PANO_TITLE + "*" + wordList[i] + "*"; 
     		allSpaces = false;
     	}
     }
     
     if(!allSpaces){
     	processSolrJSON(searchConditions, processSearch);
     }
}

//FOR TESTER JSONS
// function processPosts(url){
// 	$.getJSON(url, function(data){
// 		for (var i = 0; i < data.panoramas.length; i++) {
// 			var pano = data.panoramas[i]; 
// 			makePost(pano.title, pano.PID.split("gothic:"));
// 		};
// 	});
// }

function processSolrJSON(search, handler){
	console.log("processing search: " + search)
	$.ajax({
		'url': SOLR_URL,
		'data': {
			      'indent': 'on',
			      'start':'0',
			      'q': search,
			      'wt':'json',
			      'rows':'600',
			      'version':'2.2'},
		'success': function(data) {
			var numFound = data.response.numFound;
			var panoList = data.response.docs;
			handler(panoList, numFound);
		},
		'dataType': 'jsonp',
			'jsonp': 'json.wrf'
	});
}

function processAllPanos(panoList, numFound){
	for (var i in panoList){
		var pano = panoList[i];
		var panoTitle = pano["dc.title_s"][0]; 
		var panoID = parseInt(pano.PID.split("gothic:")[1]); 
		var nonPanos = 0; 
		if(!isNaN(panoID)){
			panoIDList.push(pano.PID);
			$('#pano-title').after('<label class="pano-list-elements"><li class="nohighlight"><input class="pano-checkbox" type="checkbox" data-title="' + panoTitle +
				'" data-id="'+ panoID + '" onclick=clickPano(this)><div class="custom-checkbox"></div><p>' + panoTitle.split('_').join(' ') + '</p></li></label>');
			// makePost(panoTitle, panoID); 
		}else{
			console.log("Found: " + panoTitle);
			nonPanos++; 
		}
		
	}

	totalNumPanos = numFound - nonPanos; 

	$('#pano-showing-total').replaceWith('<span id="pano-showing-total">Showing: <span class="avoidWrapping">' + totalNumPanos + ' of ' + totalNumPanos + '</span></span>');
}

function processSearch(panoList, numFound){
	$('.pano-list-elements').hide(); 

	for (var i in panoList){
		var nonPanos = 0; 
		var pano = panoList[i];
		var panoID = parseInt(pano.PID.split("gothic:")[1]);
		if(!isNaN(panoID)){
			$('input[data-id="'+ panoID + '"]').parent().parent().show();
		}else{
			nonPanos++;
		}
		
	}
	$('#pano-showing-total').replaceWith('<span id="pano-showing-total">Showing: <span class="avoidWrapping">' + (numFound-nonPanos) + ' of ' + totalNumPanos + '</span></span>');
}


function clickPano(input){
	if(input.checked) {
        makePost(input.dataset.title, input.dataset.id); 
      }else{
        removePost(input.dataset.id); 
      }
}

function makePost(title, panoID){
	var postHTML = []; 
	postHTML.push('<div class="post">');
	postHTML.push('<a name="'+ title.split(' ').join('_') + '"></a>');
	postHTML.push('<div class="title">');
	postHTML.push('<div class="pano-icon"></div>');
	postHTML.push('<p>' + title + '</p>')
	postHTML.push('<div class="button x-button nohighlight">&times</div>'); 
	postHTML.push('<div class="button min-button nohighlight">&#8722</div>'); 
	postHTML.push('</div>')
	postHTML.push('<div class="content-area">');
	postHTML.push('<div class="tab-bar">');
	postHTML.push('<div class="tab pano selected nohighlight" data-tab="panorama"><p>Panorama</p></div>');
	postHTML.push('<div class="tab info nohighlight" data-tab="information"><p>Information</p></div>');
	postHTML.push('</div>');
	postHTML.push('<iframe class="panorama" src="' + PANO_URL + GOTHIC_NAMESPACE + panoID + '" allowFullScreen></iframe>');
	postHTML.push('<div class="information" style="display: none;">');
	postHTML.push('<div class="google-maps"></div>'); 
	postHTML.push('<h2>About the ' + title + '</h2>');
	postHTML.push('<p>' + lorem + '</p>');
	postHTML.push('</div>'); 
	postHTML.push('</div>'); 
	postHTML.push('</div>');
	var postRef = $(postHTML.join(""));


	$("#posts").append(postRef);

	var linkHTML = [];
	linkHTML.push('<li>');
	linkHTML.push('<a href="#' + title.split(' ').join('_') + '">'); 
	linkHTML.push('<h2>' + title + '</h2>'); 
	linkHTML.push('</a></li>');
	var linkRef = $(linkHTML.join(""));
	
	$("#contents > ul").append(linkRef);

	posts.push({
		title : title,
		id : panoID,
		postRef : postRef,
		linkRef : linkRef,
	})


	$(postRef).find(".x-button").click(function(){
		removePost(panoID);
	})

	var minButton = $(postRef).find(".min-button");

	$(minButton).click(function(){
		var postContent = $(postRef).find(".content-area"); 
		if ($(postContent).is(":visible")){
			$(postRef).height("50px");
			$(minButton).children().html("&#43");
		}else{
			$(postRef).height("75%");
			$(minButton).children().html("&#8722");
		}

		$(postContent).toggle();


	});

	var tabs = $(postRef).find(".tab");

	$(tabs).click(function(event){
		tabSelect(event.currentTarget);
	});

}

function removePost(panoID){
	for (var i = 0, len = posts.length; i < len; i++){
		if (posts[i].id == panoID){
			$(posts[i].postRef).remove();
			$(posts[i].linkRef).remove();
			posts.splice(i, 1);
			break;
		}
	}

	$('input[data-id="'+ panoID + '"]').prop('checked', false);
}


function tabSelect(element){
	if(!$(element).hasClass('selected')){
		$(element).siblings('.selected').removeClass('selected');
		$(element).addClass('selected');
		switchTabs(element); 
	}
}

function switchTabs(element){
	var $pano = $(element).parent().siblings('.panorama'); 
	var $info = $pano.siblings('.information'); 
	$($info).toggle();
	$($pano).toggle();
}

function initializeGoogleMaps(){
	 var mapStyle = [
					   {
					      "featureType":"poi",
					      "elementType":"labels.text",
					      "stylers":[
					         {
					            "visibility":"off"
					         }
					      ]
					   },
					   {
					      "featureType":"road",
					      "elementType":"labels.icon",
					      "stylers":[
					         {
					            "visibility":"off"
					         }
					      ]
					   },
					   {
					      "featureType":"administrative",
					      "elementType":"labels.text.fill",
					      "stylers":[
					         {
					            "color":"#606060"
					         }
					      ]
					   },
					   {
					      "featureType":"administrative.locality",
					      "elementType":"labels.icon",
					      "stylers":[
					         {
					            "visibility":"off"
					         }
					      ]
					   },
					   {
					      "featureType":"water",
					      "elementType":"geometry",
					      "stylers":[
					         {
					            "visibility":"on"
					         },
					         {
					            "color":"#C6E2FF"
					         }
					      ]
					   },
					   {
					      "featureType":"poi",
					      "elementType":"geometry.fill",
					      "stylers":[
					         {
					            "color":"#C5E3BF"
					         }
					      ]
					   },
					   {
					      "featureType":"road",
					      "elementType":"geometry",
					      "stylers":[
					         {
					            "visibility":"off"
					         }
					      ]
					   },
					   {
					      "featureType":"administrative",
					      "elementType":"geometry",
					      "stylers":[
					         {
					            "visibility":"off"
					         }
					      ]
					   }
					]
	var mapCanvas = document.getElementsByClassName('google-maps')[0];
	var mapOptions = {
  		center: new google.maps.LatLng(47, 3),
  		zoom: 4,
  		styles: mapStyle,
	}
	map = new google.maps.Map(mapCanvas, mapOptions); 
}

$(init);

google.maps.event.addDomListener(window, 'load', initializeGoogleMaps);
