function createButtons()
{
    var buttons = {};

    Object.defineProperty(buttons, "draw", 
    {
        enumerable: false,

        value: function(graphics)
        {
            for(var i in buttons)
            {
                buttons[i].draw(graphics);
            }
        },
    });
    Object.defineProperty(buttons, "onpointerdown", 
    {
        enumerable: false,

        value: function(pointer)
        { 
            for(var i in buttons)
            {
                if(buttons[i].isClicked(pointer.x, pointer.y))
                {
                    buttons[i].onClick.call(this, pointer.x, pointer.y);
                }
            }
        }
    });

    return buttons;
}
function Button(origin, x, y, width, height, color, text, style, onClick, object)
{
    object = object || {};
    this.offsetX = object.offsetX || 0.37;
    this.offsetY = object.offsetY || 0.5;

    this.text = origin.add.text(x - width * (1 - this.offsetX) / 2, y - height * (1 - this.offsetY) / 2, text, style);

    this.width = width;
    this.height = height;
    this.halfWidth = width / 2;
    this.halfHeight = height / 2;

    this.color = color;

    this.draw = function(graphics)
    {     
        graphics.fillStyle((typeof this.color === "number") ? this.color : this.color.color32, (typeof this.color === "object") ? this.color.alphaGL : undefined);
        graphics.fillRoundedRect(this.text.x - this.halfWidth * this.offsetX, this.text.y - this.halfHeight * this.offsetY, this.width, this.height, this.round || 0);
    
        if(this.selected)
        {
            graphics.lineStyle(4, 0x00ff00, 1);
            graphics.strokeRect(this.text.x - this.halfWidth * this.offsetX, this.text.y - this.halfHeight * this.offsetY, this.width, this.height, this.round || 0);
        }
    };

    this.isClicked = function(x, y)
    {
        return (x > this.text.x - this.halfWidth * this.offsetX && 
                x < this.text.x - this.halfWidth * this.offsetX + this.width) && 
               (y > this.text.y - this.halfHeight * this.offsetY && 
                y < this.text.y - this.halfHeight * this.offsetY + this.height);
    };

    this.onClick = function()
    {
        return (onClick || function() {}).apply(this, arguments);
    };
}