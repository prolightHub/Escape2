var Game = (function() 
{
    /*
        @Class

        This class handles the startup of all game scenes; Maybe?
        It is not a god object, it is stateless (with a few exceptions), it only defines methods
        that call other methods and sometimes stores a variable in the method scope, until that method is done 
    */

    class Game {
        
        init ()
        {
            this.cache = {};
            this.toSaveCache = {};
        }

        onDoor (scene)
        {
            this.toSaveCache[levelHandler.levelName] = this.cache[levelHandler.levelName] = this.saveTemp(scene);

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

        // Saves temporary items 
        saveTemp (scene)
        {
            var names = ["hearts", "waterBeakers"];

            var exists = {};

            for(var i = 0; i < names.length; i++)
            {   
                var objects = gameObjects[names[i]].getChildren();

                var objectIds = [];
                objects.forEach((object) => 
                {
                    objectIds.push(object.id);
                });

                var objectExists = Array(gameObjects[names[i]].length).fill(false);

                for(var j = 0; j < objectIds.length; j++)
                {
                    objectExists[objectIds[j]] = true;
                }

                exists[names[i]] = objectExists;
            }

            return {
                exists: exists
            };
        }

        // Loads temporary items 
        loadTemp (cache)
        {
            if(cache[levelHandler.levelName] === undefined)
            {
                return;
            }

            var names = ["hearts", "waterBeakers"];

            for(var i = 0; i < names.length; i++)
            {
                var objects = gameObjects[names[i]].getChildren();

                var objectExists = cache[levelHandler.levelName].exists[names[i]];

                for(var j = 0; j < objectExists.length; j++)
                {
                    if(!objectExists[j])
                    {
                        objects.find(object => object.id === j).destroy();
                    }
                }
            }
        }

        save (scene, player, checkPoint)
        { 
            var cache = this.toSaveCache;
            cache[levelHandler.levelName] = this.saveTemp(scene);

            this.storedSaveData = {
                levelName: levelHandler.levelName,
                checkPoint: {
                    pixelX: checkPoint.pixelX,
                    pixelY: checkPoint.pixelY
                },
                cache: cache,
                player: {
                    // Stuff for player goes here
                    hp: player.hp,
                    maxHp: player.maxHp
                },
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
                this.toSaveCache = this.storedSaveData.cache;

                levelHandler.levelName = this.storedSaveData.levelName;
                levelHandler.travelType = "checkPoint";
            }
        }

        putSaveDataIntoScene (scene)
        {
            if(!this.storedSaveData)
            {
                return;
            }

            this.loadTemp(this.toSaveCache);

            gameObjects.player.hp = this.storedSaveData.player.hp;
            gameObjects.player.maxHp = this.storedSaveData.player.maxHp;

            gameObjects.player.sprite.x = this.storedSaveData.checkPoint.pixelX + gameObjects.player.sprite.width / 2;
            gameObjects.player.sprite.y = this.storedSaveData.checkPoint.pixelY + gameObjects.player.sprite.height / 2;
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