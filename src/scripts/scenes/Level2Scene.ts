import { Physics } from "phaser"

export default class Level2 extends Phaser.Scene {
    private platforms?: Phaser.Physics.Arcade.StaticGroup
    private player?: Phaser.Physics.Arcade.Sprite
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
    private spaceBtn?: Phaser.Input.Keyboard.Key
    //private stars?: Phaser.Physics.Arcade.Group
    private score = 0
    private scoreText?: Phaser.GameObjects.Text
    private house?: Phaser.Physics.Arcade.StaticGroup
    private buttons?: Phaser.Physics.Arcade.StaticGroup

    constructor() {
        super({ key: 'Level2' });
        console.log("in main - constructor");
    }

    create() {
        this.add.image(400, 300, 'scene2')

        this.platforms = this.physics.add.staticGroup();

        this.house = this.physics.add.staticGroup();

        this.buttons = this.physics.add.staticGroup();

        const block2 = this.platforms.create(700, 520, 'star') as Phaser.Physics.Arcade.Sprite
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
        this.spaceBtn = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.scoreText = this.add.text(16, 16, 'score: 0', {
            fontSize: '32px',
        })

    }

    private reachHome(player: Phaser.GameObjects.GameObject, h: Phaser.GameObjects.GameObject) {
        this.score += 10
        this.scoreText?.setText(`Score: ${this.score}`)
        this.physics.pause()
    }

    private platformClick(platform: Phaser.Physics.Arcade.Sprite) {
        const deep = this.buttons?.create(300, 520, 'deep') as Phaser.Physics.Arcade.Sprite
        deep.setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.deepCopyBtn(platform))
        const shallow = this.buttons?.create(500, 520, 'shallow') as Phaser.Physics.Arcade.Sprite
        shallow.setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.shallowCopyBtn(platform))
    }

    private shallowCopyBtn(platform: Physics.Arcade.Sprite) {
        console.log("shallow")
        this.buttons?.setVisible(false)
        var draggable = false;
        const shallowCopy = this.platforms?.create(platform.x - 75, platform.y, 'star') as Phaser.Physics.Arcade.Sprite
        shallowCopy
            .setScale(2)
            .refreshBody()
            .setInteractive()
        this.input.on('pointerdown', () => {
            this.input.setDraggable(shallowCopy, true);
            draggable = true;
        })

        // listen for pointer up event on the scene
        this.input.on('pointerup', () => {
            // stop dragging when the pointer is released
            this.input.setDraggable(shallowCopy, false);
            draggable = false;
        });

        // listen for pointer move event on the scene
        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            // update sprite position while dragging
            if (draggable) {
                shallowCopy.x = pointer.worldX;
                shallowCopy.y = pointer.worldY;
                shallowCopy.body.updateFromGameObject();
            }
        });
    }


    private deepCopyBtn(platform: Physics.Arcade.Sprite) {
        console.log("deep")
        this.buttons?.setVisible(false)
        var draggable = false;
        const deepCopy = this.platforms?.create(platform.x - 75, platform.y, 'star') as Phaser.Physics.Arcade.Sprite
        deepCopy
            .setScale(2)
            .refreshBody()
            .setInteractive()
        this.input.on('pointerdown', () => {
            this.input.setDraggable(deepCopy, true);
            draggable = true;
        })

        // listen for pointer up event on the scene
        this.input.on('pointerup', () => {
            // stop dragging when the pointer is released
            this.input.setDraggable(deepCopy, false);
            draggable = false;
        });

        // listen for pointer move event on the scene
        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            // update sprite position while dragging
            if (draggable) {
                deepCopy.x = pointer.worldX;
                deepCopy.y = pointer.worldY;
                deepCopy.body.updateFromGameObject();
            }
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
        if (this.cursors.up?.isDown && this.player?.body.touching.down) {
            this.player.setVelocity(-330)
        }
        if (this.spaceBtn?.isDown) {
            console.log("space bar hit")
            this.player?.setVelocityY(1000)
        }
    }
}