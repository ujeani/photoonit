var psbDb;

/******************************************************************************
 * 
 * psbDbOpen()
 * 
 * Arguments
 *     none 
 *     
 * Return value
 *     SQL에서 얻은 페이스북 사진 데이터베이스
 *     
 * Description
 *      
 * Related page
 *     
 *       
 *****************************************************************************/
function psbDbOpen() {
    console.log('함수 : psbDbOpen');
    psbDb = window.openDatabase("psbDB", "1.0", "PhotoShareBook Database", 
    		                    200000);
}

/******************************************************************************
 * 
 * onDbErrorQuery
 * 
 * Arguments
 *     none 
 *     
 * Description
 *     
 * Related page
 *     photolist.html
 *       
 *****************************************************************************/
function onDbErrorQuery(err) {
    console.log('함수 : onDbErrorQuery');
    console.log('Error to query DB. Erro Code = '+err.code+'\nError message = '
    		   +err.message);

	$("#photolist_photo").html("<br><br><center>Take a Photo & post to facebook</center>");

}

/******************************************************************************
 * 
 * onDbSuccessQuery
 * 
 * Arguments
 *     tx : SQLTransaction 객체
 *     results : DB에서 지정된 쿼리를 수행한 결과 정보.
 *     
 * Description
 *     DB에서 지정된 정보를 읽는데 성공했을때 호출하는 함수.
 *     
 * Related page
 *     photolist.html
 *       
 *****************************************************************************/
function onDbSuccessQuery(tx, results) {
    console.log('함수 : onDbSuccessQuery');
	
    var len = results.rows.length;
    for (var i=len; i>0; i--){
        psbPhotoLists[len-i] = results.rows.item(i-1).pid;
        console.log('psbPhotolists['+(len-i)+']='+psbPhotoLists[len-i]+
       			    ' results.row.items('+(i-1)+').pid='+
       			    results.rows.item(i-1).pid);
    }

    psbPhotoListGetPhotoInfo(psbCurIdx);
}

/******************************************************************************
 * 
 * psbDbQuery
 * 
 * Arguments
 *     tx : 사용하려는 SQLTransaction 객체 
 *     
 * Description
 *     이전에 연 SQL 데이터베이스에서 페이스북 사진 ID를 읽어온다. 
 *     
 * Related page
 *     photolist.html
 *       
 *****************************************************************************/
function psbDbQuery(tx) {
    console.log('함수 : psbDbQuery');
    tx.executeSql('SELECT * FROM PSBDB', [], onDbSuccessQuery, onDbErrorQuery);	
}

/******************************************************************************
 * 
 * psbDbRead
 * 
 * Arguments
 *     none 
 *     
 * Description
 *     DB에 저장된 페이스북 사진 ID를 모두 읽는다.  
 *     
 * Related page
 *     photolist.html
 *       
 *****************************************************************************/
function psbDbRead() {
    console.log('함수 : psbDbRead');
    psbDb.transaction(psbDbQuery, onDbErrorQuery);
}

var dbPid = null;

/******************************************************************************
 * 
 * onDbErrorSave
 * 
 * Arguments
 *     none 
 *     
 * Description
 *     데이터를 SQL 데이터베이스에 제대로 쓰지 못했을 때 호출하는 함수 
 *     정상적으로 저장하지 못했더라도 photolist.html로 이동한다. 
 * Related page
 *     
 *       
 *****************************************************************************/
function onDbErrorSave(err) {
    console.log('함수 : onDbErrorSave');
    console.log('Error to save DB. Erro Code = '+err.code+' pid = '+ dbPid);
    $.mobile.changePage('photolist.html');
}

/******************************************************************************
 * 
 * onDbSuccessSave
 * 
 * Arguments
 *     none 
 *     
 * Description
 *     데이터를 SQL 데이터베이스에 제대로 썼을 때 호출하는 함수
 *     사진을 찍어 페이스북에 정상적으로 올린 후 DB에 저장이 완료되면 photolist.html
 *     페이지로 이동한다. 
 * Related page
 *     
 *       
 *****************************************************************************/
function onDbSuccessSave() {
    console.log('함수 : onDbSuccessSave');
    $.mobile.changePage('photolist.html');
}

/******************************************************************************
 * 
 * psbDbPopulate
 * 
 * Arguments
 *     tx : 사용하려는 SQLTransaction 객체 
 *     
 * Description
 *     이전에 연 SQL 데이터베이스에 페이스북의 사진 ID를 저장한다. 
 *     
 * Related page
 *     compose.html
 *       
 *****************************************************************************/
function psbDbPopulate(tx) {
    console.log('함수 : psbDbPopulate');
    tx.executeSql('CREATE TABLE IF NOT EXISTS PSBDB (pid unique)');
    tx.executeSql('INSERT INTO PSBDB (pid) VALUES ('+dbPid+')');
    dbPid = null;
}

/******************************************************************************
 * 
 * psbDbSave
 * 
 * Arguments
 *     pid : 페이스북에 등록된 사진의 ID 
 *     
 * Description
 *     페이스북에 사진을 등록하고 받은 사진의 ID를 DB에 저장한다.
 *      
 * Related page
 *     compose.html
 *       
 *****************************************************************************/
function psbDbSave(pid) {
    console.log('함수 : psbDbSave');
	
    dbPid = pid;
    console.log('dbPid = '+dbPid);
    if(dbPid) {
        psbDb.transaction(psbDbPopulate, onDbErrorSave, onDbSuccessSave);
    }
}
