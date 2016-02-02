
/* TO DO:
 * - when you click on a tile in cathedral post, it detects if a post already exists and jumps to that location 
 *   and if that post doesn't exist, will check the input box of that post and create a new post
 *
 */

/*******************************************************************************
                            GLOBAL VARIABLES
 ******************************************************************************/

//~~~~~~~~~~~~~~~~~~~~~~~ SOLR SEARCH VARIABLES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var PANO_URL = "http://digitallibrary.vassar.edu/panorama_krpano_embed/";    
var SOLR_URL = "http://dg02.vassar.edu:8080/solr/select";

var THUMBNAIL_BEGIN = "http://digitallibrary.vassar.edu/islandora/object/";
//PID goes in between, like gothic:1 
var THUMBNAIL_END = "/datastream/TN/view";

var GOTHIC_NAMESPACE = "gothic:";
var ALL_GOTHIC = "dc.identifier:gothic*";
var SEARCH_TITLE = "dc.title_s:";
var ACTIVE_COLLECTION = "rels.hasModel:*collectionCModel"; 
var ACTIVE_CATHEDRALS = ACTIVE_COLLECTION; 
var ACTIVE_PANO = "rels.hasModel:*panoramaCModel"; 
var ALL_PANOS = ALL_GOTHIC + " AND " + ACTIVE_PANO;
var ALL_CATHEDRALS = ALL_GOTHIC + " AND " + ACTIVE_CATHEDRALS;
var PANO_ID = "PID"; 
var PARENT_DIR = "PARENT_collection_s:";


//~~~~~~~~~~~~~~~~~~~~~~ CACHE ARRAYS and VALUES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var panoIDList = [];                   //list of all Pano IDs 
var cathedralIDList = [];              //list of all Cathedral IDs
var cathedralMaps = [];		           //list of all Cathedral Maps
var posts = []; 			           //list of all current posts 
var totalNumPanos, totalNumCathedrals; //total number of panos, cathedral

var lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut posuere malesuada leo eget pellentesque. Praesent hendrerit tincidunt velit imperdiet commodo. "
			+ "In porttitor luctus justo sit amet ultricies. Sed vulputate velit ac feugiat iaculis. Nullam lacinia, elit quis pretium molestie, est purus accumsan orci,"
			+ "tristique lacinia neque ipsum nec libero. Maecenas pellentesque, magna id faucibus consequat, nisi libero pharetra nulla, in vehicula sapien nisi imperdiet justo."
			+ "Proin vestibulum purus quam, ut dictum elit interdum id. Curabitur ut pretium tortor. Duis vehicula aliquam quam egestas semper. Quisque bibendum nulla in commodo efficitur."
			+ "Vivamus vehicula ligula id consectetur feugiat.";

//~~~~~~~~~~~~~~~~~~~~~~ MAP VARIABLES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var searchMap; //main map on screen

//map style
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


/**
 * Init function, called after body load. 
 * @param none
 * @return none
 */
function init(){
	resizeToWindow();
	checkPostsDisplay();
	processSolrJSON(ALL_PANOS, processAllPanos);
	processSolrJSON(ALL_CATHEDRALS, processAllCathedrals);

	//calls searchAttributes while typing 
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
        google.maps.event.trigger(searchMap, 'resize');
        resizeToWindow();
        resizeMaps();
      }, false);

}


/**
 * Edits css of certain elements based on the current window width 
 * @param none
 * @return none
 */
function resizeToWindow(){
	
	var winWidth = $(window).width()

	if($('#left-sidebar').width() == parseInt($('#left-sidebar').css('min-width'), 10)){
		$('#search').css('margin-left', (parseInt($('#left-sidebar').css('min-width'), 10) + 50)); 
		$('.main-content').css('margin-left', 365); 
	}else{
		$('#search').css('margin-left', 'calc(25% + 50px)'); 
		$('.main-content').css('margin-left', 'calc(65%/2)');
	}
}

/**
 * Searches Solr Gothic namespace based on the current value in the search bar  
 * @param none
 * @return none
 */
function searchAttributes(){
	 var str = $('#search-bar').val();   
	 if(str.length == 0){
	 	$('#results-list ul label').show(); 
	 	$('#pano-showing-total').replaceWith('<span id="pano-showing-total">Showing: <span class="avoidWrapping">' + totalNumPanos + ' of ' + totalNumPanos + '</span></span>');
	 	$('#cathedral-showing-total').replaceWith('<span id="cathedral-showing-total">Showing: <span class="avoidWrapping">' + totalNumCathedrals + ' of ' + totalNumCathedrals + '</span></span>');
	 	return;
	 }
	 var wordList = str.split(" ") || [];
     var allSpaces = true;

     var wordSearchConditions = ""; 
     for(var i = 0, len = wordList.length; i < len; i++){
     	if(wordList[i].length != 0){
     		wordSearchConditions += " AND " + SEARCH_TITLE + "*" + wordList[i] + "*"; 
     		allSpaces = false;
     	}
     }
     
     if(!allSpaces){
     	processSolrJSON(ALL_PANOS + wordSearchConditions, processPanoSearch);
     	processSolrJSON(ALL_CATHEDRALS + wordSearchConditions, processCathedralSearch);
     }
}

