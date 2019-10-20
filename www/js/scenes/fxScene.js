export default class FxScene extends Phaser.Scene {

    constructor ()
    {
        super('fxScene');
    }

    preload ()
    {
        this.load.image("heart1", "assets/images/heart1.png");        
        this.load.image("heart2", "assets/images/heart2.png");        
        this.load.image("heart3", "assets/images/heart3.png")     
        this.load.image("heart4", "assets/images/heart4.png");
    }

    create ()
    {
        
    }

    update ()
    {

    }

    render ()
    {
        
    }

    destroyHearts ()
    {
        if(this.hearts)
        {
            this.hearts.destroy(true);
        }
    }

    updateHearts (hp)
    {
        if(this.hearts)
        {
            this.hearts.destroy(true);
        }

        this.hearts = this.add.group();

        var heartsInt = hp / 4;

        for(var i = 0; i < heartsInt; i++)
        {
            var name = "heart4";

            if(i >= heartsInt - 1)
            {
                name = "heart" + (hp % 4 || 4);
            }

            this.hearts.create(30 + i * 40, 30, name).setScale(1.4, 1.4).setScrollFactor(0);
        }
    }

    fadeIn (duration, func)
    {
        if(duration === undefined) { duration = 500; }

        this.cameras.main.fadeIn(duration);
    
        if(func)
        {
            this.cameras.main.once("camerafadeincomplete", () =>
            {
                func(this.cameras.main, this);
            });
        }
    }

    fadeOut (duration, func)
    {
        if(duration === undefined) { duration = 500; }

        this.cameras.main.fadeOut(duration);

        if(func)
        {   
            this.cameras.main.once("camerafadeoutcomplete", () => 
            {
                func(this.cameras.main, this);
            });
        }
    }
}


