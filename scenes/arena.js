class Arena extends Phaser.Scene {

    constructor() {
        super("arena");
    }

    preload() {
        this.load.spritesheet("ant", "assets/image/gun_base.png", { frameWidth: 37, frameHeight: 50 });
        this.load.spritesheet("anteater", "assets/image/anteater.png", { frameWidth: 60, frameHeight: 29 });
        this.load.spritesheet("antHill", "assets/image/anthill.png", { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet("maxim", "assets/image/ant_gun.png", { frameWidth: 96, frameHeight: 32 });
        this.load.spritesheet("ball", "assets/image/bullet_ant.png", { frameWidth: 16, frameHeight: 8 });
        this.load.image("forestBG", "assets/image/forest_background.png");
        this.load.image("floorTransparent", "assets/image/floor_transparent.png");
        this.load.audio("blast", "assets/sounds/shot.wav");
    }

    create() {
        this.sound.stopAll();
        
        var bg = this.add.image(480, 270, "forestBG");
        bg.setScale(3.5);
        
        this.floor = this.physics.add.sprite(480, 454, "floorTransparent");
        this.floor.setCollideWorldBounds(true);

        
        this.player = this.physics.add.sprite(69, -69, "ant");
        this.player.setScale(2);
        this.player.setGravityY(1200);
        this.player.setDragX(543.21);
        this.player.setDragY(333);
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.floor, this.player);
        
        this.projectiles = this.physics.add.group();
        
        this.anteaters = this.physics.add.group();
        this.physics.add.collider(this.anteaters, this.floor);

        
        this.fortress = this.physics.add.sprite(100, 200, "antHill");
        this.fortress.setScale(2);
        this.fortress.setCollideWorldBounds(true);
        this.fortress.setGravityY(1200);
        this.physics.add.collider(this.fortress, this.floor);
        
        this.firearm = this.physics.add.sprite(this.player.x, this.player.y, "maxim");
        this.firearm.setScale(2);
        this.firearm.flipX = true;
        this.firearm.setDepth(5);
        
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
        this.anims.create({
            key: "antChillin",
            frames: this.anims.generateFrameNumbers("ant",
                {start: 0, end: 1}),
            frameRate: 8,
            repeat: -1
        });
        this.player.play("antChillin", true);
        this.anims.create({
            key: "fire",
            frames: this.anims.generateFrameNumbers("maxim",
                {start: 0, end: 4}),
            frameRate: 8,
            repeat: 0
        });
        this.firearm.on("animationcomplete", function() {
            this.setTexture("maxim", 0);
        });
        this.anims.create({
            key: "flyingAnt",
            frames: this.anims.generateFrameNumbers("ball",
                {start: 0, end: 1}),
            frameRate: 8,
            repeat: -1
        });
        
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
            ball.setScale(2);
            ball.rotation = Math.atan2(this.clicka.y - this.player.y, relClickX - this.player.x);
            ball.setVelocityX(Math.cos(ball.rotation) * 1000);
            ball.setVelocityY(Math.sin(ball.rotation) * 1000);
            ball.play("flyingAnt", true);
            console.log("ball");
            var sound = this.sound.add("blast");
            sound.play();
            this.firearm.play("fire", false);
        }
        else if (!this.clicka.isDown) {
            this.canClick = true;
        }
        
        this.player.flipX = relClickX >= this.player.x;
        
        this.firearm.x = this.player.x; this.firearm.y = this.player.y;
        this.firearm.rotation = Math.atan2(this.clicka.y - this.player.y, relClickX - this.player.x);
        this.firearm.x += Math.cos(this.firearm.rotation) * 50;
        this.firearm.y += Math.sin(this.firearm.rotation) * 50;
        
        this.floor.setVelocityY(0);
        
        
        var garbageDump = this.garbageDump;
        
        while (garbageDump.length > 0) {
            garbageDump.pop().destroy();
        }
        
        if (this.internalClock % 180 == 0) {
            var anteater = this.anteaters.create(810, 100, "anteater");
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