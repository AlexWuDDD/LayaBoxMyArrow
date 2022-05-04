import GameConfig from "./GameConfig";
class Main {
	constructor() {
		//根据IDE设置初始化引擎		
		if (window["Laya3D"]) Laya3D.init(GameConfig.width, GameConfig.height);
		else Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
		Laya["Physics"] && Laya["Physics"].enable();
		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
		Laya.stage.scaleMode = GameConfig.scaleMode;
		Laya.stage.screenMode = GameConfig.screenMode;
		Laya.stage.alignV = GameConfig.alignV;
		Laya.stage.alignH = GameConfig.alignH;
		//兼容微信不支持加载scene后缀场景
		Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

		//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
		if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
		if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
		if (GameConfig.stat) Laya.Stat.show();
		Laya.alertGlobalError(true);

        //init();
        //init2();
        init3();

	}
}
//激活启动类
new Main();

// 功能初始化
function init(){
    //显示统计信息
    Laya.Stat.show();
    //在调试控制台输出”Hello World"
    console.log("Hello Laya");
    //设置stage的背景颜色
    Laya.stage.bgColor = '#aabbcc';
    //显示Laya.stage的坐标
    console.log('Laya.stage.x = ', Laya.stage.x);
    console.log('Laya.stage.y = ', Laya.stage.y);

    //添加Sprite
    let sp = new Laya.Sprite();
    //打印Laya.Sprite的子节点数量
    console.log('Laya.stage的子节点数量: ', Laya.stage.numChildren);
    Laya.stage.addChild(sp);
    console.log('Laya.stage的子节点数量: ', Laya.stage.numChildren);

    //在Laya.stage中绘制水平线段
    Laya.stage.graphics.drawLine(100, 200, 300, 200, '#ff0000', 1);
    //在Laya.stage中绘制垂直线段
    Laya.stage.graphics.drawLine(200, 100, 200, 300, '#ff0000', 1);

    //将sp移动到横坐标400, 纵坐标300
    sp.pos(400, 300);
    //绘制两条在sp原点交叉的线段
    sp.graphics.drawLine(-50, 0, 50, 0, '#00ff00',1);
    sp.graphics.drawLine(0, -50, 0, 50, '#00ff00',1);

    //绘制以sp原点为中心，半径为40的圆
    sp.graphics.drawCircle(0, 0, 40, null, '#ffff00', 2);
    
    //在Laya.stage中绘制圆
    Laya.stage.graphics.drawCircle(400, 300, 80, null, '#ffff00', 2);

    //在sp中添加sp1
    let sp1 = new Laya.Sprite();
    sp.addChild(sp1);
    //设置sp1的坐标，作用和sp1.pos(x, y)相同
    sp1.x = 50;
    sp1.y = 150;
    //绘制sp1的原点
    sp1.graphics.drawLine(-50, 0, 50, 0, '#0000ff',1);
    sp1.graphics.drawLine(0, -50, 0, 50, '#0000ff',1);

    //在控制台打印sp1相对Laya.stage的坐标
    let sp1GlobalPoint1 = sp.localToGlobal(new Laya.Point(sp1.x, sp1.y));
    console.log('sp1相对Laya.stage的坐标: ', sp1GlobalPoint1.x, sp1GlobalPoint1.y);

    //将sp旋转30度
    sp.rotation = 30;

    //在控制台打印sp1相对Laya.stage的坐标
    let sp1GlobalPoint2 = sp.localToGlobal(new Laya.Point(sp1.x, sp1.y));
    console.log('sp1相对Laya.stage的坐标: ', sp1GlobalPoint2.x, sp1GlobalPoint2.y);
}

function init2(){

    //设置stage的背景颜色
    Laya.stage.bgColor = "#aabbcc";

    //加载图集
    Laya.loader.load("res/atlas/img.atlas",
    Laya.Handler.create(this, onAssetLoaded));
}

