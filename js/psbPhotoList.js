var psbPhotoLists = new Array();
var psbCurIdx = 0;

/******************************************************************************
 * 
 * psbPhotoListPostComment
 * 
 * Arguments
 *     pid : 사진 아이디 
 *     message : 포스팅할 댓글 내용
 *     
 * Description
 *     지정된 사진에 댓글을 올린다.
 *      
 * Related page
 *     photolist.html
 *       
 *****************************************************************************/
function psbPhotoListPostComment(pid, message) {
    console.log('함수 : psbPhotoListPostComment');
    
    FB.api('/'+pid+'/comments', 'post', {
        message: message
    }, function (response) {
        console.log(JSON.stringify(response));
        if (response.error) {
            console.log('Error occured:' + response.error.message);
        } else {
            console.log('Success:' + response.id);
        }
        psbPhotoListGetPhotoInfo(psbCurIdx);
    });
}


/******************************************************************************
 * 
 * psbPhotoListProcForm
 * 
 * Arguments
 *     frm : 입력 폼을 통해 입력한 정보 
 *     
 * Description
 *     댓글을 입력하면 이 댓글을 해당 사진에 포스팅한다.
 *      
 * Related page
 *     photolist.html
 *       
 *****************************************************************************/
function psbPhotoListProcForm(frm) {
    console.log('함수 : psbPhotoListProcForm');
    var message = frm.photolist_comment_message.value;
    var pid = frm.photolist_id.value;
    console.log('댓글 = '+message+'를 사진 = '+pid+'에 포스팅합니다.');
    
    $.mobile.showPageLoadingMsg();

    psbPhotoListPostComment(pid, message);
    
}


/******************************************************************************
 * 
 * psbPhotoListGetFBPhoto
 * 
 * Arguments
 *    pid : 페이스북의 사진 ID   
 *    
 * Description
 *    페이스북에서 pid로 지정된 사진의 정보를 가져온다. 
 *    가져온 사진 정보를 이용해서  photolist.html에 표시한다.
 *      
 * Related page
 *     photolist.html
 *       
 *****************************************************************************/
function psbPhotoListGetFBPhoto(pid) {
    console.log("함수 : psbPhotoListGetFBPhoto pid = "+pid);
    FB.api('/'+pid, function(response) {
        console.log(JSON.stringify(response));
        if (response.error) {
    		
        } else {
            console.log('사진 정보 획득 성공 : '+response.source);
    		
            $('input[id=pid]').attr('value', pid);

        	// 화면에 사진을 표시한다.
            var html = "<img class=\"psb_photo\" src=\""+response.source+"\">";
            var info_html = '';
    	    
            $("#photolist_photo").html(html);
    	    
            if(response.comments) {
          	    psbPhotoListComments(response.comments.data);
                if(response.comments.data.length > 0) {
                    info_html += "<img class=\"img_info_icon\" ";
                    info_html += "src=\"images/comment.png\"> ";
                    info_html += response.comments.data.length+"&nbsp&nbsp"; 
                }
    	    } else {
    	        console.log('No comments');
    	    }

            if(response.likes) {
                if(response.likes.data.length > 0) {
       	            info_html += "<img class=\"img_info_icon\" ";
       	            info_html += "src=\"images/like.png\"> ";
                    info_html += response.likes.data.length; 
                }
            } else {
            	console.log('No likes');
            }

            $("#photolist_infos").html(info_html);
    
            if(response.name) {
                $("#photolist_message").html(response.name);
            }
            $('#div_photolist_form').show();
            console.log('입력 폼 표시함');
        }
        $.mobile.hidePageLoadingMsg();
    });
}

/******************************************************************************
 * 
 * psbPhotoCommentElement
 * 
 * Arguments
 *    idx : 몇번째 댓글인지 지정
 *    user_name : 사용자 이름
 *    message : 댓글 내용    
 *    
 * Description
 *    댓글 하나를 표시한다. 
 *      
 * Related page
 *     photolist.html
 *       
 *****************************************************************************/
function psbPhotoCommentElement(idx, user_name, message) {
    console.log('함수 : psbListElement');
    var html='<div class=div_comment_element>';
	
    html += '<div class=div_comment_profile_image id="profile_img_'+idx+'">';
    html += '<img class="comment_profile_image" src=""></div>';
    html += '<div class=div_comment_user_name>'+user_name+'</div>';
    html += '<div class=div_comment_message>'+message+'</div>';
	
    html += '</div>';
	
    console.log(html);
    return html;
}

/******************************************************************************
 * 
 * psbPhotoListDispCommentPhoto
 * 
 * Arguments
 *    idx : 몇번째 댓글인지 지정
 *    fbid : 댓글을 단 페이스북 사용자 아이디 
 *    
 * Description
 *    댓글을 단 사람의 프로필 사진을 표시한다. 
 *    문서상에 <div id=profile_img_idx></div> 로 지정된 태그에 페이스북에서 가져온 
 *    사진을 추가한다.
 *      
 * Related page
 *     photolist.html
 *       
 *****************************************************************************/
