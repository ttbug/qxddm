/*************************************

项目名称：iTunes-系列解锁合集
更新日期：2025-04-08
脚本作者：@ddm1023
电报频道：https://t.me/ddm1023
使用声明：⚠️仅供参考，🈲转载与售卖！
使用说明：如果脚本无效，请先排除是否脚本冲突
特别说明：此脚本可能会导致App Store无法登录ID
解决方法：关[MITM][脚本][代理工具]方法选一即可

**************************************

[rewrite_local]
^https?:\/\/buy\.itunes\.apple\.com\/verifyReceipt$ url script-response-body https://raw.githubusercontent.com/ttbug/qxddm/main/iTunes.js

[mitm]
hostname = buy.itunes.apple.com

*************************************/
let ddm;
try {
  ddm = JSON.parse($response.body.match(/\{[\s\S]*\}/)[0]);
} catch {
  console.log("⚠️ 非法 JSON，跳过修改");
  $done({ body: $response.body });
  return;
}
const ua = $request.headers["User-Agent"] || $request.headers["user-agent"];
const bundle_id = ddm.receipt["bundle_id"] || ddm.receipt["Bundle_Id"];

const forbiddenApps = ['LivePhoto','com.risingcabbage.pro.camera'];
if (forbiddenApps.some(app => (ua && ua.includes(app)) || (bundle_id && bundle_id.includes(app))  || ($request.body && $request.body.includes(app)))) {
  console.log("⛔️检测到禁止 MITM 的 APP，脚本停止运行！");
  $done({});
}

