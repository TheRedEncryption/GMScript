originalConsole = window.console;
window.console.font = function(url){
    split = url.split("/")
    text = "<style>\n\t@import url('https://fonts.googleapis.com/css2?family=" + split[split.length-1] + "&display=swap');\n</style>"
    originalConsole.log(text)
}

// console.font(url) insane

// a regex that gets all the digits
const rexAllDigits = /^\d+$/;

// a regex that gets all the negative digits
const rexAllNegativeDigits = /-\d+/;

// this is the get and set methods for the Game's Scene iterable
const contactProxyHandlers = {
    get(target, key) {
        if (rexAllNegativeDigits.test(key) && Math.abs(key) <= target.scenes.length) {
            return target.scenes[target.scenes.length + parseInt(key)];
        }
        if (rexAllDigits.test(key)) {
            return target.scenes[key];
        }
        return target[key];
    },
    set(target, key, value) {
        if (rexAllNegativeDigits.test(key) && Math.abs(key) <= target.scenes.length) {
            return Reflect.set(target.scenes, target.scenes.length + parseInt(key), value);
        }
        if (rexAllDigits.test(key)) {
            return Reflect.set(target.scenes, key, value);
        }
        return Reflect.set(target, key, value);
    }
};

// class declaration for the Game object
class Game {
    constructor(canvas = null, scenes = this.createScene()) {
        this.canvas = canvas != null ? canvas : this.createCanvas();
        this.left = 0;
        this.top = 0;
        this.right = this.canvas.getBoundingClientRect().width;
        this.bottom = this.canvas.getBoundingClientRect().height;
        this.scenes = scenes;
        this.currentScene = scenes[0];
        this.backgroundColor = "white";
        return new Proxy(this, contactProxyHandlers);
    }

    // if canvas not specified, then create one
    createCanvas() {
        let canvas = document.createElement("canvas");
        canvas.width = 600;
        canvas.height = 600;
        canvas.style.border = "2px solid black";
        document.querySelector("body").appendChild(canvas);
        return canvas;
    }

    // returns a new scene inside of an array
    createScene() {
        return [new Scene()];
    }

    // Renders sprites to the current Scene
    renderScene() {
        this.canvas.getContext("2d").clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvas.getContext("2d").fillStyle = this.backgroundColor;
        this.canvas.getContext("2d").fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.currentScene.render(this.canvas);
    }

    // onStep
    onStep(onstep, stepsPerSecond = 60) {
        let that = setInterval(() => {
            onstep();
        }, 1000 / stepsPerSecond);
    }

    // sets the background color to any HTML5 supported color
    setBackgroundColor(color){
        this.backgroundColor = color;
        return this;
    }
}


class Scene {
    // Realistically a Scene has no default sprites
    spritesPrivateLater;
    constructor(sprites) {
        if (!Array.isArray(sprites) && sprites != undefined) { throw Error(`${sprites} is not an Array`) }
        this.spritesPrivateLater = Array.isArray(sprites) ? sprites : [];
    }

    addSprite() {
        console.log(this.spritesPrivateLater)
        let self = this.spritesPrivateLater;

        // lets the user define the Sprite object to be added
        let addSpriteInit = function (type, x, y, color = "black") {
            if (!type || !x || !y) { throw new Error("addSprite requires (type, x, y) arguments or (Sprite)") }
            self.push(new Sprite(type, x, y, color))
        }

        // lets the user create the sprite before calling addSprite()
        let addSpritePredefined = function (spriteSubclass) {
            if (!(spriteSubclass instanceof Sprite)) { throw new Error("addSprite requires (type, x, y) arguments or (Sprite)") }
            self.push(spriteSubclass)
        }

        // calls the correct function based on the length of the arguments
        if (arguments.length == 3) {
            addSpriteInit(arguments[0], arguments[1], arguments[2])
        }
        else if (arguments.length == 4) {
            addSpriteInit(arguments[0], arguments[1], arguments[2], arguments[3])
        }
        else if (arguments.length == 1) {
            addSpritePredefined(arguments[0])
        }
    }

    // lets you add a rectangle
    addRect(x, y, width, height, color = "black", isFilled = true, strokeColor = null) {
        if (!x || !y || !width || !height) { throw new Error("addRect requires (x, y, width, height) arguments") }
        this.spritesPrivateLater.push(new Rectangle(x, y, width, height, color, isFilled, strokeColor))
    }

    // render function that draws all the sprites inside of each scene
    render(canvas) {
        let ctx = canvas.getContext("2d");
        this.spritesPrivateLater.forEach((sprite) => {
            sprite.drawSprite(ctx);
        })
    }

}


// declaration for the Sprite object (only serves as a superclass and does not work as a sprite of its own)
class Sprite {

    // list of acceptable types, can be expanded later
    #acceptableTypes = ["rect", "rectangle", "circle", "text", "line", "polygon"];

