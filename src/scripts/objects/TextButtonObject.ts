/**
 * Button class heavily based on
 * https://snowbillr.github.io/blog//2018-07-03-buttons-in-phaser-3/
 */
// this is a 'text' button 
// x location middle but you can change constructor to pass x value
export class TextButtonObject extends Phaser.GameObjects.Text {
    constructor(scene: Phaser.Scene, x: number, y: number, text: string, callback: () => void) {
        super(scene, x, y, text, {});
        console.log("in text button - " + text)
       
        this.setInteractive({ useHandCursor: true })
            .on('pointerover', () => this.enterButtonHoverState())
            .on('pointerout', () => this.enterButtonRestState())
            .on('pointerdown', () => this.enterButtonActiveState())
            .on('pointerup', () => {
                this.enterButtonHoverState();
                callback();
            });           
    }

    enterButtonHoverState() {
        this.setStyle({ fill: '#ff0' });
    }

    enterButtonRestState() {
        this.setStyle({ fill: '#0f0' });
    }

    enterButtonActiveState() {
        this.setStyle({ fill: '#0ff' });
    }
}
