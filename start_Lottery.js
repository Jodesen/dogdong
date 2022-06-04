if (!auto.service) {
    toast('无障碍服务未启动！退出！')
    exit()
}

console.setTitle("日志窗口")
console.show()

function getSetting() {
    let indices = []
    autoOpen && indices.push(0)
    alert("抽奖功能目前还在测试")
    let settings = dialogs.multiChoice('任务设置', ['自动打开🐕东进入活动。'], indices)

    if (settings.length == 0) {
        toast('取消选择，任务停止')
        exit()
    }

    if (settings.indexOf(0) != -1) {
        storage.put('autoOpen', true)
        autoOpen = true
    } else {
        storage.put('autoOpen', false)
        autoOpen = false
    }
}

let storage = storages.create("jd_task");
let autoOpen = storage.get('autoOpen', true)
getSetting()

// 自定义取消亮屏的退出方法
function quit() {
    device.cancelKeepingAwake()
    exit()
}

// 监听音量下键
function registerKey() {
    events.observeKey()
    events.onKeyDown('volume_down', function (event) {
        console.log('🐕东任务脚本停止了')
        device.vibrate(2000)
        console.log('请手动切换回主页面')
        sleep(3000)
        console.hide()
        quit()
        
    })
}
threads.start(registerKey)

// 自定义一个findTextDescMatchesTimeout
function findTextDescMatchesTimeout(reg, timeout) {
    let c = 0
    while (c < timeout / 50) {
        let result = textMatches(reg).findOnce() || descMatches(reg).findOnce()
        if (result) return result
        sleep(50)
        c++
    }
    return null
}

// 打开🐕东进入活动
function openAndInto() {
    console.log('正在打开🐕东App...')
    if (!launch('com.jingdong.app.mall')) {
        console.log('可能未安装🐕东App')
        sleep(500)
        console.log('你是不是没安装🐕东？？')
        quit()
    }

    sleep(3000)
    console.log('进入活动页面')

    app.startActivity({
        action: "VIEW",
        data: 'openApp.jdMobile://virtual?params={"category":"jump","action":"to","des":"m","sourceValue":"JSHOP_SOURCE_VALUE","sourceType":"JSHOP_SOURCE_TYPE","url":"https://u.jd.com/JCTuenU","M_sourceFrom":"mxz","msf_type":"auto"}'
    })
}

// 获取金币数量
function getCoin() {
    let anchor = className('android.view.View').filter(function (w) {
        if ((w.desc() && w.desc().match(/分红：.*份/)) || (w.text() && w.text().match(/分红：.*份/))) {
            return true
        } else {
            return false
        }
    }).findOne(5000)
    if (!anchor) {
        console.log('找不到分红控件')
        return false
    }
    let coin = anchor.parent().child(2).text()
    if (coin) {
        return parseInt(coin)
    } else {
        coin = anchor.parent().child(3).text() // 有可能中间插了个控件
        if (coin) {
            return parseInt(coin)
        } else {
            return false
        }
    }
}

// 打开抽奖页
function openPage() {
    let anchor = className('android.view.View').filter(function (w) {
        return w.clickable() && (w.text() == '去使用奖励' || w.desc() == '去使用奖励')
    }).findOne(5000)

    if (!anchor) {
        console.log('未找到指定控件，打开抽奖页失败')
        return false
    }

    let anchor_index = anchor.indexInParent()
    let sign = anchor.parent().child(anchor_index + 1) // 去使用的后1个
    sign.child(0).child(0).click() // child才可以点

    return text('剩余抽奖次数').findOne(8000)
}

// 查找任务，返回所有任务
function findTasks() {
    let anchor = text('剩余抽奖次数').findOnce()
    if (!anchor) {
        console.log('无法指定控件')
        return false
    }
    console.log('打开任务列表')
    anchor.parent().parent().parent().parent().child(1).click()
    sleep(5000)
    let go = text('去完成').findOnce()
    if (!go) {
        console.log('似乎未能打开任务列表')
        return false
    }
    console.log('任务列表已打开')
    let tasks = []
    let taskList = go.parent().children()
    let task = []
    for (let i = 0; i < taskList.length; i++) {
        let e = taskList[i]
        if (e.text()) {
            task.push(e.text())
            if (e.text() == '去完成') {
                if (!task[0].match(/邀/)) { // 如果有邀请好友就不完成
                    tasks.push([task[0], e])
                }
                task = []
            } else if (e.text() == '已完成') {
                task = []
            }
        }
    }
    console.log('任务寻找结束')
    return tasks
}

function backToPage() {
    back()
    if (!text('剩余抽奖次数').findOne(8000)) {
        console.log('返回失败，重试')
        back()
        if (!text('剩余抽奖次数').findOne(8000)) {
            console.log('似乎未能返回')
            return false
        }
    }
    return true
}

