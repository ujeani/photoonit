/******************************************************************************
 * 
 * psbReloadPage
 * 
 * Arguments
 *     page : 이동할 html 페이지  
 *      
 * Description
 *     reloadPage를 true로 지정하고 page로 지정된 html 페이지를 연다.  
 * Related page
 *       
 *****************************************************************************/
function psbReloadPage(page) {
    console.log('함수 : psbReloadPage');
    $.mobile.changePage(page, {reloadPage:true});
}

/******************************************************************************
 * 
 * psbHeadDispMenuIcon
 * 
 * Arguments
 *     url : 버튼 터치시 이동할 URL
 *     div : 어떤 <div> 태에 표시할 것인지를 지정한다.
 *     icon : 표시할 아이콘
 *     
 * Description
 *     메뉴 아이콘을 표시한다.
 *      
 * Related page
 *       
 *****************************************************************************/
function psbHeadDispMenuIcon(url, div, icon) {
    console.log('함수 : psbHeadDispMenuIcon');
    var html="";
    var icon_url="images/"+icon+".png";

    html ="<a href=\"\" onclick=\""+url+"\">";
    html +="<img class=img_menu_icon src=\'"+icon_url+"\'></a>";

    $(div).html(html);
}

