import GameObject from "./gameObject.js";

export default class Player extends GameObject {
    constructor(scene, x, y)
    {
        super(scene, x, y);

        // Initialization
        this.sprite = scene.physics.add.sprite(x, y, "player");
        this.sprite.setName("player");
        this.sprite.setMaxVelocity(125, 330).setDrag(400, 20);
        this.sprite.body.inAir = true;

        scene.cameras.main.startFollow(this.sprite);

        // Physics
        scene.physics.add.collider(this.sprite, levelHandler.worldLayer);
        scene.physics.add.collider(this.sprite, levelHandler.itemsLayer);

        this.sprite.body.setCollideWorldBounds(true);

        // Controls
        this.keys = scene.input.keyboard.createCursorKeys();
        var keys = ("wasdzxkl").split("");

        var self = this;
        keys.forEach(function(key)
        {
            self.keys[key] = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[key.toUpperCase()]);
        });
    }

    update ()
    {
        let keys = this.keys;
        let sprite = this.sprite;
        let speed = 200;
        let jumpHeight = 330;

        if(keys.left.isDown || keys.a.isDown) 
        {
            sprite.setAccelerationX(-speed).setFriction(230, 20);
        }
        else if(keys.right.isDown || keys.d.isDown) 
        {
            sprite.setAccelerationX(speed).setFriction(230, 20);
        }else{
            sprite.setAccelerationX(0).setFriction(600, 20);
        }

        if(sprite.body.blocked.down)
        {
            sprite.body.inAir = false;
        }

        if((keys.z.isDown || keys.k.isDown) && !sprite.body.inAir)
        {
            sprite.setVelocityY(-jumpHeight);
        }

        sprite.body.inAir = true;
    }   

    onCollide (object, name)
    {
        switch(name)
        {
            case "door":
                if(this.keys.down.isDown && this.sprite.body.onFloor())
                {
                    this.enteredDoor = true;
                    this.touchedObject = object;

                    this.sprite.body.stop();
                }
                break;
        }
    }
}