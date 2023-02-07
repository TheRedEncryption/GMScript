//import { Renderer, Camera, Transform, Box, Program, Mesh } from 'https://unpkg.com/ogl';
//const THREE = require('three');

originalConsole = window.console;
window.console.font = function(url){
    split = url.split("/")
    text = "<style>\n\t@import url('https://fonts.googleapis.com/css2?family=" + split[split.length-1] + "&display=swap');\n</style>"
    originalConsole.log(text)
}
/** 
* @typedef {Object} inputRecieverType
* @property {Number} timestamp - UNIX timestamp.
* @property {String} url - Booking URL.
*/
// console.font(url) insane

// a regex that gets all the digits
const rexAllDigits = /^\d+$/;

// a regex that gets all the negative digits
const rexAllNegativeDigits = /-\d+/;

// this is the get and set methods for the Game's Scene iterable
const contactProxyHandlers = {
    /**
     * 
     * @param {Array.<Scene>} target 
     * @param {number} key 
     * @returns {Scene}
     */
    get(target, key) {
        if (rexAllNegativeDigits.test(key) && Math.abs(key) <= target.scenes.length) {
            return target.scenes[target.scenes.length + parseInt(key)];
        }
        else if (rexAllDigits.test(key)) {
            if(key >= target.scenes.length){
                let temp = key-target.scenes.length+1;
                for(var i = 0; i < temp; i++){
                    target.createScene();
                }
            }
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

/**
* Game class that creates a canvas and controls input for the game
* @class Game
*/
class Game {
    /**
    * Creates an instance of Game.
    * @param {HTMLCanvasElement} canvas - The canvas element for the game. If none is provided, a canvas will be created.
    * @param {Array.<Scene>} scenes - The scenes for the game. If none are provided, a default scene will be created.
    */
    constructor(canvas = null, scenes = null) {
        this.canvas = canvas != null ? canvas : this.createCanvas();
        this.left = 0;
        this.top = 0;
        this.right = this.canvas.getBoundingClientRect().width;
        this.bottom = this.canvas.getBoundingClientRect().height;
        this.contextType = "2d"
        /**
         * @type {Array.<Scene>}
         */
        this.scenes = scenes==null?[]:scenes;
        this.createScene();
        /**
         * @type {Scene}
         */
        this.currentScene = this.scenes[0];
        this.backgroundColor = "white";
        this.mouseHovering = false;
        this.verticalPressed = false;
        this.horizontalPressed = false;
        this.inputRecievers = [];
        // TODO: Add better support for all keys (remove the lag upon keypress)
        this.controlsIntervalsAdvanced = [];
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

            this.inputRecievers.forEach((methodArr) => {
                if(methodArr[0]==e.key){
                    methodArr[1](e.key)
                }
            })

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
        window.addEventListener("mousemove",(mouse)=>{
            this.inputRecievers.forEach((methodArr)=>{
                if(methodArr[0]=="mouse"){
                    var rect = mouse.target.getBoundingClientRect();
                    var relativeX = mouse.clientX - rect.left;
                    var relativeY = mouse.clientY - rect.top;
                    methodArr[1](mouse.x, mouse.y, relativeX, relativeY);
                }
            })
        })
        var self = this;
        this.canvas.addEventListener("mouseleave", function (event) {
            self.mouseHovering = false
        }, false);
        this.canvas.addEventListener("mouseover", function (event) {
            self.mouseHovering = true
        }, false);
        
        return new Proxy(this, contactProxyHandlers);
    }

    /**
     * Get the angle between two points. 0 is up, 90 is right.
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2 
     * @param {number} y2 
     * @returns {number} Angle between the points, with 0 being up and 90 being right
     */
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

    /**
     * Gets the point at a certain angle and distance from a given point.
     * @param {number} x position of initial point
     * @param {number} y position of initial point
     * @param {number} angle, direction to find point in
     * @param {number} distance, how far to go at that angle
     * @param {boolean} isDegrees, if the provided angle is in degrees
     * @returns {Array.<number>} The point found in the direction and distance provided
     */
    getPointInDirection(x,y,angle,distance, isDegrees = true){
        if(isDegrees){
            angle = angle * (Math.PI/180)
        }
        let finalX = x + Math.sin(angle) * distance
        let finalY = y - Math.cos(angle) * distance
        return [finalX, finalY]
    }
    /**
     * Adds the given function to the list of method recievers for the provided type
     * @param {string} inputType 
     * @param {function} methodToCall 
     * @returns {inputRecieverType} The inputType and method provided to allow method editing later
     */
    addInputReciever(inputType, methodToCall){
        if(!(inputType.toLowerCase()=="wasd"||inputType.toLowerCase()=="mouse"))
            console.warn(`inputType is not a default, ensure that the input is a key on the keyboard, or instead use "wasd" or "mouse" ... ${inputType}`);
        let theArray = [inputType.toLowerCase(),methodToCall, this.canvas]
        this.inputRecievers.push(theArray);
        return theArray;
    }
    /**
     * Removes the previously added method from the input recievers
     * @param {inputRecieverType} inputRecieverArray 
     */
    removeInputReciever(inputRecieverArray){
        let index = this.inputRecievers.indexOf(inputRecieverArray)
        this.inputRecievers.splice(index, 1)
    }

    /**
     * Creates a default canvas element with width and height set to 600, and then adds it to the body
     * @returns {HTMLCanvasElement} canvas - The created canvas element
     */
    createCanvas() {
        let canvas = document.createElement("canvas");
        canvas.width = 600;
        canvas.height = 600;
        canvas.style.border = "2px solid black";
        document.querySelector("body").appendChild(canvas);
        return canvas;
    }

    /**
    * Creates a new default scene and adds it to the Game scene array
    * @returns {Scene} 
    */
    createScene() {
        let temp = new Scene();
        temp.parentGame = this;
        this.scenes.push(temp);
        return temp;
    }

    /**
     * Renders sprites to the current Scene
     */
    renderScene() {
        this.canvas.getContext(this.contextType).clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvas.getContext(this.contextType).fillStyle = this.backgroundColor;
        this.canvas.getContext(this.contextType).fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.currentScene.render(this.canvas);
    }

    /**
     * Checks if the sprite is in the current scene
     * @param {Sprite} sprite The sprite to search for
     * @returns boolean
     */
    currentSceneContains(sprite){
        return this.currentScene.spritesArray.includes(sprite)
    }

    /**
     * Checks if the scene provided is the current scene
     * @param {Scene} scene The scene to check
     * @returns boolean
     */
    isCurrentScene(scene){
        return this.currentScene == scene;
    }

    clearCanvas(){
        this.canvas.getContext(this.contextType).clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // onStep
    /**
     * Calls the provided function a set amount of times per second
     * @param {Function} onstep The function to be called
     * @param {number} stepsPerSecond Amount the provided function is called per second
     * @returns {number} The setInterval id, you can use this to clear the onstep function with `clearInterval()`
     */
    onStep(onstep, stepsPerSecond = 60) {
        let that = setInterval(() => {
            onstep();
        }, 1000 / stepsPerSecond);
        return that;
    }

    // sets the background color to any HTML5 supported color
    /**
     * Sets the background color of the scene to any HTML5 supported color
     * @example
     * // Sets the background to orange
     * game.setBackgroundColor("rgba(137,58,0,0.9)")
     * @param {string} color The color to set the background to. Can be any HTML5 supported color
     * @returns The current game object for easy function chaining
     */
    setBackgroundColor(color){
        this.backgroundColor = color;
        return this;
    }

    /**
     * Plays a note in the browser
     * @param {number} frequency frequency of the note to be played
     * @param {*} type Type of note... sine, sawtooth, square, triangle 
     */
    playNote(frequency, type) {
        let availableTypes = ["sine", "square", "triangle", "sawtooth"]
        if(!(availableTypes.includes(type.toLowerCase()))){
            return console.error(`playNote type has to be sine, square, triangle, or sawtooth... ${type}`)
        }
        let context = new AudioContext();
        let o = context.createOscillator();
        let g = context.createGain();
        o.type = type;
        o.connect(g);
        o.frequency.value = frequency;
        g.connect(context.destination);
        o.start(0);
        g.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.2);
        setTimeout(function () {
            context.close()
        }, 250)
    }

    /**
     * Adds a new polygon to the sprites.
     * @param {Array.<Array.<number>>} pointsList 2D array of points for the polygon
     * @example
     * game.addPolygon([[0,0],[500,500],[0,500]])
     * @param {string|null} fillColor Color of the shape
     * @param {boolean} isFilled Whether the shape is filled in or not
     * @param {string|null} strokeColor Color of the border
     * @returns {Polygon} the Polygon that was created
     */
    addPolygon(pointsList, fillColor = "black", isFilled = true, strokeColor = null){
        if (!pointsList) { throw new Error("addPolygon requires (pointsList) arguments") }
        return this.currentScene.addPolygon(pointsList, fillColor, isFilled, strokeColor);
    }
    
    /**
     * Add a circle to the sprites.
     * @param {number} x x-position of the center of the circle
     * @param {number} y y-position of the center of the circle
     * @param {number} radius radius of the circle
     * @param {string|null} fillColor Color of the shape
     * @param {boolean} isFilled Whether the shape is filled in or not
     * @param {string|null} strokeColor Color of the border
     * @returns {Circle} the Circle that was created
     */
    addCircle(x, y, radius, fillColor = "black", isFilled = true, strokeColor = null){
        if (x==undefined || y==undefined || radius==undefined) { throw new Error("addCircle requires (x, y, radius) arguments") }
        return this.currentScene.addCircle(x, y, radius, fillColor, isFilled, strokeColor);
    }

    /**
     * Adds a regular polygon to the sprites.
     * @param {number} x x-position of the center of the RegularPolygon
     * @param {number} y y-position of the center of the RegularPolygon
     * @param {number} radius 
     * @param {number} sides 
     * @param {string|null} fillColor Color of the shape
     * @param {boolean} isFilled Whether the shape is filled in or not
     * @param {string|null} strokeColor Color of the border
     * @returns {RegularPolygon} the RegularPolygon that was created
     */
    addRegularPolygon(x, y, radius, sides, fillColor = "black", isFilled = true, strokeColor = null){
        if (x==undefined || y==undefined || radius==undefined || !sides) { throw new Error("addPolygon requires (x, y, radius, sides) arguments") }
        return this.currentScene.addRegularPolygon(x, y, radius, sides, fillColor, isFilled, strokeColor);
    }

    /**
     * Lets you add a rectangle
     * @param {number} x x-position of the object
     * @param {number} y y-position of the object
     * @param {number} width width of the rectangle
     * @param {number} height height of the rectangle
     * @param {string|null} fillColor Color of the shape
     * @param {boolean} isFilled Whether the shape is filled in or not
     * @param {string|null} strokeColor Color of the border
     * @returns {Rectangle} the Rectangle that was created
     */
    addRectangle(x = 250, y = 250, width = 100, height = 100, fillColor = "black", isFilled = true, strokeColor = null) {
        if (x==undefined || y==undefined || width==undefined || height==undefined) { throw new Error("addRectangle requires (x, y, width, height) arguments") }
        return this.currentScene.addRectangle(x, y, width, height, fillColor, isFilled, strokeColor);
    }
    
    /**
     * Adds an image to the sprites.
     * @param {string|HTMLImageElement} image File path for the image or an Image() object
     * @param {number} x x-position of the object
     * @param {number} y y-position of the object
     * @param {number} width width of the image
     * @param {number} height height of the image
     * @returns {ImageSprite} the ImageSprite that was created
     */
    addImage(image, x, y, width = 0, height = 0){
        if (!image || x==undefined || y==undefined) { throw new Error("addImage requires (image, x, y) arguments") }
        return this.currentScene.addImage(image, x, y, width, height);
    }

    /**
     * Adds a label to the sprites.
     * @param {string} textValue 
     * @param {number} x 
     * @param {number} y 
     * @param {string|null} fillColor Color of the text
     * @param {boolean} isFilled Whether the text is filled in or not
     * @param {string|null} strokeColor Color of the text border
     * @returns {Label} the Label that was created
     */
    addLabel(textValue, x, y, fillColor="black", isFilled = true, strokeColor = null){
        if (!textValue || x==undefined || y==undefined) { throw new Error("addLabel requires (textValue, x, y) arguments") }
        return this.currentScene.addLabel(textValue, x, y, fillColor, isFilled, strokeColor);
    }

    addAdvancedLabel(textValue, x, y, autoAlign = true, fillColor = "black", isFilled = true, strokeColor = null){
        if (!textValue || x==undefined || y==undefined) { throw new Error("addLabel requires (textValue, x, y) arguments") }
        return this.currentScene.addAdvancedLabel(textValue, x, y, autoAlign, fillColor, isFilled, strokeColor);
    }
    
    /**
     * Adds a line to the sprites.
     * @param {number} x1 the x position for the 1st point of the line
     * @param {number} y1 the y position for the 1st point of the line
     * @param {number} x2 the x position for the 2nd point of the line
     * @param {number} y2 the y position for the 2nd point of the line
     * @param {string} fillColor Color of the line
     * @returns {Line} the Line that was created
     */
    addLine(x1, y1, x2, y2, fillColor="black"){
        if (x1==undefined || y1==undefined || x2==undefined || y2==undefined) { throw new Error("addLabel requires (textValue, x, y) arguments") }
        return this.currentScene.addLine(x1, y1, x2, y2, fillColor);
    }

    // render function that draws all the sprites inside of each scene
    // render(canvas) {
    //     let ctx = canvas.getContext("2d");
    //     this.spritesArray.forEach((sprite) => {
    //         sprite.drawSprite(ctx);
    //     })
    // }
}
class Game3D extends Game {
    constructor(canvas = null, scenes = null) {
        super(canvas, scenes);
        this.contextType = "webgl2";
        this.gl = this.canvas.getContext("webgl2");
        var vertexShaderSource = `#version 300 es

            // an attribute is an input (in) to a vertex shader.
            // It will receive data from a buffer
            in vec2 a_position;

            // Used to pass in the resolution of the canvas
            uniform vec2 u_resolution;

            // all shaders have a main function
            void main() {

            // convert the position from pixels to 0.0 to 1.0
            vec2 zeroToOne = a_position / u_resolution;

            // convert from 0->1 to 0->2
            vec2 zeroToTwo = zeroToOne * 2.0;

            // convert from 0->2 to -1->+1 (clipspace)
            vec2 clipSpace = zeroToTwo - 1.0;

            gl_Position = vec4(clipSpace, 0, 1);
            }
        `;

        var fragmentShaderSource = `#version 300 es

            // fragment shaders don't have a default precision so we need
            // to pick one. highp is a good default. It means "high precision"
            precision highp float;

            // we need to declare an output for the fragment shader
            out vec4 outColor;

            void main() {
            // Just set the output to a constant redish-purple
            outColor = vec4(1, 0, 0.5, 1);
            }
        `;
        // Get A WebGL context
        var gl = this.canvas.getContext("webgl2");
        if (!gl) {
            return;
        }

        // create GLSL shaders, upload the GLSL source, compile the shaders
        var vertexShader = this.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        var fragmentShader = this.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

        // Link the two shaders into a program
        var program = this.createProgram(gl, vertexShader, fragmentShader);

        // look up where the vertex data needs to go.
        var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

        // look up uniform locations
        var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");

        // Create a buffer and put a single pixel space rectangle in
        // it (2 triangles)
        // Create a buffer and put three 2d clip space points in it
        var positionBuffer = gl.createBuffer();

        // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        // Create a vertex array object (attribute state)
        var vao = gl.createVertexArray();
        
        // and make it the one we're currently working with
        gl.bindVertexArray(vao);
        
        // Turn on the attribute
        gl.enableVertexAttribArray(positionAttributeLocation);
        
        // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        var size = 2;          // 2 components per iteration
        var type = gl.FLOAT;   // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(
            positionAttributeLocation, size, type, normalize, stride, offset);

        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // Clear the canvas
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Tell it to use our program (pair of shaders)
        gl.useProgram(program);

        // Bind the attribute/buffer set we want.
        gl.bindVertexArray(vao);

        // Pass in the canvas resolution so we can convert from
        // pixels to clipspace in the shader
        gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

        this.createRectangle(gl, 300,300,50,50);
        this.createRectangle(gl, 450,450,50,50);
        this.createRectangle(gl, 200,300,50,50);
    }

    renderScene() {

    }

    createShader(gl, type, source) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (success) {
            return shader;
        }

        //console.log(gl.getShaderInfoLog(shader));  // eslint-disable-line
        gl.deleteShader(shader);
        return undefined;
    }

    createProgram(gl, vertexShader, fragmentShader) {
        var program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        var success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success) {
            return program;
        }

        //console.log(gl.getProgramInfoLog(program));  // eslint-disable-line
        gl.deleteProgram(program);
        return undefined;
    }

    createRectangle(gl, x, y, width, height) {
        var x1 = x;
        var x2 = x + width;
        var y1 = y;
        var y2 = y + height;

        // NOTE: gl.bufferData(gl.ARRAY_BUFFER, ...) will affect
        // whatever buffer is bound to the `ARRAY_BUFFER` bind point
        // but so far we only have one buffer. If we had more than one
        // buffer we'd want to bind that buffer to `ARRAY_BUFFER` first.

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            x1, y1,
            x2, y1,
            x1, y2,
            x1, y2,
            x2, y1,
            x2, y2]), gl.STATIC_DRAW);
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 6;
        gl.drawArrays(primitiveType, offset, count);
    }

}
class TopDownGame extends Game{
    constructor(isOpenBorders = false, canvas = null) {
        super(canvas);
        this.player = new Circle(300,300,20)
        this.lastMousePos = [0,0]
        this.scenes[0].addSprite(this.player);
        this.backgroundColor = "#36393F";
        this.speed = 1
        this.keydownStepsPerSecond = 5000
        this.verticalWallBufferDist = this.player.radius;
        this.horizontalWallBufferDist = this.player.radius;
        this.isOpenBorders = isOpenBorders;
        this.isCenteredCamera = false;
        this.wasdReciever = this.addInputReciever("wasd", (input)=>{
            let speed;
            // if(input==="w"&&input==="a"){speed = -this.speed/2}
            if(input==="w"){speed = -this.speed}
            if(input==="s"){speed = this.speed}
            if(input==="d"){speed = this.speed}
            if(input==="a"){speed = -this.speed}
            verticalCheck: if(input=="w"||input=="s"){
                if(!this.isOpenBorders){
                    if(this.player.y-this.verticalWallBufferDist<this.top&&input=="w"){
                        break verticalCheck
                    }
                    else if(this.player.y+this.verticalWallBufferDist>this.bottom&&input=="s"){
                        break verticalCheck
                    }
                }
                let moveAmount = this.horizontalPressed?speed/Math.sqrt(2):speed
                if(!this.isCenteredCamera){
                    this.player.y+= moveAmount
                }
                else{
                    this.currentScene.spritesArray.forEach((sprite)=>{
                        if(this.player===sprite){
                            return
                        }
                        sprite.y-= moveAmount;
                        
                    })
                }
            }
            horizontalCheck: if(input=="a"||input=="d"){
                if(!this.isOpenBorders){
                    if(this.player.x-this.horizontalWallBufferDist<this.left&&input=="a"){
                        break horizontalCheck
                    }
                    else if(this.player.x+this.horizontalWallBufferDist>this.right&&input=="d"){
                        break horizontalCheck
                    }
                }
                let moveAmount = this.verticalPressed?speed/Math.sqrt(2):speed
                if(!this.isCenteredCamera){
                    this.player.x+= moveAmount
                }
                else{
                    this.currentScene.spritesArray.forEach((sprite)=>{
                        if(this.player===sprite){
                            return
                        }
                        sprite.x-= moveAmount;
                    })
                }
            }
        })
        this.addInputReciever("mouse", (globalX, globalY, relativeX, relativeY)=>{
            //console.log(globalX, globalY, relativeX, relativeY,this.mouseHovering)
            if(this.mouseHovering==true){
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
    spritesArray;
    constructor(sprites) {
        if (!Array.isArray(sprites) && sprites != undefined) { throw Error(`${sprites} is not an Array`) }
        this.spritesArray = Array.isArray(sprites) ? sprites : [];
        this.gravityVal = 0;
        this.sceneSpeed = 0;
        this.floorPosition = -1;
        this.parentGame = null;
    }

    // Add a sprite to the sprites collection.
    addSprite() {
        //console.log(this.spritesArray)
        let self = this.spritesArray;

        // lets the user define the Sprite object to be added
        let addSpriteInit = function (type, x, y, color = "black") {
            if (!type || x==undefined || y==undefined) { throw new Error("addSprite requires (type, x, y) arguments or (Sprite)") }
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
        if((this.#containsObject(sprite, this.spritesArray))){
            let index = this.spritesArray.indexOf(sprite);
            if (index > -1) { // only splice array when item is found
                this.spritesArray.splice(index, 1); // 2nd parameter means remove one item only
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
            if((this.#containsObject(sprite, this.spritesArray))){
                let index = this.spritesArray.indexOf(sprite);
                if (index > -1) { // only splice array when item is found
                    this.spritesArray.splice(index, 1); // 2nd parameter means remove one item only
                }
            }
        })
        this.spritesArray.push(group)
    }

    #array_move(arr, old_index, new_index) {
        if (new_index >= arr.length) {
            var k = new_index - arr.length + 1;
            while (k--) {
                arr.push(undefined);
            }
        }
        arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    };

    setSpriteLayer(sprite, layer){
        if(typeof layer == "string"){
            if(!(layer=="top"||layer=="bottom"||layer=="middle")){
                return console.error(`setSpriteLayer requires either a number (greater than 0) or a string (top, bottom, or middle)... ${layer}`)
            }
            let tempInd = this.spritesArray.indexOf(sprite);
            if(layer==="bottom"){
                this.#array_move(this.spritesArray,tempInd,0)
            }
            if(layer==="top"){
                this.#array_move(this.spritesArray,tempInd,this.spritesArray.length-1);
            }
            if(layer==="middle"){
                this.#array_move(this.spritesArray,tempInd,Math.floor((this.spritesArray.length-1)/2));
            }
            return sprite
        }
        else if (typeof layer == "number"){
            if(!(layer<0||false)){
                return console.error(`setSpriteLayer requires either a number (greater than 0) or a string (top, bottom, or middle)... ${layer}`)
            }
            if(!isFinite(layer)||layer>this.spritesArray.length){
                layer = this.spritesArray.length-1
            }
            this.#array_move(this.spritesArray,tempInd,layer)
            return sprite
        }
        return console.error("setSpriteLayer accepts strings or numbers")
    }

    /**
     * Adds a new polygon to the sprites.
     * @param {Array.<Array.<number>>} pointsList 2D array of points for the polygon
     * @example
     * game.addPolygon([[0,0],[500,500],[0,500]])
     * @param {string|null} fillColor Color of the shape
     * @param {boolean} isFilled Whether the shape is filled in or not
     * @param {string|null} strokeColor Color of the border
     * @returns {Polygon} the Polygon that was created
     */
    addPolygon(pointsList, fillColor = "black", isFilled = true, strokeColor = null){
        if (!pointsList) { throw new Error("addPolygon requires (pointsList) arguments") }
        let temp = new Polygon(pointsList, fillColor, isFilled, strokeColor);
        this.spritesArray.push(temp);
        return temp;
    }
    static createPolygon(pointsList, fillColor = "black", isFilled = true, strokeColor = null){
        if (!pointsList) { throw new Error("addPolygon requires (pointsList) arguments") }
        let temp = new Polygon(pointsList, fillColor, isFilled, strokeColor);
        return temp;
    }
    
    /**
     * Add a circle to the sprites.
     * @param {number} x x-position of the center of the circle
     * @param {number} y y-position of the center of the circle
     * @param {number} radius radius of the circle
     * @param {string|null} fillColor Color of the shape
     * @param {boolean} isFilled Whether the shape is filled in or not
     * @param {string|null} strokeColor Color of the border
     * @returns {Circle} the Circle that was created
     */
    addCircle(x, y, radius, fillColor = "black", isFilled = true, strokeColor = null){
        if (x==undefined || y==undefined || radius==undefined) { throw new Error("addCircle requires (x, y, radius) arguments") }
        let temp = new Circle(x, y, radius, fillColor, isFilled, strokeColor);
        this.spritesArray.push(temp);
        return temp;
    }
    static createCircle(x, y, radius, fillColor = "black", isFilled = true, strokeColor = null){
        if (x==undefined || y==undefined || radius==undefined) { throw new Error("addCircle requires (x, y, radius) arguments") }
        let temp = new Circle(x, y, radius, fillColor, isFilled, strokeColor);
        return temp;
    }
    
    /**
     * Adds a regular polygon to the sprites.
     * @param {number} x x-position of the center of the RegularPolygon
     * @param {number} y y-position of the center of the RegularPolygon
     * @param {number} radius 
     * @param {number} sides 
     * @param {string|null} fillColor Color of the shape
     * @param {boolean} isFilled Whether the shape is filled in or not
     * @param {string|null} strokeColor Color of the border
     * @returns {RegularPolygon} the RegularPolygon that was created
     */
    addRegularPolygon(x, y, radius, sides, fillColor = "black", isFilled = true, strokeColor = null){
        if (x==undefined || y==undefined || radius==undefined || !sides) { throw new Error("addPolygon requires (x, y, radius, sides) arguments") }
        let temp = new RegularPolygon(x, y, radius, sides, fillColor, isFilled, strokeColor);
        this.spritesArray.push(temp);
        return temp;
    }
    static createRegularPolygon(x, y, radius, sides, fillColor = "black", isFilled = true, strokeColor = null){
        if (x==undefined || y==undefined || radius==undefined || !sides) { throw new Error("addPolygon requires (x, y, radius, sides) arguments") }
        let temp = new RegularPolygon(x, y, radius, sides, fillColor, isFilled, strokeColor);
        return temp;
    }

    /**
     * Lets you add a rectangle
     * @param {number} x x-position of the object
     * @param {number} y y-position of the object
     * @param {number} width width of the rectangle
     * @param {number} height height of the rectangle
     * @param {string|null} fillColor Color of the shape
     * @param {boolean} isFilled Whether the shape is filled in or not
     * @param {string|null} strokeColor Color of the border
     * @returns {Rectangle} the Rectangle that was created
     */
    addRectangle(x = 250, y = 250, width = 100, height = 100, fillColor = "black", isFilled = true, strokeColor = null) {
        if (x==undefined || y==undefined || width==undefined || height==undefined) { throw new Error("addRectangle requires (x, y, width, height) arguments") }
        let temp = new Rectangle(x, y, width, height, fillColor, isFilled, strokeColor);
        this.spritesArray.push(temp);
        return temp;
    }
    static createRectangle(x = 250, y = 250, width = 100, height = 100, fillColor = "black", isFilled = true, strokeColor = null) {
        if (x==undefined || y==undefined || width==undefined || height==undefined) { throw new Error("addRectangle requires (x, y, width, height) arguments") }
        let temp = new Rectangle(x, y, width, height, fillColor, isFilled, strokeColor);
        return temp;
    }
    
    /**
     * Adds an image to the sprites.
     * @param {string|HTMLImageElement} image File path for the image or an Image() object
     * @param {number} x x-position of the object
     * @param {number} y y-position of the object
     * @param {number} width width of the image
     * @param {number} height height of the image
     * @returns {ImageSprite} the ImageSprite that was created
     */
    addImage(image, x, y, width = 0, height = 0){
        if (!image || x==undefined || y==undefined) { throw new Error("addImage requires (image, x, y) arguments") }
        let temp = new ImageSprite(image, x, y, width, height);
        this.spritesArray.push(temp);
        return temp;
    }
    static createImage(image, x, y, width = 0, height = 0){
        if (!image || x==undefined || y==undefined) { throw new Error("addImage requires (image, x, y) arguments") }
        let temp = new ImageSprite(image, x, y, width, height);
        return temp;
    }

    /**
     * Adds a label to the sprites.
     * @param {string} textValue 
     * @param {number} x 
     * @param {number} y 
     * @param {string|null} fillColor Color of the text
     * @param {boolean} isFilled Whether the text is filled in or not
     * @param {string|null} strokeColor Color of the text border
     * @returns {Label} the Label that was created
     */
    addLabel(textValue, x, y, fillColor="black", isFilled = true, strokeColor = null){
        if (!textValue || x==undefined || y==undefined) { throw new Error(`addLabel requires (textValue, x, y) arguments... ${textValue}, ${x}, ${y}`) }
        let temp = new Label(textValue, x, y, fillColor, isFilled, strokeColor);
        this.spritesArray.push(temp);
        return temp;
    }

    static createLabel(textValue, x, y, fillColor="black", isFilled = true, strokeColor = null){
        if (!textValue || x==undefined || y==undefined) { throw new Error(`addLabel requires (textValue, x, y) arguments... ${textValue}, ${x}, ${y}`) }
        let temp = new Label(textValue, x, y, fillColor, isFilled, strokeColor);
        return temp;
    }
    
    addAdvancedLabel(textValue, x, y, autoAlign = true, fillColor = "black", isFilled = true, strokeColor = null){
        if (!textValue || x==undefined || y==undefined) { throw new Error(`addLabel requires (textValue, x, y) arguments... ${textValue}, ${x}, ${y}`) }
        let temp = new AdvancedLabel(textValue, x, y, autoAlign, fillColor, isFilled, strokeColor);
        this.spritesArray.push(temp);
        return temp;
    }
    static createAdvancedLabel(textValue, x, y, autoAlign = true, fillColor = "black", isFilled = true, strokeColor = null){
        if (!textValue || x==undefined || y==undefined) { throw new Error(`addLabel requires (textValue, x, y) arguments... ${textValue}, ${x}, ${y}`) }
        let temp = new AdvancedLabel(textValue, x, y, autoAlign, fillColor, isFilled, strokeColor);
        return temp;
    }

    /**
     * Adds a line to the sprites.
     * @param {number} x1 the x position for the 1st point of the line
     * @param {number} y1 the y position for the 1st point of the line
     * @param {number} x2 the x position for the 2nd point of the line
     * @param {number} y2 the y position for the 2nd point of the line
     * @param {string} fillColor Color of the line
     * @returns {Line} the Line that was created
     */
    addLine(x1, y1, x2, y2, fillColor="black"){
        if (x1==undefined || y1==undefined || x2==undefined || y2==undefined) { throw new Error("addLabel requires (textValue, x, y) arguments") }
        let temp = new Line(x1, y1, x2, y2, fillColor);
        this.spritesArray.push(temp);
        return temp;
    }
    
    static addLine(x1, y1, x2, y2, fillColor="black"){
        if (x1==undefined || y1==undefined || x2==undefined || y2==undefined) { throw new Error("addLabel requires (textValue, x, y) arguments") }
        let temp = new Line(x1, y1, x2, y2, fillColor);
        return temp;
    }

    setGravity(floorPosition = -1, gravityVal=0.3, sceneSpeed = 0){
        this.gravityVal = gravityVal;
        this.sceneSpeed = sceneSpeed;
        this.floorPosition = this.addFloor(floorPosition);
    }

    addFloor(floorPosition){
        if(floorPosition==-1){
            return null;
        }
        return floorPosition;
    }

    clearCanvas(){
        this.parentGame.canvas.getContext(this.parentGame.contextType).clearRect(0,0,this.parentGame.canvas.width, this.parentGame.canvas.height);
    }
    
    // render function that draws all the sprites inside of each scene
    render(canvas) {
        let ctx = canvas.getContext(this.parentGame!=null?this.parentGame.contextType:"2d");
        this.sceneSpeed += this.gravityVal;
        this.spritesArray.forEach((sprite) => {
            sprite.sceneSpeed = this.sceneSpeed;
            sprite.floorPosition = this.floorPosition;
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

class Collider {
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    hits(collider){
        // box-box collision
        if(this instanceof BoxCollider && collider instanceof BoxCollider){
            return this.boxBoxCheck(collider);
        }
        // circle-circle collision
        else if(collider instanceof CircleCollider && this instanceof CircleCollider){
            return this.circleCircleCheck(collider)
        }
        // box-circle collision
        else if((collider instanceof CircleCollider && this instanceof BoxCollider) || (this instanceof CircleCollider && collider instanceof BoxCollider)){
            return this.boxCircleCheck(collider);
        }
        // box-flex collision
        else if((collider instanceof FlexCollider && this instanceof BoxCollider) || (this instanceof FlexCollider && collider instanceof BoxCollider)){
            return this.boxFlexCheck(collider);
        }

    }

    circleCircleCheck(collider){
        let radiusSum = this.radius + collider.radius;
        let Dx = collider.x - this.x;
        let Dy = collider.y - this.y;
        return Dx * Dx + Dy * Dy <= radiusSum * radiusSum
    }

    boxCircleCheck(collider){
        let boxColliderX1;
        let boxColliderY1;
        let boxColliderX2;
        let boxColliderY2;
        let circleColliderX;
        let circleColliderY;
        let colliderRadius;

        if(collider instanceof CircleCollider){
            boxColliderX1 = this.x;
            boxColliderY1 = this.y;
            boxColliderX2 = this.right;
            boxColliderY2 = this.bottom;
            circleColliderX = collider.x;
            circleColliderY = collider.y;
            colliderRadius = collider.radius;
        }
        else{
            boxColliderX1 = collider.x;
            boxColliderY1 = collider.y;
            boxColliderX2 = collider.x + collider.width;
            boxColliderY2 = collider.y + collider.height;
            circleColliderX = this.x;
            circleColliderY = this.y;
            colliderRadius = this.radius;
        }


        // Find the nearest point on the
        // rectangle to the center of
        // the circle
        let Xn = Math.max(boxColliderX1, Math.min(circleColliderX, boxColliderX2));
        let Yn = Math.max(boxColliderY1, Math.min(circleColliderY, boxColliderY2));
        // Find the distance between the
        // nearest point and the center
        // of the circle
        // Distance between 2 points,
        // (x1, y1) & (x2, y2) in
        // 2D Euclidean space is
        // ((x1-x2)**2 + (y1-y2)**2)**0.5
        let Dx = Xn - circleColliderX;
        let Dy = Yn - circleColliderY;
        return (Dx * Dx + Dy * Dy) <= colliderRadius * colliderRadius;
    }

    boxBoxCheck(boxCollider){
        if(this.right>=boxCollider.left && this.left<=boxCollider.right && this.bottom>=boxCollider.top && this.top<=boxCollider.bottom){
            return true
        }
    }

    boxFlexCheck(collider){
        let boxColliderX1;
        let boxColliderY1;
        let boxColliderX2;
        let boxColliderY2;
        let flexPoints;

        if(collider instanceof CircleCollider){
            boxColliderX1 = this.x;
            boxColliderY1 = this.y;
            boxColliderX2 = this.right;
            boxColliderY2 = this.bottom;
            flexPoints = collider.points;
        }
        else{
            boxColliderX1 = collider.x;
            boxColliderY1 = collider.y;
            boxColliderX2 = collider.x + collider.width;
            boxColliderY2 = collider.y + collider.height;
            flexPoints = this.points;
        }
        return console.error("NO SUPPORT FOR FLEX COLLIDERS RIGHT NOW")
    }
}

class BoxCollider extends Collider{
    constructor(left, top, right, bottom){
        super(left, top);
        //console.warn("bx", left, top, right-left, bottom-top, right, bottom)
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
    }
}

class CircleCollider extends Collider{
    constructor(centerX, centerY, radius){
        super(centerX, centerY);
        //console.warn("bx", left, top, right-left, bottom-top, right, bottom)
        this.radius = radius;
        this.left = this.x-this.radius;
        this.top = this.y-this.radius;
        this.right = this.x+this.radius;
        this.bottom = this.y+this.radius;
    }
}

class FlexCollider extends Collider{
    constructor(points){
        this.points = points!=undefined ? points : [];
    }
}

// declaration for the Sprite object (only serves as a superclass and does not work as a sprite of its own)
class Sprite {

    // list of acceptable types, can be expanded later

    // constructor for such
    constructor(type, x, y, color) {
        let acceptableTypes = ["rect", "rectangle", "circle", "text", "line", "polygon", "line", "svg"];
        
        if (!acceptableTypes.includes(type)) { throw new Error(`${type} is not a valid type, use one of the following: ${acceptableTypes.join(", ")}`) }
        if (typeof x != "number" || typeof y != "number") { throw new Error(`x or y is not a number: x: ${x}, y: ${y}`) }
        
        this.type = type;
        this.x = x;
        this.y = y;

        this.rotation = 0;
        this.scale = 1.0;
        
        this.fillColor = color;
        
        this.lineWidth = 1.0;
        this.lineRounding = "miter";
        
        this.floorPosition = null;
    }

    updateCollider(){
        if(!this.collider){
            console.warn("Default box collider has been added for " + this + " because it did not have one");
            this.collider = new BoxCollider(this.x, this.y, this.x+1, this.y+1);
            return;
        }
        this.collider.x = this.x;
        this.collider.y = this.y;

        if(this.collider instanceof CircleCollider){
            this.collider.radius = this.radius;
            this.collider.left = this.x-this.radius;
            this.collider.top = this.y-this.radius;
            this.collider.right = this.x+this.radius;
            this.collider.bottom = this.y+this.radius;
        }
        else if(this.collider instanceof BoxCollider){
            this.collider.left = this.x
            this.collider.top = this.y;
            this.collider.right = this.x+this.width;
            this.collider.bottom = this.y+this.height;
        }
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
        this.updateShape();
        return this;
    }

    drawSprite(ctx) {
        console.log("Not a function yet");
    }

    checkFloor(){
        if(this.floorPosition!=null && this.floorPosition<=this.bottom){
            //this.setBottom(this.floorPosition)
            this.sceneSpeed = 0;
        }
        else if (this.sceneSpeed!=null){
            this.y+=this.sceneSpeed;
        }
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
        this.updateCollider();
        this.checkFloor();
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
        this.updateCollider();
        this.checkFloor();
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
        this.collider = new CircleCollider(this.x,this.y,this.radius);
    }

    hits(hitsArray){
        if(!Array.isArray(hitsArray)){return console.error(`.hits(Array) needs an array... ${hitsArray}`)}
        hitsArray.forEach((element)=>{
            if(!(element instanceof Sprite||element instanceof Group)){return console.error(`.hits(Array) needs the array to contain only Sprites or Groups... ${element} in ${hitsArray}`)}
        })
        let successArray = []
        hitsArray.forEach((element)=>{
            if(element.collider.hits(this.collider)){
                successArray.push(element);
            }
        })
        return successArray;
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
        this.updateCollider();
        this.checkFloor();
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
        this.updateCollider();
        this.checkFloor();
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
        this.collider = new BoxCollider(this.x, this.y, this.right, this.bottom)
    }

    hits(hitsArray){
        if(!Array.isArray(hitsArray)){return console.error(`.hits(Array) needs an array... ${hitsArray}`)}
        hitsArray.forEach((element)=>{
            if(!(element instanceof Sprite||element instanceof Group)){return console.error(`.hits(Array) needs the array to contain only Sprites or Groups... ${element} in ${hitsArray}`)}
        })
        let successArray = []
        hitsArray.forEach((element)=>{
            if(element.collider.hits(this.collider)){
                successArray.push(element);
            }
        })
        return successArray;
    }

    // updates the left, top, right, and bottom values to be used
    updateShape() {
        this.left = this.x;
        this.top = this.y;
        this.right = this.x + this.width * this.scale;
        this.bottom = this.y + this.height * this.scale;
        this.width = this.right-this.left;
        this.height = this.bottom-this.top;
        this.collider = new BoxCollider(this.x, this.y, this.right, this.bottom)
    }

    // the Rectangle's drawSprite() function
    drawSprite(ctx) {

        // updates the shape's properties
        this.updateShape();
        this.updateCollider();
        this.checkFloor();
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
    constructor(image, x, y) {
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
        this.left = this.x;
        this.top = this.y;
        this.right = this.x + this.width * this.scale;
        this.bottom = this.y + this.height * this.scale;
        this.collider = new BoxCollider(this.x, this.y, this.right, this.bottom)
    }

    // Draw a sprite.
    drawSprite(ctx) {
        this.updateShape();
        this.updateCollider();
        this.rotate(ctx);
    }

    // Updates the shape of the image.
    updateShape() {
        super.updateShape();
        this.checkFloor();
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
        try{
            ctx.drawImage(this.currentCostume, -this.width / 2, -this.height / 2, this.width, this.height);
        }
        catch{
            console.error("File is in a broken state, have you provided the correct path location? If so, and it still isn't working, pass an Image() instead of a path");
        }
        ctx.restore();
    }
}

// Might need to make a 3D Label as a seperate class
/**
 * Creates a label
 * @class Label
 */
class Label extends Rectangle {
    //x, y, width, height, fillColor = "black", isFilled = true, strokeColor = null
    constructor(textValue, x, y, fillColor="black", isFilled = true, strokeColor = null) {
        let canvas = document.createElement("canvas");
        // Might need to make a 3D Label as a seperate class
        let ctx = canvas.getContext('2d');
        ctx.font = `12px "arial"`;
        let metrics = ctx.measureText(textValue);
        let actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

        // SUPER CALL IS HERE
        super(x,y,metrics.width,actualHeight,fillColor,isFilled,strokeColor);
        this.x = x;
        this.y = y;
        this.fontSize = 12;
        this.font = "arial";
        this.fontBold = 'normal'
        this.fontItalic = 'normal'
        this.fontStyle = `normal normal 12px "arial"`
        this.textValue = textValue;
        this.hAlign = "left";
        this.vAlign = "top";
        this.collider = new BoxCollider(this.x, this.y, this.right, this.bottom)
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
            this.fontStyle = `${this.fontItalic} ${this.fontBold} ${fontSize}px "${this.font}"`
            let canvas = document.createElement("canvas");
            let ctx = canvas.getContext('2d');
            ctx.font = `${this.fontItalic} ${this.fontBold} ${fontSize}px "${this.font}"`;
            let metrics = ctx.measureText(this.textValue);
            let actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
            this.width = metrics.width;
            this.height = actualHeight;
            super.updateShape()
            this.collider = new BoxCollider(this.x, this.y, this.right, this.bottom)
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
        this.updateCollider();
        this.checkFloor();
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

    bolden(boldStyle = 'bold'){
        this.fontBold = boldStyle
        this.fontStyle = `${this.fontItalic} ${this.fontBold} ${this.fontSize}px "${this.font}"`
        return this;
    }

    italicize(italicStyle = "italic"){
        this.fontItalic = italicStyle;
        this.fontStyle = `${this.fontItalic} ${this.fontBold} ${this.fontSize}px "${this.font}"`
        return this;
    }

    setText(value){
        this.textValue = value;
        return this;
    }
}

class AdvancedLabel extends Rectangle {
    //x, y, width, height, fillColor = "black", isFilled = true, strokeColor = null
    constructor(textValue, x, y, autoAlign = true, fillColor = "black", isFilled = true, strokeColor = null) {
        let canvas = document.createElement("canvas");
        // Might need to make a 3D Label as a seperate class
        let ctx = canvas.getContext('2d');
        ctx.font = `12px "arial"`;
        let metrics = ctx.measureText(textValue);
        let actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

        super(x,y,metrics.width,actualHeight, fillColor, isFilled, strokeColor);
        this.autoAlign = autoAlign;
        this.fontSize = 12;
        this.font = "arial";
        this.fontBold = 'normal'
        this.fontItalic = 'normal'
        this.fontStyle = `normal normal 12px "arial"`
        this.textValue = textValue;
        this.letters = [];
        let index = 0;
        for(let i in textValue){
            let newX = this.x + metrics.width/textValue.length * index
            let tempLetter = new Label(textValue[i], newX, this.y, fillColor, isFilled, strokeColor);
            tempLetter.setBottom(this.y);
            this.letters.push(tempLetter);
            index++;
        }
    }    
    // setFont has to update the width and height and fontsize and fontstyle
    setFont(font = null, fontSize = this.fontSize){
        this.font = font;
        this.fontSize = fontSize;
        this.fontStyle = `${this.fontItalic} ${this.fontBold} ${this.fontSize}px "${this.font}"`
        this.updatePlacement();
        return this;
    }

    updatePlacement(){
        if(!this.autoAlign){
            return;
        }
        let nextX;
        this.letters.forEach((letterLabel)=>{
            let newLetter = letterLabel.setFont(this.font, this.fontSize).bolden(this.fontBold).italicize(this.fontItalic);
            if(nextX!=undefined){
                newLetter.x = nextX;
            }
            nextX = newLetter.x + newLetter.width; 
            newLetter.setBottom(this.y);
        })
    }

    drawSprite(ctx) {
        this.letters.forEach((letterLabel)=>{
            letterLabel.drawSprite(ctx);
        })
    }

    bolden(boldStyle = "bold"){
        this.fontBold = boldStyle;
        this.fontStyle = `${this.fontItalic} ${this.fontBold} ${this.fontSize}px "${this.font}"`
        this.letters.forEach((letterLabel)=>{
            letterLabel.bolden(boldStyle);
        });
        return this;
    }

    italicize(italicStyle = "italic"){
        this.fontItalic = italicStyle;
        this.fontStyle = `${this.fontItalic} ${this.fontBold} ${this.fontSize}px "${this.font}"`
        this.letters.forEach((letterLabel)=>{
            letterLabel.italicize(italicStyle);
        });
        return this;
    }

    setText(textValue){
        let canvas = document.createElement("canvas");
        // Might need to make a 3D Label as a seperate class
        let ctx = canvas.getContext('2d');
        ctx.font = this.fontStyle;
        let metrics = ctx.measureText(textValue);
        let actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        this.width = metrics.width;
        this.height = actualHeight;
        
        this.letters = [];
        for(let i in textValue){
            let tempLetter = new Label(textValue[i], this.x, this.y, this.fillColor, this.isFilled, this.strokeColor);
            tempLetter.setBottom(this.y);
            tempLetter.setFont(this.fontStyle)
            this.letters.push(tempLetter);
        }
        this.updatePlacement();
        return this;
    }
}

class SVGSprite extends ImageSprite{
    constructor(data, x, y){
        let svgImage = new Image();
        if(!Array.isArray(data)){
            var upData = [data];
        }
        else{
            var upData = data;
        }
        let dataBlob = new Blob(upData, {type: 'image/svg+xml'});
        var DOMURL = window.URL || window.webkitURL || window;
        var url = DOMURL.createObjectURL(dataBlob);
        svgImage.onload = function() {
            DOMURL.revokeObjectURL(url);
        }
        svgImage.src = url;

        super(svgImage, x, y);
        
        this.data = upData;
        this.dataBlob = dataBlob;
        
    }

    // Draw a sprite.
    drawSprite(ctx) {
        this.updateShape();
        this.updateCollider();
        try{
            ctx.drawImage(this.currentCostume, this.x, this.y);
        }
        catch{
            console.error("File is in a broken state, have you provided the correct path location? If so, and it still isn't working, pass an Image() instead of a path");
        }
    }

    /**
     * Gets the image that was created from the SVG
     * @returns the svg as an Image object
     */
    getImage(){
        return this.svgImage;
    }

    // Updates the shape of the image.
    updateShape() {
        this.checkFloor();
    }
}

class ScalableVectorGraphicSprite extends SVGSprite{
    constructor(data, x, y){
        super(data, x, y);
    }
}