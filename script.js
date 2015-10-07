function init(){

	function makePost(title, url){
		var postHTML = []; 
		postHTML.push('<div class="post">');
		postHTML.push('<a name="'+ title.split(' ').join('_') + '"></a>');
		postHTML.push('<div class="title">');
		postHTML.push('<p>' + title + '</p>')
		postHTML.push('<div class="x-button"><span style="color:rgb(200,200,200);">&times</span></div>'); 
		postHTML.push('<div class="min-button"><span style="color:rgb(200,200,200);">&#8722</span></div>'); 
		postHTML.push('</div>')
		postHTML.push('<iframe src="' + url + '" allowFullScreen></iframe>');
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


		$(postRef).children().children().filter(".x-button").click(function(){
			$(postRef).remove();
			$(linkRef).remove();
		})

		var minButton = $(postRef).children().children().filter(".min-button");

		$(minButton).click(function(){
			var postIframe = $(postRef).children().filter("iframe"); 
			if ($(postIframe).is(":visible")){
				$(postRef).height("50px");
				$(minButton).children().html("&#43");
			}else{
				$(postRef).height("75%");
				$(minButton).children().html("&#8722");
			}

			$(postIframe).toggle();


		})

	}



	function processPosts(url){
		$.getJSON(url, function(data){
			for (var i = 0; i < data.panoramas.length; i++) {
				var pano = data.panoramas[i]; 
				var postHTML = []; 
				makePost(pano.title, pano.url);
			};
		});
	}

	//JSON Link A: https://api.myjson.com/bins/4iayi
	//JSON Link B: https://api.myjson.com/bins/neyi

	processPosts("https://api.myjson.com/bins/4iayi");

	






}