var game = new Phaser.Game({
    type: Phaser.WEBGL,
    width: 960,
    height: 540,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0, x: 0 },
            debug: false,
            fps: 60
        }
    },
    fps: {
        target: 60,
        forceSetTimeOut: true
    },
    scene: [Arena],
    pixelArt: true
});