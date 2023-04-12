import Phaser from 'phaser'

export default class Cat extends Phaser.Physics.Arcade.Sprite{
    velocityX:number = 125; // 100
    velocityY:number = 125; // 100

    constructor(scene: Phaser.Scene, x:number, y:number){
        super(scene, x, y, 'cat');
        scene.add.existing(this);
        scene.physics.world.enableBody(this);
    }

    move(){
        this.setVelocityX(100)
        //if colide with platform, jump
        //if colide with house, dissapear
    }
}