const list = {
  'bazaart': { tp: 'timea', hx: 'hxpda', id: "Bazaart_Super_Three_Months_v4" }, //Bazaart百色特
  'com.polygitapp.polygit':{ cm: 'polygit',hx: 'hxpda', id: 'com.polygitapp.polygit.pro.yearly'},
  'PhotosPK': { cm: 'timeb', hx: 'hxpda', id: "indie.davidwang.PicPicks.membership.lifetime" },  //PicPicks-AI智能照片整理
  'com.digitalworkroom.noted': {cm: 'timea', hx: 'hxpda', id: "com.digitalworkroom.noted.plus.year", latest: "ddm1023"},
  'Presets': { cm: 'timea', hx: 'hxpda', id: "com.chromatech.chroma.yearlyAutoRenewable", latest: "ddm1023" },  //Presets:照片处理、图像编辑器
  'GoodTask': { cm: 'timeb', hx: 'hxpda', id: "com.hahainteractive.goodtask3.pro", latest: "ddm1023" },  //代办事项清单-GoodTask
  'com.hanchongzan.book': { cm: 'timeb', hx: 'hxpda', id: "com.hanchongzan.book.vip", latest: "ddm1023" }, //闪电记账
  'SoundLab': { cm: 'timeb', hx: 'hxpda', id: "8001", latest: "ddm1023" },  //合声-音乐制作
  'com.ideack.MagicAudio': { cm: 'timeb', hx: 'hxpdb', id: "MagicAudioPermanent", latest: "ddm1023" }, //音乐剪辑
  'DuChuangZhe': { cm: 'timea', hx: 'hxpda', id: "org.zrey.du.main", latest: "ddm1023" }, //独创者
  'FETreeVideoChange': { cm: 'timeb', hx: 'hxpda', id: "com.dj.videototext.forever", latest: "ddm1023" },  //视频转文字
  'FoodIdentificationTool': { cm: 'timeb', hx: 'hxpda', id: "20002", latest: "ddm1023" },  //剂查查
  'com.qingcheng.seal.Seal': { cm: 'timeb', hx: 'hxpda', id: "com.qingcheng.seal.Seal.premium.forever", latest: "ddm1023" },  //印章制作
  'com.geekapp.VoiceTranslation': { cm: 'timeb', hx: 'hxpda', id: "VoiceTranslatorPerpetual", latest: "ddm1023" },  //出国翻译官
  'com.idealityapp.VideoEditing': { cm: 'timeb', hx: 'hxpda', id: "MagicVideo_Vip_Permanent", latest: "ddm1023" },  //魔影-视频剪辑
  'YinzhangMaster': { cm: 'timeb', hx: 'hxpda', id: "com.xiaoqi.seal.forever", latest: "ddm1023" },  //印章大师
  'com.cuilingshi.flipclock': { cm: 'timeb', hx: 'hxpda', id: "FlipClockProVersion", latest: "ddm1023" },  //翻页时钟
  'com.maine.aifill': { cm: 'timeb', hx: 'hxpda', id: "com.maine.aifill.unlimited", latest: "ddm1023" },  //AI FILL-智能填充.换衣/换背景
  'DeviceFinder': { cm: 'timeb', hx: 'hxpda', id: "com.wonderfind.lifetime", latest: "ddm1023" },  //Wonderfind-设备查找
  'Graphionica': { cm: 'timea', hx: 'hxpda', id: "premium_year", latest: "ddm1023" },  //Graphionica
  'AIAssistant': { cm: 'timea', hx: 'hxpda', id: "AIchat_1w_7.99_trial", latest: "ddm1023" },  //AIAssistant
  'MonitorPlus': { cm: 'timeb', hx: 'hxpda', id: "com.unhonin.MonitorPlus.proversion", latest: "ddm1023" },  //Monitor+
  'MessageHold': { cm: 'timeb', hx: 'hxpda', id: "com.messagehold.forever", latest: "ddm1023" },  //拦截盾
  'co.vulcanlabs': { cm: 'timea', hx: 'hxpda', id: lifetimeid, latest: "ddm1023" },  //vulcanlabs合集
  'Guitar%20Gravitas': { cm: 'timea', hx: 'hxpda', id: "GuitarGravitasChordsScalesArpeggiosLessons", latest: "ddm1023" },  //GuitarGravitas
  'com.eleven.chatgpt': { cm: 'timea', hx: 'hxpda', id: "com.chatgpt.yearly", latest: "ddm1023" },  //ChatAI
  'com.casttv.remotetv': { cm: 'timeb', hx: 'hxpda', id: "liftetime2", latest: "ddm1023" }, //TVRemote电视遥控器
  'WallpaperWidget': { cm: 'timea', hx: 'hxpda', id: "com.widget.theme.yearly.3dayfree", latest: "ddm1023" }, //壁纸主题(需试用)
  'ProREC': { cm: 'timea', hx: 'hxpda', id: "ProAudioCamera_Annual", latest: "ddm1023" }, //ProREC-相机
  'TypeOn%20Keyboard': { cm: 'timeb', hx: 'hxpda', id: "com.hanchongzan.book.vip", latest: "ddm1023" }, //TypeOn
  'PhotoCollagePro': { cm: 'timeb', hx: 'hxpda', id: "PHOTABLE_PREMIUM", latest: "ddm1023" }, //Photable-腹肌P图神器
  'com.alphamobiletech.bodyApp': { cm: 'timeb', hx: 'hxpda', id: "Bodyapp_Forever", latest: "ddm1023" }, //Bodyapp-身材修图软件
  'com.alphamobiletech.facey': { cm: 'timeb', hx: 'hxpda', id: "Facey_Forever", latest: "ddm1023" }, //Facey-专业彩妆P图神器
  'Packet': { cm: 'timeb', hx: 'hxpda', id: "com.aaaalab.nepacket.iap.full", latest: "ddm1023" }, //HTTPS抓包
  'AllMyBatteries': { cm: 'timeb', hx: 'hxpda', id: "AllMyBatteries_Ultimate", latest: "ddm1023" }, //AllMyBatteries-电池管家
  'VDIT': { cm: 'timeb', hx: 'hxpda', id: "me.imgbase.videoday.profeaturesLifetime", latest: "ddm1023" }, //VDIT-视频转换
  'CodeSnippet': { cm: 'timea', hx: 'hxpda', id: "it.beatcode.codesnippetpro.annualSubscription", latest: "ddm1023" }, //CodeSnippet
  'darkWeb': { cm: 'timea', hx: 'hxpda', id: "dforce_unlock_all_functions", latest: "ddm1023" }, //DForce-Safari扩展
  'BookReader': { cm: 'timea', hx: 'hxpda', id: "com.reader.1year", latest: "ddm1023" }, //阅读器-小说阅读器
  'BeatStation': { cm: 'timea', hx: 'hxpda', id: "BS_Pro_Yearly", latest: "ddm1023" }, //BeatStation-节奏工作站
  'FastPlayer': { cm: 'timea', hx: 'hxpda', id: "VideoPlayer_ProVersion", latest: "ddm1023" }, //万能播放器
  'SimpleNotation': { cm: 'timeb', hx: 'hxpda', id: "com.xinlin.notation.once", latest: "ddm1023" }, //简谱大师
  'ChordMaster': { cm: 'timeb', hx: 'hxpda', id: "com.chordMaster.once", latest: "ddm1023" }, //MusicTotor-识谱大师
  'Xfuse': { cm: 'timeb', hx: 'hxpda', id: "com.xfuse.ProVision", latest: "ddm1023" }, //磁力宅播放器
  'com.BertonYc.ScannerOCR': { cm: 'timeb', hx: 'hxpda', id: "Scanner_Subscibe_Permanent", latest: "ddm1023" }, //万能扫描王
  'HRV': { hx: 'hxpdc', id: "com.stress.test.record.yearly", latest: "ddm1023" },  //解压小橘子(需试用)
  'iVCam': { cm: 'timeb', hx: 'hxpda', id: "ivcam.full", latest: "ddm1023" },//iVCam-电脑摄像头
  'RBrowser': { cm: 'timea', hx: 'hxpda', id: "com.mm.RBroswer.product11", latest: "ddm1023" }, //R浏览器(需试用)
  'Filterra': { cm: 'timeb', hx: 'hxpda', id: "com.filterra.wtonetimepurchase", latest: "ddm1023" },//Filterra-照片编辑器
  'MOLDIV': { cm: 'timeb', hx: 'hxpda', id: "com.jellybus.Moldiv.IAP.PRO7999", latest: "ddm1023" },//MOLDIV-视频/照片编辑
  'PICSPLAY': { cm: 'timea', hx: 'hxpda', id: "com.jellybus.PicsPlay2.IAP.PRO5999", latest: "ddm1023" },//PICSPLAY-照片编辑
  'Rookie': { cm: 'timea', hx: 'hxpda', id: "com.jellybus.Rookie.IAP.PRO5999", latest: "ddm1023" },//RKCAM-照片编辑
  'MoneyWiz': { cm: 'timea', hx: 'hxpda', id: "com.moneywiz.personalfinance.1year", latest: "ddm1023" }, //MoneyWiz-个人财务
  'qxzs': { cm: 'timeb', hx: 'hxpda', id: "yongjiu", latest: "ddm1023" },//心率广播
  'Overdrop': { cm: 'timeb', hx: 'hxpda', id: "com.weather.overdrop.forever", latest: "ddm1023" }, //Overdrop-天气预报
  'Boom': { cm: 'timeb', hx: 'hxpda', id: "com.globaldelight.iBoom.LifetimeDiscountPack", latest: "ddm1023" }, //Boom-感受音乐
  'PDFReaderPro%20Free': { cm: 'timeb', hx: 'hxpda', id: "com.pdfreaderpro.free.member.all_access_pack_permanent_license.001", latest: "ddm1023" }, //PDFReaderProFree
  'VideoHelper': { cm: 'timeb', hx: 'hxpda', id: "vip_service", latest: "ddm1023" }, //媒关系
  'Digital%20Planner': { cm: 'timea', hx: 'hxpda', id: "com.softwings.DigitalPlanner.1year", latest: "ddm1023" }, //电子手帐
  'SuperMandarin': { cm: 'timea', hx: 'hxpda', id: "pth_vip_year", latest: "ddm1023" }, //普通话水平测试
  'SuperQuestion': { cm: 'timea', hx: 'hxpda', id: "qtzs_vip_year", latest: "ddm1023" }, //真题全刷
  'SuperElves': { cm: 'timeb', hx: 'hxpda', id: "com.SuperElves.Answer.Forever", latest: "ddm1023" }, //答案精灵
  'SuperDriving': { cm: 'timeb', hx: 'hxpda', id: "jiakao_vip_forever", latest: "ddm1023" }, //驾考学典
  'Pollykann': { cm: 'timeb', hx: 'hxpda', id: "vip.forever.pollykann", latest: "ddm1023" }, //小鹦看看
  'JCCalendar': { cm: 'timeb', hx: 'hxpda', id: "com.sjc.calendar.vip.lifelong", latest: "ddm1023" }, //简约日历
  'com.yanxia.ChsMedical': { cm: 'timeb', hx: 'hxpda', id: "VIPUser", latest: "ddm1023" }, //中医精华
  'SuperPointer': { cm: 'timeb', hx: 'hxpda', id: "com.SuperPointer.Location.Forever", latest: "ddm1023" }, //海拔指南针
  'SnakeReader': { cm: 'timeb', hx: 'hxpda', id: "com.lyran.snakescanner.premium18", latest: "ddm1023" }, //开卷阅读
  'FourthPPT': { cm: 'timeb', hx: 'hxpda', id: "com.FourthPPT.Mobile.Forever", latest: "ddm1023" }, //PPT制作软件
  'OneExtractor': { cm: 'timeb', hx: 'hxpda', id: "com.OneExtractor.Video.Forever", latest: "ddm1023" }, //视频提取器
  'com.Colin.Colors': { cm: 'timea', hx: 'hxpda', id: "com.colin.colors.annualVIP", latest: "ddm1023" }, //搜图
  'PhotosSorter': { cm: 'timeb', hx: 'hxpda', id: "sorter.pro.ipa", latest: "ddm1023" }, //Sorter-相册整理
  'intolive': { cm: 'timea', hx: 'hxpda', id: "me.imgbase.intolive.proSubYearly", latest: "ddm1023" }, //intolive-实况壁纸制作器
  'MyAlbum': { cm: 'timeb', hx: 'hxpda', id: "com.colin.myalbum.isUpgradeVip", latest: "ddm1023" }, //Cleaner-照片管理
  'VideoEditor': { cm: 'timeb', hx: 'hxpda', id: "com.god.videohand.alwaysowner", latest: "ddm1023" }, //VideoShot
  'PhotoMovie': { cm: 'timea', hx: 'hxpda', id: "com.mediaeditor.photomovie.year", latest: "ddm1023" }, //PhotoMovie-照片视频
  'ShotOn': { cm: 'timeb', hx: 'hxpda', id: "com.colin.shoton.forevervip", latest: "ddm1023" }, //ShotOn
  'PhimCiaj': { cm: 'timeb', hx: 'hxpda', id: "com.jiancent.calligraphymaster.lifetime", latest: "ddm1023" }, //练字大师
  'TimeCut': { cm: 'timea', hx: 'hxpda', id: "com.floatcamellia.hfrslowmotion.forevervip", latest: "ddm1023" },  //TimeCut
  'com.floatcamellia.motiok': { cm: 'timea', hx: 'hxpda', id: "com.floatcamellia.motiok.vipforever", latest: "ddm1023" },  //Hype_Text-AE特效片制作
  'POPOLockScreenWidgetable': { cm: 'timea', hx: 'hxpda', id: "com.widget.fightenegery.yearly", latest: "ddm1023" },  //多彩壁纸
  'GreetingScanner': { cm: 'timea', hx: 'hxpda', id: "com.alphaplus.greetingscaner.w.b", latest: "ddm1023" },  //扫描识别王
  'FancyCamPlus': { cm: 'timea', hx: 'hxpda', id: "com.alphaplus.fancycam.year.198", latest: "ddm1023" },  //悦颜相机
  'Again': { cm: 'timeb', hx: 'hxpda', id: "com.owen.again.profession", latest: "ddm1023" },  //Again-稍后阅读器
  'remotelg': { cm: 'timeb', hx: 'hxpda', id: "com.gqp.remotelg.lifetime", latest: "ddm1023" },  //UniversalRemoteTV+ 遥控器
  'Notebook': { cm: 'timea', hx: 'hxpda', id: "com.zoho.notebook.ios.personal.yearly", latest: "ddm1023" },  //Notebook
  'com.damon.dubbing': { cm: 'timea', hx: 'hxpda', id: "com.damon.dubbing.vip12", latest: "ddm1023" },  //有声英语绘本
  'ZHUBEN': { cm: 'timea', hx: 'hxpda', id: "com.xiaoyu.yue", latest: "ddm1023" },  //有声英语绘本
  'XIAOTangHomeParadise': { cm: 'timea', hx: 'hxpda', id: "com.yuee.mo2", latest: "ddm1023" },  //鸿海幼儿启蒙
  'film': { cm: 'timea', hx: 'hxpda', id: "pro_auto_subscribe_year_ovs", latest: "ddm1023" },  //胶卷相机
  'Muza': { cm: 'timea', hx: 'hxpda', id: "com.appmuza.premium_year", latest: "ddm1023" },  //Muza-修图APP
  'StandbyWidget': { cm: 'timed', hx: 'hxpda', id: "com.standby.idream.year.68", ids: "standbyus.nonconsume.missingyou", latest: "ddm1023" },  //StandBy_Us-情侣定位
  'Mango6Minute': { cm: 'timea', hx: 'hxpda', id: "576170870", latest: "ddm1023" },  //6分钟英语
  'Photo%20Cutout': { cm: 'timea', hx: 'hxpda', id: "com.icepine.allyear", latest: "ddm1023" },  //轻松扣图
  'cleanPhone': { cm: 'timea', hx: 'hxpda', id: "com.clean.year", latest: "ddm1023" },  //爱机清理
  'ppt': { cm: 'timea', hx: 'hxpda', id: "com.palmmob.pptios.yearly", latest: "ddm1023" },  //手机PPT制作
  'WasteCat': { cm: 'timeb', hx: 'hxpda', id: "dev.sanjin.WasteCat.PermanentVip", latest: "ddm1023" },  //垃圾贪吃猫
  'MeowTalk': { cm: 'timea', hx: 'hxpda', id: "meowtalk.month.basic.autorenewable.subscription", latest: "ddm1023" },  //喵说
  'habitdot': { cm: 'timeb', hx: 'hxpda', id: "habitdots_pro_forever", latest: "ddm1023" },  //习惯点点
  'stretchworkout': { cm: 'timea', hx: 'hxpda', id: "com.abishkking.premiumYearStretch", latest: "ddm1023" },  //拉伸运动
  'Planist': { cm: 'timed', hx: 'hxpda', id: "org.zrey.planist.main", ids: "org.zrey.planist.lifetime", latest: "ddm1023" },  //Planist-计划和清单
  'com.uzstudio.avenuecast.ios': { cm: 'timeb', hx: 'hxpda', id: "1001", latest: "ddm1023" },  //凡视知音
  'CongZhenBaZi': { cm: 'timeb', hx: 'hxpda', id: "vip_forever_78", latest: "ddm1023" },  //八字排盘-从真版
  'CongZhenQiMen': { cm: 'timea', hx: 'hxpda', id: "cn.congzhen.CongZhenQiMen.yearlyplan", latest: "ddm1023" },  //奇门遁甲
  'ProFit': { cm: 'timea', hx: 'hxpda', id: "com.maxty.gofitness.yearlyplan", latest: "ddm1023" },  //ProFit锻炼计划
  'FitnessBodybuildingVGFIT': { cm: 'timea', hx: 'hxpda', id: "com.vgfit.fitnessvip.yearly", latest: "ddm1023" },  //fitnessvip
  'Water%20Reminder': { cm: 'timea', hx: 'hxpda', id: "com.vgfit.premiumtracker.year", latest: "ddm1023" },  //WaterReminder水提醒
  '%E7%91%9C%E4%BC%BD': { cm: 'timea', hx: 'hxpda', id: "com.vgfit.yoga.yearly", latest: "ddm1023" },  //瑜伽
  'GPSMaker': { cm: 'timea', hx: 'hxpda', id: "theodolite_vip_year", latest: "ddm1023" },  //指南针定位
  'wrongbook': { cm: 'timea', hx: 'hxpda', id: "com.palmmob.wrongbookios.yearly", latest: "ddm1023" },  //错题宝
  'excel': { cm: 'timea', hx: 'hxpda', id: "com.gamawh.excelerios.yearly", latest: "ddm1023" },  //办公文档
  'Future%20Baby': { cm: 'timea', hx: 'hxpda', id: "com.nilu.faceseer.yearly", latest: "ddm1023" },  //宝宝长相预测
  'Smoke': { cm: 'timea', hx: 'hxpda', id: "smoke19870727", latest: "ddm1023" },  //今日香烟
  'AppAlarmIOS': { cm: 'timea', hx: 'hxpda', id: "alarm.me.vip.year.tier1", latest: "ddm1023" },  //Me+
  'Tinglee': { cm: 'timea', hx: 'hxpdb', id: "vip.forever.tinglee", latest: "ddm1023" },  //英语听听
  'NoteKeys': { cm: 'timea', hx: 'hxpda', id: "notekeys_access_weekly", latest: "ddm1023" },  //五线谱
  'SheetMusicPro': { cm: 'timea', hx: 'hxpda', id: "sheetmusicpro.yearwithtrial", latest: "ddm1023" },  //乐谱吧
  'ProtractorEdge': { cm: 'timea', hx: 'hxpda', id: "ProtracatorEdge.PremiumAccess", latest: "ddm1023" },  //量角器
  'Piano%20Plus': { cm: 'timea', hx: 'hxpda', id: "kn_access_weekly", latest: "ddm1023" },  //Piano Plus
  'Notation%20Pad': { cm: 'timea', hx: 'hxpda', id: "np_access_weekly", latest: "ddm1023" },  //Notation Pad
  'Guitar%20Notation': { cm: 'timea', hx: 'hxpda', id: "gn_access_weekly", latest: "ddm1023" },  //Guitar Notation
  'Piano%20Fantasy': { cm: 'timea', hx: 'hxpda', id: "com.lotuz.PianoFantasy.weekwithtrail", latest: "ddm1023" },  //钢琴幻想
  'Piano%20Rush': { cm: 'timea', hx: 'hxpda', id: "com.lotuz.PianoPro.weekwithtrail", latest: "ddm1023" },  //钢琴大师
  'com.richads.saucyart': { cm: 'timea', hx: 'hxpda', id: "com.richads.saucyart.sub.quarterly_29.99", latest: "ddm1023" },  //Perky
  'SurveyorPro': { cm: 'timea', hx: 'hxpda', id: "com.celiangyuan.SurveyorPro.OneYear", latest: "ddm1023" },  //测量员Pro
  'com.ydatong.dingdone': { cm: 'timeb', hx: 'hxpda', id: "com.ydatong.dingdone.vip.forever", latest: "ddm1023" },  //叮当代办
  'Dial': { cm: 'timea', hx: 'hxpda', id: "2104", latest: "ddm1023" },  //T9拨号
  'qxwp%20copy': { cm: 'timed', hx: 'hxpda', id: "com.chowjoe.wp2free.year.pro", ids: "com.chowjoe.wp2free.coin.70", latest: "ddm1023" },  //壁纸
  'LingLongShouZ': { cm: 'timea', hx: 'hxpda', id: "zhenwushouzhangQuarterlyPlus", latest: "ddm1023" },  //Cute手帐软件
  'MediaEditor': { cm: 'timeb', hx: 'hxpda', id: "alwaysowner", latest: "ddm1023" },  //剪影(需试用)
  'UniversTranslate': { cm: 'timea', hx: 'hxpda', id: "com.univers.translator.tool.year", latest: "ddm1023" },  //翻译官(需试用)
  'com.gostraight.smallAccountBook': { cm: 'timeb', hx: 'hxpda', id: "ForeverVIPPayment", latest: "ddm1023" },  //iCost记账(需要购买)
  'ZJTBiaoGe': { cm: 'timea', hx: 'hxpda', id: "zhangjt.biaoge.monthvip", latest: "ddm1023" },  //表格手机版
  'MiniMouse': { cm: 'timea', hx: 'hxpda', id: "minimouse_vip_1year", latest: "ddm1023" },  //MiniMouse
  'Paste%20Keyboard': { cm: 'timea', hx: 'hxpda', id: "com.keyboard.1yetr", latest: "ddm1023" },  //复制和粘贴键盘
  'EWA': { cm: 'timea', hx: 'hxpda', id: "com.ewa.renewable.subscription.year8", latest: "ddm1023" },  //EWA-学习外语
  'BuBuSZ': { cm: 'timea', hx: 'hxpda', id: "quaVersion", latest: "ddm1023" },  //BuBu手帐
  'CapyMood': { cm: 'timea', hx: 'hxpda', id: "com.paha.CapyMood.year", latest: "ddm1023" },  //CapyMood
  'xyz.iofree.lifenotes': { cm: 'timea', hx: 'hxpda', id: "xyz.iofree.lifelog.pro.yearly", latest: "ddm1023" },  //人生笔记(需试用)
  'com.icandiapps.nightsky': { cm: 'timea', hx: 'hxpda', id: "com.icandiapps.ns4.annual", latest: "ddm1023" },  //星空
  'Wallpapers': { cm: 'timea', hx: 'hxpda', id: "wallpaperworld.subscription.yearly.12.notrial", latest: "ddm1023" },  //Wallpaper Tree壁纸
  'com.yumiteam.Kuki.ID': { cm: 'timea', hx: 'hxpda', id: "com.yumiteam.Kuki.ID.2", latest: "ddm1023" },  //PicsLeap-美飞
  'com.quangtm193.picpro': { cm: 'timea', hx: 'hxpda', id: "com.quangtm193.picpro1year", latest: "ddm1023" },  //PicPro-人工智能照片编辑器
  'Storybeat': { cm: 'timea', hx: 'hxpda', id: "yearly_1", latest: "ddm1023" },  //Storybeat
  'SmartGym': { cm: 'timea', hx: 'hxpda', id: "com.smartgymapp.smartgym.premiumuserworkoutsyearly", latest: "ddm1023" },  //SmartGym
  'Ptime': { cm: 'timea', hx: 'hxpda', id: "com.subscribe.pro.year", latest: "ddm1023" },  //Ptime-拼图(需试用)
  'Prookie': { cm: 'timea', hx: 'hxpda', id: "prookie.month.withtrial.0615", latest: "ddm1023" },  //AI灵绘
  'BodyTune': { cm: 'timea', hx: 'hxpda', id: "Bodypro1", latest: "ddm1023" },  //BodyTune-瘦身相机
  'killer.sudoku.free.brain.puzzle': { cm: 'timea', hx: 'hxpda', id: "ks.i.iap.premium", latest: "ddm1023" },  //杀手数独
  'sudoku.puzzle.free.game.brain': { cm: 'timea', hx: 'hxpda', id: "sudoku.i.sub.vvip.p1y", latest: "ddm1023" },  //数独
  'One%20Markdown': { cm: 'timeb', hx: 'hxpda', id: "10012", latest: "ddm1023" },  //One Markdown
  'MWeb%20iOS': { cm: 'timeb', hx: 'hxpda', id: "10001", latest: "ddm1023" },  //MWeb-编辑器/笔记/发布
  'NYMF': { cm: 'timea', hx: 'hxpda', id: "com.nymf.app.premium_year", latest: "ddm1023" },  //Nymf艺术照片
  'com.lockwidt.cn': { cm: 'timea', hx: 'hxpda', id: "com.lockwidt.cn.member", latest: "ddm1023" },  //壁纸16
  'Utsuki': { cm: 'timea', hx: 'hxpda', id: "KameePro", latest: "ddm1023" },  //梦见账本
  'Processing': { cm: 'timeb', hx: 'hxpda', id: "wtf.riedel.processing.lifetime", latest: "ddm1023" },  //Processing-软件开发工具
  'one%20sec': { cm: 'timea', hx: 'hxpda', id: "wtf.riedel.one_sec.pro.annual.individual", latest: "ddm1023" },  //one sec-番茄钟
  'com.skysoft.pencilsketch': { cm: 'timea', hx: 'hxpda', id: "com.skysoft.pencilsketch.subscription.yearly", latest: "ddm1023" },  //铅笔画(需试用)
  'com.instagridpost.rsigp': { cm: 'timea', hx: 'hxpda', id: "com.GridPost.oneyearplus", latest: "ddm1023" },  //九宫格切图
  'com.skysoft.picsqueen': { cm: 'timea', hx: 'hxpda', id: "com.skysoft.picsqueen.subscription.yearly", latest: "ddm1023" },  //PicsQueen-AI绘图
  'com.skysoft.removalfree': { cm: 'timea', hx: 'hxpda', id: "com.skysoft.removalfree.discount.unlimitedaccess", latest: "ddm1023" },  //神奇消除笔-图片消除
  'com.skysoft.facecartoon': { cm: 'timea', hx: 'hxpda', id: "com.skysoft.facecartoon.subscription.yearly", latest: "ddm1023" },  //卡通头像
  'Jennie%20AI': { cm: 'timea', hx: 'hxpda', id: "com.skysoft.text2img.vip.yearly", latest: "ddm1023" },  //Jennie AI制作图片
  'MGhostLens': { cm: 'timea', hx: 'hxpda', id: "com.ghostlens.premium1month", latest: "ddm1023" },  //魔鬼相机
  'Luminous': { cm: 'timea', hx: 'hxpda', id: "com.spacemushrooms.weekly", latest: "ddm1023" },  //光影修图
  'RitmoVideo': { cm: 'timea', hx: 'hxpda', id: "com.zhk.hidebox.yearly", latest: "ddm1023" },  //RitmoVideo
  'PerfectImage': { cm: 'timea', hx: 'hxpda', id: "Perfect_Image_VIP_Yearly", latest: "ddm1023" },  //完美影像(需试用)
  'moment': { cm: 'timea', hx: 'hxpda', id: "PYJMoment2", latest: "ddm1023" },  //片羽集(需试用)
  'Planner%20Plus': { cm: 'timea', hx: 'hxpda', id: "com.btgs.plannerfree.yearly", latest: "ddm1023" },  //PlannerPro-日程安排
  'HiddenBox': { cm: 'timec', hx: 'hxpdb', version: "1" },//我的书橱
  'Synthesizer': { cm: 'timea', hx: 'hxpda', id: "com.qingxiu.synthesizer.mon", latest: "ddm1023" },  //语音合成
  'ContractMaster': { cm: 'timea', hx: 'hxpda', id: "com.qingxiu.contracts.monthly", latest: "ddm1023" },  //印象全能王
  'MyDiary': { cm: 'timea', hx: 'hxpda', id: "diary.yearly.vip.1029", latest: "ddm1023" },  //我的日记
  'Translator': { cm: 'timea', hx: 'hxpda', id: "trans_sub_week", latest: "ddm1023" },  //翻译家
  'ToDoList': { cm: 'timea', hx: 'hxpda', id: "todolist.subscription.yearly", latest: "ddm1023" },  //ToDoList(需试用)
  'Idea': { cm: 'timea', hx: 'hxpda', id: "top.ideaapp.ideaiOS.membership.oneyear", latest: "ddm1023" },  //灵感(需试用)
  'ZeroTuImg': { cm: 'timea', hx: 'hxpda', id: "ZeroTuImgPlus", latest: "ddm1023" },  //Zero壁纸
  'com.traveltao.ExchangeAssistant': { cm: 'timea', hx: 'hxpda', id: "lxbyplus", latest: "ddm1023" },  //极简汇率(需试用)
  'ServerKit': { cm: 'timea', hx: 'hxpda', id: "com.serverkit.subscription.year.a", latest: "ddm1023" },  //服务器助手
  'RawPlus': { cm: 'timea', hx: 'hxpda', id: "com.dynamicappdesign.rawplus.yearlysubscription", latest: "ddm1023" },  //Raw相机
  'Mindkit': { cm: 'timeb', hx: 'hxpda', id: "mindkit_permanently", latest: "ddm1023" },  //Mindkit
  'Noted': { cm: 'timeb', hx: 'hxpda', id: "com.digitalworkroom.noted.plus.lifetime", latest: "ddm1023" },  //Noted-录音笔记软件
  'BingQiTools': { cm: 'timea', hx: 'hxpda', id: "bingqi_e2", latest: "ddm1023" },  //猫狗翻译
  'AnyDown': { cm: 'timeb', hx: 'hxpda', id: "com.xiaoqi.down.forever", latest: "ddm1023" },  //AnyDown-下载神器
  'Reader': { cm: 'timeb', hx: 'hxpda', id: "com.xiaoqi.reader.forever", latest: "ddm1023" },  //爱阅读-TXT阅读器
  'Nutrilio': { cm: 'timea', hx: 'hxpda', id: "net.nutrilio.one_year_plus", latest: "ddm1023" },  //Nutrilio
  'AIHeader': { cm: 'timea', hx: 'hxpda', id: "com.ai.avatar.maker.month.3dayfree", latest: "ddm1023" },  //AI头像馆
  'MoodTracker': { cm: 'timeb', hx: 'hxpda', id: "co.vulcanlabs.moodtracker.lifetime2", latest: "ddm1023" },  //ChatSmith(美区)
  'YSBrowser': { cm: 'timeb', hx: 'hxpda', id: "com.ys.pro", latest: "ddm1023" },  //亚瑟浏览器
  'org.zrey.metion': { cm: 'timed', hx: 'hxpda', id: "org.zrey.metion.pro", ids: "org.zrey.metion.main", latest: "ddm1023" },  //Metion-基础+Pro
  'ZenJournal': { cm: 'timea', hx: 'hxpda', id: "zen_pro", latest: "ddm1023" },  //禅记
  'com.visualmidi.app.perfectpiano.Perfect-Piano': { cm: 'timea', hx: 'hxpda', id: "auto_renew_monthly_subscription", latest: "ddm1023" },  //完美钢琴
  'vibee': { cm: 'timea', hx: 'hxpda', id: "com.vibee.year.bigchampagne", latest: "ddm1023" },  //vibee-氛围歌单小组件
  'com.photoslab.ai.writerassistant': { cm: 'timea', hx: 'hxpda', id: "com.photoslab.ai.writerassistant.year", latest: "ddm1023" },  //Smart AI
  'WaterMaskCamera': { cm: 'timea', hx: 'hxpda', id: "com.camera.watermark.yearly.3dayfree", latest: "ddm1023" },  //徕卡水印相机
  'com.SingingFish.SudokuGame': { cm: 'timea', hx: 'hxpda', id: "com.singingfish.sudokugame.year", latest: "ddm1023" },  //数独
  'HandNote': { cm: 'timeb', hx: 'hxpda', id: "permanent_membership", latest: "ddm1023" },  //千本笔记
  'Kilonotes': { cm: 'timea', hx: 'hxpda', id: "kipa_kilonotes_quarter_subscription", latest: "ddm1023" },  //千本笔记
  'YiJianKouTu': { cm: 'timea', hx: 'hxpda', id: "XiChaoYiJianKouTuPlus", latest: "ddm1023" },  //一键抠图
  'Wext': { cm: 'timeb', hx: 'hxpda', id: "com.lmf.wext.life", latest: "ddm1023" },  //万源阅读
  'xTerminal': { cm: 'timea', hx: 'hxpda', id: "xterminal.pro2", latest: "ddm1023" },  //xTerminal
  'Fotoz': { cm: 'timeb', hx: 'hxpda', id: "com.kiddy.fotoz.ipa.pro", latest: "ddm1023" },  //Fotoz - 图片一键下载
  'TheLastFilm': { cm: 'timea', hx: 'hxpda', id: "Filmroll_Pro_1Year", latest: "ddm1023" },  //最后一卷胶片(需订阅一次)
  'io.sumi.GridDiary2': { cm: 'timea', hx: 'hxpda', id: "io.sumi.GridDiary.pro.annually", latest: "ddm1023" },  //格志
  'com.leapfitness.fasting': { cm: 'timea', hx: 'hxpda', id: "com.leapfitness.fasting.oneyear1", latest: "ddm1023" },  //168轻断食
  'WidgetBox': { cm: 'timeb', hx: 'hxpda', id: "widgetlab001", latest: "ddm1023" },  //小组件盒子
  'com.chenxi.shanniankapian': { cm: 'timea', hx: 'hxpda', id: "com.chenxi.shannian.superNian", latest: "ddm1023" },  //闪念
  'com.risingcabbage.pro.camera': { cm: 'timea', hx: 'hxpda', id: "com.risingcabbage.pro.camera.yearlysubscription", latest: "ddm1023" },  //ReLens相机
  '%E5%BD%95%E9%9F%B3%E4%B8%93%E4%B8%9A%E7%89%88': { cm: 'timea', hx: 'hxpda', id: "com.winat.recording.pro.yearly", latest: "ddm1023" },  //录音专业版
  'PictureScanner': { cm: 'timea', hx: 'hxpda', id: "om.picturescanner.tool.year", latest: "ddm1023" },  //扫描王
  'com.iuuapp.audiomaker': { cm: 'timed', hx: 'hxpda', id: "com.iuuapp.audiomaker.cloud.year", ids: "com.iuuapp.audiomaker.removeads", latest: "ddm1023" },  //音频剪辑
  'com.biggerlens.photoretouch': { cm: 'timeb', hx: 'hxpda', id: "com.photoretouch.SVIP", latest: "ddm1023" },  //PhotoRetouch消除笔P图
  'com.macpaw.iosgemini': { cm: 'timea', hx: 'hxpda', id: "com.macpaw.iosgemini.month.trial", latest: "ddm1023" },  //GeminiPhotos
  'com.mematom.ios': { cm: 'timea', hx: 'hxpda', id: "MMYear", latest: "ddm1023" },  //年轮3
  'com.LuoWei.aDiary': { cm: 'timea', hx: 'hxpda', id: "com.LuoWei.aDiary.yearly0", latest: "ddm1023" },  //aDiary-待办日记本
  'com.zerone.hidesktop': { cm: 'timeb', hx: 'hxpda', id: "com.zerone.hidesktop.forever", latest: "ddm1023" },  //iScreen-桌面小组件主题美化
  'com.readdle.ReaddleDocsIPad': { cm: 'timea', hx: 'hxpda', id: "com.readdle.ReaddleDocsIPad.subscription.month10_allusers", latest: "ddm1023" },  //Documents
  'com.1ps.lovetalk': { cm: 'timea', hx: 'hxpda', id: "com.1ps.lovetalk.normal.weekly", latest: "ddm1023" },  //高级恋爱话术
  'com.floatcamellia.prettyup': { cm: 'timeb', hx: 'hxpda', id: "com.floatcamellia.prettyup.onetimepurchase", latest: "ddm1023" },  //PrettyUp视频P图
  'DoMemo': { cm: 'timea', hx: 'hxpda', id: "org.zrey.fastnote.lifetime", latest: "ddm1023" },  //DoMemo-笔记和备忘录
  'CostMemo': { cm: 'timea', hx: 'hxpda', id: "org.zrey.money.lifetime", latest: "ddm1023" },  //CostMemo-生活记账本
  'com.yengshine.webrecorder': { cm: 'timea', hx: 'hxpda', id: "com.yengshine.webrecorder.yearly", latest: "ddm1023" },  //VlogStar-视频编辑器
  'org.skydomain.foodcamera': { cm: 'timea', hx: 'hxpda', id: "org.skydomain.foodcamera.yearly", latest: "ddm1023" },  //Koloro-滤镜君
  'com.yengshine.proccd': { cm: 'timea', hx: 'hxpda', id: "com.yengshine.proccd.yearly", latest: "ddm1023" },  //ProCCD相机
  'com.palmmob.pdfios': { cm: 'timea', hx: 'hxpda', id: "com.palmmob.pdfios.168", latest: "ddm1023" },  //图片PDF转换器
  'com.palmmob.scanner2ios': { cm: 'timea', hx: 'hxpda', id: "com.palmmob.scanner2ios.396", latest: "ddm1023" },  //文字扫描
  'com.palmmob.officeios': { cm: 'timea', hx: 'hxpda', id: "com.palmmob.officeios.188", latest: "ddm1023" },  //文档表格编辑
  'com.palmmob.recorder': { cm: 'timea', hx: 'hxpda', id: "com.palmmob.recorder.198", latest: "ddm1023" },  //录音转文字
  'com.7color.newclean': { cm: 'timea', hx: 'hxpda', id: "com.cleaner.salesyear", latest: "ddm1023" },  //手机清理
  'com.ziheng.OneBox': { cm: 'timeb', hx: 'hxpda', id: "com.ziheng.OneBox", latest: "ddm1023" },  //Pandora管理订阅
  '%E6%96%87%E4%BB%B6%E7%AE%A1%E7%90%86%E5%99%A8': { cm: 'timea', hx: 'hxpda', id: "com.mobislet.files.yearly", latest: "ddm1023" },  //文件管理器
  'ZIP%E5%8E%8B%E7%BC%A9%E8%A7%A3%E5%8E%8B%E7%BC%A9%E5%B7%A5%E5%85%B7': { cm: 'timea', hx: 'hxpda', id: "com.mobislet.zipfile.yearly", latest: "ddm1023" },  //ZIP压缩解压
  'TPTeleprompter': { cm: 'timea', hx: 'hxpda', id: "com.pocket.compress.yearly", latest: "ddm1023" },  //爱提词
  'com.pocket.photo': { cm: 'timea', hx: 'hxpda', id: "com.pocket.photo.yearly", latest: "ddm1023" },  //一寸证件照
  'com.pocket.watermark': { cm: 'timea', hx: 'hxpda', id: "com.pocket.watermark.yearly", latest: "ddm1023" },  //一键水印
  'com.pocket.compress': { cm: 'timea', hx: 'hxpda', id: "com.pocket.compress.yearly", latest: "ddm1023" },  //压缩软件
  'com.pocket.format': { cm: 'timea', hx: 'hxpda', id: "com.pocket.format.yearly", latest: "ddm1023" },  //格式转换
  'com.CalculatorForiPad.InternetRocks': { cm: 'timea', hx: 'hxpda', id: "co.airapps.calculator.year", latest: "ddm1023" },  //计算器Air
  'Focos': { cm: 'timea', hx: 'hxpda', id: "com.focos.1w_t4_1w", latest: "ddm1023" },  //Focos
  'ProKnockOut': { cm: 'timeb', hx: 'hxpda', id: "com.knockout.SVIP.50off", latest: "ddm1023" },  //ProKnockOut
  'com.teadoku.flashnote': { cm: 'timea', hx: 'hxpda', id: "pro_ios_ipad_mac", latest: "ddm1023" },  //AnkiNote
  'com.tapuniverse.texteditor': { cm: 'timea', hx: 'hxpda', id: "com.tapuniverse.texteditor.w", latest: "ddm1023" },  //TextEditor
  'ancienthealth':{cm: 'timea', hx: 'hxpda', id: "com.highone.palmsamwind.yearly.188", latest: "ddm1023"}
};

