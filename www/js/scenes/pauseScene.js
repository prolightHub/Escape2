export default class PauseScene extends Phaser.Scene {

    constructor ()
    {
        super('pauseScene');
    }

    preload ()
    {
       
    }

    create ()
    {
        this.graphics = this.add.graphics({});

        var rectColor = new Phaser.Display.Color(0, 0, 0, 100);
        this.graphics.fillStyle(rectColor.color32, rectColor.alphaGL);
        this.graphics.fillRect(170, 0, 460, 480);

        this.scene.get("fxScene").fadeIn();

        this.add.text(400, 134, 'Paused', 
        {
            fill: '#FFFFFF',
            align: 'center',
            fontSize: '30px'
        })
        .setOrigin(0.5, 0.5);

        this.input.keyboard.on("keydown-P", function(event)
        {
            this.scene.pause("pauseScene");

            this.scene.get("fxScene").fadeOut(undefined, () =>
            {
                this.scene.stop("pauseScene");
                this.scene.resume("playScene");

                this.scene.get("fxScene").fadeIn();
            });
        }, this);
    }

    update ()
    {

    }

    render ()
    {
        
    }
}


