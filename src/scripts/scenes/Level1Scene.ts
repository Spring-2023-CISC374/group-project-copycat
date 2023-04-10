export default class MainMenu extends Phaser.Scene {
    private platforms?: Phaser.Physics.Arcade.StaticGroup
    private player?: Phaser.Physics.Arcade.Sprite
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
    //private stars?: Phaser.Physics.Arcade.Group
    private score = 0
    private scoreText?: Phaser.GameObjects.Text
    private house?: Phaser.Physics.Arcade.StaticGroup

    constructor() {
        super({ key: 'Level1' });
        console.log("in main - constructor");
    }



	create() {
		this.add.image(400, 300, 'scene1')

		this.platforms = this.physics.add.staticGroup();

		this.house = this.physics.add.staticGroup();

		const block2 = this.platforms.create(700, 520, 'hay') as Phaser.Physics.Arcade.Sprite
		block2
			.setScale(2)
			.refreshBody()
		
		const house = this.house.create(730, 320, 'barn') as Phaser.Physics.Arcade.Sprite
		house
			.refreshBody()


		this.player = this.physics.add.sprite(100, 450, 'cat')
		this.player.setBounce(0.2)
		this.player.setCollideWorldBounds(true)


		this.physics.add.collider(this.player, this.platforms)

		this.physics.add.collider(this.player, this.house, this.reachHome, undefined, this)

		this.cursors = this.input.keyboard.createCursorKeys()

		
		this.scoreText = this.add.text(16,16,'score: 0', {
			fontSize: '32px',
		})

    }

    private reachHome (player: Phaser.GameObjects.GameObject, h: Phaser.GameObjects.GameObject){
        this.score += 10
        this.scoreText?.setText(`Score: ${this.score}`)
        this.physics.pause()
    }



    update(){
        if (!this.cursors){
            return
        }
        if (this.cursors.left?.isDown){
            this.player?.setVelocityX(-160)
            this.player?.anims.play('left', true)
        } else if (this.cursors.right?.isDown) {
            this.player?.setVelocityX(160)
            this.player?.anims.play('right', true)
        } else {
            this.player?.setVelocityX(0)
            this.player?.anims.play('turn')
        }
        if (this.cursors.up?.isDown && this.player?.body.touching.down){
            this.player.setVelocity(-330)
        }
    }
}
