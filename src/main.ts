import Phaser from 'phaser'

import StartScreen from './scripts/scenes/StartScreen'
import PreLoadScene from './scripts/scenes/PreLoadScene'
import Level1 from './scripts/scenes/Level1Scene'
import Level2 from './scripts/scenes/Level2Scene'
import Level3 from './scripts/scenes/Level3Scene'
import Instructions from './scripts/scenes/InstructionsScene'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'app',
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 300 },
			debug: false
		},
	},
	scene: [PreLoadScene,StartScreen,Level1,Level2,Level3,Instructions],
}

export default new Phaser.Game(config)
