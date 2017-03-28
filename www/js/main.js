/**
 * Created by 王泽良 on 2016/12/8.
 */
function tablechenge(btnclassname,tableclassname){
    this.addtr=function(){
        $(btnclassname).click(function(){
        	$(tableclassname).find('[name="blank"]').remove();
        	var tr=$(tableclassname).find('tr:nth-child(2)').clone(true);
        	tr.find("input").val("");
            $(tableclassname).append(tr);
        })

    }
}