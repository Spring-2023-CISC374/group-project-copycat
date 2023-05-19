import { Physics } from "phaser"
import ImageButtonObject from "../objects/ImageButtonObject"


export default class Level3 extends Phaser.Scene {
    private platforms?: Phaser.Physics.Arcade.StaticGroup
    private player?: Phaser.Physics.Arcade.Sprite
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
    //private stars?: Phaser.Physics.Arcade.Group
    private score = 0
    private scoreText?: Phaser.GameObjects.Text
    private house?: Phaser.Physics.Arcade.StaticGroup
    private river?: Phaser.Physics.Arcade.StaticGroup
    private buttons?: Phaser.Physics.Arcade.StaticGroup

    private numCopies = 0;
    private maxCopies = 1;
    private endText?: Phaser.GameObjects.Text
    private endText2?: Phaser.GameObjects.Text
    private shallowCopies = [] as Phaser.Physics.Arcade.Sprite[]
    private shallowCopy: Phaser.Physics.Arcade.Sprite | undefined;
    //private music?: Phaser.Sound.BaseSound

    private copiesLeft = 1;
    private copiesText?: Phaser.GameObjects.Text

    constructor() {
        super({ key: 'Level3' });
        //console.log("in main - constructor");
    }



    create() {
        //scene setup- background, objects, help button, rules, etc
        this.add.image(400, 300, 'scene3')

        const rules = this.add.image(400, 300, 'rulesL3').setScale(1);
        rules.visible = false;
        rules.depth = 1;

        this.add.existing(new ImageButtonObject(this, 100, 150, "help", () => {
            rules.visible = !rules.visible;
        })).setScale(0.25);

        this.add.existing(new ImageButtonObject(this, 780, 30, "reset-btn", () => {
            this.scene.start("Level3");
            this.numCopies = 0;
            this.shallowCopies = []
            this.copiesLeft = 1;
        }));

        this.platforms = this.physics.add.staticGroup();

        this.house = this.physics.add.staticGroup();

        this.river = this.physics.add.staticGroup();

        this.buttons = this.physics.add.staticGroup();

        //this is solely to avoid phaser warnings
        this.endText = this.add.text(0,0, '');
        this.endText
        this.endText2 = this.add.text(0,0, '');
        this.endText2

        //creates original lilypad platform (& will move shallow copy if there is one)
        const block2 = this.platforms.create(600, 520, 'lily-glow') as Phaser.Physics.Arcade.Sprite
        block2
            .setScale(2)
            .refreshBody()
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.platformClick(block2))
        //Makes original block dragable
        this.input.setDraggable(block2, true);
        block2.on('drag',  (_pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
            block2.setPosition(dragX, dragY);
            block2.body.updateFromGameObject();
            //If there is a shallow copy, move original and copy together
            if (this.shallowCopy) {
                this.shallowCopy.setPosition(dragX - 100, dragY);
                this.shallowCopy.body.updateFromGameObject();
            }
        });

        //Creates river boundry
        const river = this.river.create(650, 600, 'water') as Phaser.Physics.Arcade.Sprite
        river

        const house = this.house.create(730, 320, 'house3') as Phaser.Physics.Arcade.Sprite
        house
            .refreshBody()


        this.player = this.physics.add.sprite(100, 450, 'cat')
        this.player.setBounce(0.2)
        this.player.setCollideWorldBounds(true)


        this.physics.add.collider(this.player, this.platforms)
        this.physics.add.collider(this.player, this.river, this.handleRiver, undefined, this)

        this.physics.add.collider(this.player, this.house, this.reachHome, undefined, this)

        this.cursors = this.input.keyboard.createCursorKeys()

        this.scoreText = this.add.text(16, 16, 'score: 0', {
            fontSize: '32px',
        })

        this.copiesText = this.add.text(16, 48, 'copies: 1', {
            fontSize: '32px',
        })

    }

    //if player hits river, they have failed the level, game resets
    private handleRiver() {
        this.player?.setCollideWorldBounds(false);
        this.numCopies = 0
        this.copiesLeft = 1
        this.add.existing(new ImageButtonObject(this, 400, 300, "reset-btn", () => {
            this.scene.start("StartScreen");
        }));
    }

    //if player reaches the house, they win the game
    private reachHome() {
        this.score += 10;
        if (this.maxCopies > 0) {
            this.score += (this.maxCopies - this.numCopies) * 5;
            this.maxCopies = 0;
        }
        this.scoreText?.setText(`Score: ${this.score}`)
        this.endText = this.add.text(200, 210,'You got the cat home!', {
            fontSize: '32px'
        })
        this.endText2 = this.add.text(200, 180,'Try again to beat your score!', {
            fontSize: '32px'
        })
        this.physics.pause()
        this.add.existing(new ImageButtonObject(this, 400, 300, "reset-btn", () => {
            this.scene.start("StartScreen");
        }))
    }

    //ability to make copies
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

    //ability to make shallow copy; a shallow copy created will move when a deep copy moves
    private shallowCopyBtn(platform: Physics.Arcade.Sprite) {
        console.log("shallow")
        this.buttons?.setVisible(false) //Hides buttons
        const shallowCopy = this.platforms?.create((platform.x - 100) - (50 * this.numCopies), platform.y, 'lily') as Phaser.Physics.Arcade.Sprite
        this.numCopies++;  //Increases number of copies used
        //If this is the first shallow copy, add the original platform to shallow copies array
        if (this.numCopies == 1) {
            this.shallowCopies.push(platform)
        }
        this.shallowCopies.push(shallowCopy)    //Add shallow copy to array
        shallowCopy
            .setScale(2)
            .refreshBody()
            .setInteractive()
        this.input.setDraggable(shallowCopy, true);
        //Sets draggability
        shallowCopy
            .setInteractive({ draggable: true })
            .on('drag', function (_pointer: Phaser.Input.Pointer, dragX: number, dragY: number) {
                shallowCopy.setPosition(dragX, dragY);
                shallowCopy.body.updateFromGameObject();
                platform.setPosition(dragX + 100, dragY);
                platform.body.updateFromGameObject();
            });
        //Updates number of copies left and the on screen text
        this.shallowCopy = shallowCopy;
        this.copiesLeft -= 1
        this.copiesText?.setText(`copies: ${this.copiesLeft}`)
    }

    //allows user to make deep copy of lilypad, has ability to move freely of original
    private deepCopyBtn(platform: Physics.Arcade.Sprite) {
        this.numCopies++;
        console.log("deep")
        this.buttons?.setVisible(false) //Hides buttons
        const deepCopy = this.platforms?.create((platform.x - 50) - (50 * this.numCopies), platform.y, 'lily') as Phaser.Physics.Arcade.Sprite
        deepCopy
            .setScale(2)
            .refreshBody()
            .setInteractive()
        this.input.setDraggable(deepCopy, true);
        //Sets draggability
        deepCopy
            .setInteractive({ draggable: true })
            .on('drag', function (_pointer: Phaser.Input.Pointer, dragX: number, dragY: number) {
                deepCopy.setPosition(dragX, dragY);
                deepCopy.body.updateFromGameObject();
            });
        //Updates number of copies left and the on screen text
        this.copiesLeft -= 1
        this.copiesText?.setText(`copies: ${this.copiesLeft}`)
    }

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