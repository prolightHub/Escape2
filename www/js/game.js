var Game = (function() 
{
    /*
        @Class

        This class handles the startup of all game scenes; Maybe?
        It is not a god object, it is stateless (with a few exceptions), it only defines methods
        that call other methods and sometimes stores a variable in the method scope, until that method is done 
    */

    class Game {
        onDoor (scene)
        {
            scene.scene.get("fxScene").fadeOut(undefined, () =>
            {
                var player = gameObjects.player;
                var touchedObject = player.touchedObject;

                const [ doorLevel, doorSymbol ] = touchedObject.obj.properties;

                levelHandler.levelName = doorLevel.value;
                levelHandler.doorSymbol = doorSymbol.value;
                levelHandler.travelType = "door";

                scene.scene.restart();

                delete player.touchedObject;
                player.enteredDoor = false;
            });
        }

        save (scene, player, checkPoint)
        {
            this.storedSaveData = {
                levelName: levelHandler.levelName,
                checkPoint: {
                    pixelX: checkPoint.pixelX,
                    pixelY: checkPoint.pixelY
                },
                player: {
                    // Stuff for player goes here
                    hp: player.hp,
                    maxHp: player.maxHp
                }
            };

            console.log("Game Saved!");
        }

        beforePlaySceneLoad (player)
        {
            if(!this.storedSaveData)
            {
                return;
            }

            if(!player || player.dead)
            {
                levelHandler.levelName = this.storedSaveData.levelName;
                levelHandler.travelType = "checkPoint";
            }
        }

        gameOver (scene)
        {
            levelHandler.levelName = levelHandler.lastSpawnPointLevel || levelHandler.levelName;
            levelHandler.travelType = "spawnPoint";

            scene.scene.get("fxScene").fadeOut();

            // Doing this fix for now.
            window.setTimeout(() =>
            {
                scene.scene.start("mainScene");
            }, 500);
        }

        putSaveDataIntoScene (scene)
        {
            if(!this.storedSaveData)
            {
                return;
            }

            gameObjects.player.hp = this.storedSaveData.player.hp;
            gameObjects.player.maxHp = this.storedSaveData.player.maxHp;

            gameObjects.player.sprite.x = this.storedSaveData.checkPoint.pixelX + gameObjects.player.sprite.width / 2;
            gameObjects.player.sprite.y = this.storedSaveData.checkPoint.pixelY + gameObjects.player.sprite.height / 2;
        }
    }

    var instance;

    return {
        GetInstance: function() 
        {
            if(!instance) 
            {
                instance = new Game();
            }
            return instance;
        }
    };
})();

export default Game.GetInstance();