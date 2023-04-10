import Phaser from 'phaser'

export default class HelloWorldScene extends Phaser.Scene {
	private platforms?: Phaser.Physics.Arcade.StaticGroup
	private player?: Phaser.Physics.Arcade.Sprite
	private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
	//private stars?: Phaser.Physics.Arcade.Group

	private score = 0
	private scoreText?: Phaser.GameObjects.Text

	private bombs?: Phaser.Physics.Arcade.Group

	private house?: Phaser.Physics.Arcade.StaticGroup

	private gameOver = false

	constructor() {
		super('hello-world')
	}

	preload() {
  		this.load.image('ground', 'assets/platform.png')
		this.load.image('scene1', 'assets/scene1-resize.jpeg')
		this.load.image('scene2', 'assets/scene2-resize.png')
		this.load.image('star', 'assets/star.png')
		this.load.image('scene3', 'assets/scene3-resize.png')
		this.load.image('house2', 'assets/house2-resize.png')
		this.load.image('barn', 'assets/barn-resize.png')
		this.load.image('house3', 'assets/house3-resize.png')
		this.load.image('hay', 'assets/bale-resize.png')
		this.load.spritesheet('cat', 'assets/cat-resize.png', {

			frameWidth: 32, frameHeight: 48
		})
	}

	create() {
		this.add.image(400, 300, 'scene1')

		this.platforms = this.physics.add.staticGroup();

		this.house = this.physics.add.staticGroup();

		//floor of game
		const ground = this.platforms.create(400, 568, 'ground') as Phaser.Physics.Arcade.Sprite
		ground
			.setScale(2)
			.refreshBody()
		
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
