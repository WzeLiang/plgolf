$(function(){
	var objhei=$('.bottom-button').outerHeight(true);
	 var objdoc =$('.bottom-button').offset().top;//元素到文档顶部距离
     var windowhei =$(window).height();//可是区域高度
     
     $(document).scroll(function(){

         var docscrol =$(document).scrollTop();//滚上去的高度

         /*var d=(a-b);
         console.log('这是元素到可可视区域距离'+d);*/
         
        /* console.log('这是元素到可视区域距离'+(objdoc-docscrol));
         console.log('这是窗口大小'+windowhei);*/
         
        if((objdoc-docscrol+objhei)<=(windowhei)){
             $('.bottom-button').css({'position':'static','width':'100%'});
             
         }else{
         $('.bottom-button').css({'position':'fixed','bottom':'0','width':'98%'});
             
          
         };
     });
});