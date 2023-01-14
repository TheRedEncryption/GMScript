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

// wdym? whether we should use class or list? prob class if we can make it act like a list
// seems more open to future edits
// YO IT WORKS, kinda. Google translate keeps saying French -> English

//which one you want to use?

// surely you cant just:

// class Game {
//     constructor(canvas = null) {
//         this.scenes = [];
//     }
// }


/* the way i was seeing the Game to be was an array of all the Scenes, through which you could
iterate and then render each Scene on whether or not the Scene.visible property was True.

so basically the renderer would check each scene to see if if the visible property was true
and then loop through that scene (it is also an array)

oh no
but then how do people create a "Game" if its an array, they dont? thats crazy
Game is created for them upon including the script
there is only one Game

i feel like thats bad practice for themlike
you should be able to create as many Game canvases as you want
hm
remember what i was sayign about the uhhh initialize function?

oh yeah

hmmmmmmmm

let canvas = new Game() // creates an object that can be iterated through

This is apparently a thing
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols

we could tweak that to be able to create multiple Game canvases


the scenes are objects, they just have arrays as one of the properties
that hold the Sprites

so really only the Game is an array
but we can make it an object too

so you are saying

yeah
that seems insane to me, no reason for that, it just is wild
actually idk
classes just feel smoother
Can't you still do that with a class
you could technically but uhhhh you'd have to make it iterable */