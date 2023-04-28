import { Physics } from "phaser"
import ImageButtonObject from "../objects/ImageButtonObject"

export default class Level3 extends Phaser.Scene {
    private platforms?: Phaser.Physics.Arcade.StaticGroup
    private player?: Phaser.Physics.Arcade.Sprite
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
    private spaceBtn?: Phaser.Input.Keyboard.Key
    //private stars?: Phaser.Physics.Arcade.Group
    private score = 0
    private scoreText?: Phaser.GameObjects.Text
    private house?: Phaser.Physics.Arcade.StaticGroup
    private buttons?: Phaser.Physics.Arcade.StaticGroup
    
    private numCopies = 0;
    private maxCopies = 1;
    private shallowCopies = [] as Phaser.Physics.Arcade.Sprite[];
    private hasCopied = false
    private music?: Phaser.Sound.BaseSound

    constructor() {
        super({ key: 'Level3' });
        //console.log("in main - constructor");
    }



    create() {

        this.add.image(400, 300, 'scene3')

        this.add.existing(new ImageButtonObject(this, 780, 30, "reset-btn", () => {
            this.scene.start("Level3");
        }));

        this.platforms = this.physics.add.staticGroup();

        this.house = this.physics.add.staticGroup();

        this.buttons = this.physics.add.staticGroup();

        const block2 = this.platforms.create(700, 520, 'lily') as Phaser.Physics.Arcade.Sprite
        block2
            .setScale(2)
            .refreshBody()
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.platformClick(block2))
        this.input.setDraggable(block2, true);
        block2.on('drag', function (pointer: Phaser.Input.Pointer, dragX: int, dragY: int) {
            block2.setPosition(dragX, dragY);
            block2.body.updateFromGameObject();
        });

        const house = this.house.create(730, 320, 'house3') as Phaser.Physics.Arcade.Sprite
        house
            .refreshBody()


        this.player = this.physics.add.sprite(100, 450, 'cat')
        this.player.setBounce(0.2)
        this.player.setCollideWorldBounds(true)


        this.physics.add.collider(this.player, this.platforms)

        this.physics.add.collider(this.player, this.house, this.reachHome, undefined, this)

        this.cursors = this.input.keyboard.createCursorKeys()
        this.spaceBtn = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.scoreText = this.add.text(16, 16, 'score: 0', {
            fontSize: '32px',
        })

    }

    private reachHome() {
        this.score += 10;
        if (this.maxCopies > 0) {
            this.score += (this.maxCopies - this.numCopies) * 5;
        }
        this.scoreText?.setText(`Score: ${this.score}`)
        this.physics.pause()
        this.add.existing(new ImageButtonObject(this, 400, 300, "reset-btn", () => {
            this.scene.start("StartScreen");
        }));
    }

    private platformClick(platform: Phaser.Physics.Arcade.Sprite) {
        if (this.numCopies < this.maxCopies) {
            const deep = this.buttons?.create(300, 500, 'deep') as Phaser.Physics.Arcade.Sprite
            deep.setInteractive({ useHandCursor: true })
                .on('pointerdown', () => this.deepCopyBtn(platform))
            const shallow = this.buttons?.create(500, 500, 'shallow') as Phaser.Physics.Arcade.Sprite
            shallow.setInteractive({ useHandCursor: true })
                .on('pointerdown', () => this.shallowCopyBtn(platform))
            const cancel = this.buttons?.create(400, 560, 'cancel') as Phaser.Physics.Arcade.Sprite
            cancel.setInteractive({ useHandCursor: true })
                .on('pointerdown', () => this.buttons?.setVisible(false))
        }
    }

    private shallowCopyBtn(platform: Physics.Arcade.Sprite) {
        var rescale = 2;
        console.log("shallow")
        this.buttons?.setVisible(false)
        const shallowCopy = this.platforms?.create((platform.x - 50) - (50 * this.numCopies), platform.y, 'lily') as Phaser.Physics.Arcade.Sprite
        this.numCopies++;
        if (this.numCopies == 1) {
            this.shallowCopies.push(platform)
        }
        this.shallowCopies.push(shallowCopy)
        shallowCopy
            .setScale(2)
            .refreshBody()
            .setInteractive()
        this.input.setDraggable(shallowCopy, true);
        shallowCopy
            .setInteractive({ draggable: true })
            .on('drag', function (pointer: Phaser.Input.Pointer, dragX: int, dragY: int) {
                shallowCopy.setPosition(dragX, dragY);
                shallowCopy.body.updateFromGameObject();
            });
    }

    private deepCopyBtn(platform: Physics.Arcade.Sprite) {
        this.numCopies++;
        console.log("deep")
        this.buttons?.setVisible(false)
        const deepCopy = this.platforms?.create((platform.x - 50) - (50 * this.numCopies), platform.y, 'lily') as Phaser.Physics.Arcade.Sprite
        deepCopy
            .setScale(2)
            .refreshBody()
            .setInteractive()
            .setInteractive({ draggable: true })
            .on('drag', function (pointer: Phaser.Input.Pointer, dragX: int, dragY: int) {
                deepCopy.setPosition(dragX, dragY);
                deepCopy.body.updateFromGameObject();
            });
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