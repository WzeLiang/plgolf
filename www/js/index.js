/**
 * Created by 王泽良 on 2016/11/30.
 */
$(function(){

   

    $('#skin-blue').click(function(){
        $('body').removeClass('skin-green').addClass('skin-blue')
    });

    $('.treeview-menu').find('a').click(function(){
        $('.treeview-menu').find('a').removeClass('active-li');
       $(this).addClass('active-li');
    })
});