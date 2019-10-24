import Player from "../gameObjects/player.js";
import WaterBeaker from "../gameObjects/waterBeaker.js";
import game from "../game.js";

export default class PlayScene extends Phaser.Scene {

    constructor ()
    {
        super('playScene');
    }

    preload ()
    {
        game.beforePlaySceneLoad(gameObjects.player);

        this.load.tilemapTiledJSON(levelHandler.levelName, "assets/tilemaps/" + levelHandler.levelName + ".json");

		this.load.spritesheet("psTileset-extruded", "assets/tilesets/psTileset-extruded.png", 
		{ 
			frameWidth: 16,
            frameHeight: 16 
        });

        this.load.image("player", "assets/images/player.png");
        this.load.image("trampoline", "assets/images/trampoline.png");
        this.load.image("waterBeaker", "assets/images/waterBeaker.png");
    }

    create ()
    {
        this.createTiles();
        this.createGameObjects();
        this.createCollision();

        if(levelHandler.travelType === "checkPoint")
        {
            game.putSaveDataIntoScene(this);
        }
        else if(levelHandler.travelType === "door")
        {
            game.loadTemp(game.cache);
        }

        this.cameras.main.setZoom(3, 3);
        this.cameras.main.setBounds(0, 0, levelHandler.level.widthInPixels, levelHandler.level.heightInPixels);
        this.physics.world.setBounds(0, 0, levelHandler.level.widthInPixels, levelHandler.level.heightInPixels, true, true, true, false);

        this.input.keyboard.on("keydown-P", function(event)
        {
            this.scene.pause("playScene");

            this.scene.get("fxScene").fadeOut(undefined, () =>
            {
                this.scene.launch("pauseScene");
            });
        }, this);

        gameObjects.player.updateHearts();
        this.scene.get('fxScene').fadeIn(); 

        this.isGameBusy = false;
    }

    update ()
    {
        if(this.isGameBusy)
        {
            return;
        }

        gameObjects.player.update();
        
        gameObjects.waterBeakers.getChildren().forEach(waterBeaker => waterBeaker.container.update());

        if(gameObjects.player.enteredDoor)
        {
            game.onDoor(this);
            this.isGameBusy = true;
        }
        if(gameObjects.player.dead)
        {
            game.gameOver(this);
            this.isGameBusy = true;
        }
    }

    render ()
    {
        
    }

    createTiles ()
    {
        levelHandler.level = this.make.tilemap({ key: levelHandler.levelName });
        levelHandler.defaultTileset = levelHandler.level.addTilesetImage("psTileset-extruded", "psTileset-extruded");

        levelHandler.worldLayer = levelHandler.level.createStaticLayer("World", [levelHandler.defaultTileset], 0, 0);
        levelHandler.worldLayer.setCollisionByExclusion([-1, TILES.DOORUP, TILES.DOORDOWN, TILES.LAVA, TILES.TRAMPOLINE]);

        levelHandler.itemsLayer = levelHandler.level.createDynamicLayer("Items", [levelHandler.defaultTileset], 0, 0);
        levelHandler.itemsLayer.setCollisionByExclusion([-1, TILES.CHECKPOINT, TILES.CHECKPOINTUNSAVED]);
    }

