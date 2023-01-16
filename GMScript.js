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
        this.currentScene.render(this.canvas);
    }
}


class Scene {
    // Realistically a Scene has no default sprites
    #sprites;
    constructor(sprites) {
        if (!Array.isArray(sprites) && sprites != undefined) { throw Error(`${sprites} is not an Array`) }
        this.#sprites = Array.isArray(sprites) ? sprites : [];
    }

    addSprite() {
        console.log(this.#sprites)
        let self = this.#sprites;
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

    addRect(x, y, width, height, color = "black", isFilled = true) {
        if (!x || !y || !width || !height) { throw new Error("addRect requires (x, y, width, height) arguments") }
        this.#sprites.push(new Rectangle("rectangle", x, y, width, height, color, isFilled))
    }

    render(canvas) {
        this.#sprites.forEach((sprite) => {
            sprite.drawSprite(canvas);
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

    drawSprite(canvas) {
        let ctx = canvas.getContext("2d");
    }
}

class Rectangle extends Sprite {
    constructor(x, y, width, height, fillColor = "black", isFilled = true, strokeColor = null) {
        super("rectangle", x, y, fillColor);
        this.width = width;
        this.height = height;
        this.isFilled = isFilled;
        this.strokeColor = strokeColor;
        this.lineWidth = 1.0;
    }

    drawSprite(canvas) {
        let ctx = canvas.getContext("2d");
        ctx.fillStyle = this.isFilled ? fillColor : "rgba(0,0,0,0)";
        ctx.strokeStyle = this.strokeColor!=null ? this.strokeColor : "rgba(0,0,0,0)";
        ctx.lineWidth = this.lineWidth;
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fill();
        ctx.stroke();
    }
}