// 変数宣言
let   nowPage  = 0;     //現在のページ
let   nowList  = 0;     //現在のテーブル
const arrWords = [];    //単語と意味を入れる配列
let   json_text = "";   //配列をJSONに変換したテキストを入れる変数

//ローカルストレージのJSONファイルを読み取り
if(localStorage.hasOwnProperty("単語帳")){
    let json_prs = JSON.parse(localStorage.getItem("単語帳"));
    for(let i = 0; i < json_prs.length; i++){
        arrWords[i] = json_prs[i];
    }
}

// ロードする時の処理
$(document).ready( function(){
    // 開いているファイル名を取得
    let nowDoc = window.location.href.split('/').pop();
    // 編集画面を開いたとき
    if(nowDoc == "edtList.html" ){
        nowList = 0;
        showTable(nowList);
    }
});

//---------自作関数-------------//

//文字入力チェック関数
function chkInput(iptTxt){
    //インプットの内容を空白消して取得
    const iptVal = $.trim( iptTxt.value );

    // 空白の場合、背景を赤にする
    if(iptVal == ""){
        iptTxt.classList.add("red_bgc");
    }else{
        iptTxt.classList.remove("red_bgc");
    }
}

//正解の時、丸付けする関数
function chkMaru(iptTxt){

    // 答えが合っている時
    if(iptTxt.value == arrWords[nowPage].ans){

        // 紙吹雪発動
        confetti({
            particleCount: 600,
            spread: 100,
            origin: { y: 0 }
        });


        //時間取得
        let date = new Date();
        let time = date.getTime();

        // プロパティにタイムスタンプ付与して代入
        let src = '<img id="akamaru" src="./img/akamaru.gif?'+ time + '">';

        // gifが入っているタグを一旦消して再代入
        $("#akamaruDiv").html('').html(src);

        //答えを表示(クリック処理)
        $("#ansWordBtn").click();

        // 入力の背景の赤を削除
        $("#iptWord").removeClass("red_bgc");

        // 次の単語へボタンにフォーカス
        $("#nextWordBtn").focus();


    }
    // 間違っている場合
    else{
        // 背景を赤にする
        $("#iptWord").addClass("red_bgc");
    }

}

// 解答場所を初期化する関数
function clearStudyWord(){
        // gifが入っているタグを削除
        $("#akamaruDiv").html('');

        //単語表示名変更
        $("#studyWord").html(arrWords[nowPage].word);

        // 答えを見るボタンを表示
        $("#ansWordBtn").slideDown(10);
        // 答えを非表示
        $("#ansWord").slideUp(10);

        // インプットの内容を消去して再フォーカス
        $("#iptWord").removeClass("red_bgc").val("").focus();

        // 解答場所を非表示にして表示
        $("#study_div").slideUp(10).slideDown(10);

        // ボタン名の変更
        $("#nextWordBtn").html("").html("次の単語へ");
}

// 登録されている単語一覧をテーブルに表示する関数
function addEditTable(){
    //テーブル初期化
    $("#edit_table").html("");

}

// 重複がないかチェックする関数
function chkDupWord(chkWord){
    for(let i =0;i < arrWords.length; i++){
        if(arrWords[i].word == chkWord){
            return false;
        }
    }

    //重複がない場合はtrue
    return true;
}


// 登録単語一覧を表示する関数
function showTable(nowList){

    // 登録されている単語がない場合
    if(arrWords.length == 0){
        $("#notList").show(10);
        $("#next_table_btn").hide(10);
        $("#back_table_btn").hide(10);
        $(".edit_space").hide(10);
        return;

    }else{
        $("#notList").hide(10);
    }

    //最初or最後のページの場合、ボタン非表示
    if(nowList == 0){
        $("#back_table_btn").hide(10);
        $("#next_table_btn").show(10);
    }else if((nowList + 1) * 3  < arrWords.length){

        $("#back_table_btn").show(10);
        $("#next_table_btn").show(10);
    }else{
        $("#next_table_btn").hide(10);
        $("#back_table_btn").show(10);
    }

    // 単語情報の表示
    for(let i = 0; i < 3;i++ ){

        if((nowList * 3) + i < arrWords.length){
            $("#edtWord_box"+(i + 1)).show(10);
        }else{
            $("#edtWord_box"+(i + 1)).hide(10);
            continue;
        }

        $("#edtWord_box_nmb"+(i + 1)).html("");
        $("#edit_word_ipt"+(i + 1)).val("");
        $("#edit_mean_ipt"+(i + 1)).val("");

        $("#edtWord_box_nmb"+(i + 1)).html((nowList * 3) + (i + 1) + "個目");
        $("#edit_word_ipt"+(i + 1)).val(arrWords[(nowList * 3) + i].word);
        $("#edit_mean_ipt"+(i + 1)).val(arrWords[(nowList * 3) + i].ans);
    
    }

}


