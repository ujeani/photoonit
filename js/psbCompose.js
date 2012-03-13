/******************************************************************************
 * 
 * psbComposeShowMenu
 * 
 * Arguments
 *     none
 *     
 * Description
 *     compose.html의 메뉴 아이콘을 표시한다.
 *      
 * Related page
 *     photolist.html
 *       
 *****************************************************************************/
function psbComposeShowMenu() {
    console.log('함수 : psbComposeShowMenu');
    var href;
	
    href="javascript:psbReloadPage('compose.html');";
    psbHeadDispMenuIcon(href,'#psb_menu_camera', 'camera');

    href="javascript:psbReloadPage('photolist.html');";
    psbHeadDispMenuIcon(href,'#psb_menu_cancel', 'cancel');

}


/******************************************************************************
 * 
 * 
 * psbComposeFBPostPhoto
 * 
 * Arguments
 *     msg : 사진과 함께 올라갈 글 
 *     imageURL : 서버에 저장된 사진 파일의 URL
 *     
 * Description
 *     서버에 저장된 사진 URL을 이용해서 페이스북에 사진을 포스팅한다.
 *      
 * Related page
 *     compose.html
 *       
 *****************************************************************************/
function psbComposeFBPostPhoto(msg, imgURL) {
    console.log('함수 : psbComposeFBPostPhoto');
    FB.api('/me/photos', 'post', {
        name: msg,
        url: imgURL
    }, function (response) {
    	console.log(JSON.stringify(response));
    	if (response.error) {
            console.log('Error occured:' + response.error.message);
            $.mobile.changePage('photolist.html');
        } else {
            psbCurIdx = 0;
            console.log('Post ID: ' + response.id);
            psbDbSave(response.id);
        }
    });
}

var fileUploadURL = "http://photo.onit.fm/hybrid/fileupload.php";

/******************************************************************************
 * 
 * psbComposeUploadPhoto
 * 
 * Arguments
 *     imageURI : 촬영한 사진의 파일 URI
 *     
 * Description
 *     촬영한 사진을 서버에 올리고 페이스북에 포스팅하기 위한 함수를 호출한다.
 *     서버에 사진 파일을 전송하기 위해 폰갭의 파일 업로드 함수를 이용한다.
 *      
 * Related page
 *     compose.html
 *       
 *****************************************************************************/
function psbComposeUploadPhoto(fbId, message, imageURI) {
    console.log('함수 : psbComposeUploadPhoto');
    var options = new FileUploadOptions();
    options.fileKey = "File";
    options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1)
    
    // 안드로이드는 파일끝에 확장자가 안붙어 있다.
    if(!(options.fileName.match(".jpg"))) {
        options.fileName += ".jpg";
    }
    console.log("파일명 = "+options.fileName);

    var params = new Object();
    console.log("User ID = "+ fbId);

    params.id = fbId;
    options.params = params;

    var ft = new FileTransfer();
    ft.upload(imageURI, 
        fileUploadURL,
        function(r){
            var photo_res = JSON.parse(r.response);
           
            // TODO : 에러 검사 및 처리 필요함.
            console.log("response.code = "+photo_res.code);
            console.log("response.ImgURL = "+photo_res.ImgURL);
    	    // 서버에서 보내온 사진 URL을 이용해서 페이스북에 사진을 포스팅한다.      
            psbComposeFBPostPhoto(message, photo_res.ImgURL);
        }, function(error){
            console.log("파일 전송 실패 Code = "+ error.code);
        }, options
    );
}

/******************************************************************************
 * 
 * psbComposeProcForm
 * 
 * Arguments
 *     frm : 입력 폼을 통해 입력한 정보 
 *     
 * Description
 *     사용자가 사진을 찍고 글을 쓴 후 "보내기" 버튼을 누르면 호출되는 함수
 *     입력 form에 기록된 정보를 이용해서 사진을 페이스북에 포스팅한다.
 *      
 * Related page
 *     compose.html
 *       
 *****************************************************************************/
function psbComposeProcForm(frm) {
    var message = frm.message.value;
    var imgURI = frm.File.value;
    var fbId = frm.id.value;
    console.log('함수 : psbComposeProcForm');
    console.log('message = '+message+'\nimgURI = '+imgURI+'\nfbId = '+fbId);
    
    $.mobile.showPageLoadingMsg();

    psbComposeUploadPhoto(fbId, message, imgURI);
    
}

/******************************************************************************
 * 
 * onComposePhotoURISuccess
 * 
 * Arguments
 *     imageURI : 촬영한 사진의 파일 URI
 *     
 * Description
 *     카메라 사진 촬영을 정상적으로 완료하면 호출되는 콜백 함수.
 *     화면에 촬영한 사진을 표시하고 form의 정보들을 구성한다.
 *      
 * Related page
 *     compose.html
 *       
 *****************************************************************************/
function onComposePhotoURISuccess(imageURI) {
    console.log('함수 : onComposePhotoURISuccess');
    console.log('촬영된 사진 URI : '+imageURI);
    
    psbComposeShowMenu();
    
    var html = "<img class=\"psb_compose_photo\" src=\""+imageURI+"\"> ";
    $("#compose_photo").html(html);
    console.log('사진 표시 완료');

    var uid;
    FB.api('/me', function(response) {
        console.log(JSON.stringify(response));
        if (response.error) {
            console.log(JSON.stringify(response.error));
            uid = 'unknown';
        } else {
            uid = response.id;
            console.log(response.id);
        }
        $('input[id=compose_id]').attr('value', uid);
        $('input[id=compose_File]').attr('value', imageURI);
        $('#div_compose_form').show();
        console.log('입력 폼 표시함.');
    });
}

/******************************************************************************
 * 
 * onComposePhotoFail
 * 
 * Arguments
 *     none
 *     
 * Description
 *     카메라 사진 촬영을 취소하거나 실패하면 호출되는 콜백 함수.
 *     photolist.html 페이지로 이동한다.
 *      
 * Related page
 *     compose.html
 *       
 *****************************************************************************/
function onComposePhotoFail(message) {
    console.log('함수 : onComposePhotoFail');
    console.log('사진 촬영 오류 : '+message);
    $.mobile.changePage("photolist.html");
}

/******************************************************************************
 * 
 * psbComposeCapturePhoto
 * 
 * Arguments
 *     none
 *     
 * Description
 *     카메라를 실행시켜 사진을 촬영한다.
 *     촬영을 정상적으로 완료하면 onComposePhotoURISuceess 콜백 함수를 호출하고 
 *     실패하면 onComposePhotoFail 콜백 함수를 호출한다.
 *      
 * Related page
 *     compose.html
 *       
 *****************************************************************************/
function psbComposeCapturePhoto() {
    console.log('함수 : psbComposeCapturePhoto');

    navigator.camera.getPicture(
        onComposePhotoURISuccess,
        onComposePhotoFail,
        {quality:35, 
         destinationType: Camera.DestinationType.FILE_URI,
         EncodingType: Camera.EncodingType.JPEG,
         targetWidth: 720,
         saveToPhotoAlbum: true,  // API설명에 빠져있음.
         allowEdit: false
        }
    );
}
