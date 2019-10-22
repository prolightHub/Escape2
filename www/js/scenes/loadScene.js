import game from "../game.js";

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

        game.init();

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