// ===== 自动App分组 =====
const autoMap = {
  year: [
    'com.internet-rocks',  //Air Apps System
    'co.airapps'  //Air Apps System
  ],
  yearly: [
    'com.pocket'  //NetPocket Co
  ],
  yearlysubscription: [
    'solutions.wzp'  //Air Apps System 
  ],
  lifetime: [
    'co.vulcanlabs'  //Vulcan Labs Company Limited
  ],
  forever: [
    
  ]
};

// ===== 需要expires为null的App =====
const nullExpireApps = ['ProKnockOut'];

// ===== 购买时间 =====
const purchase = "2025-09-09T09:09:09Z";
// ===== 到期时间 =====
const expiration = "2099-09-09T09:09:09Z";

// ===== 自动生成订阅ID =====
const AutoID = {
  year: (bid) => `${bid}.year`,
  yearly: (bid) => `${bid}.yearly`,
  yearlysubscription: (bid) => `${bid}.yearlysubscription`,
  lifetime: (bid) => `${bid}.lifetime`,
  forever: (bid) => `${bid}.Forever`
};

// ===== 自动注入list =====
for (const type in autoMap) {
  autoMap[type].forEach(key => {
    if (!list[key]) {
      const isForever = ['lifetime', 'forever'].includes(type);
      list[key] = {
        tp: isForever ? 'timeb' : 'timea',
        hx: 'hxpda',
        auto: true,
        autoType: type
      };
    }
  });
}