//---------メイン画面-------------//

// 単語を覚えるボタンをクリックしたとき
$("#start").on("click",function () {

    //メイン画面を非表示にする
    $("#main").hide(10);

    //勉強画面を表示する
    $("#study_page").show(10);

    // 配列に単語が入っていれば解答場所表示
    if(arrWords.length != 0){

        // 現在のページ番号を初期化
        nowPage = 0;

        //単語未登録用テキストを非表示
        $("#notStudy").css("display","none");

        // 解答場所表示
        $(".study_box").css("display","block");

        // 解答場所を初期化する関数
        clearStudyWord();


        //登録単語が１個の場合は次の単語へボタン非表示
        if(arrWords.length == 1){
            $("#nextWordBtn").hide(10);
        }else{
            $("#nextWordBtn").show(10);
        }

    // 配列内に単語が未登録の場合
    }else{
        // 解答場所非表示
        $(".study_box").css("display","none");

        //登録してない場合のテキストを表示
        $("#notStudy").css("display","block");

        //最初に戻るボタンにフォーカス
        $("#study_end").focus();
    }
});


// 単語を追加ボタンをクリックしたとき
$("#add").on("click",function () {
    //編集画面に移動
    window.location.href = "./edtList.html";
});


//---------単語帳編集画面-------------//
//単語を追加するボタンをクリックしたとき
$("#edit_add_btn").on("click",function(){
    $("#edit_add_page").show(20);
    $("#edit_page").hide(20);
});

//メイン画面に戻るボタンをクリックしたとき
$("#back_main_btn").on("click",function(){
    //メイン画面に戻る
    window.location.href = "./index.html";
});

//テーブル単語変更ボタン
$(".change_word_btn").on("click",function(){
    let nmb = 0;
    let word = "";
    let ans  = "";

    console.log(this.id);

    for(let i = 1; i <=3; i++){
        if(this.id == "change_word_btn" + i){
            nmb = i;
            break;
        }
    }
    console.log(nmb);

    word = $.trim( $("#edit_word_ipt" + nmb).val() ) ;
    ans  = $.trim( $("#edit_mean_ipt" + nmb).val() ) ;

    if(word == "" || ans == ""){
        alert("空白で変更はできません");
        $("#edit_word_ipt" + nmb).val(arrWords[(nowList * 3) +(nmb - 1)].word);
        $("#edit_mean_ipt" + nmb).val(arrWords[(nowList * 3) +(nmb - 1)].ans);
        return;
    }

    if(!chkDupWord(word)){
        //同じ単語の場所でなければ処理
        if(word != arrWords[(nowList * 3) +(nmb - 1)].word){
            alert("登録されている単語と重複しているため変更できません");
            $("#edit_word_ipt" + nmb).val(arrWords[(nowList * 3) +(nmb - 1)].word);
            $("#edit_mean_ipt" + nmb).val(arrWords[(nowList * 3) +(nmb - 1)].ans);
            return;
        }
    }

    // 配列に変更文字を代入
    arrWords[(nowList * 3) +(nmb - 1)].word = word;
    arrWords[(nowList * 3) +(nmb - 1)].ans  = ans;

    //ローカルストレージにJSON形式で保存
    json_text = JSON.stringify(arrWords);
    localStorage.setItem("単語帳",json_text);

    //登録したアラートを表示
    alert("変更しました！");

    // 入力単語に空白を除外して代入
    $("#edit_word_ipt" + nmb).val(word);
    $("#edit_mean_ipt" + nmb).val(ans);

});


