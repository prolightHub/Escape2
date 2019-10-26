import GameObject from "./gameObject.js";

export default class FireBeaker extends GameObject {
    constructor(scene, x, y, group)
    {
        super(scene, x, y);

        this.sprite = group.create(x, y, "fireBeaker");
        this.sprite.setDrag(100, 0).setMaxVelocity(100, 400);
        this.sprite.body.setCollideWorldBounds(true);

        this.sprite.container = this;

        scene.physics.add.collider(this.sprite, levelHandler.worldLayer);

        this.xSpeed = 60;

        this.raycastTimer = 0;
        this.raycastInterval = 25;

        this.lastDirectionChangeTime = 0;
    }

    update (time, delta)
    {
        if(this.dead)
        {
            return;
        }

        if(time - this.raycastTimer > this.raycastInterval)
        {
            this.createRaycast();

            this.raycastTimer = time;
        }

        const sprite = this.sprite;

        sprite.setVelocityX(this.xSpeed);

        if(sprite.body.blocked.left || sprite.body.touching.left)
        {
            this.xSpeed = Math.abs(this.xSpeed);
        }
        if(sprite.body.blocked.right || sprite.body.touching.right)
        {
            this.xSpeed = -Math.abs(this.xSpeed);
        }
    }

    createRaycast ()
    {
        var self = this;
        gameObjects.raycasts.addRaycast(this.sprite.x, this.sprite.y + this.sprite.height / 2, function(raycast, tile)
        {
            if(tile === undefined && self.scene.time.now - self.lastDirectionChangeTime > 300)
            {
                self.xSpeed = Math.abs(self.xSpeed) * (self.sprite.body.velocity.x < 0 ? 1 : -1);
                self.sprite.setVelocityX(self.xSpeed * 3);

                self.lastDirectionChangeTime = self.scene.time.now;
            }
        });
    }

    kill ()
    {
        this.sprite.destroy();
        this.dead = true;
    }
}