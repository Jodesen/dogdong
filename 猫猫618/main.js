"ui";

const VERSION = '1.0.4'

const upDateLog  = '版本 1.0.4\n新增 淘宝任务按钮\n测试 🐕东抽奖任务\n修复 关闭弹窗的错误\n修复 品牌墙任务查找\n优化 部分入会任务类型' 

ui.layout(
    <frame>
        <vertical id="main" visibility="visible" gravity="center_vertical">
            <button id="testTaobao" text="淘宝任务测试按钮(任务5.29开启)" />
            <button id="automationPermission" text="1. 授予无障碍权限" />
            <button id="consolePermission" text="2. 授予悬浮窗权限" />
            <button id="startJDTask" text="3. 开始🐕东任务" />
            <button id="startTestJd" text="3-1. 开始🐕东抽奖任务(beta)" />
            <button id="about" text="关于" />
            <button id="upDateLog" text="更新日志" />
            <text text="请按步骤授予权限，否则脚本没法运行。" textStyle="bold|italic" textColor="red" textSize="18sp" />
            <text text="脚本原理是模拟点击效果" textStyle="bold|italic" textColor="red" textSize="18sp" />
            <text text="注意调节媒体音量，会有部分浏览直播任务" textStyle="bold|italic" />

            <text id="ver" line="1" />


        </vertical>



    </frame>
);
ui.about.click(function () {
    //toast("成功");
    alert("作者：Xu" + '\n版本：' + VERSION);
});

var num = 0
ui.testTaobao.click(function () {
    num++;
    if(num >=10 && num <20){ 
        toast("阿伟，你又在打电动啦，快去干点别的事啦~") 
    }else if(num >= 20 && num <30){
        toast("别点了,别点了。拜托你很闲勒!!!")
    }
    else if(num >= 50) {
        alert("好吧你赢了，但是我没写功能啊！！！")
    }
    // else{toast("还没功能。咕咕咕ing")}
});

ui.upDateLog.click(function(){
    alert(upDateLog)
})



ui.automationPermission.click(function () {
    threads.start(autoPerReq)
});

ui.consolePermission.click(function () {
    threads.start(conPerReq)
});


ui.startJDTask.click(function () {
    engines.execScriptFile('./start.js')
})

ui.startTestJd.click(function () {
    engines.execScriptFile('./start_Lottery.js')
})

function autoPerReq() {
    if (!auto.service) {
        alert('请找到猫猫618，勾选授予权限')
    }
    auto.waitFor()
    toast('无障碍权限授予成功')
}

function conPerReq() {
    toast('请打开悬浮窗权限')
    console.show()
    console.log('悬浮窗权限授予成功！此窗口马上消失')
    sleep(1000)
    toast("日志窗口创建成功")
    console.hide()
}


// 唤起京东APP打开url的方法
function openJdUrl(url) {
    app.startActivity({
        action: "VIEW",
        data: 'openApp.jdMobile://virtual?params={"category":"jump","des":"m","sourceValue":"JSHOP_SOURCE_VALUE","sourceType":"JSHOP_SOURCE_TYPE","url":"' + url + '","M_sourceFrom":"h5auto","msf_type":"auto"}'
    })
}
