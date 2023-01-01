class Arena extends Phaser.Scene {

    constructor() {
        super("arena");
    }

    preload() {
        this.load.image("ant", "assets/image/ant.png");
    }

    create() {
        this.sound.stopAll();
        
        var graphics = this.add.graphics();
        graphics.fillGradientStyle(0x00d8ff, 0x00d8ff, 0x003ebd, 0x003ebd, 1);
        
        this.player = this.physics.add.sprite(69, -69, "ant");
        this.player.setGravityY(1200);
        this.player.setDragX(333);
        this.player.setDragY(333);
        this.player.setCollideWorldBounds(true);
        
        this.physics.world.setBounds(0, 0, 960, 540);
        this.cameras.main.setBounds(0, 0, 960, 540);
        this.cameras.main.startFollow(this.player);
        
        this.garbageDump = [];
        
        this.cursors = this.input.keyboard.createCursorKeys();
        
        this.clicka = this.input.activePointer;
        this.canClick = false;
        
        this.internalClock = 0;
        
        /*this.music = this.sound.add("mainMusic");
        this.music.loop = true;
        this.music.play();*/
        
    }

    update() {
        if (this.cursors.left.isDown) {
            this.player.body.x-=10;
        }
        if (this.cursors.right.isDown) {
            this.player.body.x+=10;
        }
        if (this.cursors.up.isDown) {
            this.player.body.y-=10;
        }
        if (this.cursors.down.isDown) {
            this.player.body.y+=10;
        }
        
        this.internalClock++;
        
        var relClickX = this.clicka.x + this.cameras.main.scrollX;
        
        if (this.clicka.isDown && this.canClick && this.player.y > 21 && this.stunFrames == 0) {
            this.canClick = false;
            
        }
        else if (!this.clicka.isDown) {
            this.canClick = true;
        }
        
        this.player.flipX = relClickX < this.player.x;
        
        var garbageDump = this.garbageDump;
        
        while (garbageDump.length > 0) {
            garbageDump.pop().destroy();
        }
    }

}