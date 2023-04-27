import ImageButtonObject from "../objects/ImageButtonObject";
import {TextButtonObject} from "../objects/TextButtonObject";

export default class StartScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScreen' });
        console.log("in main - constructor");
    }

    
    create() {
        this.add.image(400, 300, 'main');

        this.add.existing(new ImageButtonObject(this, 675, 57, "instruct-button", () => {
            this.scene.start("Instructions");
        }));

        this.add.existing(new ImageButtonObject(this, 600, 200, "lvl-1", () => {
            this.scene.start("Level1");
        }));

        this.add.existing(new ImageButtonObject(this, 600, 300, "lvl-2", () => {
            this.scene.start("Level2");
        }));
        
        this.add.existing(new ImageButtonObject(this, 600, 420, "lvl-3", () => {
            this.scene.start("Level3");
        }));

        /*
        this.add.existing(new TextButtonObject(this, 700, 400, 
            "Instructions", () => {
                // starts up the tutorial scene when clicked
                this.scene.start('Instructions');
            }))

        
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
        */
    }
}