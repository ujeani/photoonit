var PhoneGapReady=false;

/******************************************************************************
 * 
 * onInit
 * 
 * Arguments
 *     none 
 *      
 * Description
 *     index.html의 onload 이벤트가 발생하면 호출되는 함수
 *     phonegap 초기화가 완료되어 deviceready 이벤트가 발생하면 onDeviceReady 콜백 함수
 *     호출하도록 설정한다.
 *     resum 이벤트가 발생하면 onResume 콜백 함수를 호출하도록 설정한다.
 *      
 * Related page
 *     index.html
 *       
 *****************************************************************************/
function onInit() {
    document.addEventListener("deviceready", onDeviceReady,false);
    document.addEventListener("resume", onResume, false);
}


/******************************************************************************
 * 
 * onDeviceReady
 * 
 * Arguments
 *     none 
 *      
 * Description
 *     deviceready 이벤트가 발생하면 호출되는 함수
 *     phonegap 초기화가 완료되었을때 호출되는 함수로 PhoneGapReady를 true로 설정하여 다음
 *     페이지로 넘어갈 수 있도록 설정한다.
 *      
 * Related page
 *     index.html
 *       
 *****************************************************************************/
function onDeviceReady() {
    PhoneGapReady=true;
    console.log('함수 : onDeviceReady');
}


/******************************************************************************
 * 
 * onResume
 * 
 * Arguments
 *     none 
 *      
 * Description
 *     resume 이벤트가 발생하면 호출되는 함수
 *     프로세스가 다시 시작되는 이벤트로 다시 인증 확인을 하고 카메라를 구동시키는 절차로
 *     진입하도록 한다.
 *      
 * Related page
 *     index.html
 *       
 *****************************************************************************/
function onResume() {
    console.log('함수 : onResume');
    
    // 이미 로그인되어있는지 체크한다.
    FB.getLoginStatus(function(response) {
        console.log(JSON.stringify(response));
        if(response.status === 'connected') {
            console.log('이미 로그인 되어 있음.');
            // 사진 촬영 및 공유글 작성 화면으로 바로 이동 
            $.mobile.changePage("compose.html");
        } else {
            console.log('로그인 되어 있지 않음.');
            // login.html 페이지로 이동하여 로그인을 먼저 수행함.
            $.mobile.changePage("login.html");
        }
    });
}

$(document).bind("mobileinit", function() {
    $.mobile.loadingMessage = "로딩중...";
    $.mobile.page.prototype.options.backBtnText = "뒤로";
    $.mobile.defaultPageTransition = 'fade';

    // index.html 페이지 생성 
    $('#page_index').live('pageshow',function(event){
        if(PhoneGapReady==true) {
            console.log('폰갭 초기화 완료');
            // 페이스북 라이브러리 초기화
            try {
                FB.init({ appId: "YOUR_APP_ID", nativeInterface: PG.FB });
            } catch(e) {
                console.log(e);
            }
            // 데이터베이스를 연다.
            psbDbOpen();
            
            // 이미 로그인되어있는지 체크한다.
            FB.getLoginStatus(function(response) {
                console.log(JSON.stringify(response));
                if(response.status === 'connected') {
                    console.log('이미 로그인 되어 있음.');
                    // 사진 촬영 및 공유글 작성 화면으로 바로 이동 
                    $.mobile.changePage("compose.html");
                } else {
                    console.log('로그인 되어 있지 않음.');
                    // login.html 페이지로 이동하여 로그인을 먼저 수행함.
                    $.mobile.changePage("login.html");
                }
            });
        } else {
            console.log('폰갭 초기화 되지 않음.');
            // 폰갭이 아직 초기화되어있지 않으면 index.html을 다시 연다.
            $.mobile.changePage("index.html",{reloadPage:true});
        }
    });

    $('#page_compose').live('pagecreate',function(event){
        console.log('페이지 : compose.html 이벤트 : "pagecreate"');
    	
        $('#div_compose_form').hide();
        console.log('입력폼 숨김');
        psbComposeCapturePhoto();
    });

    $('#page_photolist').live('pagecreate',function(event){
        console.log('페이지 : photolist.html 이벤트 : "pagecreate"');
        $('#div_photolist_form').hide();
        console.log('입력 폼 숨김');
    });

    $('#page_photolist').live('pageshow',function(event){
        console.log('페이지 : photolist.html 이벤트 : "pageshow"');
        psbPhotoList();
    });
    
    $('#photolist_photo').live('swiperight', function(event){
        console.log('페이지 : photolist.html 이벤트 : 오른쪽으로 밀기');
        psbPhotoListNav('next');
    });

    $('#photolist_photo').live('swipeleft', function(event){
        console.log('페이지 : photolist.html 이벤트 : 왼쪽으로 밀기');
        psbPhotoListNav('prev');
    });
});
