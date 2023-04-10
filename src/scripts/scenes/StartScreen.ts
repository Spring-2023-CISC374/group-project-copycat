import {TextButtonObject} from "../objects/TextButtonObject";

export default class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScreen' });
        console.log("in main - constructor");
    }

    
    create() {
        this.add.image(400, 300, 'main');

        this.add.existing(new TextButtonObject(this, 700, 200, 
        "Level 1", () => {
            // starts up the tutorial scene when clicked
            this.scene.start('Level1');
        }))    

        this.add.existing(new TextButtonObject(this, 700, 300, 
        "Level 2", () => {
            // starts up the tutorial scene when clicked
            this.scene.start('Level2');
        })) 

        this.add.existing(new TextButtonObject(this, 700, 400, 
        "Level 3", () => {
            // starts up the tutorial scene when clicked
            this.scene.start('Level3');
        })) 
    }
}