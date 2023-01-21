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

// Comment anchors extension in vscode
/** ANCHOR - Game class
 * Class declaration for the Game object
 * TODO: add 3d canvas. The way we could do this is by, instead of getting 2d context, get webgl2 context which is for 3d
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
 */ 
class Game {
    constructor(canvas = null, scenes = null) {
        this.canvas = canvas != null ? canvas : this.createCanvas();
        this.left = 0;
        this.top = 0;
        this.right = this.canvas.getBoundingClientRect().width;
        this.bottom = this.canvas.getBoundingClientRect().height;
        this.scenes = [];
        this.createScene();
        this.currentScene = this.scenes[0];
        this.backgroundColor = "white";
        this.isMouseHover = false;
        this.verticalPressed = false;
        this.horizontalPressed = false;
        this.inputRecievers = [];
        //    W S A D   Used in the inputs
        this.controlsIntervals = [0,0,0,0]
        this.keydownStepsPerSecond = 60;
        this.keyDownListener = this.canvas.parentElement.addEventListener("keydown",(e)=>{
            if(e.key==="w"||e.key==="s"){this.verticalPressed=true}
            if(e.key==="a"||e.key==="d"){this.horizontalPressed=true}
            if(e.key=="w"){
                if(this.controlsIntervals[0]==0){
                    this.controlsIntervals[0] = setInterval(()=>{
                        this.inputRecievers.forEach((methodArr)=>{
                            if(methodArr[0]=="wasd"){
                                methodArr[1]("w")
                            }
                        })
                    }, 1000/this.keydownStepsPerSecond);
                }
            }
            if (e.key == "s") {
                if(this.controlsIntervals[1]==0){
                    this.controlsIntervals[1] = setInterval(() => {
                        this.inputRecievers.forEach((methodArr) => {
                            if(methodArr[0]=="wasd"){
                                methodArr[1]("s")
                            }
                        })
                    }, 1000/this.keydownStepsPerSecond);
                }
            }
            if (e.key == "a") {
                if(this.controlsIntervals[2]==0){
                    this.controlsIntervals[2] = setInterval(() => {
                        this.inputRecievers.forEach((methodArr) => {
                            if(methodArr[0]=="wasd"){
                                methodArr[1]("a")
                            }
                        })
                    }, 1000/this.keydownStepsPerSecond);
                }
            }
            if (e.key == "d") {
                if(this.controlsIntervals[3]==0){
                    this.controlsIntervals[3] = setInterval(() => {
                        this.inputRecievers.forEach((methodArr) => {
                            if(methodArr[0]=="wasd"){
                                methodArr[1]("d")
                            }
                        })
                    }, 1000/this.keydownStepsPerSecond);
                }
            }
        });
        this.canvas.parentElement.addEventListener("keyup",(e)=>{
            if(e.key==="w"||e.key==="s"){this.verticalPressed=false}
            if(e.key==="a"||e.key==="d"){this.horizontalPressed=false}
            if(e.key=="w"){
                if(this.controlsIntervals[0]!=0){
                    clearInterval(this.controlsIntervals[0]);
                    this.controlsIntervals[0] = 0;
                }
            }
            if (e.key == "s") {
                if (this.controlsIntervals[1] != 0) {
                    clearInterval(this.controlsIntervals[1]);
                    this.controlsIntervals[1] = 0;
                }
            }
            if (e.key == "a") {
                if (this.controlsIntervals[2] != 0) {
                    clearInterval(this.controlsIntervals[2]);
                    this.controlsIntervals[2] = 0;
                }
            }
            if (e.key == "d") {
                if (this.controlsIntervals[3] != 0) {
                    clearInterval(this.controlsIntervals[3]);
                    this.controlsIntervals[3] = 0;
                }
            }
        })
        document.onmousemove = (mouse)=>{
            this.inputRecievers.forEach((methodArr)=>{
                if(methodArr[0]=="mouse"){
                    var rect = mouse.target.getBoundingClientRect();
                    var relativeX = mouse.clientX - rect.left;
                    var relativeY = mouse.clientY - rect.top;
                    methodArr[1](mouse.x, mouse.y, relativeX, relativeY);
                }
            })
        }
        var self = this;
        this.canvas.addEventListener("mouseleave", function (event) {
            self.isMouseHover = false
        }, false);
        this.canvas.addEventListener("mouseover", function (event) {
            self.isMouseHover = true
        }, false);
        
        return new Proxy(this, contactProxyHandlers);
    }
    
