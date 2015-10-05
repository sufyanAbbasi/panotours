function init(){
	//JSON Link A: https://api.myjson.com/bins/4iayi
	//JSON Link B: https://api.myjson.com/bins/neyi
	$.getJSON("https://api.myjson.com/bins/4iayi", function(data){
		for (var i = 0; i < data.panoramas.length; i++) {
			var pano = data.panoramas[i]; 
			var postHTML = []; 
			postHTML.push('<div class="post">');
			postHTML.push('<a name="'+ pano.title.split(' ').join('_') + '"></a>');
			postHTML.push('<div><p>' + pano.title + '</p></div>'); 
			postHTML.push('<iframe src="' + pano.url + '" allowFullScreen></iframe>');
			postHTML.push('</div>');
			// console.log(postHTML.join(""));
			$("#posts").append(postHTML.join(""));

			var linkHTML = [];
			linkHTML.push('<li>');
			linkHTML.push('<a href="#' + pano.title.split(' ').join('_') + '">'); 
			linkHTML.push('<h2>' + pano.title + '</h2>'); 
			linkHTML.push('</a></li>');
			// console.log(linkHTML.join(""));
			$("#contents > ul").append(linkHTML.join(""));
		};
	});

}