// ===== 工具函数 =====
function rand(len) {
  let s = "";
  for (let i = 0; i < len; i++) s += Math.floor(Math.random() * 10);
  return s;
}

function format(time) {
  return time.toISOString().replace(/\.\d{3}Z$/, 'Z').replace('T', ' ').replace('Z', ' Etc/GMT');
}

function formatPST(time) {
  let pst = new Date(time.getTime() - 7 * 3600 * 1000);
  return pst.toISOString().replace(/\.\d{3}Z$/, 'Z').replace('T', ' ').replace('Z', ' America/Los_Angeles');
}

// ===== 时间初始化 =====
let now = new Date(purchase);
let start = new Date(now.getTime() - 60 * 1000);
let expire = new Date(now.getTime() + 3650 * 86400000);
let fixedExpire = new Date(expiration);

// ===== transaction id =====
let transactionid = "49000" + rand(10);

// ===== 构建订阅 =====
function build(product_id, purchaseTime, expireTime, type, strict, forceNull) {
  if (!(purchaseTime instanceof Date) || isNaN(purchaseTime)) purchaseTime = new Date();
  if (!(expireTime instanceof Date) || isNaN(expireTime)) expireTime = new Date(purchaseTime.getTime() + 86400000);

  let finalExpire = strict ? expireTime : fixedExpire;
  let originalFix = new Date(purchaseTime.getTime() - 1000);

  let base = {
    "quantity": "1",
    "transaction_id": transactionid,
    "original_transaction_id": transactionid,
    "purchase_date": format(purchaseTime),
    "purchase_date_ms": String(purchaseTime.getTime()),
    "purchase_date_pst": formatPST(purchaseTime),
    "product_id": product_id,
    "is_trial_period": "false",
    "is_in_intro_offer_period": "false",
    "in_app_ownership_type": "PURCHASED",
    "web_order_line_item_id": "49000" + rand(10),
    "original_purchase_date": format(originalFix),
    "original_purchase_date_ms": String(originalFix.getTime()),
    "original_purchase_date_pst": formatPST(originalFix)
  };
  // ===== 只有timea/timed才带正常过期时间 =====
  if (type === 'timea' || type === 'timed') {
    base["expires_date"] = format(finalExpire);
    base["expires_date_ms"] = String(finalExpire.getTime());
    base["expires_date_pst"] = formatPST(finalExpire);
  }
  // ===== 特殊timeb需要null =====
  if (type === 'timeb' && forceNull) {
    base["expires_date"] = null;
    base["expires_date_ms"] = null;
    base["expires_date_pst"] = null;
  }
  return base;
}

