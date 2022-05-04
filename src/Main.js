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
        init2();

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

    //创建一个Sprite作为弓的根节点
    let sp_bow = new Laya.Sprite();
    Laya.stage.addChild(sp_bow);
    //将弓移到屏幕中央
    sp_bow.pos(Laya.stage.width / 2, 1200);
    //绘制弓的中心点
    sp_bow.graphics.drawLine(-100, 0, 100, 0, '#00ff00', 1);
    sp_bow.graphics.drawLine(0, -100, 0, 100, '#00ff00', 1);

    //创建一个Sprite，加载图片资源bow.img作为并显示
    let sp_bow_img = new Laya.Sprite();
    sp_bow.addChild(sp_bow_img);
    //绘制图片的坐标原点
    sp_bow_img.graphics.drawLine(-100,0, 100, 0, "#00ffff", 1);
    sp_bow_img.graphics.drawLine(0, -100, 0, 100, "#00ffff",1);
    //移动弓的图片并将其在正确的位置显示
    sp_bow_img.pos(30, -160);
    //加载弓的图片资源
    sp_bow_img.loadImage("res/img/bow.png",
        Laya.Handler.create(this, function(){
            console.log("图片加载完毕！");
        })
    );
    // 把弓逆时针旋转90度, 对准正上方
    sp_bow.rotation = -90;

    //加载图集
    Laya.loader.load("res/atlas/img.atlas",
        Laya.Handler.create(this, onAssetLoaded));
    
    /**加载图集后的处理 */
    function onAssetLoaded(){
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
    }

}