class StudioLogo extends Phaser.Scene {

    constructor() {
        super("studio-logo");
    }

    preload() {
        this.load.image("studioLogo", "assets/image/studioLogo.png");
    }

    create() {
        this.logo = this.add.image(480, 270, "studioLogo");
        this.frame = 0;
    }

    update() {
        this.frame++;
        this.logo.setScale(1 - 1 / (this.frame / 50 + 1));
        
        if (this.frame == 210) this.scene.start("arena");
    }

}