const rexAllDigits = /^\d+$/;
const rexAllNegativeDigits = /-\d+/;
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
class Game {
    constructor(canvas = null, scenes = this.createScene()) {
        this.canvas = canvas != null ? canvas : this.createCanvas();
        this.scenes = scenes;
        this.currentScene = scenes[0];
        return new Proxy(this, contactProxyHandlers);
    }

    createCanvas() {
        let canvas = document.createElement("canvas");
        canvas.width = 600;
        canvas.height = 600;
        canvas.style.border = "2px solid black";
        document.querySelector("body").appendChild(canvas);
        return canvas;
    }

    createScene() {
        return [new Scene()];
    }

    renderScene() {
        // Renders sprites to the current Scene
        this.canvas.getContext("2d").clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.currentScene.render(this.canvas);
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
        let addSpriteInit = function (type, x, y, color = "black") {
            if (!type || !x || !y) { throw new Error("addSprite requires (type, x, y) arguments or (Sprite)") }
            self.push(new Sprite(type, x, y, color))
        }
        let addSpritePredefined = function (spriteSubclass) {
            if (! (spriteSubclass instanceof Sprite)) { throw new Error("addSprite requires (type, x, y) arguments or (Sprite)") }
            self.push(spriteSubclass)
        }

        if(arguments.length==3){
            addSpriteInit(arguments[0],arguments[1],arguments[2])
        }
        else if(arguments.length==4){
            addSpriteInit(arguments[0],arguments[1],arguments[2],arguments[3])
        }
        else if(arguments.length==1){
            addSpritePredefined(arguments[0])
        }
    }

    addRect(x, y, width, height, color = "black", isFilled = true, strokeColor = null) {
        if (!x || !y || !width || !height) { throw new Error("addRect requires (x, y, width, height) arguments") }
        this.spritesPrivateLater.push(new Rectangle(x, y, width, height, color, isFilled, strokeColor))
    }

    render(canvas) {
        console.log(this.spritesPrivateLater)
        let ctx = canvas.getContext("2d");
        console.log("Canvas ctx:")
        console.log(ctx)
        this.spritesPrivateLater.forEach((sprite) => {
            sprite.drawSprite(ctx);
        })
    }

}

class Sprite {
    #acceptableTypes = ["rect", "rectangle", "circle", "text", "line"];
    constructor(type, x, y, color) {
        if (!this.#acceptableTypes.includes(type)) { throw new Error(`${type} is not a valid type, use one of the following: ${this.#acceptableTypes.join(", ")}`) }
        if(typeof x != "number" || typeof y != "number") { throw new Error(`x or y is not a number: x: ${x}, y: ${y}`)}
        this.type = type;
        this.x = x;
        this.y = y;
        this.color = color;
    }

    drawSprite(ctx) {
        console.log("sprite")
    }
}

class Rectangle extends Sprite {
    constructor(x, y, width, height, fillColor = "black", isFilled = true, strokeColor = null) {
        console.log(fillColor)
        console.log(isFilled)
        console.log(strokeColor)
        super("rectangle", x, y, fillColor);
        this.width = width;
        this.height = height;
        this.isFilled = isFilled;
        this.strokeColor = strokeColor;
        this.lineWidth = 1.0;
        this.fillColor = fillColor;
    }
    
    drawSprite(ctx) {
        let arr = [this.x, this.y, this.width, this.height, this.lineWidth,this.fillColor, this.strokeColor, this.isFilled, this.strokeColor!=null]
        console.log("Properties: " + arr.join(", "))
        ctx.beginPath();
        console.log("rectangle")
        console.log(this.strokeColor!=null ? this.strokeColor : "rgba(0,0,0,0)");
        ctx.fillStyle = this.isFilled ? this.fillColor : "rgba(0,0,0,0)";
        ctx.strokeStyle = this.strokeColor!=null ? this.strokeColor : "rgba(0,0,0,0)";
        ctx.lineWidth = this.lineWidth;
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fill();
        ctx.stroke();
        arr = [this.x, this.y, this.width, this.height, this.lineWidth, this.fillColor, this.strokeColor, this.isFilled, this.strokeColor!=null]
        console.log("Properties: " + arr.join(", "))
        ctx.closePath();
    }
}