    getAngleBetweenPoints(x1,y1,x2,y2){
        if(x1 == x2 && y1 == y2) {console.warn(`These are the same point fool... (${x1},${y1}) and (${x2},${y2})`)}
        let theta = Math.atan2(x2-x1,y2-y1);
        if (theta < 0.0){
            theta += Math.PI*2;
        }
        let thetaDeg = theta * (180/Math.PI);
        thetaDeg = -thetaDeg+180;
        if(thetaDeg< 0){
            thetaDeg += 360;
        }
        return (thetaDeg);
    }

    getPointInDirection(x,y,angle,distance, isDegrees = true){
        if(isDegrees){
            angle = angle * (Math.PI/180)
        }
        let finalX = x + Math.sin(angle) * distance
        let finalY = y - Math.cos(angle) * distance
        return [finalX, finalY]
    }
    
    addInputReciever(inputType, methodToCall){
        if(!(inputType.toLowerCase()=="wasd"||inputType.toLowerCase()=="mouse"))
            console.error(`inputType is not valid, use wasd... ${inputType}`);
        let theArray = [inputType.toLowerCase(),methodToCall]
        this.inputRecievers.push(theArray);
        return theArray;
    }

    removeInputReciever(inputRecieverArray){
        let index = this.inputRecievers.indexOf(inputRecieverArray)
        this.inputRecievers.splice(index, 1)
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
        let temp = new Scene();
        temp.parentGame = this;
        this.scenes.push(temp);
        return temp;
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
        return that;
    }

    // sets the background color to any HTML5 supported color
    setBackgroundColor(color){
        this.backgroundColor = color;
        return this;
    }

    // Adds a new polygon to the sprites.
    addPolygon(pointsList, fillColor = "black", isFilled = true, strokeColor = null){
        if (!pointsList) { throw new Error("addPolygon requires (pointsList) arguments") }
        return this.currentScene.addPolygon(pointsList, fillColor, isFilled, strokeColor);
    }
    
    // Add a circle to the sprites.
    addCircle(x, y, radius, fillColor = "black", isFilled = true, strokeColor = null){
        if (!x || !y || !radius) { throw new Error("addCircle requires (x, y, radius) arguments") }
        return this.currentScene.addCircle(x, y, radius, fillColor, isFilled, strokeColor);
    }
    
    // Adds a regular polygon to the sprites.
    addRegularPolygon(x, y, radius, sides, fillColor = "black", isFilled = true, strokeColor = null){
        if (!x || !y || !radius || !sides) { throw new Error("addPolygon requires (x, y, radius, sides) arguments") }
        return this.currentScene.addRegularPolygon(x, y, radius, sides, fillColor, isFilled, strokeColor);
    }

    // lets you add a rectangle
    addRectangle(x = 250, y = 250, width = 100, height = 100, color = "black", isFilled = true, strokeColor = null) {
        if (!x || !y || !width || !height) { throw new Error("addRectangle requires (x, y, width, height) arguments") }
        return this.currentScene.addRectangle(x, y, width, height, color, isFilled, strokeColor);
    }
    
    // Adds an image to the sprites.
    addImage(image, x, y, width = 0, height = 0){
        if (!image || !x || !y) { throw new Error("addImage requires (image, x, y) arguments") }
        return this.currentScene.addImage(image, x, y, width, height);
    }

    // Adds a label to the sprites.
    addLabel(textValue, x, y, fillColor="black", isFilled = true, strokeColor = null){
        if (!textValue || !x || !y) { throw new Error("addLabel requires (textValue, x, y) arguments") }
        return this.currentScene.addLabel(textValue, x, y, fillColor, isFilled, strokeColor);
    }
    
