export default class PreLoadScene extends Phaser.Scene {
    constructor() {
      super({ key: 'PreLoadScene' });
      //console.log("in preload constructor");
    }
  
    preload() {
        // loads all the images for the project
        this.load.image('scene1', 'assets/scene1-resize.jpeg')
        this.load.image('scene2', 'assets/scene2-resize.png')
        this.load.image('star', 'assets/star.png')
        this.load.image('scene3', 'assets/scene3-resize.png')
        this.load.image('house2', 'assets/house2-resize.png')
        this.load.image('barn', 'assets/barn-resize.png')
        this.load.image('house3', 'assets/house3-resize.png')
        this.load.image('hay', 'assets/bale-resize.png')
        this.load.image('main','assets/copy-cat.png' )
        this.load.image('lily', 'assets/pad-resize.png')
        this.load.spritesheet('cat', 'assets/cat-resize.png', {

            frameWidth: 32, frameHeight: 48
        })
    }
  
    create() {
      //starts with the main menu scene
      this.scene.start('StartScreen');
      //console.log("done with preload");
    }

  }