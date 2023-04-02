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
		this.load.image('sky', 'assets/newbackg.png')
		this.load.image('ground', 'assets/platform.png')
		this.load.image('block2', 'assets/block2.png')
		//this.load.image('star', 'assets/star.png')
		this.load.image('bomb', 'assets/bomb.png')
		this.load.image('house', 'assets/house-pixelated.png')
		this.load.spritesheet('cat', 'assets/cat.png', {
			frameWidth: 32, frameHeight: 48
		})
	}

	create() {
		//sets background image
		this.add.image(400, 300, 'sky')

		this.platforms = this.physics.add.staticGroup();

		this.house = this.physics.add.staticGroup();

		//floor of game
		const ground = this.platforms.create(400, 568, 'ground') as Phaser.Physics.Arcade.Sprite
		ground
			.setScale(2)
			.refreshBody()
		
		const block2 = this.platforms.create(700, 520, 'block2') as Phaser.Physics.Arcade.Sprite
		block2
			.setScale(2)
			.refreshBody()
		
		const house = this.house.create(730, 320, 'house') as Phaser.Physics.Arcade.Sprite
		house
			.setScale(0.5)
			.refreshBody()


		this.player = this.physics.add.sprite(300, 300, 'cat')
		this.player.setBounce(0.2)
		this.player.setCollideWorldBounds(true)


		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers('cat', {
				start:0, end: 3 }),
			frameRate: 10,
			repeat: -1
		})

		this.anims.create({
			key: 'turn',
			frames: [{key: 'cat', frame: 4}],
			frameRate: 20
		})

		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers('cat', {
				start: 5, end:0 
			}),
			frameRate: 10,
			repeat: -1
		})


		this.physics.add.collider(this.player, this.platforms)

		this.physics.add.collider(this.player, this.house, this.reachHome, undefined, this)

		this.cursors = this.input.keyboard.createCursorKeys()
		/**
		this.stars = this.physics.add.group({
			key: 'star',
			repeat: 11,
			setXY: {x: 12, y: 0, stepX: 70}
		})

		this.stars.children.iterate(c => {
			const child = c as Phaser.Physics.Arcade.Image
			child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
		})
		*/

		//this.physics.add.collider(this.stars, this.platforms)
		//this.physics.add.overlap(this.player, this.stars, this.handleCollectStar, undefined, this)
		
		this.scoreText = this.add.text(16,16,'score: 0', {
			fontSize: '32px',
		})


		this.bombs = this.physics.add.group()

		this.physics.add.collider(this.bombs, this.platforms)
		this.physics.add.collider(this.bombs, this.player, this.handleHitBomb, undefined, this)

	}

	
	private handleHitBomb(player: Phaser.GameObjects.GameObject, b: Phaser.GameObjects.GameObject){
		this.physics.pause()
		this.player?.setTint(0xff0000)
		this.player?.anims.play('turn')
		this.gameOver = true
	}

	private reachHome (player: Phaser.GameObjects.GameObject, h: Phaser.GameObjects.GameObject){
		this.score += 10
		this.scoreText?.setText(`Score: ${this.score}`)
		this.physics.pause()
	}


	/** 
	private handleCollectStar(player: Phaser.GameObjects.GameObject, s: Phaser.GameObjects.GameObject){
		const star = s as Phaser.Physics.Arcade.Image
		star.disableBody(true,true)

		this.score += 10
		this.scoreText?.setText(`Score: ${this.score}`)

		if (this.stars?.countActive(true) === 0){
			this.stars.children.iterate(c => {
				const child = c as Phaser.Physics.Arcade.Image
				child.enableBody(true,child.x, 0, true, true)
			})
			
			if (this.player){
				const x = this.player.x < 400 ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0,400)

				const bomb: Phaser.Physics.Arcade.Image = this.bombs?.create(x,16,'bomb')
				bomb.setBounce(1)
				bomb.setCollideWorldBounds(true)
				bomb.setVelocity(Phaser.Math.Between(-200, 200), 20)
			}

		}

	}
	*/

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
