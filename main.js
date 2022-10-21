"ui";

const VERSION = '1.0.9'

ui.layout(
    <frame>
        <vertical id="main"gravity="center_vertical">
        <text text="" textStyle="bold|italic" />
        <text text="" textStyle="bold|italic" />
        <text text="" textStyle="bold|italic" />
        <text text="" textStyle="bold|italic" />
        <button id="automationPermission" w="200" text="1. 授予无障碍权限" />
        <horizontal>
        <button id="consolePermission" w="200"text="2. 授予悬浮窗权限" />
        <button id="about" w="200" text="关于" />
        </horizontal>
        <horizontal>
        <button id="startJDTask" w="200" text="3. 开始🐕东任务" />
        <button id="checkUpdate" w="200" text="检查更新" />
        </horizontal>
        <img src="http://gchat.qpic.cn/gchatpic_new/0/0-0-7485C27B7B1345797032B0A17127EC08/0?term=2"/>
        </vertical>

    </frame>
);
//检查更新
//threads.start(checkUpdate)
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

function autoPerReq() {
    if (!auto.service) {
        alert('请找到嘎嘎鸭，勾选授予权限')
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
        data: 'openApp.jdMobile://virtual?params={"category":"jump","des":"m","sourceValue":"JSHOP_SOURCE_VALUE","sourceType":"JSHOP_SOURCE_TYPE","url":"'+ url +'","M_sourceFrom":"h5auto","msf_type":"auto"}'
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
            var logMessage = confirm("检查更新出错是否前往项目地址查看？")
            if (logMessage) {
                toast('密码为：2333')
                setClip("2333");
                app.openUrl('https://wwd.lanzouf.com/b03167d5g')
            }
            return
        }
        try {
            res = res.body.json()
        } catch (err) {
            var logMessage = confirm("检查更新出错是否前往项目地址查看？")
            if (logMessage) {
                toast('密码为：2333')
                setClip("2333");
                app.openUrl('https://wwd.lanzouf.com/b03167d5g')
            }
        }
        const version = res.version
        const log = res.log
        if (version != VERSION) {
            var go = confirm("更新了，前往下载" + version, log)
            if (go) {
                toast('密码为：2333')
                setClip("2333");
                app.openUrl('https://wwd.lanzouf.com/b03167d5g')
            }
        } else {
            toast('当前版本为最新版！')
        }
    })
}