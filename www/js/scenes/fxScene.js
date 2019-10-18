export default class FxScene extends Phaser.Scene {

    constructor ()
    {
        super('fxScene');
    }

    preload ()
    {
        
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


