class Arena extends Phaser.Scene {

    constructor() {
        super("arena");
    }

    preload() {
        this.load.image("ant", "assets/image/ant.png");
        this.load.spritesheet("anteater", "assets/image/anteater.png", { frameWidth: 60, frameHeight: 29 });
        this.load.spritesheet("antHill", "assets/image/anthill.png", { frameWidth: 64, frameHeight: 64 });
    }

    create() {
        this.sound.stopAll();
        
        var graphics = this.add.graphics();
        graphics.fillGradientStyle(0x00d8ff, 0x00d8ff, 0x003ebd, 0x003ebd, 1);
        
        this.player = this.physics.add.sprite(69, -69, "ant");
        this.player.setGravityY(1200);
        this.player.setDragX(543.21);
        this.player.setDragY(333);
        this.player.setCollideWorldBounds(true);
        
        this.projectiles = this.physics.add.group();
        
        this.anteaters = this.physics.add.group();
        
        this.fortress = this.physics.add.sprite(100, 200, "antHill");
        this.fortress.setScale(2);
        this.fortress.setCollideWorldBounds(true);
        this.fortress.setGravityY(1200);
        
        this.physics.world.setBounds(0, 0, 960, 540);
        this.cameras.main.setBounds(0, 0, 960, 540);
        this.cameras.main.startFollow(this.player);
        
        this.garbageDump = [];
        
        this.physics.add.overlap(this.projectiles, this.anteaters, function(projectile, enemy) {
            this.garbageDump.push(projectile);
            this.garbageDump.push(enemy);
        }.bind(this), null, this);
        
        this.cursors = this.input.keyboard.createCursorKeys();
        this.buttons = {
            w: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            a: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            s: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            d: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        };
        
        this.clicka = this.input.activePointer;
        this.canClick = false;
        
        this.internalClock = 0;
        
        /*this.music = this.sound.add("mainMusic");
        this.music.loop = true;
        this.music.play();*/
        
        this.anims.create({
            key: "anteaterWalk",
            frames: this.anims.generateFrameNumbers("anteater",
                {start: 0, end: 3}),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: "antHillWave",
            frames: this.anims.generateFrameNumbers("antHill",
                {start: 0, end: 1}),
            frameRate: 8,
            repeat: -1
        });
        this.fortress.play("antHillWave", true);
        
    }

    update() {
        if (this.buttons.a.isDown) {
            this.player.setVelocityX(-333);
        }
        if (this.buttons.d.isDown) {
            this.player.setVelocityX(333);
        }
        if (Phaser.Input.Keyboard.JustDown(this.buttons.w)) {
            this.player.setVelocityY(-543.21);
        }
        /* (this.cursors.down.isDown) {
            this.player.body.y+=10;
        }*/
        
        this.internalClock++;
        
        var relClickX = this.clicka.x + this.cameras.main.scrollX;
        
        if (this.clicka.isDown && this.canClick) {
            this.canClick = false;
            var ball = this.projectiles.create(this.player.x, this.player.y, "ball");
            ball.rotation = Math.atan2(this.clicka.y - this.player.y, relClickX - this.player.x);
            ball.setVelocityX(Math.cos(ball.rotation) * 1000);
            ball.setVelocityY(Math.sin(ball.rotation) * 1000);
            console.log("ball");
        }
        else if (!this.clicka.isDown) {
            this.canClick = true;
        }
        
        this.player.flipX = relClickX < this.player.x;
        
        var garbageDump = this.garbageDump;
        
        while (garbageDump.length > 0) {
            garbageDump.pop().destroy();
        }
        
        if (this.internalClock % 180 == 0) {
            var anteater = this.anteaters.create(810, 500, "anteater");
            anteater.play("anteaterWalk", true);
            console.log("anyeater");
            anteater.flipX = true;
            anteater.setVelocityX(-100);
            anteater.setScale(2);
            anteater.setGravityY(1200);
            anteater.setCollideWorldBounds(true);
        }
    }

}