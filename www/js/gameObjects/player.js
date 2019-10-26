import GameObject from "./gameObject.js";
import game from "../game.js";

export default class Player extends GameObject {
    constructor(scene, x, y)
    {
        super(scene, x, y);

        // Needs to be 12
        this.hp = 12;
        this.maxHp = 12;

        // Initialization
        this.refreshSprite(scene, x, y);

        // Controls
        this.keys = scene.input.keyboard.createCursorKeys();
        var keys = ("wasdzxkl").split("");

        var self = this;
        keys.forEach(function(key)
        {
            self.keys[key] = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[key.toUpperCase()]);
        });

        // Timers
        this.lastHurtTime = 100;
        this.hurtInterval = 1000;
        
        this.lastBlinkTime = 0;
        this.blinkInterval = 100;
    }

    refreshSprite (scene, x, y)
    {
        this.sprite = scene.physics.add.sprite(x, y, "player");
        this.sprite.setName("player");
        this.sprite.setMaxVelocity(125, 330).setDrag(400, 20);
        this.sprite.body.inAir = true;

        scene.cameras.main.startFollow(this.sprite);

        // Physics
        scene.physics.add.collider(this.sprite, levelHandler.worldLayer);
        scene.physics.add.collider(this.sprite, levelHandler.itemsLayer);

        this.sprite.body.setCollideWorldBounds(true);
    }

    update ()
    {
        if(this.dead)
        {
            return;
        }

        var time = this.scene.time.now;

        if(time - this.lastHurtTime < this.hurtInterval)
        {
            if(time - this.lastBlinkTime >= this.blinkInterval)
            {
                this.sprite.setVisible(!this.sprite._visible);

                this.lastBlinkTime = time;
            }
        }else{
            this.sprite.setVisible(true);
        }

        let keys = this.keys;
        let sprite = this.sprite;
        let speed = 200;
        let jumpHeight = 300;

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

        if(sprite.y > levelHandler.worldLayer.height + sprite.height || this.hp <= 0)
        {
            this.kill();
        }
    }   

    updateHearts ()
    {
        this.scene.scene.get("fxScene").updateHearts(this.hp, this.maxHp);
    }

    destroyHearts ()
    {
        this.scene.scene.get("fxScene").destroyHearts();
    }

    takeDamage (amt)
    {
        var time = this.scene.time.now;

        if(time - this.lastHurtTime >= this.hurtInterval)
        {
            this.hp -= amt;

            this.updateHearts();

            if(this.hp <= 0)
            {
                this.kill();
            }

            this.lastHurtTime = time;
        }
    }

    heal (amt)
    {
        this.hp += amt;
        this.hp = Math.min(this.hp, this.maxHp);

        this.updateHearts();
    }

    onCollide (object, name)
    {
        switch(name)
        {
            case "fireBeaker":
                this.takeDamage(1);
                break;

            case "waterBeaker":
                this.takeDamage(1);
                break;

            case "heart":
                this.heal(4);
                break

            case "lava":
                this.takeDamage(1);
                break;

            case "door":
                if(this.keys.down.isDown && this.sprite.body.onFloor())
                {
                    this.enteredDoor = true;
                    this.touchedObject = object;
                    
                    this.sprite.body.stop();
                }
                break;

            case "trampoline":
                if(this.sprite.body.blocked.down && !this.sprite.body.blocked.left && !this.sprite.body.blocked.right)
                {
                    this.sprite.setVelocityY(-1000);
                }
                break;

            case "checkPoint":
                game.save(this.scene, this, object);
                break;
        }
    }

    kill ()
    {
        this.destroyHearts(); 
        this.sprite.body.stop();
        this.dead = true;
    }
}