    // Adds a label to the sprites.
    addLine(x1, y1, x2, y2, fillColor="black"){
        if (x1==undefined || y1==undefined || x2==undefined || y2==undefined) { throw new Error("addLabel requires (textValue, x, y) arguments") }
        return this.currentScene.addLine(x1, y1, x2, y2, fillColor);
    }

    // render function that draws all the sprites inside of each scene
    // render(canvas) {
    //     let ctx = canvas.getContext("2d");
    //     this.spritesPrivateLater.forEach((sprite) => {
    //         sprite.drawSprite(ctx);
    //     })
    // }
}
class OmnidirectionalGame extends Game{
    constructor(canvas = null){
        super(canvas);
        this.player = new Circle(300,300,20)
        this.lastMousePos = [0,0]
        this.scenes[0].addSprite(this.player);
        this.backgroundColor = "#36393F";
        this.speed = 1
        this.keydownStepsPerSecond = 5000
        this.verticalWallBufferDist = this.player.radius;
        this.horizontalWallBufferDist = this.player.radius;
        this.wasdReciever = this.addInputReciever("wasd", (input)=>{
            let speed;
            // if(input==="w"&&input==="a"){speed = -this.speed/2}
            if(input==="w"){speed = -this.speed}
            if(input==="s"){speed = this.speed}
            if(input==="d"){speed = this.speed}
            if(input==="a"){speed = -this.speed}
            verticalCheck: if(input=="w"||input=="s"){
                if(this.player.y-this.verticalWallBufferDist<this.top&&input=="w"){
                    break verticalCheck
                }
                else if(this.player.y+this.verticalWallBufferDist>this.bottom&&input=="s"){
                    break verticalCheck
                }
                this.player.y+= this.horizontalPressed?speed/Math.sqrt(2):speed
            }
            horizontalCheck: if(input=="a"||input=="d"){
                if(this.player.x-this.horizontalWallBufferDist<this.left&&input=="a"){
                    break horizontalCheck
                }
                else if(this.player.x+this.horizontalWallBufferDist>this.right&&input=="d"){
                    break horizontalCheck
                }
                this.player.x+=this.verticalPressed?speed/Math.sqrt(2):speed
            }
        })
        this.addInputReciever("mouse", (globalX, globalY, relativeX, relativeY)=>{
            //console.log(globalX, globalY, relativeX, relativeY,this.isMouseHover)
            if(omniGame.isMouseHover==true){
                this.lastMousePos = [relativeX, relativeY]
            }
        });
        this.onStep(()=>{
            this.renderScene();
        })
    }
}

class Scene {
    // Realistically a Scene has no default sprites
    spritesPrivateLater;
    constructor(sprites) {
        if (!Array.isArray(sprites) && sprites != undefined) { throw Error(`${sprites} is not an Array`) }
        this.spritesPrivateLater = Array.isArray(sprites) ? sprites : [];
        this.gravityVal = 0;
        this.sceneSpeed = 0;
        this.floorLevel = -1;
    }

    // Add a sprite to the sprites collection.
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
    
