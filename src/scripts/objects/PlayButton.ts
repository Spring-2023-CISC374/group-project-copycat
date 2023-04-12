import Phaser from 'phaser'
import Cat from './Cat';

export default class PlayButton extends Phaser.Physics.Arcade.Image{
    inputEnabled = true;
    
    constructor(scene: Phaser.Scene, x:number, y:number){
        super(scene, x, y, 'start');
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    getInput(kitty: Cat){
        kitty.move();
    }
}
