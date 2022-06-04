"ui";

const VERSION = '1.0.5'

ui.layout(
    <frame>
        <vertical id="main" visibility="visible" gravity="center_vertical">
            <button id="automationPermission" text="1. 授予无障碍权限" />
            <button id="consolePermission" text="2. 授予悬浮窗权限" />
            <button id="startJDTask" text="3. 开始🐕东任务" />
            <button id="startTestJd" text="3-1. 开始🐕东抽奖任务(beta)" />
            <button id="about" text="关于" />
            <button id="checkUpdate" text="检查更新" />
            <text text="请按步骤授予权限，否则脚本没法运行。" textStyle="bold|italic" textColor="red" textSize="18sp" />
            <text text="脚本原理是模拟点击效果" textStyle="bold|italic" textColor="red" textSize="18sp" />
            <text text="注意调节媒体音量，会有部分浏览直播任务" textStyle="bold|italic" />

            <text id="ver" line="1" />


        </vertical>



    </frame>
);
//检查更新
threads.start(checkUpdate)
ui.about.click(function () {
    //toast("成功");
    alert("作者：Jodesen" + '\n版本：' + VERSION);
});



ui.checkUpdate.click(function () {
    threads.start(checkUpdate)
});


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
function checkUpdate() {
    if (VERSION == 0) {
        toast('无法加载version.js')
        return
    }
    toast('正在检查更新')
    const versionUrl = 'https://gh.api.99988866.xyz/https://github.com/Jodesen/dogdong/blob/main/version'
    http.get(versionUrl, {}, function (res, err) {
        if (err) {
            toast('检查更新出错，请手动前往项目地址查看')
            return
        }
        try {
            res = res.body.json()
        } catch (err) {
            toast('检查更新出错，请手动前往项目地址查看')
            return
        }
        const version = res.version
        const log = res.log
        if (version != VERSION) {
            var go = confirm("更新了，前往下载" + version, log)
            if (go) {
                alert('如果打不开Github链接，请查看QQ群公告至蓝奏云下载')
                app.openUrl('https://github.com/Jodesen/dogdong/releases/latest')
            }
        } else {
            toast('当前版本为最新版！')
        }
    })
}