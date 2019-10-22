import GameObject from "./gameObject.js";

export default class WaterBeaker extends GameObject {
    constructor(scene, x, y, group)
    {
        super(scene, x, y);

        this.sprite = group.create(x, y, "waterBeaker");
        this.sprite.setDrag(100, 0).setMaxVelocity(100, 400);
        this.sprite.body.setCollideWorldBounds(true);

        this.sprite.container = this;
        scene.physics.add.collider(this.sprite, levelHandler.worldLayer);

        this.xSpeed = 60;
    }

    update ()
    {
        if(this.dead)
        {
            return;
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

    kill ()
    {
        this.sprite.destroy();
        this.dead = true;
    }
}