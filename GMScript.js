const rexAllDigits = /^\d+$/;
const rexAllNegativeDigits = /-\d+/;
const contactProxyHandlers = {
    get(target, key) {
        if (rexAllNegativeDigits.test(key) && Math.abs(key) <= target.scenes.length){
            return target.scenes[target.scenes.length+parseInt(key)];
        }
        if (rexAllDigits.test(key)) {
            return target.scenes[key];
        }
        return target[key];
    },
    set(target, key, value) {
        if (rexAllDigits.test(key)) {
            return Reflect.set(target.scenes, key, value);
        }
        return Reflect.set(target, key, value);
    }
};
class Game {
    constructor(canvas = null, scenes = this.createScene()) {
        this.canvas = canvas!=null ? canvas : this.createCanvas();
        this.scenes = scenes;
        this.currentScenes = scenes[0]; 
        return new Proxy(this, contactProxyHandlers);
    }

    createCanvas(){
        let canvas = document.createElement("canvas");
        canvas.style.width = "100vw";
        canvas.style.height = "5vh";
        document.querySelector("body").appendChild(canvas);
        return canvas;
    }

    createScene(){
        return [new Scene()];
    }

    updateScene(){

    }
}


class Scene {
    constructor(sprites = [new Sprite("square", 10, 10)]){
        this.sprites = sprites;
    }
}

class Sprite{
    constructor(type, x, y, color = "black"){
        this.type = type;
        this.x = x;
        this.y = y;
        this.color = color;
    }
}