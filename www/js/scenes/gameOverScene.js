export default class GameOverScene extends Phaser.Scene {

    constructor ()
    {
        super('gameOverScene');
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

        this.scene.get('fxScene').fadeIn(); 

        this.add.text(400, 124, 'Game Over!', 
        {
            fill: '#FFFFFF',
            align: 'center',
            fontSize: '40px',
        })
        .setOrigin(0.5, 0.5);

        this.add.text(400, 300, 'Click to retry', 
        {
            fill: '#FFFFFF',
            align: 'center',
            fontSize: '16px',
        })
        .setOrigin(0.5, 0.5);

        this.input.on("pointerdown", function(pointer) 
        {
            this.scene.get("fxScene").fadeOut(undefined, () =>
            {
                this.scene.start("mainScene");
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


