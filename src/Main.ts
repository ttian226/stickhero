/**
 * 棍子英雄圣诞版
 * @author wangxu <ttian226@gmail.com>
 * @date 2015-01-27
 */


class Main extends egret.DisplayObjectContainer{

    /**
     * 加载进度界面
     */
    private loadingView:LoadingUI;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
    }

    private onAddToStage(event:egret.Event){
        //设置加载进度界面
        this.loadingView  = new LoadingUI();
        this.stage.addChild(this.loadingView);

        //初始化Resource资源加载库
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE,this.onConfigComplete,this);
        RES.loadConfig("resource/resource.json","resource/");
    }
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     */
    private onConfigComplete(event:RES.ResourceEvent):void{
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE,this.onConfigComplete,this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE,this.onResourceLoadComplete,this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS,this.onResourceProgress,this);
        RES.loadGroup("preload");
    }
    /**
     * preload资源组加载完成
     */
    private onResourceLoadComplete(event:RES.ResourceEvent):void {
        if(event.groupName=="preload"){
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE,this.onResourceLoadComplete,this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS,this.onResourceProgress,this);
            
            this.imgs = RES.getRes("gzyx");
            this.imgs1 = RES.getRes("gzyx_img1");
            this.imgs2 = RES.getRes("gzyx_img2");

            this.scene_num = Math.floor(Math.random() * 5) + 1;
            this.initStartGame();
        }
    }
    /**
     * preload资源组加载进度
     */
    private onResourceProgress(event:RES.ResourceEvent):void {
        if(event.groupName=="preload"){
            this.loadingView.setProgress(event.itemsLoaded,event.itemsTotal);
        }
    }

    private game_container:egret.Sprite;
    private fimg:egret.Bitmap;
    private imgs:egret.SpriteSheet;
    private imgs1:egret.SpriteSheet;
    private imgs2:egret.SpriteSheet;
    private scene_num:number;
    
    /**
     * 创建游戏场景
     */
    private createGameScene():void{
        this.resetScene();

        this.game_container = new egret.Sprite();
        this.addChild(this.game_container);
        this.game_container.width = 2000;
        this.game_container.height = 800;

        this.game_container.touchEnabled = true;

        this.initgame();
    }

    /**
     * 重置游戏场景
     */
    private resetScene():void {
        var bg_name = 'bgImage_' + this.scene_num;
        var front_name = 'frontImage_' + this.scene_num;

        //背景图
        var bg:egret.Bitmap = this.createBitmapByName(bg_name);
        this.addChild(bg);
        var stageW:number = this.stage.stageWidth;
        var stageH:number = this.stage.stageHeight;
        bg.width = stageW;
        bg.height = stageH;

        //前景图
        this.fimg = this.createBitmapByName(front_name);
        this.addChild(this.fimg);
        this.fimg.y = 800 - 667;
        this.fimg.width = 800;
        this.fimg.height = 667;
    }

    private initgame():void {
        //初始化前景图位置
        this.fimg.x = 0;
        //
        this.num = 1;
        this.score = 0;

        this.createFirstZhuzi();
        this.createHero();
        this.createscorebox();

        this.game_container.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchAct, this);
        this.game_container.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEndAct, this);
        
    }


    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     */
    private createBitmapByName(name:string):egret.Bitmap {
        var result:egret.Bitmap = new egret.Bitmap();
        var texture:egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

    /**
     * 移动前景图
     */
    private moveFrontImg(img:egret.Bitmap):void {
        var tw = egret.Tween.get(img);
        tw.to({x:-480}, 60000);
    }

    /**
     * 前景图上下抖动
     */
    private moveFrontUd():void {
        var tw = egret.Tween.get(this.fimg);
        tw.to({y:128}, 50);
        tw.to({y:133}, 50);
        tw.to({y:128}, 50);
        tw.to({y:133}, 50);
    }

    /**
     * 创建英雄
     */
    private createHero():void {
        var data = RES.getRes("hero_json");
        var texture = RES.getRes("hero_mc_img");
        this.hero_mc = new egret.MovieClip(data,texture);
        this.hero_mc.x = 56;
        this.hero_mc.y = 510;
        this.game_container.addChild(this.hero_mc);
        this.hero_mc.frameRate = 4;
        this.hero_mc.gotoAndPlay('stand');
    }

    private score_number_s:egret.TextField;
    private game_tishi:egret.Bitmap;
    private game_double_score:egret.Bitmap;

    /**
     * 创建记分牌
     */
    private createscorebox():void {
        var score_box:egret.Bitmap = new egret.Bitmap();
        score_box.texture = this.imgs.getTexture("box_1");
        score_box.x = 190;
        score_box.y = 35;
        score_box.scaleX = 0.8;
        score_box.scaleY = 0.8;
        this.game_container.addChild(score_box);

        this.score_number_s = new egret.TextField();
        this.score_number_s.text = (this.score) + '';
        this.score_number_s.x = 233;
        this.score_number_s.y = 47;
        this.game_container.addChild(this.score_number_s);

        this.game_tishi = new egret.Bitmap();
        this.game_tishi.texture = this.imgs.getTexture("tishi");
        this.game_tishi.x = 185;
        this.game_tishi.y = 110;
        this.game_tishi.scaleX = 0.8;
        this.game_tishi.scaleY = 0.8;
        this.game_container.addChild(this.game_tishi);
    }

    private start_x:number;//第二个柱子的起始x坐标
    private s_width:number;//第二个柱子的宽度

    private num:number = 1;
    private score:number = 0;
    private bestscroe:number = 0;
    private zhuzi:egret.Shape[] = [];

    private gz:egret.Shape;
    private gz_lst:egret.Shape[] = [];
    private hero:egret.Bitmap;
    private hero_mc:egret.MovieClip;

    private x_width:number = 0;

    private red_point:egret.Shape;//红点

    /**
     * 创建初始的两个柱子
     */
    private createFirstZhuzi():void {

        this.zhuzi[1] = new egret.Shape();
        this.zhuzi[1].graphics.beginFill( 0x000000, 1);
        this.zhuzi[1].graphics.drawRect( 0, 550, 100, 250 );
        this.zhuzi[1].graphics.endFill();
        this.game_container.addChild( this.zhuzi[1] );

        //第二个柱子
        this.start_x = 150 + Math.random() * 150; //x坐标150-350
        this.s_width = 100;//第二个柱子起始宽度固定是100
        this.zhuzi[2] = new egret.Shape();
        this.zhuzi[2].graphics.beginFill( 0x000000, 1);
        this.zhuzi[2].graphics.drawRect( this.start_x, 550, 100, 250 );
        this.zhuzi[2].graphics.endFill();
        this.game_container.addChild( this.zhuzi[2] );

        //初始化第二个柱子上的红点
        this.red_point = new egret.Shape();
        this.red_point.graphics.beginFill( 0xFF0000, 1);
        this.red_point.graphics.drawRect( this.start_x + 45, 550, 10, 5 );
        this.game_container.addChild( this.red_point );
    }



    /**
     * 触摸屏幕事件
     */
    private touchAct():void {
        //初始化棍子
        this.gz = new egret.Shape();
        this.gz.x = 100;
        this.gz.y = 548;
        this.gz.graphics.beginFill( 0x000000, 1);
        this.gz.graphics.drawRect( 0, 0, 4, -10);
        this.gz.graphics.endFill();
        this.game_container.addChild(this.gz);

        var tw:egret.Tween = egret.Tween.get(this.gz);

        tw.to({scaleY:100}, 2500);
    }

    /**
     * 停止触摸屏幕事件
     */
    private touchEndAct():void {
        //移除缓动动画
        egret.Tween.removeAllTweens();
        //移除原来的棍子
        this.game_container.removeChild(this.gz);
        //克隆一个新的棍子
        var height = this.gz.scaleY * 10;
        this.copyZhuzi(height);
        //移除事件监听
        this.game_container.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchAct, this);
        this.game_container.removeEventListener(egret.TouchEvent.TOUCH_END, this.touchEndAct, this);
        
    }

    
    /**
     * 克隆一根棍子
     */
    private copyZhuzi(height:number):void {
        this.gz_lst[this.num] = new egret.Shape();
        //柱子的原点。固定不变
        this.gz_lst[this.num].x = 100;//100
        this.gz_lst[this.num].y = 548;
        this.gz_lst[this.num].graphics.beginFill( 0x000000, 1);
        this.gz_lst[this.num].graphics.drawRect( 0, 0, 4, 0-height);
        this.gz_lst[this.num].graphics.endFill();
        this.game_container.addChild( this.gz_lst[this.num] );
        this.moveZhuzi(height);
    }

    /**
     * 柱子旋转90度倒下
     */
    private moveZhuzi(height:number):void {
        var tw = egret.Tween.get(this.gz_lst[this.num]);
        tw.to({rotation:90}, 300);
        //英雄向前行走
        var $this = this;
        setTimeout(function() {
            $this.herogo(height);
        }, 500);
    }

    /**
     * 英雄向前行走
     */
    private herogo(length:number):void {
        var gzlength = length;//棍子长度
        var min_width = this.start_x - 100; //两个柱子间宽度
        var max_width = min_width + this.s_width; //英雄出发点距离第二个柱子右侧边缘的宽度

        var tw = egret.Tween.get(this.hero_mc);
        //站立->跑动
        this.hero_mc.gotoAndStop('stand');
        this.hero_mc.frameRate = 12;
        this.hero_mc.gotoAndPlay('go');

        if (gzlength <= min_width) {
            //棍子短
            var golength = gzlength + 75;
            this.gameend();
        } else if (gzlength > min_width && gzlength <= max_width) {
            var red_min = min_width + (this.s_width / 2 - 5);
            var red_max = min_width + (this.s_width / 2 + 5);
            if (gzlength > red_min && gzlength < red_max) {
                //棍子落在红色区间
                var status = 1;
            } else {
                //棍子未落在红色区间
                var status = 0;
            }
            //正好
            var golength = max_width + 56;
            this.nextone(status);
        } else if (gzlength > max_width) {
            //棍子长
            var golength = gzlength + 75;
            this.gameend();
        }
        tw.to({x:golength}, 1000);

        var move_num = (this.num % 40 == 0) ? 40 : (this.num % 40);

        //background move
        var twgk = egret.Tween.get(this.fimg);
        if (this.fimg.x == -320) {
            this.fimg.x = 0;
        }
        var w = move_num * 8;
        twgk.to({x:-w}, 1000);
    }

    /**
     * 游戏结束
     */
    private gameend():void {
        var $this = this;
        setTimeout(function() {
            $this.moveFrontUd();
            $this.game_container.removeChild($this.hero_mc);
            var tw = egret.Tween.get($this.gz_lst[$this.num]);
            tw.to({rotation:180}, 200);
            $this.show_score();
        }, 1000);
    }

    private game_over_container:egret.Sprite;

    /**
     * 游戏结束页面
     */
    private show_score():void {
        var $this = this;
        this.game_over_container = new egret.Sprite();
        this.addChild(this.game_over_container);
        this.game_over_container.width = this.stage.stageWidth;
        this.game_over_container.height = this.stage.stageHeight;
        
        var game_over_bg_img:egret.Bitmap = this.createBitmapByName("game_over_bg_Image");
        
        setTimeout(function() {
            $this.game_over_container.addChild(game_over_bg_img);
            game_over_bg_img.width = 480;
            game_over_bg_img.height = 800;

            var gameover_title:egret.Bitmap = new egret.Bitmap();
            gameover_title.texture = $this.imgs.getTexture("gameover");
            gameover_title.x = 125;
            gameover_title.y = 100;
            $this.game_over_container.addChild(gameover_title);

            var box:egret.Bitmap = new egret.Bitmap();
            box.texture = $this.imgs.getTexture("box");
            box.x = 80;
            box.y = 180;
            $this.game_over_container.addChild(box);

            //重来
            var return_btn:egret.Bitmap = new egret.Bitmap();
            return_btn.texture = $this.imgs1.getTexture("restart_1");
            return_btn.x = 150;
            return_btn.y = 420;
            $this.game_over_container.addChild(return_btn);

            //炫耀
            var share_btn:egret.Bitmap = new egret.Bitmap();
            share_btn.texture = $this.imgs1.getTexture("share_1");
            share_btn.x = 150;
            share_btn.y = 500;
            $this.game_over_container.addChild(share_btn);

            //更多游戏
            var more_btn:egret.Bitmap = new egret.Bitmap();
            more_btn.texture = $this.imgs1.getTexture("more_1");
            more_btn.x = 150;
            more_btn.y = 580;
            $this.game_over_container.addChild(more_btn);

            //分数
            var score_title:egret.Bitmap = new egret.Bitmap();
            score_title.texture = $this.imgs.getTexture("score");
            score_title.x = 217;
            score_title.y = 210;
            $this.game_over_container.addChild(score_title);

            //最佳
            var bestscore_title:egret.Bitmap = new egret.Bitmap();
            bestscore_title.texture = $this.imgs.getTexture("bestscore");
            bestscore_title.x = 217;
            bestscore_title.y = 290;
            $this.game_over_container.addChild(bestscore_title);

            var current_scroe = $this.score;
            if ($this.bestscroe < current_scroe) {
                $this.bestscroe = current_scroe;
            }

            //分数 数字
            var score_number:egret.TextField = new egret.TextField();
            score_number.text = current_scroe + '';
            if (current_scroe < 10) {
                score_number.x = 230;
            } else {
                score_number.x = 223;
            }
            score_number.y = 245;
            score_number.textColor = 0x000000;
            $this.game_over_container.addChild(score_number);

            //最佳 数字
            var bestscore_number:egret.TextField = new egret.TextField();
            bestscore_number.text = $this.bestscroe + '';
            if ($this.bestscroe < 10) {
                bestscore_number.x = 230;
            } else {
                bestscore_number.x = 223;
            }
            bestscore_number.y = 330;
            bestscore_number.textColor = 0x000000;
            $this.game_over_container.addChild(bestscore_number);

            //返回按钮点击事件
            return_btn.touchEnabled = true;
            return_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, $this.returngame, $this);

            //炫耀按钮点击事件
            share_btn.touchEnabled = true;
            share_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, $this.sharegame, $this);

            //更多游戏点击事件
            more_btn.touchEnabled = true;
            more_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, $this.moregame, $this);

        }, 500);

    }


    /**
     * 重新开始游戏
     */
    private returngame():void {
        this.removeChild(this.game_over_container);
        this.game_container.removeChildren();
        this.scene_num = Math.floor(Math.random() * 5) + 1;
        this.createGameScene();
    }

    /**
     * 微信分享游戏
     */
    private sharegame():void {
        
    }

    /**
     * 更多游戏
     */
    private moregame():void {
        
    }

    private prelen:number;

    /**
     * 移动到下一关
     */
    private nextone(status:number):void {
        var len = this.start_x - 100 + this.s_width;
        var $this = this;
        if (status == 1) {
            //双倍得分提示
            this.game_double_score = new egret.Bitmap();
            this.game_double_score.texture = this.imgs2.getTexture("doublescore");
            this.game_double_score.x = 200;
            this.game_double_score.y = 200;
            this.game_double_score.scaleX = 0.8;
            this.game_double_score.scaleY = 0.8;
            this.game_container.addChild(this.game_double_score);
        }
        setTimeout(function() {
            if (status == 1) {
                $this.game_container.removeChild($this.game_double_score);//移除双倍提示
                $this.score += 2;//分数+2
            } else {
                $this.score += 1;//分数+1
            }

            //去除红点
            $this.game_container.removeChild($this.red_point);

            //跑动->站立
            $this.hero_mc.gotoAndStop('go');
            $this.hero_mc.frameRate = 4;
            $this.hero_mc.gotoAndPlay('stand');

            //改变显示分数
            if ($this.score >= 10) {
                $this.score_number_s.x = 225;
            }
            $this.score_number_s.text = $this.score + '';
            if ($this.num == 1) {
                $this.game_container.removeChild($this.game_tishi);
            }

            var tw1 = egret.Tween.get($this.zhuzi[$this.num]);
            var tw2 = egret.Tween.get($this.zhuzi[$this.num + 1]);
            var twhero = egret.Tween.get($this.hero_mc);
            var twgz = egret.Tween.get($this.gz_lst[$this.num]);

            if ($this.num == 1) {
                tw1.to({x:0-len}, 500);
            } else {
                tw1.to({x:0-($this.prelen + len)}, 500);
            }
            $this.prelen = len;
            
            tw2.to({x:0-len}, 500);
            twhero.to({x:56}, 500);
            twgz.to({x:100-len}, 500);

            if ($this.num > 1) {
                var twgz0 = egret.Tween.get($this.gz_lst[$this.num-1]);
                twgz0.to({x:$this.x_width+100-len}, 500);
            }
            $this.x_width = 0 - len;
            $this.createnextzhuzi();
        }, 1000);
    }
    
    /**
     * 创建下一个柱子
     */
    private createnextzhuzi():void {
        var $this = this;
        setTimeout(function() {
            $this.game_container.addEventListener(egret.TouchEvent.TOUCH_BEGIN, $this.touchAct, $this);
            $this.game_container.addEventListener(egret.TouchEvent.TOUCH_END, $this.touchEndAct, $this);

            $this.num += 1;
            var c_num = $this.num + 1;
            $this.start_x = 180 + Math.random() * 200; 
            $this.s_width = 20 + Math.random() * 80;
            $this.zhuzi[c_num] = new egret.Shape();
            $this.zhuzi[c_num].graphics.beginFill( 0x000000, 1);
            $this.zhuzi[c_num].graphics.drawRect( $this.start_x, 550, $this.s_width, 250 );
            $this.zhuzi[c_num].graphics.endFill();
            $this.game_container.addChild( $this.zhuzi[c_num] );

            //初始化柱子上的红点
            $this.red_point = new egret.Shape();
            $this.red_point.graphics.beginFill( 0xFF0000, 1);
            $this.red_point.graphics.drawRect( $this.start_x + ($this.s_width / 2 - 5), 550, 10, 5 );
            $this.game_container.addChild( $this.red_point );
        }, 500);
    }

    private game_start_container:egret.Sprite;

    /**
     * 初始化开始游戏界面
     */
    private initStartGame():void {
        //初始化开始界面容器
        this.game_start_container = new egret.Sprite();
        this.addChild(this.game_start_container);
        this.game_start_container.width = 480;
        this.game_start_container.height = 800;

        var bg_name = 'bgImage_' + this.scene_num;
        var front_name = 'frontImage_' + this.scene_num;

        //背景图
        var bg:egret.Bitmap = this.createBitmapByName(bg_name);
        this.game_start_container.addChild(bg);
        var stageW:number = this.stage.stageWidth;
        var stageH:number = this.stage.stageHeight;
        bg.width = stageW;
        bg.height = stageH;

        //前景图
        var fimg:egret.Bitmap = this.createBitmapByName(front_name);
        this.game_start_container.addChild(fimg);
        fimg.y = 800 - 667 * 0.6;
        fimg.scaleX = 0.6;
        fimg.scaleY = 0.6;

        //开始按钮
        var startbtn:egret.Bitmap = new egret.Bitmap();
        startbtn.texture = this.imgs.getTexture("start_4");
        startbtn.x = 149;
        startbtn.y = 290;
        startbtn.scaleX = 0.9;
        startbtn.scaleY = 0.9;
        this.game_start_container.addChild(startbtn);

        var i = 0;
        setInterval(function() {
            if (i++ % 2 == 0) {
                var yy = 310;
            } else {
                var yy = 290;
            }
            var tw_btn = egret.Tween.get(startbtn);
            tw_btn.to({y:yy}, 1500);
        }, 1500);
        

        //title
        var gametitle:egret.Bitmap = new egret.Bitmap();
        gametitle.texture = this.imgs.getTexture("game_title");
        gametitle.x = 107;
        gametitle.y = 70;
        gametitle.scaleX = 0.9;
        gametitle.scaleY = 0.9;
        this.game_start_container.addChild(gametitle);

        //柱子
        var zhuzi:egret.Shape = new egret.Shape();
        zhuzi.graphics.beginFill( 0x000000, 1);
        zhuzi.graphics.drawRect( 160, 580, 160, 220 );
        zhuzi.graphics.endFill();
        this.game_start_container.addChild( zhuzi );

        //英雄
        var data = RES.getRes("hero_json");
        var texture = RES.getRes("hero_mc_img");
        var mc = new egret.MovieClip(data,texture);
        mc.x = 220;
        mc.y = 540;
        this.game_start_container.addChild(mc);
        mc.frameRate = 4;
        mc.gotoAndPlay('stand');

        startbtn.touchEnabled = true;
        startbtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.startbtnevt, this);
    }

    private startbtnevt():void {
        this.removeChild(this.game_start_container);
        this.createGameScene();
    }

}


