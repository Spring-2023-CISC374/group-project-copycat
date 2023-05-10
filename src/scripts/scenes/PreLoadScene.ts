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
        this.load.image('instructions','assets/instructions.png' )
        this.load.image('lily', 'assets/pad-resize.png')
        this.load.image('deep', 'assets/deepcopy-button.png')
        this.load.image('shallow', 'assets/shallowcopy-button.png')
        this.load.image('ground', 'assets/platform.png')
        this.load.image('cancel', 'assets/cancel-button.png')
        this.load.image('water', 'assets/water.png')
        this.load.image('instruct-button', 'assets/instruct-button.png')
        this.load.image('lvl-1', 'assets/lvl-1.png')
        this.load.image('lvl-2', 'assets/lvl-2.png')
        this.load.image('lvl-3', 'assets/lvl-3.png')
        this.load.image('reset-btn', 'assets/reset-btn.png')

        this.load.spritesheet('cat', 'assets/cat.png', {

            frameWidth: 32, frameHeight: 48
        })
        this.load.image('help', 'assets/help_txt.png')
        this.load.image('rulesL1', 'assets/rules_lvl1.png')
        this.load.image('rulesL2', 'assets/rules_lvl2.png')
        this.load.image('rulesL3', 'assets/rules_lvl3.png')
    }
  
    create() {
      //starts with the main menu scene
      this.scene.start('StartScreen');
      //console.log("done with preload");
    }

  }
