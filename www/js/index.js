import LoadScene from "./scenes/loadScene.js";
import MainScene from "./scenes/mainScene.js";
import PlayScene from "./scenes/playScene.js";
import FxScene from "./scenes/fxScene.js";
import GameOverScene from "./scenes/gameOverScene.js";
import PauseScene from "./scenes/pauseScene.js";
import StartScene from "./scenes/startScene.js";

document.addEventListener('deviceready', function() 
{
    var config = {
        type: Phaser.AUTO,
        parent: 'game',
        width: 800,
        height: 480,
        scene: [LoadScene, StartScene, MainScene, PlayScene, GameOverScene, PauseScene, FxScene],
        backgroundColor: '#36B0C1',
        pixelArt: true,
        physics: {
            default: "arcade",
            arcade: {
                gravity: { 
                    y: 640 
                }
            }
        },
    };
    
    var game = new Phaser.Game(config);
});

//Prevent right click menu from showing because it is annoying
document.addEventListener('contextmenu', event => event.preventDefault());