//テーブル単語削除ボタン
$(".delete_word_btn").on("click",function(){
    let nmb = 0;
    let word = "";
    let ans  = "";

    console.log(this.id);

    for(let i = 1; i <=3; i++){
        if(this.id == "delete_word_btn" + i){
            nmb = i;
            break;
        }
    }

    // 確認フォーム表示
    if(window.confirm("本当に削除しますか？")){
        arrWords.splice((nowList * 3) +(nmb - 1),1);

        //ローカルストレージにJSON形式で保存
        json_text = JSON.stringify(arrWords);
        localStorage.setItem("単語帳",json_text);

        //登録したアラートを表示
        alert("削除しました！");

        // リストを再表示
        showTable(nowList);
    }

});


// 次のテーブルに進むボタン
$("#next_table_btn").on("click",function(){
    nowList++;
    showTable(nowList);
});

// 前のテーブルに進むボタン
$("#back_table_btn").on("click",function(){
    nowList--;
    showTable(nowList);
});


//---------単語追加画面-------------//

// 登録ボタンをクリックしたとき
$("#add_word_btn").on("click",function () {

    //空白及びスペースを削除して代入
    let addWord = $.trim( $("#add_word").val() ) ;
    let addMean = $.trim( $("#add_mean").val() ) ;
    
    //入力チェック
    if(addWord == "" || addMean == ""){
        if(addMean == ""){
            $("#add_mean").addClass("red_bgc").val("").focus();
        }
        if(addWord == ""){
            $("#add_word").addClass("red_bgc").val("").focus();
        }

        alert("未入力箇所があります");

        return;     //処理終了（ここから先は処理しない）
    }

    // 重複チェック
    if( !chkDupWord(addWord )){
        alert("同じ単語が登録されているため登録できません");

        //単語の部分を消す
        $("#add_word").val("");
        return;
    }

    // 配列に追加用の変数
    let addTmp = {word:addWord,ans:addMean};

    // 配列に追加
    arrWords.push(addTmp);

    //ローカルストレージにJSON形式で保存
    json_text = JSON.stringify(arrWords);
    localStorage.setItem("単語帳",json_text);

    //登録したアラートを表示
    alert("登録しました！");

    //単語編集画面のインプット内容を消す
    $("#add_word").val("");
    $("#add_mean").val("");

});



// 編集終了ボタンをクリックしたとき
$("#edit_add_end").on("click",function () {

    //単語編集画面のインプット内容を消す
    $("#add_word").val("").removeClass("red_bgc");
    $("#add_mean").val("").removeClass("red_bgc");

    // リスト表示
    nowList = 0;
    showTable(nowList);

    //単語編集画面に戻る
    $("#edit_add_page").hide(20);
    $("#edit_page").show(20);

});


//---------勉強画面-------------//

// 答えを見るボタンをクリック
$("#ansWordBtn").on('click',function(){
    // 順次処理
    $.when(
        // 答えを見るボタンを非表示
        $("#ansWordBtn").slideUp(300)
    ).done(function(){
        // 答えを一旦消して表示
        $("#ansWord").html("").html("答え："+ arrWords[nowPage].ans).slideDown(300);
    });
});


//勉強終了画面をクリック
$("#study_end").on('click',function (){

    //勉強画面を非表示
    $("#study_page").hide(10);

    // メイン画面を表示にする
    $("#main").show(10);

});

// 次の単語へボタンをクリック
$("#nextWordBtn").on('click',function () {

    // ページ用変数に1加算
    nowPage += 1;

    // 次のページがある場合
    if($("#nextWordBtn").html() == "次の単語へ"){

        // 解答場所を初期化する関数
        clearStudyWord();


        // 最後の単語の場合は次の単語へボタン名を変更
        if(nowPage + 1 == arrWords.length){
            $("#nextWordBtn").html("").html("最初の単語に戻る");
        }
    }
    // 最後のページの場合
    else{

        // ページ用変数初期化
        nowPage = 0;

        // 解答場所を初期化する関数
        clearStudyWord();

    }

});