    // Checks if a list contains an object.
    #containsObject(obj, list) {
        var i;
        for (i = 0; i < list.length; i++) {
            if (list[i] === obj) {
                return true;
            }
        }
        return false;
    }
    
    remove(sprite){
        if((this.#containsObject(sprite, this.spritesPrivateLater))){
            let index = this.spritesPrivateLater.indexOf(sprite);
            if (index > -1) { // only splice array when item is found
                this.spritesPrivateLater.splice(index, 1); // 2nd parameter means remove one item only
            }
            else{
                return console.warn("Sprite was not found in the sprites array for this scene... " + sprite)
            }
        }
    }

    // Add a group to the game object.
    addGroup(group){
        if(!(group instanceof Group)){return console.error(`addGroup takes a Group object as input... ${group}`)}
        group.sprites.forEach((sprite)=>{
            if((this.#containsObject(sprite, this.spritesPrivateLater))){
                let index = this.spritesPrivateLater.indexOf(sprite);
                if (index > -1) { // only splice array when item is found
                    this.spritesPrivateLater.splice(index, 1); // 2nd parameter means remove one item only
                }
            }
        })
        this.spritesPrivateLater.push(group)
    }
    
    // Adds a new polygon to the sprites.
    addPolygon(pointsList, fillColor = "black", isFilled = true, strokeColor = null){
        if (!pointsList) { throw new Error("addPolygon requires (pointsList) arguments") }
        let temp = new Polygon(pointsList, fillColor, isFilled, strokeColor);
        this.spritesPrivateLater.push(temp);
        return temp;
    }
    static createPolygon(pointsList, fillColor = "black", isFilled = true, strokeColor = null){
        if (!pointsList) { throw new Error("addPolygon requires (pointsList) arguments") }
        let temp = new Polygon(pointsList, fillColor, isFilled, strokeColor);
        return temp;
    }
    
    // Add a circle to the sprites.
    addCircle(x, y, radius, fillColor = "black", isFilled = true, strokeColor = null){
        if (!x || !y || !radius) { throw new Error("addCircle requires (x, y, radius) arguments") }
        let temp = new Circle(x, y, radius, fillColor, isFilled, strokeColor);
        this.spritesPrivateLater.push(temp);
        return temp;
    }
    static createCircle(x, y, radius, fillColor = "black", isFilled = true, strokeColor = null){
        if (!x || !y || !radius) { throw new Error("addCircle requires (x, y, radius) arguments") }
        let temp = new Circle(x, y, radius, fillColor, isFilled, strokeColor);
        return temp;
    }
    
    // Adds a regular polygon to the sprites.
    addRegularPolygon(x, y, radius, sides, fillColor = "black", isFilled = true, strokeColor = null){
        if (!x || !y || !radius || !sides) { throw new Error("addPolygon requires (x, y, radius, sides) arguments") }
        let temp = new RegularPolygon(x, y, radius, sides, fillColor, isFilled, strokeColor);
        this.spritesPrivateLater.push(temp);
        return temp;
    }
    static createRegularPolygon(x, y, radius, sides, fillColor = "black", isFilled = true, strokeColor = null){
        if (!x || !y || !radius || !sides) { throw new Error("addPolygon requires (x, y, radius, sides) arguments") }
        let temp = new RegularPolygon(x, y, radius, sides, fillColor, isFilled, strokeColor);
        return temp;
    }

    // lets you add a rectangle
    addRectangle(x = 250, y = 250, width = 100, height = 100, color = "black", isFilled = true, strokeColor = null) {
        if (!x || !y || !width || !height) { throw new Error("addRectangle requires (x, y, width, height) arguments") }
        let temp = new Rectangle(x, y, width, height, color, isFilled, strokeColor);
        this.spritesPrivateLater.push(temp);
        return temp;
    }
    static createRectangle(x = 250, y = 250, width = 100, height = 100, color = "black", isFilled = true, strokeColor = null) {
        if (!x || !y || !width || !height) { throw new Error("addRectangle requires (x, y, width, height) arguments") }
        let temp = new Rectangle(x, y, width, height, color, isFilled, strokeColor);
        return temp;
    }
    
    // Adds an image to the sprites.
    addImage(image, x, y, width = 0, height = 0){
        if (!image || !x || !y) { throw new Error("addImage requires (image, x, y) arguments") }
        let temp = new ImageSprite(image, x, y, width, height);
        this.spritesPrivateLater.push(temp);
        return temp;
    }
    static createImage(image, x, y, width = 0, height = 0){
        if (!image || !x || !y) { throw new Error("addImage requires (image, x, y) arguments") }
        let temp = new ImageSprite(image, x, y, width, height);
        return temp;
    }

    // Adds a label to the sprites.
    addLabel(textValue, x, y, fillColor="black", isFilled = true, strokeColor = null){
        if (!textValue || x==undefined || y==undefined) { throw new Error(`addLabel requires (textValue, x, y) arguments... ${textValue}, ${x}, ${y}`) }
        let temp = new Label(textValue, x, y, fillColor, isFilled, strokeColor);
        this.spritesPrivateLater.push(temp);
        return temp;
    }
    static createLabel(textValue, x, y, fillColor="black", isFilled = true, strokeColor = null){
        if (!textValue || x==undefined || y==undefined) { throw new Error(`addLabel requires (textValue, x, y) arguments... ${textValue}, ${x}, ${y}`) }
        let temp = new Label(textValue, x, y, fillColor, isFilled, strokeColor);
        return temp;
    }

    addLine(x1, y1, x2, y2, fillColor="black"){
        if (x1==undefined || y1==undefined || x2==undefined || y2==undefined) { throw new Error("addLabel requires (textValue, x, y) arguments") }
        let temp = new Line(x1, y1, x2, y2, fillColor);
        this.spritesPrivateLater.push(temp);
        return temp;
    }
    static addLine(x1, y1, x2, y2, fillColor="black"){
        if (x1==undefined || y1==undefined || x2==undefined || y2==undefined) { throw new Error("addLabel requires (textValue, x, y) arguments") }
        let temp = new Line(x1, y1, x2, y2, fillColor);
        return temp;
    }

    setGravity(gravityVal=0.3, sceneSpeed = 0, floorLevel = -1){
        this.gravityVal = gravityVal;
        this.sceneSpeed = sceneSpeed;
        this.floorLevel = this.addFloor();
    }

    addFloor(){
        return 0;
    }
    
    // render function that draws all the sprites inside of each scene
    render(canvas) {
        let ctx = canvas.getContext("2d");
        this.sceneSpeed += this.gravityVal;
        this.spritesPrivateLater.forEach((sprite) => {
            sprite.y+=this.sceneSpeed;
            sprite.floorLevel = this.floorLevel;
            sprite.drawSprite(ctx);
        })
    }
}

class Group {
    constructor(...args){
        if(!Array.isArray(args)){
            return console.error("Args is not an array")
        }
        let minX;
        let maxX;
        let minY;
        let maxY;
        // BUG/ISSUE : THIS NEEDS ANOTHER FOR LOOP FOR EACH SPRITE
        // LOOP THROUGH THE TOP LEFT BOTTOM AND RIGHT VALUE TO GET MIN AND MAX
        args.forEach((arg)=>{
            if(!(arg instanceof Sprite)){
                return console.error(`One of the args is not a sprite... ${arg}`)
            }
            if(minX==undefined){minX=arg.x}
            if(maxX==undefined){maxX=arg.x+arg.width}
            if(arg.x<minX){minX=arg.x}            
            if(arg.x+arg.width>maxX){maxX=arg.x+arg.width}            
            if(minY==undefined){minY=arg.y}
            if(maxY==undefined){maxY=arg.y+arg.height}
            if(arg.y<minY){minY=arg.y}            
            if(arg.y+arg.height>maxY){maxY=arg.y+arg.height}           
        })
        this.x = minX;
        this.prevX = this.x;
        this.width = maxX-minX;
        this.y = minY;
        this.prevY = this.y;
        this.height = maxY-minY;
        this.sprites = args;
    }

    addSprite(sprite){
        let minX;
        let maxX;
        let minY;
        let maxY;
        this.sprites.forEach((arg)=>{
            if(!(arg instanceof Sprite)){
                return console.error(`One of the args is not a sprite... ${arg}`)
            }
            if(minX==undefined){minX=arg.x}
            if(maxX==undefined){maxX=arg.x+arg.width}
            if(arg.x<minX){minX=arg.x}            
            if(arg.x+arg.width>maxX){maxX=arg.x+arg.width}            
            if(minY==undefined){minY=arg.y}
            if(maxY==undefined){maxY=arg.y+arg.height}
            if(arg.y<minY){minY=arg.y}            
            if(arg.y+arg.height>maxY){maxY=arg.y+arg.height}           
        })
        this.x = minX;
        this.prevX = this.x;
        this.width = maxX-minX;
        this.y = minY;
        this.prevY = this.y;
        this.height = maxY-minY;
        this.sprites.push(sprite);
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
    
    updateGroup(){
        this.left = this.x;
        this.right = this.x + this.width;
        this.top = this.y;
        this.bottom = this.y + this.height;
        this.sprites.forEach((sprite)=>{
            let deltaX = this.x - this.prevX;
            let deltaY = this.y-this.prevY;
            sprite.x += deltaX;
            sprite.y += deltaY;
            //console.log(sprite.x, sprite.y, sprite.fillColor)
        })
        this.prevX = this.x;
        this.prevY = this.y;
    }

    drawSprite(ctx){
        this.updateGroup();
        this.sprites.forEach((sprite)=>{
            sprite.drawSprite(ctx);
        })
    }
}

// declaration for the Sprite object (only serves as a superclass and does not work as a sprite of its own)
class Sprite {

    // list of acceptable types, can be expanded later
    #acceptableTypes = ["rect", "rectangle", "circle", "text", "line", "polygon", "line"];

    // constructor for such
    constructor(type, x, y, color) {
        
        if (!this.#acceptableTypes.includes(type)) { throw new Error(`${type} is not a valid type, use one of the following: ${this.#acceptableTypes.join(", ")}`) }
        if (typeof x != "number" || typeof y != "number") { throw new Error(`x or y is not a number: x: ${x}, y: ${y}`) }
        
        this.type = type;
        this.x = x;
        this.y = y;

        this.rotation = 0;
        this.scale = 1.0;
        
        this.fillColor = color;
        
        this.lineWidth = 1.0;
        this.lineRounding = "miter";
        
        this.floorLevel = false;
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

    setScale(scale){
        this.scale = scale;
        return this;
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

    setLineRounding(lineRounding = "miter"){
        let validStrings = ["miter", "round", "bevel"]
        if(validStrings.includes(lineRounding)){
            this.lineRounding = lineRounding;
        }
        else{
            console.warn(`${lineRounding} is not a valid rounding property. Use "miter", "round", or "bevel"...`)
            console.warn(this)
        }
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

class Line extends Sprite{
    constructor(x1, y1, x2, y2, fillColor="black"){
        super("line", x1, y1, fillColor)
        this.x2 = x2;
        this.y2 = y2;
    }

    updateShape(){
        this.left = this.x<this.x2?this.x:this.x2
        this.top = this.y<this.y2?this.y:this.y2
        this.right = this.x>this.x2?this.x:this.x2
        this.bottom = this.y>this.y2?this.y:this.y2
        this.height= Math.abs(this.y-this.y2);
        this.width= Math.abs(this.x-this.x2);
    }

    drawSprite(ctx){
        this.updateShape();
        ctx.beginPath();
        ctx.strokeStyle = this.fillColor != null ? this.fillColor : "rgba(0,0,0,0)";
        ctx.lineWidth = this.lineWidth;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x2, this.y2);
        ctx.stroke();
        ctx.closePath();
    }
}

class Polygon extends Sprite{
    constructor(pointsList, fillColor = "black", isFilled = true, strokeColor = null){
        super("polygon", 0, 0, fillColor)
        this.points = pointsList; // 2d array [[50,200],[75,220]]
        this.isFilled = isFilled;
        this.strokeColor = strokeColor;
        let minMax = this.#findMinandMax(); let minArr = minMax[0]; let maxArr = minMax[1];
        this.x = minArr[0];
        this.y = minArr[1];
        this.width = this.x + maxArr[0] - minArr[0]
        this.height = this.y + maxArr[1] - minArr[1]
    }

    #findMinandMax(){
        let array2d = this.points;
        let minX;
        let maxX;
        let minY;
        let maxY;
        array2d.forEach((arg)=>{
            if(minX==undefined){minX=arg[0]}
            if(maxX==undefined){maxX=arg[0]}
            if(minY==undefined){minY=arg[1]}
            if(maxY==undefined){maxY=arg[1]}
            if(arg[0]<minX){minX=arg[0]}            
            if(arg[0]>maxX){maxX=arg[0]}            
            if(arg[1]<minY){minY=arg[1]}            
            if(arg[1]>maxY){maxY=arg[1]}            
        })
        //this.x = minX;
        //this.width = maxX-minX;
        //this.y = minY;
        //this.height = maxY-minY;
        return [[minX,minY],[maxX,maxY]];
    }

    move2d(distanceX = 0, distanceY = 0){
        this.points.forEach((point)=>{
            point[0]+=distanceX;
            point[1]+=distanceY;
        })
    }

    drawSprite(ctx){
        if(this.points.length>=1){
            ctx.beginPath();
            ctx.moveTo(this.points[0][0], this.points[0][1]+this.y);          

            for (var i = 1; i < this.points.length; i++) {
                ctx.lineTo(this.points[i][0], this.points[i][1]+this.y);
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
        this.height=this.radius*2;
        this.width=this.radius*2;
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
        this.updateShape();
        let temp = [];
        ctx.beginPath();
        ctx.moveTo (this.x +  this.radius * Math.cos(0+this.polyRotation), this.y +  this.radius *  Math.sin(0+this.polyRotation));          
        temp.push([this.x +  this.radius * Math.cos(0+this.polyRotation), this.y +  this.radius *  Math.sin(0+this.polyRotation)]);
        temp.push(temp[0]);
        temp.push(temp[1]);
        for (var i = 1; i <= this.sides;i += 1) {
            
            let tempX = this.x + this.radius * Math.cos(i * 2 * Math.PI / this.sides+this.polyRotation);
            let tempY = this.y + this.radius * Math.sin(i * 2 * Math.PI / this.sides+this.polyRotation);

            ctx.lineTo (tempX, tempY);
            temp.push([tempX, tempY]);
        }
        ctx.lineTo (this.x + this.radius * Math.cos(2 * Math.PI / this.sides+this.polyRotation), this.y + this.radius * Math.sin(2 * Math.PI / this.sides+this.polyRotation));
        ctx.lineJoin = this.lineRounding;
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
        this.right = this.x + this.width * this.scale;
        this.bottom = this.y + this.height * this.scale;
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
        ctx.rect(this.x, this.y, this.width * this.scale, this.height * this.scale);
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

        let tempImages = [];
        this.costumes = [];
        
        this.costumeNumber = 0;

        // creates an array out of a single image if not already an array
        if(!Array.isArray(image)){
            tempImages[0] = image;
        }
        else{
            tempImages = image;
        }

        for(let i = 0; i < tempImages.length; i++){

            // Constructs a new Image instance.
            if(typeof tempImages[i] == "string"){
                let temp = new Image();
                temp.src = tempImages[i];
                this.costumes[i] = temp;
            }
            
            // Sets the image.
            else if(tempImages[i] instanceof Image){
                this.costumes[i] = tempImages[i];
            }
        }

        this.currentCostume = this.costumes[this.costumeNumber]
        this.width = this.currentCostume.width * this.scale;
        this.height = this.currentCostume.height * this.scale;
    }

    // Draw a sprite.
    drawSprite(ctx) {
        this.updateShape();
        this.rotate(ctx);
    }

    // Updates the shape of the image.
    updateShape() {
        super.updateShape();
        //console.log(this.costumeNumber);
        if(this.costumeNumber > this.costumes.length - 1){
            this.costumeNumber = 0;
        }
        else if(this.costumeNumber < 0){
            this.costumeNumber = this.costumes.length - 1;
        }
        this.currentCostume = this.costumes[this.costumeNumber]
        this.width = this.currentCostume.width * this.scale;
        this.height = this.currentCostume.height * this.scale;
    }

    // saves the canvas, translates, rotates, draws, and then restores
    rotate(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotation);
        ctx.drawImage(this.currentCostume, -this.width / 2, -this.height / 2, this.width, this.height);
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

    // Sets the alignment of the rectangle.
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

        /* NOT WORKING cause im cringe
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

    setText(value){
        this.textValue = value;
        return this;
    }
}