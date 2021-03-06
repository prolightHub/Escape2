export default class StartScene extends Phaser.Scene {

    constructor ()
    {
        super('startScene');
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

        this.add.text(400, 114, 'Escape 2', 
        {
            fill: '#FFFFFF',
            align: 'center',
            fontSize: '40px'
        })
        .setOrigin(0.5, 0.5);

        this.add.text(400, 300, 'Press any key to start',
        {
            fill: '#FFFFFF',
            align: 'center',
            fontSize: '17px',
        })
        .setOrigin(0.5, 0.5);

        this.input.keyboard.on("keydown", function(event)
        {
            if(this.cutScening)
            {
                return;
            }

            this.cutScening = true;

            this.scene.get("fxScene").fadeOut(undefined, () =>
            {
                this.scene.start("mainScene");

                this.cutScening = false;
            });

        }, this);

        this.scene.get("fxScene").fadeIn();   
    }

    update ()
    {
        
    }

    render ()
    {
        
    }

}