/**
 * Calls Solr Engine for search return JSON and passes JSON into the callback handler
 * @param {string} search The parameters to search SOLR with 
 * @param {functoin} handler The callback function to process the JSON with 
 * @return none 
 */
function processSolrJSON(search, handler){
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
			var foundList = data.response.docs;
			handler(foundList, numFound);
		},
		'dataType': 'jsonp',
			'jsonp': 'json.wrf'
	});
}

/**
 * Callback Handler for processing JSON containing all found panoramas currently in database
 * @param {array} panoList List of all panoramas currently in database 
 * @return {number} numFound number of elements found in search
 */
function processAllPanos(panoList, numFound){
	appendInOrder = []; 
	for (var i in panoList){
		var pano = panoList[i];
		var panoTitle = pano["dc.title_s"][0]; 
		var panoID = pano.PID.split("gothic:")[1]; 
		panoIDList.push(pano.PID);
		appendInOrder.push('<label class="pano-label result-list-elements nohighlight"><li><input class="pano-checkbox" type="checkbox" data-title="' + panoTitle +
			'" data-id="'+ panoID + '" onclick=clickPano(this)><div class="custom-checkbox"></div><p>' + panoTitle.split('_').join(' ') + '</p></li></label>');
		}

	for(var i = appendInOrder.length - 1; i >= 0; i--){
		$('#pano-title').after(appendInOrder[i]); 
	}
	totalNumPanos = numFound;

	$('#pano-showing-total').replaceWith('<span id="pano-showing-total">Showing: <span class="avoidWrapping">' + totalNumPanos + ' of ' + totalNumPanos + '</span></span>');
}

/**
 * Callback Handler for processing JSON containing all found cathedrals currently in database
 * @param {array} cathedralList List of all cathedrals currently in database 
 * @return {number} numFound number of elements found in search
 */
function processAllCathedrals(cathedralList, numFound){
	appendInOrder = []; 
	for (var i in cathedralList){
		var cathedral = cathedralList[i];
		var cathedralTitle = cathedral["dc.title_s"][0]; 
		var cathedralID = cathedral.PID.split("gothic:")[1];
		cathedralIDList.push(cathedralID);
		appendInOrder.push('<label class="cathedral-label result-list-elements nohighlight"><li><input class="cathedral-checkbox" type="checkbox" data-title="' + cathedralTitle +
			'" data-id="'+ cathedralID + '" onclick=clickCathedral(this)><div class="custom-checkbox"></div><p>' + cathedralTitle.split('_').join(' ') + '</p></li></label>');
	}

	for(var i = appendInOrder.length - 1; i >= 0; i--){
		$('#cathedral-title').after(appendInOrder[i]); 
	}

	totalNumCathedrals = numFound; 

	$('#cathedral-showing-total').replaceWith('<span id="cathedral-showing-total">Showing: <span class="avoidWrapping">' + totalNumCathedrals + ' of ' + totalNumCathedrals + '</span></span>');
}

/**
 * Callback Handler for processing JSON containing found panoramas returned by the search
 * @param {array} panoList List of panoramas found by search in database 
 * @return {number} numFound number of elements found in search
 */
function processPanoSearch(panoList, numFound){
	$('.pano-label').hide(); 

	for (var i in panoList){
		var pano = panoList[i];
		var panoID = pano.PID.split("gothic:")[1];
		$('input[data-id="'+ panoID + '"]').parent().parent().show();		
	}
	$('#pano-showing-total').replaceWith('<span id="pano-showing-total">Showing: <span class="avoidWrapping">' + numFound + ' of ' + totalNumPanos + '</span></span>');
}

/**
 * Callback Handler for processing JSON containing found cathedrals returned by the search
 * @param {array} cathedralList List of cathedrals found by search in database 
 * @return {number} numFound number of elements found in search
 */
function processCathedralSearch(cathedralList, numFound){
	$('.cathedral-label').hide(); 

	for (var i in cathedralList){
		var cathedral = cathedralList[i];
		var cathedralID = cathedral.PID.split("gothic:")[1];
		$('input[data-id="'+ cathedralID + '"]').parent().parent().show();		
	}
	$('#cathedral-showing-total').replaceWith('<span id="cathedral-showing-total">Showing: <span class="avoidWrapping">' + numFound + ' of ' + totalNumCathedrals + '</span></span>');
}