// ===== 风控历史链 =====
function buildHistory(product_id, type, strict, forceNull) {
  let baseNow = now;
  let baseStart = start;
  // ===== 自动时间 =====
  if (strict === "auto") {
    baseNow = new Date();
    baseStart = new Date(baseNow.getTime() - 60 * 1000);
  }
  // ===== 固定时间 =====
  if (strict === "fix") {
    baseNow = new Date(purchase);
    baseStart = new Date(baseNow.getTime() - 60 * 1000);
  }
  if (!strict) {
    return [build(product_id, baseNow, expire, type, false, forceNull)];
  }
// ===== 时间闭环 =====
  let duration = 365 * 86400000;
  let prevStart = new Date(baseNow.getTime() - duration);
  let prevExpire = new Date(prevStart.getTime() + duration);
  let historyType = (type === 'timeb') ? 'timea' : type;
  return [
    build(product_id, prevStart, prevExpire, historyType, true, forceNull),
    build(product_id, baseNow, expire, type, true, forceNull)
  ];
}

// ===== 创建receipt =====
function fakeReceipt() {
  let str = "receipt_" + Date.now() + "_" + Math.random();
  return btoa(str + str);
}

let anchor = false;
let data;

;var encode_version = 'jsjiami.com.v5', ukugv = '__0x134067',  __0x134067=['w6LDqcOVDlDDr8KM','wo/CjsOKwoE5w7Y=','wq0vRsKGw4/DjD9dHMOtwobDrR7DqCHChcKheTA=','wqhNYSAmw5cGOMO0Z8OywrVqccKFwoF/w5zDpMOE','bnlQw4HCh8O5T0U=','wrBQfyAt','w4vCnVLCmjvDusKC','wrvCrk15e2c=','wo/CjsO2wow8w6LCgyk=','wrBQfyAs','eMOLw4AdwqM=','JcKdw6nDlMK8wp4DwrJ1','csK2wqIlJg==','MnzCiQzDphrDpw==','wrPCs2FxbHk=','wofDvcOecilVHg==','wpnDucOJcjNRNRRVTyIRw4sDL8OJGEvCjA==','aR49XcOEw44=','cMOKwpbCuMOqOMK0','w4fDkMOow5wcw6k=','woAiwq3Ctw==','MMKcIG1DwrA6YcKwA0bCtsOCbsKSHMKAwr3ClBfCpMKFwo9Pw5LChsK8bQ==','wr7Cr3U=','5oGD5Ze25oK877yB5bSh5pOX5L645oqO5YmS8YytkvCUvqjwnoy5XeWPruW9mOeNg+OBoOWJjOS5kemgrOmCt8K+a21DPsOJw7zDqcO6wonCmSzCrFTCrcKYw7dFw6Zuw6Qj','wo01wqXCqMKXeQ==','fiPDt8Kaw4Q=','ZcK/wrMoZcO7','w4NyAXdTwpstccOQwplBwqkNFcO0w6bDicKnwrXClg==','YF4GC2PDsMKbUsOxIMOeMsOawqA=','GcKnw5w=','w5AXw6Q=','OcKcwpRIw7XCjcOkwr7DsA==','aVrDmEQqN3NnRQTDtmjCsi0=','wr7DtMOr','w6fDtcOS','54u95p2J5Y2n772HFsOm5Ly05a+H5p285b2D56mB77yq6L2Z6K6W5pSw5o2Z5ouY5LmM55uo5bef5L+i','w4XDnMOLw4YO','w5zCtmpuw6w=','w6bDpcOFIV4=','w47Ci1vCpwc=','cirDrA==','4pmV77qXwp3or6zljpYFKAlIZhRY6Ye257yZ5aWB6LaF772s','w5TCnULCjDPDrcKT','E07CoiHDrQ==','XkAXw6sa','5YmV6Zqs54uz5p675YyD77+TOsKE5Lyr5a6B5p2r5by156if','JilpbnMpwrXCmsK1','fUUw','ZlvDhg==','4pmh77mBEuaUg+axqeahuOa0q+WIn+WOlueWpueZp8KkLMOzBsKmwpw/54+w5aC1772F','DMKiw7w=','O07DqsOhw5Rhw6DDnhszHcOtCE0jWlMGw47Dpg==','OMKwwqV7w7k=','aMKWwodnwqzDksKPw48=','8LOkmk/miIPliqXorI7ljpwOw6DCk1fChilU5YKk776xwoTCucK2wovClMObw4NMLnsywpAZwr4OwqzvvInvv6c=','WmwXAkQ=','w6bDrcOaHlzDmcKXE2TDrjQ=','bxfDvlwc','wqnCocKvwrVa','w6UVw4k=','fsK0wo8sfMO7wps=','YyTDhcKew5UR','a8O3w5TDgMKrwrlHw6w5w6vCnw==','XsKBKg==','LAJS','XU4+DFQ=','fsOsQsK5Bw==','R0giw7UV','UljDvk8P','w6bCj1hBw7E=','RBl+ZMKyd8KNwrDCrsKhwrYBVzE=','54m55py15Y6Q7761HcKh5Ly75ayS5py85byc56mN77266L+B6KyG5pWa5o+J5omV5Lu255uu5bec5L6Y','X0d8w47Cng==','YmjDuGok','XcOkcsKpKg==','YcK0wp86dMOswoo=','w40tw6d4dcKgYA==','WwvDqxPCgw==','JMKfw5rDosKn','w6IRw6YxMA==','wrAowo3ChAtJwrfCqwkpwrY8ccOz','w7ZiGQnDkQ==','OGN5wqItwrnCoS5MfMKyL8Ozw6Q=','ajfDvnY=','w7zDo8OR','AnbCkiPDnErph57nvqvorYrljaTvvJ/Du8OPw5XDjcOESyssw6bDnx7Co8KrFRfCg8KE','Q3/CrA==','4puY77iwUix/w7zCjnPCtOmEjue/leenmueWguiHjuaflO+/ouiHieadm+WCt+avl+i/j+ihnA==','bcO5w4vDgQ==','4pug77iWw4rohbPmnqPlvajluqvltLfnubnmr5Dov5Xoo5M=','8JSypjTjgJ3CkXXCnMO0wr7DrumGlue9geaMpuWNk+OCoV0x77iE4oKLLumEh+e+lOWejeWepO++nmttQz7DicO8w6nDusKJwoprwrVZw7fCnsK9S8K4M8O5c8OEw69AwptWGsKiw6fDssKxwotRwrzDscO1w4ovwpfCve+5nOKBliHorZ7pmL/pkrfmjqnvvYjDpjVOSDLDrcKmw4LDnjbDjcKTH2zDsMKZwoIiwqbCr8KDw70qHgbCthvCpQNFwo8bblzCpcOLwr9KwrLDizAlIiN/wpo0wqhaL8K+OMOGZxdGw5YjwpfDqDELFQMow7zCpsOIMwgrCsOUYGbDim3Dv/CkkYZ144GA5L+k55ab6K+M5piS44KIInLvuKbigZzCnua3veWJq+iuhumbsemSu+aOmeWLiMK5w48awrJWbi5b77q74oCcOeWRvueUusKCEuiHiuadl+W+guWFusKdWeW4mOS9r+Wsueiuv+e9smRK4puZ77iUwp/jg6bmsbHmhYXkurPpoonjgKRxwofCguW/ruWEpueWk+S7rumZqeasuumdrOazmeWUi+WOj+iFuOadlGZ1VeS6p+S8qOWvsuS4kuS8rumqjO+8sOispuWLl+S8geaSguaLn+a5rueUusKMw6hZ5bil6K6qCsK1w7HDjeWzs+aWveWFjuWJt+mbje+8oOmCh+WHvuS7mOW8tOimoemXoOmjusKUw7rwoqqPw6PmhoDosKTnk5Dop7zkuIfml5rmjLHvvqA=','wrUrQcKX','FF3CuFJww4rCm1w=','w43CkVzCmjM=','P0LDqcOgw58=','w6ZOEAfDuA==','wpbClcOnwoMhw6fClT/DmwIJG2kYwoTCsg==','dj3Du3c+'];(function(_0x6b4fd6,_0x50c7d9){var _0x3dc75d=function(_0x360b84){while(--_0x360b84){_0x6b4fd6['push'](_0x6b4fd6['shift']());}};_0x3dc75d(++_0x50c7d9);}(__0x134067,0xf2));var _0x3f42=function(_0x2f013f,_0x142015){_0x2f013f=_0x2f013f-0x0;var _0x267a12=__0x134067[_0x2f013f];if(_0x3f42['initialized']===undefined){(function(){var _0x280954=typeof window!=='undefined'?window:typeof process==='object'&&typeof require==='function'&&typeof global==='object'?global:this;var _0x317e33='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x280954['atob']||(_0x280954['atob']=function(_0x5e967b){var _0x40e384=String(_0x5e967b)['replace'](/=+$/,'');for(var _0x50da5a=0x0,_0x1bf96,_0x5a827b,_0x309962=0x0,_0xa5c384='';_0x5a827b=_0x40e384['charAt'](_0x309962++);~_0x5a827b&&(_0x1bf96=_0x50da5a%0x4?_0x1bf96*0x40+_0x5a827b:_0x5a827b,_0x50da5a++%0x4)?_0xa5c384+=String['fromCharCode'](0xff&_0x1bf96>>(-0x2*_0x50da5a&0x6)):0x0){_0x5a827b=_0x317e33['indexOf'](_0x5a827b);}return _0xa5c384;});}());var _0x2ad142=function(_0x27b016,_0x1860c9){var _0x72f9ac=[],_0x2d4af6=0x0,_0xfad775,_0x1da7f1='',_0x461231='';_0x27b016=atob(_0x27b016);for(var _0x177f41=0x0,_0x3a7f43=_0x27b016['length'];_0x177f41<_0x3a7f43;_0x177f41++){_0x461231+='%'+('00'+_0x27b016['charCodeAt'](_0x177f41)['toString'](0x10))['slice'](-0x2);}_0x27b016=decodeURIComponent(_0x461231);for(var _0x283f2f=0x0;_0x283f2f<0x100;_0x283f2f++){_0x72f9ac[_0x283f2f]=_0x283f2f;}for(_0x283f2f=0x0;_0x283f2f<0x100;_0x283f2f++){_0x2d4af6=(_0x2d4af6+_0x72f9ac[_0x283f2f]+_0x1860c9['charCodeAt'](_0x283f2f%_0x1860c9['length']))%0x100;_0xfad775=_0x72f9ac[_0x283f2f];_0x72f9ac[_0x283f2f]=_0x72f9ac[_0x2d4af6];_0x72f9ac[_0x2d4af6]=_0xfad775;}_0x283f2f=0x0;_0x2d4af6=0x0;for(var _0x52b981=0x0;_0x52b981<_0x27b016['length'];_0x52b981++){_0x283f2f=(_0x283f2f+0x1)%0x100;_0x2d4af6=(_0x2d4af6+_0x72f9ac[_0x283f2f])%0x100;_0xfad775=_0x72f9ac[_0x283f2f];_0x72f9ac[_0x283f2f]=_0x72f9ac[_0x2d4af6];_0x72f9ac[_0x2d4af6]=_0xfad775;_0x1da7f1+=String['fromCharCode'](_0x27b016['charCodeAt'](_0x52b981)^_0x72f9ac[(_0x72f9ac[_0x283f2f]+_0x72f9ac[_0x2d4af6])%0x100]);}return _0x1da7f1;};_0x3f42['rc4']=_0x2ad142;_0x3f42['data']={};_0x3f42['initialized']=!![];}var _0x54954b=_0x3f42['data'][_0x2f013f];if(_0x54954b===undefined){if(_0x3f42['once']===undefined){_0x3f42['once']=!![];}_0x267a12=_0x3f42['rc4'](_0x267a12,_0x142015);_0x3f42['data'][_0x2f013f]=_0x267a12;}else{_0x267a12=_0x54954b;}return _0x267a12;};if(typeof $rocket!=='undefined'){function getBoxJSValue(_0x99673){var _0x184236={'haPVM':function _0x36c1c5(_0x1f1dfa,_0x497d04){return _0x1f1dfa!==_0x497d04;},'tBUVj':_0x3f42('0x0','NmBE'),'VSelT':function _0x78f023(_0x47c0a4,_0x1258e6){return _0x47c0a4===_0x1258e6;},'qRuOC':'function','MHXmT':'PpY','QqLbD':function _0x58e0d0(_0x1b6165,_0x39d215){return _0x1b6165!==_0x39d215;},'BIzWB':_0x3f42('0x1','i]G0'),'vQELb':_0x3f42('0x2',')SmF'),'LKzJS':_0x3f42('0x3','^meH'),'XPOcl':function _0x554737(_0x11066f,_0x59270a){return _0x11066f===_0x59270a;},'aAJGo':_0x3f42('0x4','xr9u'),'tkweE':'in_app','QWauS':'latest_receipt_info','WtvzL':_0x3f42('0x5','Wffc'),'dEdkM':function _0x149ced(_0x558c24){return _0x558c24();}};try{if(_0x184236['haPVM'](typeof $persistentStore,_0x184236[_0x3f42('0x6','BtpZ')])&&_0x184236['VSelT'](typeof $persistentStore['read'],_0x3f42('0x7','fieO'))){const _0x5d7d3f=$persistentStore['read'](_0x99673);console['log'](_0x3f42('0x8','em0I')+_0x99673+'\x20=\x20'+_0x5d7d3f);return _0x5d7d3f;}else if(typeof $prefs!==_0x184236['tBUVj']&&_0x184236[_0x3f42('0x9','i]G0')](typeof $prefs[_0x3f42('0xa','N%ra')],_0x184236[_0x3f42('0xb','4^7p')])){if(_0x184236[_0x3f42('0xc','@pEY')](_0x3f42('0xd','Dqkh'),_0x184236['MHXmT'])){ddm[_0x3f42('0xe',')HY4')][_0x3f42('0xf','rxD3')]=data;}else{const _0x5cea8f=$prefs[_0x3f42('0x10','LyvZ')](_0x99673);console[_0x3f42('0x11','*xrD')]('🔍\x20成功读取\x20BoxJS\x20值（$prefs）：'+_0x99673+_0x3f42('0x12','i]G0')+_0x5cea8f);return _0x5cea8f;}}else{if(_0x184236[_0x3f42('0x13','i]G0')](_0x184236[_0x3f42('0x14','lAiX')],_0x184236['BIzWB'])){c+=_0x184236[_0x3f42('0x15','cEy5')];b=encode_version;if(!(_0x184236[_0x3f42('0x16',')SmF')](typeof b,'undefined')&&_0x184236[_0x3f42('0x17','7qJ2')](b,_0x3f42('0x18','Wxry')))){w[c]('删除'+_0x3f42('0x19','cEy5'));}}else{console['log'](_0x184236['LKzJS']);}}}catch(_0x269363){if(_0x184236[_0x3f42('0x1a','I]sZ')](_0x184236[_0x3f42('0x1b',')SmF')],_0x184236[_0x3f42('0x1c','lAiX')])){console['log']('⚠️\x20读取\x20BoxJS\x20配置失败：'+_0x269363[_0x3f42('0x1d',')HY4')]);}else{ddm[_0x3f42('0x1e','3u98')][_0x184236[_0x3f42('0x1f','3#T3')]]=data;ddm[_0x184236[_0x3f42('0x20','xr9u')]]=strict?history:data;ddm[_0x184236[_0x3f42('0x21','Dqkh')]]=[{'product_id':id,'original_transaction_id':transactionid,'auto_renew_product_id':id,'auto_renew_status':'1'}];ddm[_0x3f42('0x22','4Fhp')]=_0x184236[_0x3f42('0x23','ZlbA')](fakeReceipt);}}return null;}const scriptSwitch=getBoxJSValue(_0x3f42('0x24','zY%T'));const isScriptEnabled=scriptSwitch===_0x3f42('0x25','4^7p')||scriptSwitch===!![];console[_0x3f42('0x26','N%ra')](_0x3f42('0x27','GtdG')+scriptSwitch);if(!isScriptEnabled){console[_0x3f42('0x28','R0#A')](_0x3f42('0x29','i]G0'));$notification[_0x3f42('0x2a','LyvZ')](_0x3f42('0x2b','GtdG'),'检测到脚本开关未开启',_0x3f42('0x2c','Wxry'));$done();}};for(const i in list){const regex=new RegExp('^'+i,'i');if(regex[_0x3f42('0x2d','^meH')](ua)||regex['test'](bundle_id)){let {tp,hx,id,ids,version,strict,auto,autoType}=list[i];if(auto&&autoType&&AutoID[autoType]){id=AutoID[autoType](bundle_id);}const forceNull=nullExpireApps[_0x3f42('0x2e','lPNI')](i);let history=buildHistory(id,tp,strict,forceNull);let latest=history[history['length']-0x1];switch(tp){case _0x3f42('0x2f','mU*j'):data=[latest];break;case _0x3f42('0x30','Wffc'):data=[latest];break;case'timec':data=[];break;case _0x3f42('0x31','ZlbA'):data=[build(ids,new Date(latest[_0x3f42('0x32','Ulhr')]),expire,'timed',strict,forceNull),latest];break;}if(hx['includes'](_0x3f42('0x33','4^7p'))){ddm[_0x3f42('0x34','N%ra')][_0x3f42('0x35','Ulhr')]=data;ddm[_0x3f42('0x36','^meH')]=strict?history:data;ddm[_0x3f42('0x37','i%8(')]=[{'product_id':id,'original_transaction_id':transactionid,'auto_renew_product_id':id,'auto_renew_status':'1'}];ddm['latest_receipt']=fakeReceipt();}else if(hx[_0x3f42('0x38','I]sZ')](_0x3f42('0x39','i%8('))){ddm[_0x3f42('0x3a','mU*j')][_0x3f42('0x3b','TFg5')]=data;}else if(hx[_0x3f42('0x3c','Ulhr')](_0x3f42('0x3d','i%8('))){const patch={'expires_date_formatted':format(fixedExpire),'expires_date':String(fixedExpire['getTime']()),'expires_date_formatted_pst':formatPST(fixedExpire),'purchase_date':format(now),'purchase_date_ms':String(now['getTime']()),'purchase_date_pst':formatPST(now),'original_purchase_date':format(start),'original_purchase_date_ms':String(start['getTime']()),'original_purchase_date_pst':formatPST(start),'transaction_id':transactionid,'original_transaction_id':transactionid,'web_order_line_item_id':_0x3f42('0x3e','BtpZ')+rand(0xa),'product_id':id,'in_app_ownership_type':_0x3f42('0x3f','xr9u'),'is_trial_period':'false','is_in_intro_offer_period':_0x3f42('0x40','X8nZ')};ddm[_0x3f42('0x41','GtdG')]=Object[_0x3f42('0x42','TFg5')]({},ddm[_0x3f42('0x43','pPCF')],patch);ddm[_0x3f42('0x44','pPCF')]=Object[_0x3f42('0x45','[fR@')]({},ddm[_0x3f42('0x46','!Ye4')]);ddm[_0x3f42('0x47','aOLv')]=0x0;}if(version&&version[_0x3f42('0x48','2R)g')]()!==''){ddm['receipt'][_0x3f42('0x49','TbTn')]=version;}anchor=!![];console[_0x3f42('0x4a','TFg5')](_0x3f42('0x4b','Wxry'));break;}}if(!anchor){let fallbackId=AutoID[_0x3f42('0x4c','2R)g')](bundle_id);let history=buildHistory(fallbackId,_0x3f42('0x4d','rxD3'),![],![]);let latest=history[0x0];ddm['receipt'][_0x3f42('0x4e',')HY4')]=[latest];ddm['latest_receipt_info']=[latest];ddm[_0x3f42('0x4f','em0I')]=[{'product_id':fallbackId,'original_transaction_id':transactionid,'auto_renew_product_id':fallbackId,'auto_renew_status':'1'}];ddm[_0x3f42('0x50','i]G0')]=fakeReceipt();console[_0x3f42('0x51','xr9u')]('很遗憾未能识别出UA或bundle_id\x0a但已使用备用方案🎉🎉🎉\x0a叮当猫の分享频道:\x20https://t.me/ddm1023');}$done({'body':JSON['stringify'](ddm)});;(function(_0x3e8de1,_0x217346,_0xdcc913){var _0x3f028f={'qxBng':_0x3f42('0x52','Dqkh'),'pNuRz':function _0x2b332b(_0x46a40e,_0x23def3){return _0x46a40e!==_0x23def3;},'ljWCI':_0x3f42('0x53','BtpZ'),'visJg':_0x3f42('0x54',')SmF'),'UZCMe':_0x3f42('0x55','pPCF'),'eJJav':_0x3f42('0x56','N%ra'),'SWHHb':function _0x6ce3ec(_0x2fed99,_0x25756c){return _0x2fed99+_0x25756c;},'oYpRm':_0x3f42('0x57','Dqkh')};_0xdcc913='al';try{_0xdcc913+=_0x3f028f[_0x3f42('0x58','aOLv')];_0x217346=encode_version;if(!(_0x3f028f['pNuRz'](typeof _0x217346,_0x3f028f[_0x3f42('0x59','7qJ2')])&&_0x217346===_0x3f028f[_0x3f42('0x5a','N%ra')])){if(_0x3f028f[_0x3f42('0x5b','Dr]8')]===_0x3f028f['eJJav']){console[_0x3f42('0x5c','4^7p')](_0x3f42('0x5d','pPCF')+e[_0x3f42('0x5e','mU*j')]);}else{_0x3e8de1[_0xdcc913](_0x3f028f[_0x3f42('0x5f','GtdG')]('删除',_0x3f028f[_0x3f42('0x60','cEy5')]));}}}catch(_0x3a9f13){_0x3e8de1[_0xdcc913](_0x3f42('0x61','xr9u'));}}(window));;encode_version = 'jsjiami.com.v5';
