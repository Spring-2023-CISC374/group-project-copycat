import { Physics } from "phaser"
import ImageButtonObject from "../objects/ImageButtonObject"

export default class Level2 extends Phaser.Scene {
    private platforms?: Phaser.Physics.Arcade.StaticGroup
    private player?: Phaser.Physics.Arcade.Sprite
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
    //private stars?: Phaser.Physics.Arcade.Group
    private score = 0
    private scoreText?: Phaser.GameObjects.Text
    private house?: Phaser.Physics.Arcade.StaticGroup
    private buttons?: Phaser.Physics.Arcade.StaticGroup
    private numCopies = 0;
    private maxCopies = 2;
    private shallowCopies = [] as Phaser.Physics.Arcade.Sprite[];

    private copiesLeft = 2;
    private copiesText?: Phaser.GameObjects.Text

    constructor() {
        super({ key: 'Level2' });
        console.log("in main - constructor");
    }

    create() {
        this.add.image(400, 300, 'scene2')

        this.add.existing(new ImageButtonObject(this, 780, 30, "reset-btn", () => {
            this.scene.start("Level2");
            this.numCopies = 0;
            this.shallowCopies = []
            this.copiesLeft = 2;
        }));

        this.platforms = this.physics.add.staticGroup();

        this.house = this.physics.add.staticGroup();

        this.buttons = this.physics.add.staticGroup();

        const block2 = this.platforms.create(600, 450, 'star') as Phaser.Physics.Arcade.Sprite
        block2
            .setScale(2)
            .refreshBody()
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.platformClick(block2))

        const house = this.house.create(730, 320, 'house2') as Phaser.Physics.Arcade.Sprite
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

    private reachHome() {
        this.score += 10;
        if (this.maxCopies > 0) {
            this.score += (this.maxCopies - this.numCopies) * 5;
        }
        this.scoreText?.setText(`Score: ${this.score}`)
        this.scene.start("Level3");
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
        console.log("shallow")
        this.buttons?.setVisible(false)
        const shallowCopy = this.platforms?.create((platform.x - 50) - (50 * this.numCopies), platform.y, 'star') as Phaser.Physics.Arcade.Sprite
        this.numCopies++;
        if (this.numCopies == 1) {
            this.shallowCopies.push(platform)
        }
        this.shallowCopies.push(shallowCopy)
        shallowCopy
            .setScale(2)
            .refreshBody()
            .setInteractive()
        this.copiesLeft -= 1
        this.copiesText?.setText(`copies: ${this.copiesLeft}`)
    }

    private deepCopyBtn(platform: Physics.Arcade.Sprite) {
        this.numCopies++;
        console.log("deep")
        this.buttons?.setVisible(false)
        const deepCopy = this.platforms?.create((platform.x - 50) - (50 * this.numCopies), platform.y, 'star') as Phaser.Physics.Arcade.Sprite
        deepCopy
            .setScale(2)
            .refreshBody()
            .setInteractive()
            .on('drag', function (_pointer: Phaser.Input.Pointer, dragX: number, dragY: number) {
                deepCopy.setPosition(dragX, dragY);
                deepCopy.body.updateFromGameObject();
            });
        this.input.on('pointerdown', (_pointer: Phaser.Input.Pointer) => {
            this.input.setDraggable(deepCopy, true);
        })
        
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