import ImageButtonObject from "../objects/ImageButtonObject";

export default class Instructions extends Phaser.Scene {
    constructor() {
        super({ key: 'Instructions' });
    }

    
    create() {
        this.add.image(400, 300, 'instructions');

        this.add.existing(new ImageButtonObject(this, 600, 410, "cat", () => {
            this.scene.start("StartScreen");
        }));
        
    }
}