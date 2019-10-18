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
        this.load.tilemapTiledJSON(levelHandler.levelName, "assets/tilemaps/" + levelHandler.levelName + ".json");

		this.load.spritesheet("psTileset-extruded", "assets/tilesets/psTileset-extruded.png", 
		{ 
			frameWidth: 16,
			frameHeight: 16 
		});

        this.load.image("player", "assets/images/player.png");
        this.load.image("waterBeaker", "assets/images/waterBeaker.png");
    }

    create ()
    {
        this.createTiles();
        this.createGameObjects();
        this.createCollision();

        this.cameras.main.setZoom(3, 3);
        this.cameras.main.setBounds(0, 0, levelHandler.level.widthInPixels, levelHandler.level.heightInPixels);
        this.physics.world.setBounds(0, 0, levelHandler.level.widthInPixels, levelHandler.level.heightInPixels, true, true, true, false);

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
        
        gameObjects.waterBeakers.getChildren().forEach(tile => tile.container.update());

        if(gameObjects.player.enteredDoor)
        {
            this.isGameBusy = true;
            game.onDoor(this);
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
        levelHandler.worldLayer.setCollisionByExclusion([-1, TILES.DOORUP, TILES.DOORDOWN]);

        levelHandler.itemsLayer = levelHandler.level.createDynamicLayer("Items", [levelHandler.defaultTileset], 0, 0);
        levelHandler.itemsLayer.setCollisionByExclusion([-1, TILES.CHECKPOINT, TILES.CHECKPOINTUNSAVED]);
    }

    createGameObjects ()
    {
        gameObjects.player = new Player(this, 200, 120);

        switch(levelHandler.travelType)
        {
            case "spawnPoint":
                var spawnPoint = levelHandler.level.findObject("Objects", obj => obj.name === "Player Spawn Point");
                gameObjects.player.sprite.x = spawnPoint.x;
                gameObjects.player.sprite.y = spawnPoint.y;
                break;

            case "door":
                levelHandler.level.findObject("Objects", obj => 
                {    
                    // I think we found a match
                    if(obj.type === "door" && obj.name.replace("Door", "").replace("door", "") === levelHandler.doorSymbol)
                    {
                        gameObjects.player.sprite.x = obj.x + obj.width / 2;
                        gameObjects.player.sprite.y = obj.y;
                    }
                });
                break;
        }

        gameObjects.waterBeakers = this.physics.add.group({});

        levelHandler.itemsLayer.forEachTile((tile) =>
        {
            if(tile.index === TILES.WATERBEAKER)
            {
                new WaterBeaker(this, tile.getCenterX(), tile.getCenterY(), gameObjects.waterBeakers);

                levelHandler.itemsLayer.removeTileAt(tile.x, tile.y);
            }
        });
    }

    createCollision ()
    {
        levelHandler.itemsLayer.setTileIndexCallback(TILES.CHECKPOINTUNSAVED, function(objectA, objectB)
        {
            if(objectA.name === "player")
            {
                levelHandler.itemsLayer.putTileAt(TILES.CHECKPOINT, objectB.x, objectB.y);
            }
        }, this);

        this.physics.add.collider(gameObjects.waterBeakers, gameObjects.waterBeakers);

        this.physics.add.collider(gameObjects.player.sprite, gameObjects.waterBeakers, function(playerSprite, waterBeakerSprite)
        {
            if(playerSprite.body.touching.down)
            {
                playerSprite.body.inAir = false;  

                // This is as close as we can get
                if(waterBeakerSprite.body.blocked.down || waterBeakerSprite.body.touching.down)
                {
                    // waterBeakerSprite.body.position.y -= 1;
                    waterBeakerSprite.body.position.y = playerSprite.body.position.y + playerSprite.body.height;

                    waterBeakerSprite.body.stop();
                }
            }
        });

        levelHandler.level.findObject("Objects", obj => 
        {    
            switch(obj.type)
            {
                case "door" :
                        var object = this.physics.add.sprite(obj.x, obj.y, "door").setOrigin(0, -0.5).setDepth(-1);

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
}