function init(){
	var PANO_URL = "http://digitallibrary.vassar.edu/panorama_krpano_embed/"
	var panoIDList = []; 
	var lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut posuere malesuada leo eget pellentesque. Praesent hendrerit tincidunt velit imperdiet commodo. In porttitor luctus justo sit amet ultricies. Sed vulputate velit ac feugiat iaculis. Nullam lacinia, elit quis pretium molestie, est purus accumsan orci, tristique lacinia neque ipsum nec libero. Maecenas pellentesque, magna id faucibus consequat, nisi libero pharetra nulla, in vehicula sapien nisi imperdiet justo. Proin vestibulum purus quam, ut dictum elit interdum id. Curabitur ut pretium tortor. Duis vehicula aliquam quam egestas semper. Quisque bibendum nulla in commodo efficitur. Vivamus vehicula ligula id consectetur feugiat."
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
		postHTML.push('<iframe class="panorama" src="' + PANO_URL + panoID + '" allowFullScreen></iframe>');
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


		$(postRef).find(".x-button").click(function(){
			$(postRef).remove();
			$(linkRef).remove();
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

	function processPosts(url){
		$.getJSON(url, function(data){
			for (var i = 0; i < data.panoramas.length; i++) {
				var pano = data.panoramas[i]; 
				makePost(pano.title, pano.PID);
			};
		});
	}

	function processSolrJSON(search){
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
				for (var i in panoList){
					var pano = panoList[i];
					console.log(pano);
					var panoTitle = pano["dc.title_s"][0]; 
					var panoID = pano.PID; 
						
					panoIDList.push(pano.PID);
					makePost(panoTitle, panoID); 
				}
			},
			'dataType': 'jsonp',
  			'jsonp': 'json.wrf'
		});
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
	
	processPosts("https://api.myjson.com/bins/4xbsi");

	// processSolrJSON('dc.identifier:gothic*');


}