/**
 * @author CZF188
 * @since 2017.03.03
 * 系统设置
 */
var ImgLocation='http://101.37.69.236:8888/';
//var ImgLocation='http://118.178.191.111:8888/';
var defaultImg='adminimg.jpg';
$(document).ready(function() {
	$("img[src]").each(function (i) {
		if($(this).attr("src").trim()==''||$(this).attr("src").trim()==ImgLocation
				||$(this).attr("src").trim()==ImgLocation+defaultImg){
			$(this).attr("src",ImgLocation+defaultImg);
		};
		$(this).attr("width","120px");
		$(this).attr("height","100px");
	})
});