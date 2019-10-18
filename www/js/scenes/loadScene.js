export default class LoadScene extends Phaser.Scene {

    constructor ()
    {
        super('loadScene');
    }

    preload ()
    {
        
    }

    create ()
    {
        this.scene.launch('fxScene');

        this.scene.start('mainScene');
    }

    update ()
    {

    }

    render ()
    {
        
    }
}


