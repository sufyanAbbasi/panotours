var PANO_URL = "http://digitallibrary.vassar.edu/panorama_krpano_embed/";
var GOTHIC_NAMESPACE = "gothic:"
var SEARCH_ALL_GOTHIC = "dc.identifier:gothic*";
var SEARCH_PANO_TITLE = "dc.title_s:"
var panoIDList = []; 
var lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut posuere malesuada leo eget pellentesque. Praesent hendrerit tincidunt velit imperdiet commodo. In porttitor luctus justo sit amet ultricies. Sed vulputate velit ac feugiat iaculis. Nullam lacinia, elit quis pretium molestie, est purus accumsan orci, tristique lacinia neque ipsum nec libero. Maecenas pellentesque, magna id faucibus consequat, nisi libero pharetra nulla, in vehicula sapien nisi imperdiet justo. Proin vestibulum purus quam, ut dictum elit interdum id. Curabitur ut pretium tortor. Duis vehicula aliquam quam egestas semper. Quisque bibendum nulla in commodo efficitur. Vivamus vehicula ligula id consectetur feugiat.";
 

var posts = []; 

function init(){
	// processPosts("https://api.myjson.com/bins/4xbsi");
	processSolrJSON(SEARCH_ALL_GOTHIC, processAllPanos);

	var timer = null; 
       $('#search-bar').keyup(function(){
          if ($('#search-bar').val() == ""){
             clearInterval(timer); 
             timer = null; 
             searchAttributes(); 
          }else if (timer == null) {
             timer = setTimeout(function(){
             searchAttributes()}, 100)}
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

}

function searchAttributes(){
	 var str = $('#search-bar').val();   
	 if(str.length == 0){
	 	$('#results-list ul li').show(); 
	 	console.log("Show all panos.");
	 	return;
	 }
	 var wordList = str.split(" ") || [];
     var searchConditions = "+" + SEARCH_ALL_GOTHIC; 

     var allSpaces = true;

     for(var i = 0, len = wordList.length; i < len; i++){
     	if(wordList[i].length != 0){
     		searchConditions += " +" + SEARCH_PANO_TITLE + "*" + wordList[i] + "*"; 
     		allSpaces = false;
     	}
     }
     
     if(!allSpaces){
     	processSolrJSON(searchConditions, processSearch);
     }
}

function processPosts(url){
	$.getJSON(url, function(data){
		for (var i = 0; i < data.panoramas.length; i++) {
			var pano = data.panoramas[i]; 
			makePost(pano.title, pano.PID.split("gothic:"));
		};
	});
}

function processSolrJSON(search, handler){
	console.log("processing search: " + search)
	$.ajax({
		'url': 'http://dg02.vassar.edu:8080/solr/select',
		'data': {
			      'indent': 'on',
			      'start':'0',
			      'q': search,
			      'wt':'json',
			      'rows':'600',
			      'version':'2.2'},
		'success': function(data) {
			var panoList = data.response.docs;
			handler(panoList);
		},
		'dataType': 'jsonp',
			'jsonp': 'json.wrf'
	});
}

function processAllPanos(panoList){
	for (var i in panoList){
		var pano = panoList[i];
		var panoTitle = pano["dc.title_s"][0]; 
		var panoID = parseInt(pano.PID.split("gothic:")[1]); 
		panoIDList.push(pano.PID);
		$('#results-list ul').append('<li><label><input type="checkbox" data-title="' + panoTitle +
			'" data-id="'+ panoID + '" onclick=clickPano(this)>' + panoTitle + '</label></li>')
		// makePost(panoTitle, panoID); 
	}
}

function processSearch(panoList){
	$('#results-list ul li').hide(); 
	for (var i in panoList){
		var pano = panoList[i];
		var panoID = parseInt(pano.PID.split("gothic:")[1]); 
		$('#results-list ul li label input[data-id="'+ panoID + '"]').parent().parent().show();
	}
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
	postHTML.push('<p>' + title + '</p>')
	postHTML.push('<div class="button x-button nohighlight"><span style="color:rgb(200,200,200);">&times</span></div>'); 
	postHTML.push('<div class="button min-button nohighlight"><span style="color:rgb(200,200,200);">&#8722</span></div>'); 
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
		}
	}

	$('#results-list ul li label input[data-id="'+ panoID + '"]').prop('checked', false);
}


function tabSelect(element){
	if(!$(element).hasClass('selected')){
		$(element).siblings().filter('.selected').removeClass('selected');
		$(element).addClass('selected');
		switchTabs(element); 
	}
}

function switchTabs(element){
	var $pano = $(element).parent().siblings().filter('.panorama'); 
	var $info = $pano.siblings().filter('.information'); 
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
	var map = new google.maps.Map(mapCanvas, mapOptions); 
}

$(init);

google.maps.event.addDomListener(window, 'load', initializeGoogleMaps);