function init3(){
    //设置stage的背景颜色
    Laya.stage.bgColor = "#aabbcc";
    //加载多个图像
    loadAtlas(["res/atlas/img.atlas", "res/atlas/laya/assets/comp.atlas"]);
    //添加文字
    createTitle();
    //从Laya.stage中查找文字标题
    let title = Laya.stage.getChildByName("title");
    title.text += "123456";

    //Laya.stage刷新频率设置
    Laya.stage.frameRate = Laya.Stage.FRAME_SLOW;
    //基于帧率重复执行
    Laya.timer.frameLoop(1, this, onFrame);
}

function onFrame(){
    // console.log("Laya.timer.delta: ", Laya.timer.delta);
    let speed = 1.5; //1.5像素/秒
    for(let i = 0; i < Laya.stage.numChildren; i++){
        let obj = Laya.stage.getChildAt(i);
        if(obj.name != 'arrow') continue;
        obj.y -= speed * Laya.timer.delta;
        if(obj.y < 200){
            obj.destroy();
        }
    }
}

function loadAtlas(atlasPath){
    Laya.loader.load(atlasPath,
        Laya.Handler.create(this, onAssetLoaded));
}

//添加一个全局计数器
var count = 0;

/**加载图集后的处理 */
function onAssetLoaded(){
    createBow();
    //createArrow();
    
    //引用文字对象
    let title = Laya.stage.getChildByName("title");
    title.text = "单击屏幕射箭";
    //添加计数器并将其初始化
    count = 0;
    Laya.stage.on(Laya.Event.MOUSE_DOWN, this, function(){
        //鼠标按下后计数器自动加1
        ++count;
        //在文本标题中输出计数器的变化
        title.text = "已射出 " + count + " 支箭";
        createArrow();
    })
}

function createBow(){
    //创建一个Sprite作为弓的根节点
    let sp_bow = new Laya.Sprite();
    Laya.stage.addChild(sp_bow);
    //将弓移到屏幕中央
    sp_bow.pos(Laya.stage.width / 2, 1200);
    //绘制弓的中心点
    sp_bow.graphics.drawLine(-100, 0, 100, 0, '#00ff00', 1);
    sp_bow.graphics.drawLine(0, -100, 0, 100, '#00ff00', 1);

    //使用图集创建弓的图像并将其显示出来
    let img_bow = new Laya.Image("img/bow.png");
    // img_bow.skin = "laya/assets/comp/clip_num.png";
    sp_bow.addChild(img_bow);
    //绘制图片的坐标原点
    //移动弓的图片并将其在正确的位置显示
    img_bow.pos(30, -img_bow.height/2);
    // 把弓逆时针旋转90度, 对准正上方
    sp_bow.rotation = -90;
}

function createArrow(){
    //创建承载箭的Laya.Sprite
    let sp_arrow = new Laya.Sprite();
    //使用图集中的箭的图像数据建立一个Laya.Image对象
    let img_arrow = new Laya.Image("img/arrow.png");
    //将img_arrow添加到sp_arrow中
    sp_arrow.addChild(img_arrow);
    //图像的原点在左上角，为了让箭头出现在sp_arrow的原点位置，需要偏移图像坐标
    img_arrow.pos(-img_arrow.width, Math.round(-img_arrow.height/2));
    //绘制辅助线，标注箭的原点
    sp_arrow.graphics.drawLine(-50, 0, 50, 0, '#ff0000', 1);
    sp_arrow.graphics.drawLine(0, -50, 0, 50, '#ff0000', 1);
    //在Laya.stage中添加sp_arrow，并把它放置在和工对应的位置
    Laya.stage.addChild(sp_arrow);
    sp_arrow.pos(Laya.stage.width / 2, 1040);
    // //箭头朝上
    sp_arrow.rotation = -90;
    sp_arrow.name = "arrow";
}

function createTitle(){
    //创建一个文本实例
    let title = new Laya.Text();
    //设置颜色
    title.color = "#FFFFFF";
    //设置字体
    title.font = "Impact";
    //设置字体大小
    title.fontSize = 40;
    //设置位置
    title.pos(80, 90);
    //在Laya.stage中添加文字
    Laya.stage.addChild(title);
    //设置文本内容
    title.text = "Hello World";
    //设定title的名字，用于后续操作
    title.name = "title";
}