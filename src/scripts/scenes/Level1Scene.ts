import { Physics } from "phaser"
import ImageButtonObject from "../objects/ImageButtonObject"

export default class MainMenu extends Phaser.Scene {
    private platforms?: Phaser.Physics.Arcade.StaticGroup
    private player?: Phaser.Physics.Arcade.Sprite
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
    //private stars?: Phaser.Physics.Arcade.Group
    private score = 0
    private scoreText?: Phaser.GameObjects.Text
    private house?: Phaser.Physics.Arcade.StaticGroup
    private buttons?: Phaser.Physics.Arcade.StaticGroup
    private numCopies = 0;
    private maxCopies = 2
    private shallowCopies = [] as Phaser.Physics.Arcade.Sprite[];

    private copiesLeft = 2;
    private copiesText?: Phaser.GameObjects.Text

    constructor() {
        super({ key: 'Level1' });
        console.log("in main - constructor");
    }


    create() {

        //adds scene images, help button, and setup for display (ie. barn and object)
        this.add.image(400, 300, 'scene1');

        const rules = this.add.image(400, 300, 'rulesL1').setScale(1);
        rules.visible = false;
        rules.depth = 1;

        this.add.existing(new ImageButtonObject(this, 100, 150, "help", () => {
            rules.visible = !rules.visible;
        })).setScale(0.25);


        this.add.existing(new ImageButtonObject(this, 780, 30, "reset-btn", () => {
            this.scene.start("Level1");
            this.numCopies = 0;
            this.copiesLeft = 2;
            this.shallowCopies =[]
        }));

        this.platforms = this.physics.add.staticGroup();

        this.house = this.physics.add.staticGroup();

        this.buttons = this.physics.add.staticGroup();

        const ground = this.platforms.create(780, 400, 'ground') as Phaser.Physics.Arcade.Sprite
        ground
            .refreshBody()

        //creates object to be copied: can drag and make copies of it
        const block2 = this.platforms.create(550, 430, 'hay-glow') as Phaser.Physics.Arcade.Sprite
        block2
            .setScale(1.6)
            .refreshBody()
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.platformClick(block2))
        //Makes original block dragable
        this.input.setDraggable(block2, true);
        block2.on('drag', function (_pointer: Phaser.Input.Pointer, dragX: number, dragY: number) {
            block2.setPosition(dragX, dragY);
            block2.body.updateFromGameObject();
        });

        const house = this.house.create(730, 320, 'barn') as Phaser.Physics.Arcade.Sprite
        house
            .refreshBody()

        this.player = this.physics.add.sprite(100, 450, 'cat')
        this.player.setBounce(0.2)
        this.player.setCollideWorldBounds(true)


        this.physics.add.collider(this.player, this.platforms)

        this.physics.add.collider(this.player, this.house, this.reachHome, undefined, this)

        this.cursors = this.input.keyboard.createCursorKeys()

        this.scoreText = this.add.text(16, 16, 'score: 0', {
            fontSize: '32px',
        })