    createGameObjects ()
    {
        if(!gameObjects.player || gameObjects.player.dead)
        {
            gameObjects.player = new Player(this, 200, 120);
        }else{
            gameObjects.player.refreshSprite(this, 200, 120);
        }

        switch(levelHandler.travelType)
        {
            case "spawnPoint":
                var spawnPoint = levelHandler.level.findObject("Objects", obj => obj.name === "Player Spawn Point");
                if(spawnPoint)
                {
                    gameObjects.player.sprite.x = spawnPoint.x;
                    gameObjects.player.sprite.y = spawnPoint.y;
                }
                levelHandler.lastSpawnPointLevel = levelHandler.levelName;
                break;

            case "door":
                levelHandler.level.findObject("Objects", obj => 
                {    
                    // I think we found a match
                    if(obj.type === "door" && obj.name.replace("Door", "").replace("door", "") === levelHandler.doorSymbol)
                    {
                        gameObjects.player.sprite.x = obj.x + obj.width / 2;
                        gameObjects.player.sprite.y = obj.y + gameObjects.player.sprite.height * 2;
                    }
                });
                break;
        }

        gameObjects.waterBeakers = this.physics.add.group({});
        gameObjects.trampolines = this.physics.add.staticGroup({});
        gameObjects.hearts = this.physics.add.staticGroup({});

        // Still don't know what this will be used for in the future.
        gameObjects.addGroup = function()
        {
            
        };

        levelHandler.worldLayer.forEachTile((tile) =>
        {
            switch(tile.index)
            {
                case TILES.TRAMPOLINE:
                    gameObjects.trampolines.create(tile.getCenterX(), tile.getCenterY(), "trampoline");
                    break;
            }
        });

        var heartId = 0;
        var waterBeakerId = 0;

        levelHandler.itemsLayer.forEachTile((tile) =>
        {
            switch(tile.index)
            {
                case TILES.WATERBEAKER:
                    var waterBeaker = new WaterBeaker(this, tile.getCenterX(), tile.getCenterY(), gameObjects.waterBeakers);
 
                    waterBeaker.sprite.id = waterBeakerId++;

                    levelHandler.itemsLayer.removeTileAt(tile.x, tile.y);
                    break;

                case TILES.HEART:
                    var heart = gameObjects.hearts.create(tile.getCenterX(), tile.getCenterY(), "heart4").setScale(0.5, 0.5).refreshBody();

                    heart.id = heartId++;

                    levelHandler.itemsLayer.removeTileAt(tile.x, tile.y);
                    break;
            }
        });

        gameObjects.hearts.length = heartId;
        gameObjects.waterBeakers.length = waterBeakerId;

        levelHandler.level.findObject("Objects", obj => 
        {  
            switch(obj.type)
            {
                case "door" :
                        var object = this.physics.add.sprite(obj.x - obj.width / 2, obj.y, "door").setDepth(-1);
                        object.setOrigin(0, 0);

                        object.body.setSize(obj.width, obj.height);
                        object.body.moves = false;
                        object.setVisible(false);
                        object.obj = obj;

                        this.physics.add.overlap(gameObjects.player.sprite, object, function(objectA, objectB)
                        {
                            gameObjects.player.onCollide.apply(gameObjects.player, [objectB, "door"]);
                        }, 
                        null, this);
                    break;
            }
        });
    }

    createCollision ()
    {
        levelHandler.itemsLayer.setTileIndexCallback(TILES.CHECKPOINTUNSAVED, function(objectA, objectB)
        {
            if(objectA.name === "player" && gameObjects.player.sprite.body.blocked.down)
            {
                gameObjects.player.onCollide.apply(gameObjects.player, [objectB, "checkPoint"]);
                
                levelHandler.itemsLayer.putTileAt(TILES.CHECKPOINT, objectB.x, objectB.y);
            }
        }, this);
        levelHandler.worldLayer.setTileIndexCallback(TILES.LAVA, function(objectA, objectB)
        {
            if(objectA.name === "player")
            {
                gameObjects.player.onCollide.apply(gameObjects.player, [objectB, "lava"]);
            }
        }, this);

        this.physics.add.collider(gameObjects.waterBeakers, gameObjects.waterBeakers);

        this.physics.add.collider(gameObjects.trampolines, gameObjects.player.sprite, function(trampoline, playerSprite)
        {
            gameObjects.player.onCollide.apply(gameObjects.player, [trampoline, "trampoline"]);
        });

        this.physics.add.collider(gameObjects.trampolines, gameObjects.waterBeakers);

        this.physics.add.collider(gameObjects.player.sprite, gameObjects.waterBeakers, function(playerSprite, waterBeakerSprite)
        {
            if(playerSprite.body.touching.down && waterBeakerSprite.body.touching.up)
            {
                playerSprite.body.inAir = false;  

                // This is as close as we can get
                if(waterBeakerSprite.body.blocked.down || waterBeakerSprite.body.touching.down)
                {
                    // waterBeakerSprite.body.position.y -= 1;
                    waterBeakerSprite.body.position.y = playerSprite.body.position.y + playerSprite.body.height;

                    waterBeakerSprite.body.stop();
                }

                waterBeakerSprite.container.kill();
            }else{
                gameObjects.player.onCollide.apply(gameObjects.player, [waterBeakerSprite, "waterBeaker"]);
            }
        });

        this.physics.add.overlap(gameObjects.player.sprite, gameObjects.hearts, function(playerSprite, heartSprite)
        {
            gameObjects.player.onCollide.apply(gameObjects.player, [heartSprite, "heart"]);
            gameObjects.player.sprite.body.blocked.down = false;

            heartSprite.destroy();
        });
    }
}