function psbPhotoListDispCommentPhoto(idx, fbid) {
    FB.api('/'+fbid+'/picture', function(response) {
        console.log(JSON.stringify(response));
        if (response.error) {
            console.log('오류');
        } else{
            var imgHTML='';
            imgHTML = '<img class="comment_profile_image" src="'+response+'">';

            console.log("imgHTML for "+idx+" : "+imgHTML);
            $('#profile_img_'+idx).html(imgHTML);
        }
    });
}

/******************************************************************************
 * 
 * psbPhotoListComments
 * 
 * Arguments
 *    comments : 댓글 정보    
 *    
 * Description
 *    댓글을 photolist.html에 표시한다.
 *      
 * Related page
 *     photolist.html
 *       
 *****************************************************************************/
function psbPhotoListComments(comments) {
    console.log("함수 : psbPhotoListComments");
    console.log(JSON.stringify(comments));
    var html = '';
    
    for(var i=0;i<comments.length;i++){
        console.log(i+' : 댓글단 사람은 이름이 '+comments[i].from.name
                     +'이고 ID는 '+comments[i].from.id);
    	
    	html += psbPhotoCommentElement(i, 
    	                               comments[i].from.name, 
    	                               comments[i].message);
    }    		
    $("#photolist_comments").html(html);
    console.log(html);
    
    for(i=0;i<comments.length;i++) {
        psbPhotoListDispCommentPhoto(i, comments[i].from.id);
    }
}

/******************************************************************************
 * 
 * psbPhotoListGetPhotoInfo
 * 
 * Arguments
 *    idx : 표시할 사진의 인덱스 정보 이 인덱스는 psbPhotoLists 배열의 인덱스이다.   
 *    
 * Description
 *    psbPhotoLists[idx]를 이용해 페이스북에서 사진정보, 사진에 대한 댓글, 좋아요 정보를
 *    가져온다.
 *      
 * Related page
 *     photolist.html
 *       
 *****************************************************************************/
function psbPhotoListGetPhotoInfo(idx) {
    console.log("함수 : psbPhotoListGetPhotoInfo idx = "+idx);
    
    $("#photolist_comments").html('');
    $("#photolist_infos").html('');
    $("#photolist_message").html('');
    $('textarea[id=photolist_comment_message]').attr('value', '');

    var html = "<img class=\"psb_photo\" src=\"\"> ";
    $("#photolist_photo").html(html);

    $.mobile.showPageLoadingMsg();

    if(idx >=0 && idx <psbPhotoLists.length) {
        var pid = psbPhotoLists[idx];

        psbPhotoListGetFBPhoto(pid);
    } else {
        console.log('인덱스 지정 오류 : '+ idx);
    }
}



/******************************************************************************
 * 
 * psbPhotoListNav
 * 
 * Arguments
 *    direction : 이전(next)으로 갈 것인지 이후(next)로 갈 것인지를 지정     
 *    
 * Description
 *    현재 표시되고 있는 사진의 이전, 다음 사진을 보여준다.
 *      
 * Related page
 *     photolist.html
 *       
 *****************************************************************************/
function psbPhotoListNav(direction) {
    console.log("함수 : psbPhotoListNav : " + direction);

    switch(direction) {
        case 'next' :
            console.log('다음 사진으로 ' + psbCurIdx);
            if(psbCurIdx == 0) {
                console.log('가장 최근 사진입니다.');
                return;
            } else {
                psbCurIdx--;
            }
            break;
        case 'prev' :
            if(psbCurIdx<(psbPhotoLists.length-1)) {
                psbCurIdx++;
            } else {
                console.log('가장 마지막 사진입니다.');
                return;
            }
            break;
    }
    
    $('#div_photolist_form').hide();
    psbPhotoListGetPhotoInfo(psbCurIdx);
}

/******************************************************************************
 * 
 * psbPhotoListShowMenu
 * 
 * Arguments
 *     none
 *     
 * Description
 *     photolist.html의 메뉴 아이콘을 표시한다.
 *      
 * Related page
 *     photolist.html
 *       
 *****************************************************************************/
function psbPhotoListShowMenu() {
    var href;
    console.log('psbPhotoListShowMenu');
    href="javascript:psbReloadPage('compose.html');";
    psbHeadDispMenuIcon(href,'#psb_menu_camera', 'camera');
}

/******************************************************************************
 * 
 * psbPhotoList
 * 
 * Arguments
 *     none
 *     
 * Description
 *     photolist.html 페이지가 보여질 때 (pageshow) 호출하는 함수.
 *      
 * Related page
 *     photolist.html
 *       
 *****************************************************************************/
function psbPhotoList() {
    console.log('함수 : psbPhotoList');
    psbPhotoListShowMenu();
    psbDbRead();    
}