        this.copiesText = this.add.text(16, 48, 'copies: 2', {
            fontSize: '32px',
        })


    }
    
    //player earns points for completing the level and if they have leftover copies - prompts new level to appear
    private reachHome() {
        this.score += 10
        if (this.maxCopies > 0) {
            this.score += (this.maxCopies - this.numCopies) * 5;
        }
        this.scoreText?.setText(`Score: ${this.score}`)
        console.log(this.score)
        this.scene.start("Level2");
    }

    //allows user to choose what copies they make (if they have copies left)
    private platformClick(platform: Phaser.Physics.Arcade.Sprite) {
        if (this.numCopies < this.maxCopies) {
            const deep = this.buttons?.create(300, 500, 'deep') as Phaser.Physics.Arcade.Sprite
            deep.setInteractive({ useHandCursor: true })
                .on('pointerdown', () => this.deepCopyBtn(platform))
            const shallow = this.buttons?.create(500, 500, 'shallow') as Phaser.Physics.Arcade.Sprite
            shallow.setInteractive({ useHandCursor: true })
                .on('pointerdown', () => this.shallowCopyBtn(platform))
            //Cancel button hides visibility when clicked
            const cancel = this.buttons?.create(400, 560, 'cancel') as Phaser.Physics.Arcade.Sprite
            cancel.setInteractive({ useHandCursor: true })
                .on('pointerdown', () => this.buttons?.setVisible(false))
        }
    }

    //makes a shallow copy where users can resize hay bale and it will effect original
    private shallowCopyBtn(platform: Physics.Arcade.Sprite) {
        var rescale = 2;
        console.log("shallow")
        this.buttons?.setVisible(false) //Hides buttons
        const shallowCopy = this.platforms?.create((platform.x - 50) - (50 * this.numCopies), platform.y, 'hay') as Phaser.Physics.Arcade.Sprite
        this.numCopies++;//Increases number of copies used
        //If this is the first shallow copy, add the original platform to shallow copies array
        if (this.numCopies == 1) {
            this.shallowCopies.push(platform)
        }
        this.shallowCopies.push(shallowCopy)    //Add shallow copy to array
        shallowCopy
            .setScale(2)
            .refreshBody()
            .setInteractive()
        //Resize when right clicked    
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            this.input.setDraggable(shallowCopy, true);
            if (pointer.rightButtonDown()) {
                if (rescale == 2) {
                    rescale = 3
                    this.shallowCopies.map((copy: Phaser.Physics.Arcade.Sprite) => { copy.setScale(3); copy.refreshBody() })
                }
                else if (rescale == 3) {
                    rescale = 4
                    this.shallowCopies.map((copy: Phaser.Physics.Arcade.Sprite) => { copy.setScale(4); copy.refreshBody() })
                }
                else {
                    rescale = 2
                    this.shallowCopies.map((copy: Phaser.Physics.Arcade.Sprite) => { copy.setScale(2); copy.refreshBody() })
                }
            }
        })
        //Sets draggability
        shallowCopy
            .setInteractive({ draggable: true })
            .on('drag', function (_pointer: Phaser.Input.Pointer, dragX: number, dragY: number) {
                shallowCopy.setPosition(dragX, dragY);
                shallowCopy.body.updateFromGameObject();
            });
        //Updates number of copies left and the on screen text
        this.copiesLeft -= 1
        this.copiesText?.setText(`copies: ${this.copiesLeft}`)
    }

    //allows user to make a deep copy of object that can be resized but will not change original
    private deepCopyBtn(platform: Physics.Arcade.Sprite) {
        this.numCopies++;
        console.log("deep")
        this.buttons?.setVisible(false) //Hides buttons
        var rescale = 2
        const deepCopy = this.platforms?.create((platform.x - 50) - (50 * this.numCopies), platform.y, 'hay') as Phaser.Physics.Arcade.Sprite
        deepCopy
            .setScale(2)
            .refreshBody()
            .setInteractive()
            //Sets draggability
            .on('drag', function (_pointer: Phaser.Input.Pointer, dragX: number, dragY: number) {
                deepCopy.setPosition(dragX, dragY);
                deepCopy.body.updateFromGameObject();
            });
        //Sets rescale
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            this.input.setDraggable(deepCopy, true);
            if (pointer.rightButtonDown()) {
                if (rescale == 2) {
                    rescale = 3
                    deepCopy
                        .setScale(3)
                        .refreshBody()
                }
                else if (rescale == 3) {
                    rescale = 4
                    deepCopy
                        .setScale(4)
                        .refreshBody()
                }
                else {
                    rescale = 2
                    deepCopy
                        .setScale(2)
                        .refreshBody()
                }
            }
        })
        //Updates number of copies left and the on screen text
        this.copiesLeft -= 1
        this.copiesText?.setText(`copies: ${this.copiesLeft}`)
    }

    //player controls
    update() {
        if (!this.cursors) {
            return
        }
        if (this.cursors.left?.isDown) {
            this.player?.setVelocityX(-160)
            this.player?.anims.play('left', true)
        } else if (this.cursors.right?.isDown) {
            this.player?.setVelocityX(160)
            this.player?.anims.play('right', true)
        } else {
            this.player?.setVelocityX(0)
            this.player?.anims.play('turn')
        }
        if (this.cursors.up?.isDown) {
            this.player?.setVelocityY(1000)
        }
    }

}