/**
 * Opens up a panorama window when clicked on in search table
 * @param {input element} input Input element clicked on
 */
function clickPano(input){
	if(input.checked) {
        makePanoPost(input.dataset.title, input.dataset.id); 
      }else{
        removePost(input.dataset.id); 
      }
}

/**
 * Opens up a cathedral window when clicked on in search table
 * @param {input element} input Input element clicked on
 */
function clickCathedral(input){
	if(input.checked){
		makeCathedralPost(
			input.dataset.title, 
			input.dataset.id)
	}else{
		removePost(input.dataset.id);
	}
}

/**
 * Makes a panorama post and appends it to the document
 * @param {string} title The title of the panorama 
 * @param {string} panoID The pano ID of the panorama 
 */
function makePanoPost(title, panoID){
	var postHTML = []; 
	postHTML.push('<div class="post">');
	postHTML.push('<a class="hash-link" name="'+ title.split(' ').join('_') + '"></a>');
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
	postHTML.push('<iframe class="panorama tab-content" src="' + PANO_URL + GOTHIC_NAMESPACE + panoID + '" allowFullScreen></iframe>');
	postHTML.push('<div class="information tab-content" style="display: none;">');
	postHTML.push('<div class="google-maps tab-content"></div>'); 
	postHTML.push('<h2>About the ' + title + '</h2>');
	postHTML.push('<p>' + lorem + '</p>');
	postHTML.push('</div>'); 
	postHTML.push('</div>'); 
	postHTML.push('</div>');
	var postRef = $(postHTML.join(""));

	$("#posts").append(postRef);

	var mapDiv = $(postRef).find('.google-maps')[0]; 

	var cathMap = initializeCathedralMap(mapDiv);

	checkPostsDisplay();
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

/**
 * Makes a cathedral post and appends it to the document
 * @param {string} title The title of the cathedral
 * @param {string} panoID The pano ID of the cathedral
 */
function makeCathedralPost(title, cathedralID){
	var postHTML = []; 
	postHTML.push('<div class="post">');
	postHTML.push('<a class="hash-link" name="'+ title.split(' ').join('_') + '"></a>');
	postHTML.push('<div class="title">');
	postHTML.push('<div class="cathedral-icon"></div>');
	postHTML.push('<p>' + title + '</p>')
	postHTML.push('<div class="button x-button nohighlight">&times</div>'); 
	postHTML.push('<div class="button min-button nohighlight">&#8722</div>'); 
	postHTML.push('</div>')
	postHTML.push('<div class="content-area">');
	postHTML.push('<div class="tab-bar">');
	postHTML.push('<div class="tab panos selected nohighlight" data-tab="panoramas"><p>Panoramas</p></div>');
	postHTML.push('<div class="tab info middle-tab nohighlight" data-tab="information"><p>Information</p></div>');
	postHTML.push('<div class="tab timeline  middle-tab nohighlight" data-tab="timeline"><p>Timeline</p></div>');
	postHTML.push('<div class="tab resources nohighlight" data-tab="resources"><p>Resources</p></div>');
	postHTML.push('</div>');
	postHTML.push('<div class="panoramas tab-content">');
	postHTML.push('<div class="pano-list"><ul></ul></div>');
	postHTML.push('<div class="pano-tiles"></div>');  
	postHTML.push('</div>');
	postHTML.push('<div class="information tab-content" style="display: none;">');
	postHTML.push('<div class="google-maps"></div>'); 
	postHTML.push('<h2>About the ' + title + '</h2>');
	postHTML.push('<p>' + lorem + '</p>');
	postHTML.push('</div>'); 
	postHTML.push('<div class="timeline tab-content" style="display: none;">');
	postHTML.push('<h2>Timeline of ' + title + '</h2>');
	postHTML.push('</div>');
	postHTML.push('<div class="resources tab-content" style="display: none;">');
	postHTML.push('<h2>Resources for ' + title + '</h2>');
	postHTML.push('</div>');  
	postHTML.push('</div>'); 
	postHTML.push('</div>');
	var postRef = $(postHTML.join(""));

	$("#posts").append(postRef);

	var mapDiv = $(postRef).find('.google-maps')[0]; 

	var cathMap = initializeCathedralMap(mapDiv);

	checkPostsDisplay();

	var linkHTML = [];
	linkHTML.push('<li>');
	linkHTML.push('<a href="#' + title.split(' ').join('_') + '">'); 
	linkHTML.push('<h2>' + title + '</h2>'); 
	linkHTML.push('</a></li>');
	var linkRef = $(linkHTML.join(""));
	
	$("#contents > ul").append(linkRef);

	posts.push({
		title : title,
		id : cathedralID,
		postRef : postRef,
		linkRef : linkRef,
	}); 

	processSolrJSON(ALL_PANOS + ' AND ' + PARENT_DIR + '"' + title + '"' , function(panoList, numFound){
		$panoTilesDiv = $(postRef).find(".pano-tiles"); 
		$panoList = $($panoTilesDiv).siblings('.pano-list').find('ul'); 
		for (var i in panoList){
			var pano = panoList[i];
			var panoID = pano.PID.split("gothic:")[1];
			var panoTitle = pano["dc.title_s"][0]; 
			var tileLink = $('<li data-pid="' + panoID + '" data-title="' + panoTitle + '">' + panoTitle + '</li>');
			$($panoList).append(tileLink);
			var tile = $('<div class="tile" '
				+ 'data-pid="' + panoID
				+ '" data-title="' + panoTitle
				+ '" > <img src="' + THUMBNAIL_BEGIN + GOTHIC_NAMESPACE + panoID + THUMBNAIL_END 
				+ '" alt="'+ panoTitle + '"/>'
				+ '<div class="hover-text"><p>' + panoTitle + '</p></div></div>'); 
			$($panoTilesDiv).append(tile);

			$(tileLink).click(function(event){
				makePanoPost(event.currentTarget.dataset.title, event.currentTarget.dataset.pid);
			}); 

			$(tile).click(function(event){
				makePanoPost(event.currentTarget.dataset.title, event.currentTarget.dataset.pid);
			}); 
		}
	})

	$(postRef).find(".x-button").click(function(){
		removePost(cathedralID);
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

/**
 * Checks if a post already exists 
 * @param {string} the pano ID of the post 
 * @return {number} index in posts array or -1 if does not exist
 */
function isPost(panoID){
 	for (var i = 0, len = posts.length; i < len; i++){
		if (posts[i].id == panoID){
			return i; 
		}
	}
	return -1; 
}

/**
 * Removes a post from the document
 * @param {string} the pano ID of the post  
 */
function removePost(panoID){
	var i = isPost(panoID);
	if(i >= 0){
		$(posts[i].postRef).remove();
		$(posts[i].linkRef).remove();
		posts.splice(i, 1);
		$('input[data-id="'+ panoID + '"]').prop('checked', false);
		checkPostsDisplay();
	}
}

/**
 * Hides the #posts div if there are no posts in the posts area
 * @param none 
 */
function checkPostsDisplay(){
	if($('#posts').children().length == 0){
		$('#posts').hide();
	}else{
		$('#posts').show();
	}
}

/**
 * Determines which tab is currently selected in a post and gives that tab 
 * a class of selected
 * @param {div} element The div tab element
 */
function tabSelect(element){
	if(!$(element).hasClass('selected')){
		$(element).siblings('.selected').removeClass('selected');
		$(element).addClass('selected');
		switchTabs(element); 
	}
}

/**
 * switches tab to the tab with class selected 
 * @param {div} element The div tab element
 */
function switchTabs(element){
	var $currentTab = $(element).parent().siblings('.' + element.dataset.tab); 
	var $restTab = $currentTab.siblings('.tab-content').not($currentTab); 
	$($currentTab).show();
	$($restTab).hide();
	resizeMaps()
}

/**
 * Initializes the main search map 
 * @param none
 */
function initializeSearchMap(){

	var mapCanvas = document.getElementsByClassName('google-maps')[0];
	var mapOptions = {
  		center: new google.maps.LatLng(47, 3),
  		zoom: 4,
  		styles: mapStyle,
	}
	searchMap = new google.maps.Map(mapCanvas, mapOptions); 
}

/**
 * Initializes map within each cathedral information post
 * @param {dic} mapDiv The div for containing the map 
 */
function initializeCathedralMap(mapDiv){
	var mapCanvas = mapDiv; 
	var mapOptions = {
		center: new google.maps.LatLng(47, 3),
  		zoom: 4,
  		styles: mapStyle,
	}

	var map = new google.maps.Map(mapCanvas, mapOptions); 

	cathedralMaps.push(map); 

	return map;
}

/**
 * Resizes all the maps currently initialized in posts 
 * @param {dic} mapDiv The div for containing the map 
 */
function resizeMaps(){
	for(var i = 0; i < cathedralMaps.length; i++){
		google.maps.event.trigger(cathedralMaps[i], 'resize');
		cathedralMaps[i].setCenter(new google.maps.LatLng(47, 3)); 
	}
}

$(init);

google.maps.event.addDomListener(window, 'load', initializeSearchMap);
