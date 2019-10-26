var buttons = createButtons();

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

        this.add.text(400, 114, 'Paused', 
        {
            fill: '#FFFFFF',
            align: 'center',
            fontSize: '37px'
        })
        .setOrigin(0.5, 0.5);

        buttons.play = new Button(this, 400, 230, 120, 40, new Phaser.Display.Color(0, 140, 40), "Play", 
        {
            fontSize: '20px',
            fill: '#FFFFFF',
            align: 'center',
            fontFamily: '"Press Start 2P"'
        }, 
        function()
        {
            if(this.cutScening)
            {
                return;
            }
            
            this.scene.pause("pauseScene");

            this.scene.get("fxScene").fadeOut(undefined, () =>
            {
                this.scene.stop("pauseScene");
                this.scene.resume("playScene");

                this.cutScening = false;

                this.scene.get("fxScene").fadeIn();
            });

            this.cutScening = true;
        }, {
            offsetX: 0.67
        });
        buttons.menu = new Button(this, 400, 280, 120, 40, new Phaser.Display.Color(0, 140, 40), "Menu", 
        {
            fontSize: '20px',
            fill: '#FFFFFF',
            align: 'center',
            fontFamily: '"Press Start 2P"'
        }, 
        function()
        {
            if(this.cutScening)
            {
                return;
            }
            
            this.scene.get("fxScene").fadeOut(undefined, () =>
            {
                this.scene.stop("pauseScene");
                this.scene.stop("playScene");
                this.scene.start("mainScene");

                this.cutScening = false;
            });
            
            this.cutScening = true;
        }, {
            offsetX: 0.67
        });

        this.input.on('pointerdown', function (pointer) 
        {
            buttons.onpointerdown.apply(this, arguments); 
        }, 
        this);

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
        buttons.draw(this.graphics);
    }

    render ()
    {
        
    }
}