// 进行抽奖活动
function doTask(task) {
    let tTitle = task[0]
    let tButton = task[1]
    console.log('进行', tTitle)
    tButton.click()
    if (tTitle.match(/签到/)) {
        console.log('签到完成')
        return true
    } else if (tTitle.match(/加购/)) {
        let itemFilter = textContains('!q70').filter(function (w) {
            // return w.bounds().width() == w.bounds().height() // 等宽高
            // return w.depth() >= 15
            let rect = w.bounds()
            return rect.left > 0 && rect.top <= device.height
        })

        if (!itemFilter.findOne(8000)) {
            console.log('未能找到加购商品')
            return false
        }
        console.log('查找商品')
        let items = itemFilter.find()
        if (items.empty() || items.length < 2) {
            console.log('查找商品失败')
            return false
        }
        for (let i = 0; i < 2; i++) {
            console.log('加购第' + (i+1) + '个商品')
            items[i].parent().parent().parent().child(1).child(2).click()
            sleep(2000)
        }
        console.log('加购完成')
        let t = items[0].parent().parent().parent().parent().parent()
        t.child(t.childCount() - 2).click() // 关闭
        return true
    } else if (tTitle.match(/会员|品牌页/)) {
        console.log('进行入会任务')
        return joinTask() && backToPage()
    } else {
        console.log('浏览任务，稍后返回')
        sleep(3000)
        return true && backToPage()
    }
}

// 抽奖
function openBox() {
    let anchor = text('剩余抽奖次数').findOne(8000)
    if (!anchor) {
        console.log('未能找到抽奖提示')
        return false
    }
    let count = anchor.parent().child(1)
    if (!parseInt(count)) {
        console.log('没有抽奖次数，返回')
        return true
    }
    console.log('抽奖ing，由于无法判断哪个盒子开了，所以点击每个盒子')
    let box = anchor.parent().parent().children()
    for (let i = 0; i < 6; i++) {
        console.log('打开第' + (i+1) + '个盒子')
        box[i].click()
        console.log('检测弹窗')
        let title = textContains('恭喜您').findOne(5000)
        if (title) {
            title = title.parent()
            title.child(title.childCount() - 2).click()
            sleep(1000)
        }
    }
    return true
}


let startCoin = null
let endCoin = null

// 全局try catch，应对无法显示报错
try {
    if (autoOpen) {
        openAndInto()
        console.log('等待活动页面加载')
        if (!findTextDescMatchesTimeout(/.*去使用奖励.*/, 8000)) {
            console.log('未能进入活动，请重新运行！')
            quit()
        }
    } else {
        alert('请立刻手动打开🐕东进入活动页面，并打开任务列表', '给你一分钟')
        console.log('请手动打开🐕东App进入活动页面，并打开任务列表')
        if (!findTextDescMatchesTimeout(/累计任务奖励/, 60000)) {
            console.log('未能进入活动，请重新运行！')
            quit()
        }
    }

    console.log('成功进入活动，准备进行任务')
    sleep(5000)

    try {
        console.log('获取初始金币数量')
        startCoin = getCoin()
        console.log('当前共有' + startCoin + '金币')
    } catch (err) {
        console.log('获取金币失败，跳过', err)
    }

    // 完成所有任务的循环
    while (true) {
        try {
            console.log('获取当前金币数量')
            endCoin = getCoin()
            console.log('当前共有' + endCoin + '金币')
        } catch (err) {
            console.log('获取金币失败，跳过', err)
        }

        console.log('打开抽奖页面')
        if (openPage()) {
            let tasks = findTasks()
            if (!tasks) {
                console.log('无法找到任务，可能是已经完成。退出。')
                console.log('有时候可能抽奖失败，自己点进抽奖页再看一看。')
                startCoin && endCoin && console.log('本次任务共获得' + (endCoin - startCoin) + '金币')
                quit()
            }
            for (let i = 0; i < tasks.length; i++) {
                if (tasks[i][0].match(/会员/)) {
                    continue
                }
                if (!doTask(tasks[i])) {
                    console.log('意外错误，退出脚本！')
                    quit()
                }
                sleep(5000)
            }
        } else {
            console.log('意外错误，退出脚本！')
            quit()
        }
        console.log('准备抽奖')
        if (!openBox()) {
            console.log('抽奖失败，退出')
            quit()
        }
        console.log('准备重新打开获取任务')
        sleep(2000)
        back()
        console.log('返回上一级')
        if (!findTextDescMatchesTimeout(/.*去使用奖励.*/, 8000)) {
            console.log('意外错误，退出脚本！')
            back()
            if (!findTextDescMatchesTimeout(/.*去使用奖励.*/, 8000)) {
                console.log('意外错误，退出脚本！')
                quit()
            }
        }
        console.log('任务完成，准备抽奖')
        console.log('准备进行下一次任务')
        sleep(2000)
    }
} catch (err) {
    device.cancelKeepingAwake()
    if (err.toString() != 'JavaException: com.stardust.autojs.runtime.exception.ScriptInterruptedException: null') {
        startCoin && console.log('本次任务开始时有' + startCoin + '金币')
        console.error(new Error().stack, err)
    }
    console.log("脚本执行完啦，感谢你的使用😄")
}