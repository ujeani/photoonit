/******************************************************************************
 * 
 * psbLogin
 * 
 * Arguments
 *     none
 *     
 * Description
 *     login.html의 페이스북 로그인 버튼을 누르면 호출하는 함수
 *     페이스북 로그인을 수행하고 앱에 대한 사용 권한을 인증한다.
 *      
 * Related page
 *     login.html
 *       
 *****************************************************************************/
function psbLogin() {
    console.log('함수 : psbLogin');
    
    FB.login (
        function (response) {
            console.log(JSON.stringify(response));
            if(response.status ==='connected') {
                console.log('로그인 됨');
                $.mobile.changePage("compose.html");
            } else {
                console.log('로그인 실패');
            }
        },
        {perms: "user_about_me, user_photos, friends_photos, photo_upload, publish_stream, read_stream"}
    );
}