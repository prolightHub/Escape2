
var buttons = createButtons();

export default class MainScene extends Phaser.Scene {

    constructor ()
    {
        super('mainScene');
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

        buttons.play = new Button(this, 400, 240, 120, 40, new Phaser.Display.Color(0, 140, 40), "Play", 
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
                this.scene.start("playScene");

                this.cutScening = false;
            });
            
            this.cutScening = true;
        }, {
            offsetX: 0.7
        });
        
        this.input.on('pointerdown', function (pointer) 
        {
            buttons.onpointerdown.apply(this, arguments); 
        }, 
        this);

        this.scene.get('fxScene').hideHearts(); 
        
        this.scene.get('fxScene').fadeIn(); 
    }

    update ()
    {
        buttons.draw(this.graphics);
    }

    render ()
    {

    }
}