    // constructor for such
    constructor(type, x, y, color) {
        if (!this.#acceptableTypes.includes(type)) { throw new Error(`${type} is not a valid type, use one of the following: ${this.#acceptableTypes.join(", ")}`) }
        if (typeof x != "number" || typeof y != "number") { throw new Error(`x or y is not a number: x: ${x}, y: ${y}`) }
        this.type = type;
        this.x = x;
        this.y = y;
        this.fillColor = color;
        this.rotation = 0;
        this.scale = 1.0;
        this.lineWidth = 1.0;
    }

    // converts degree input to radian (unless second parameter is false)
    setRotation(rotation, isDegrees = true) {
        if (isDegrees) {
            this.rotation = rotation * Math.PI / 180
        }
        else {
            this.rotation = rotation;
        }
    }

    drawSprite(ctx) {
        console.log("sprite")
    }

    // moves the sprite in the number of pixels based on its current direction
    move(numberOfPixels) {
        this.x -= Math.cos((this.rotation + (Math.PI / 2))) * numberOfPixels;
        this.y -= Math.sin((this.rotation + (Math.PI / 2))) * numberOfPixels;
    }

    // sets the line width
    setLineWidth(lineWidth = 1.0) {
        this.lineWidth = lineWidth
        return this;
    }

    setLeft(pixels) {
        this.left = pixels;
        this.x = this.left;
    }
    setTop(pixels) {
        this.top = pixels;
        this.y = this.top;
    }
    setRight(pixels) {
        this.right = pixels;
        this.x = this.right - this.width;
    }
    setBottom(pixels) {
        this.bottom = pixels;
        this.y = this.bottom - this.height;
    }
}

class Polygon extends Sprite{
    constructor(x, y, pointsList, fillColor = "black", isFilled = true, strokeColor = null){
        super("polygon", x, y, fillColor)
        this.points = pointsList; // 2d array [[50,200],[75,220]]
        this.isFilled = isFilled;
        this.strokeColor = strokeColor;
    }

    drawSprite(ctx){
        if(this.points.length>=1){
            ctx.beginPath();
            ctx.moveTo(this.points[0][0], this.points[0][1]);          

            for (var i = 1; i < this.points.length; i++) {
                ctx.lineTo(this.points[i][0], this.points[i][1]);
            }
            ctx.fillStyle = this.isFilled ? this.fillColor : "rgba(0,0,0,0)";
            ctx.strokeStyle = this.strokeColor != null ? this.strokeColor : "rgba(0,0,0,0)";
            ctx.lineWidth = this.lineWidth;
            ctx.stroke();
            ctx.fill();
            ctx.closePath();
        }
    }
}


class Circle extends Sprite {
    /* Circle(centerX, centerY, radius, fill='black', border=None,
       borderWidth=2, opacity=100, rotateAngle=0, dashes=False,
       align='center', visible=True) <----- CMU CS Academy
    */
    constructor(x, y, radius, fillColor = "black", isFilled = true, strokeColor = null) {
        super("circle", x, y, fillColor);
        this.radius = radius;
        this.isFilled = isFilled;
        this.strokeColor = strokeColor;
    }

    updateShape() {
        this.left = this.x - this.radius / 2 - this.lineWidth;
        this.top = this.y - this.radius / 2 - this.lineWidth;
        this.right = this.x + this.radius / 2 + this.lineWidth;
        this.bottom = this.y + this.radius / 2 + this.lineWidth;
    }

    drawSprite(ctx) {
        this.updateShape();
        ctx.beginPath();
        ctx.fillStyle = this.isFilled ? this.fillColor : "rgba(0,0,0,0)";
        ctx.strokeStyle = this.strokeColor != null ? this.strokeColor : "rgba(0,0,0,0)";
        ctx.lineWidth = this.lineWidth;
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }
}

class RegularPolygon extends Circle{
    constructor(x, y, radius, sides, fillColor = "black", isFilled = true, strokeColor = null){
        super(x, y, radius, fillColor, isFilled, strokeColor);
        this.sides = sides;
        this.points = [];
        this.polyRotation = -Math.PI/2;
    }
    
    drawSprite(ctx){
        let temp = [];
        ctx.beginPath();
        ctx.moveTo (this.x +  this.radius * Math.cos(0+this.polyRotation), this.y +  this.radius *  Math.sin(0+this.polyRotation));          
        temp.push([this.x +  this.radius * Math.cos(0+this.polyRotation), this.y +  this.radius *  Math.sin(0+this.polyRotation)])

        for (var i = 1; i <= this.sides;i += 1) {
            ctx.lineTo (this.x + this.radius * Math.cos(i * 2 * Math.PI / this.sides+this.polyRotation), this.y + this.radius * Math.sin(i * 2 * Math.PI / this.sides+this.polyRotation));
            temp.push([this.x + this.radius * Math.cos(i * 2 * Math.PI / this.sides+this.polyRotation), this.y + this.radius * Math.sin(i * 2 * Math.PI / this.sides+this.polyRotation)])
        }
        ctx.fillStyle = this.isFilled ? this.fillColor : "rgba(0,0,0,0)";
        ctx.strokeStyle = this.strokeColor != null ? this.strokeColor : "rgba(0,0,0,0)";
        ctx.lineWidth = this.lineWidth;
        ctx.stroke();
        ctx.fill();
        this.points = temp;
        ctx.closePath();
    }
}

// rectangle class
class Rectangle extends Sprite {
    constructor(x, y, width, height, fillColor = "black", isFilled = true, strokeColor = null) {
        super("rectangle", x, y, fillColor);
        this.width = width;
        this.height = height;
        this.isFilled = isFilled;
        this.strokeColor = strokeColor;
        this.left = this.x;
        this.top = this.y;
        this.right = this.x + this.width;
        this.bottom = this.y + this.height;
    }

