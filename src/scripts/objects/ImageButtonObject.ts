
// this is an 'image' button 
// tint changes on pointer events
export default class ImageButtonObject extends Phaser.GameObjects.Image {

    constructor(scene: Phaser.Scene, x: number, y: number,
         texture: string, callback: () => void) {
        super(scene, x, y, texture);
        console.log("in image button constructor")
          // creates an image with the asset image passed to the constructor
        
        this.setInteractive({ useHandCursor
            : true })
        .on('pointerover', () => this.enterButtonHoverState())
        .on('pointerout', () => this.enterButtonRestState())
        .on('pointerdown', () => this.enterButtonActiveState())
        .on('pointerup', () => {
            this.enterButtonHoverState();
            callback();
        });

    }

    enterButtonHoverState() {
        this.setTint(  0x44ff44 );
    }

    enterButtonRestState() {
        this.setTint( 0x42ff44 );
    }

    enterButtonActiveState() {
        this.setTint( 0x22ff44 );
    }
}
        