    // updates the left, top, right, and bottom values to be used
    updateShape() {
        this.left = this.x;
        this.top = this.y;
        this.right = this.x + this.width;
        this.bottom = this.y + this.height;
    }

    // the Rectangle's drawSprite() function
    drawSprite(ctx) {

        // updates the shape's properties
        this.updateShape();
        ctx.beginPath();
        
        // if not filled, or has a stroke color, then use transparent
        ctx.fillStyle = this.isFilled ? this.fillColor : "rgba(0,0,0,0)";
        ctx.strokeStyle = this.strokeColor != null ? this.strokeColor : "rgba(0,0,0,0)";
        
        // set the line width
        ctx.lineWidth = this.lineWidth;

        // creates the rectangle, fills it, and then creates the stroke
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fill();
        ctx.stroke();

        // end
        ctx.closePath();
    }
}

// image sprite (lets you use images as sprites)
class ImageSprite extends Rectangle {
    constructor(image, x, y, width = 0, height = 0) {

        super(x, y, 0, 0, "black", false);
        this.image = new Image();
        this.image.src = image;
        this.width = this.image.width;
        this.height = this.image.height;
    }

    drawSprite(ctx) {
        this.updateShape();
        this.rotate(ctx);
    }

    updateShape() {
        super.updateShape();
        this.width = this.image.width;
        this.height = this.image.height;
    }

    // saves the canvas, translates, rotates, draws, and then restores
    rotate(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotation);
        ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    }
}

class Label extends Rectangle {
    //x, y, width, height, fillColor = "black", isFilled = true, strokeColor = null
    constructor(textValue, x, y, fillColor="black", isFilled = true, strokeColor = null) {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext('2d');
        ctx.font = `12px "arial"`;
        let metrics = ctx.measureText(textValue);
        let actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        super(x,y,metrics.width,actualHeight,fillColor,isFilled,strokeColor);
        this.fontSize = 12;
        this.font = "arial";
        this.fontStyle = `12px "arial"`
        this.textValue = textValue;
        this.hAlign = "left";
        this.vAlign = "top";
    }

    setAlignment(horizontalAlignment="left", verticalAlignment="top"){
        this.hAlign = horizontalAlignment;
        this.vAlign = verticalAlignment;
        return this;
    }
    
    // setFont has to update the width and height and fontsize and fontstyle
    setFont(font = null, fontSize = this.fontSize){
        if(typeof font == "string"){
            this.font = font;
            this.fontSize = fontSize;
            this.fontStyle = `${fontSize}px "${this.font}"`
            let canvas = document.createElement("canvas");
            let ctx = canvas.getContext('2d');
            ctx.font = `${fontSize}px "${this.font}"`;
            let metrics = ctx.measureText(this.textValue);
            let actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
            this.width = metrics.width;
            this.height = actualHeight;
        }

        /* NOT WORKING
        else if(font instanceof FontFace)
        {
            font.load().then((font)=>{
                document.fonts.add(font)
                this.font = font.family;
                console.error(font)
                this.fontSize = fontSize;
                this.fontStyle = `${fontSize}px "${this.font}"`
                let canvas = document.createElement("canvas");
                let ctx = canvas.getContext('2d');
                ctx.font = `${fontSize}px "${this.font}"`;
                let metrics = ctx.measureText(this.textValue);
                let actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
                this.width = metrics.width;
                this.height = actualHeight;
            })
        }
        */
        return this;
    }

    drawSprite(ctx) {
        
        this.updateShape();
        ctx.beginPath();
        
        ctx.font = this.fontStyle;
        ctx.fillStyle = this.isFilled ? this.fillColor : "rgba(0,0,0,0)";
        ctx.strokeStyle = this.strokeColor != null ? this.strokeColor : "rgba(0,0,0,0)";
        
        ctx.lineWidth = this.lineWidth;
        ctx.textAlign = this.hAlign;
        
        ctx.fillText(this.textValue, this.x, this.y+this.height);
        ctx.strokeText(this.textValue, this.x, this.y+this.height);
        ctx.closePath();
    }

    bolden(){
        return this;
    }

    italicize(){
        return this;
    }
}