//!SECTION asas

let game = new Game()
console.log(game[0]);
let scene = game.currentScene;

// Suprisingly the layer of each of them is based on the order they are rendered in even after clearing and drawing again
// Probably because of the array of them but shush

let polyGroup = new Group(new Rectangle(275,500,100,100,"rgb(137,50,255)"), new Rectangle(250,400,100,100,"rgb(100,137,255)"), new Rectangle(225,300,100,100,"rgb(150,150,255)"))
scene.addGroup(polyGroup);

game.addLine(0,600,600,0,"orange").setLineStyle(1)
scene.addLabel("testing the scene things",300,300,"orange",true,"rgba(117,85,0,.5)").setFont("Noto Serif Toto", 53).setAlignment("center","center").setLineStyle(2).bolden().italicize();
scene.addLabel("right aligned",game.right,500,"black",true,"white").setFont("Noto Serif Toto", 50).setAlignment("right","center").setLineStyle(1)

polyGroup.addSprite(new Rectangle(200,200,100,100,"cyan"))

let testingBuddy = new Circle(500,100,50,"teal",true,"navy").setLineStyle(10, [20,8]);
testingBuddy.name = "Swift" // YIPPEEEEEEEEEE
scene.addSprite(testingBuddy);

let testingSussy = new Rectangle(150,50,50,50,"blue");
scene.addSprite(testingSussy);


let atext = new Label("Text", 0, 0, "cyan", true, "black").setFont("Noto Serif Toto", 50).setAlignment("left","top");
console.error(atext.right)
scene.addSprite(atext)
console.font("https://fonts.google.com/noto/specimen/Noto+Serif+Toto")


let direWarning = new Image()
direWarning.src = "assets/direwarning.png"
let image = new ImageSprite([direWarning,"assets/info.png","assets/warning.png"], 100, 100);
scene.addSprite(image);

let image2 = new ImageSprite([direWarning,"assets/info.png","assets/warning.png"], 50, 100);
scene.addSprite(image2);
image2.setScale(1.5);
let theREMOVALRECT = scene.addRectangle(100,100,300,300,"orange", true, "black").setLineStyle(10, [4, 6]).setLineRounding("round")

let regPoly = new RegularPolygon(300,200,100,3,"orange", true, "rgb(137,50,0)").setLineStyle(25).setLineRounding("round");
scene.addSprite(regPoly)

let regPoly2 = new RegularPolygon(300,200,100,3,"orange", true, "rgb(137,50,0)").setLineStyle(25).setLineRounding("round");
scene.addSprite(regPoly2)
//scene.setGravity() // create floor for this later

let collisionImg1 = scene.addImage("assets/direwarning.png", 500,0)
let collisionImg2 = scene.addImage("assets/tre.png", 450,25).setScale(0.20)
console.error(collisionImg2.left,collisionImg2.top,collisionImg2.right,collisionImg2.bottom,collisionImg2.width,collisionImg2.height)
let collisionLabel1 = scene.addLabel("A", 500,0,null, false, "teal").setFont("Noto Serif Toto", 50)
//let collisionLabel2 = scene.addLabel("check console", 260,25,null, false, "teal").setFont("Noto Serif Toto", 50)
let collisionRect1 = scene.addRectangle(500,0,collisionImg1.width, collisionImg1.height,null, false, "teal")
let collisionRect2 = scene.addRectangle(260,25,collisionImg2.width, collisionImg2.height,null, false, "teal")
let collisionRect3 = scene.addRectangle(500,125,50,50,"rgba(137,40,137,0.5)", true, "teal").setScale(0.995)
// Read comment on line below
console.warn(`collisionImg1 hits `, collisionImg1.hits([collisionImg2]), `and the boolean value: `, collisionImg1.hits([collisionImg2]).length!=0?"TRUE":"FALSE") // Sometimes this doesn't hit anything and sometimes it hits the other image, it seems based on the load time of the image. Recreate by hitting ctrl + f5 instead of f5
console.warn(`collisionRect1 hits `, collisionRect1.hits([collisionRect2]), `and the boolean value: `, collisionRect1.hits([collisionRect2]).length!=0?"TRUE":"FALSE")
//console.warn(`collisionLabel1 hits `, collisionLabel1.hits([collisionLabel2]), `and the boolean value: `, collisionLabel1.hits([collisionLabel2]).length!=0?"TRUE":"FALSE")


let collisionCircle = scene.addCircle(520, 220, 15)
let collisionCircle2 = scene.addCircle(520-Math.sqrt(2)*14.99, 220-Math.sqrt(2)*14.99, 15, null, false, "teal")
console.warn(`collisionCircle hits `, collisionCircle.hits([collisionCircle2]), `and the boolean value: `, collisionCircle.hits([collisionCircle2]).length!=0?"TRUE":"FALSE")


let advLbl = new AdvancedLabel("Baller", 300,300, true, "red").setFont("arial", 50).setText("More baller than before").bolden().italicize();
scene.addSprite(advLbl);

let svgData = `<?xml version="1.0" encoding="utf-8"?>
<svg viewBox="0 0 500 500" width="500" height="500" xmlns="http://www.w3.org/2000/svg">
  <ellipse style="fill: rgb(216, 216, 216); stroke: rgb(0, 0, 0);" cx="135.444" cy="148.741" rx="71.041" ry="38.417"/>
  <ellipse style="fill: rgb(216, 216, 216); stroke: rgb(0, 0, 0);" cx="328.749" cy="146.302" rx="75.919" ry="43.295"/>
  <ellipse style="fill: rgb(127, 127, 216); stroke: rgb(0, 0, 0);" cx="151.299" cy="150.875" rx="19.208" ry="33.234"/>
  <ellipse style="fill: rgb(127, 127, 216); stroke: rgb(0, 0, 0);" cx="302.222" cy="148.741" rx="15.245" ry="35.978"/>
  <path fill="rgb(255,0,0)" stroke="rgb(255,0,0)" stroke-width="0" d="M 128.274 103.153 C 139.795 102.56 153.07 101.762 164.861 104.373 C 176.758 107.007 195.836 116.36 199.314 119.008 C 200.402 119.835 199.763 120.298 200.229 120.837 C 200.744 121.432 201.843 121.807 202.363 122.361 C 202.808 122.836 202.951 123.464 203.278 123.886 C 203.566 124.258 203.775 124.443 204.193 124.801 C 204.781 125.305 205.761 125.633 206.632 126.63 C 207.926 128.112 209.892 132.457 210.9 133.643 C 211.415 134.247 211.64 133.934 212.12 134.557 C 213.059 135.777 215.858 139.881 215.779 141.875 C 215.715 143.488 214.029 145.114 213.035 145.838 C 212.269 146.396 211.543 146.619 210.595 146.448 C 209.316 146.217 206.982 144.75 206.022 143.704 C 205.259 142.873 205.281 141.583 204.802 140.96 C 204.438 140.485 204.158 140.646 203.583 140.045 C 202.384 138.792 198.857 133.679 197.79 132.423 C 197.311 131.859 197.374 131.951 196.875 131.508 C 195.936 130.675 192.928 128.48 191.997 127.545 C 191.468 127.014 191.963 126.924 191.082 126.325 C 188.182 124.351 173.598 116.402 163.641 114.129 C 153.157 111.735 140.474 112.351 129.493 112.91 C 118.96 113.445 107.889 114.212 99.004 117.178 C 90.938 119.87 83.153 123.458 77.966 129.069 C 72.804 134.653 70.296 148.276 67.904 150.717 C 66.932 151.709 66.352 151.382 65.465 151.327 C 64.445 151.263 62.889 151.207 62.111 150.107 C 60.959 148.478 60.042 144.498 60.892 140.655 C 62.122 135.093 66.649 125.083 72.478 119.617 C 78.683 113.798 88.68 110.165 97.784 107.422 C 107.228 104.576 117.523 103.706 128.274 103.153 Z M 325.236 100.104 C 332.175 99.787 336.946 99.844 342.92 100.714 C 349.135 101.619 354.503 102.777 361.824 105.592 C 371.371 109.262 392.36 120.282 395.667 122.666 C 396.582 123.326 395.936 123.242 396.582 123.886 C 398.144 125.444 404.504 128.858 407.253 132.728 C 410.236 136.927 413.529 145.229 413.351 148.582 C 413.244 150.609 411.683 151.812 410.607 152.546 C 409.705 153.162 408.595 153.239 407.558 153.156 C 406.463 153.069 405.407 153.149 404.204 151.936 C 401.958 149.67 399.605 140.217 396.582 136.692 C 394.15 133.855 389.669 132.374 388.35 131.203 C 387.726 130.649 388.316 130.634 387.435 129.984 C 384.421 127.758 366.345 117.998 358.165 114.739 C 351.978 112.274 347.632 111.281 342.311 110.47 C 337.061 109.671 332.871 109.574 326.456 109.861 C 318.036 110.237 304.257 111.407 295.357 113.519 C 287.794 115.314 281.2 117.869 275.843 120.837 C 271.232 123.392 267.667 125.502 264.562 129.679 C 260.913 134.587 258.493 147.193 256.33 149.497 C 255.412 150.474 254.778 150.163 253.891 150.107 C 252.87 150.043 251.308 149.912 250.537 148.887 C 249.487 147.492 249.038 144.194 249.317 141.265 C 249.667 137.603 251.42 132.356 253.586 128.459 C 255.774 124.522 257.689 121.215 262.428 117.788 C 269.267 112.842 283.451 106.701 294.137 103.763 C 304.396 100.942 316.518 100.502 325.236 100.104 Z M 226.45 179.987 C 227.664 179.947 229.548 180.294 230.414 181.206 C 231.327 182.168 231.43 183.594 231.633 185.78 C 231.964 189.325 229.961 197.751 231.024 201.634 C 231.826 204.568 234.676 206.917 235.597 208.037 C 236.044 208.581 235.877 208.48 236.512 208.952 C 238.101 210.136 245.292 212.927 247.488 215.66 C 249.331 217.952 249.478 220.431 249.927 223.587 C 250.481 227.481 250.892 233.724 249.927 237.612 C 249.104 240.928 247.756 244.253 245.354 245.844 C 242.851 247.503 237.39 247.282 234.987 247.064 C 233.423 246.922 232.395 246.657 231.633 245.844 C 230.825 244.981 230.389 243.133 230.414 241.881 C 230.437 240.702 230.579 239.389 231.633 238.527 C 233.146 237.289 238.669 238.403 240.17 236.393 C 241.846 234.149 240.787 227.521 240.17 224.807 C 239.748 222.947 239.359 222.046 238.036 220.843 C 236.229 219.199 230.578 217.613 229.194 216.574 C 228.537 216.081 228.779 216.123 228.279 215.355 C 227.074 213.5 222.501 208.128 221.267 203.464 C 219.885 198.243 220.473 188.86 221.267 185.17 C 221.72 183.064 222.455 182.07 223.401 181.206 C 224.235 180.445 225.345 180.023 226.45 179.987 Z" style="fill: rgb(20,32,54); stroke: rgb(25,37,59); stroke-width: 2px;"/>
</svg>`
let SVGTest = new ScalableVectorGraphicSprite(svgData, 25, 70)
scene.addSprite(SVGTest)

//scene.setGravity(600)

game.addInputReciever("z", ()=>{
    console.info("M" + Math.floor(Math.random()*10) + "o" + Math.floor(Math.random()*10) + "g" + Math.floor(Math.random()*10) + "u" + Math.floor(Math.random()*10) + "s" + Math.floor(Math.random()*10));
})

game.renderScene();

scene.addSprite(new Circle(regPoly.points[0][0], regPoly.points[0][1], 7, "gold", true, "black")); // regPoly "focus" point

let omniGame = new TopDownGame();


omniGame.sword = new Line(omniGame.player.x+omniGame.player.radius+10, omniGame.player.y,omniGame.player.x+omniGame.player.radius+50, omniGame.player.y).setLineStyle(4);
omniGame.scenes[0].addSprite(omniGame.sword);
function updateSword(){
    let angle = Math.round(omniGame.getAngleBetweenPoints(omniGame.player.x, omniGame.player.y, omniGame.lastMousePos[0], omniGame.lastMousePos[1]))
    let point1 = omniGame.getPointInDirection(omniGame.player.x, omniGame.player.y, angle, 30);
    omniGame.sword.x = point1[0];
    omniGame.sword.y = point1[1];
    let point2 = omniGame.getPointInDirection(omniGame.player.x, omniGame.player.y, angle, 70);
    omniGame.sword.x2 = point2[0];
    omniGame.sword.y2 = point2[1];
}

omniGame.addInputReciever("mouse", ()=>{
    if(omniGame.mouseHovering==true){
        updateSword()
    }
})

omniGame.addInputReciever("wasd", ()=>{
    updateSword()
})

let showcaseReciever = omniGame.addInputReciever("wasd", ()=>{
    console.log("showcaseReciever and removal")
    console.log("if this wasn't removed it would keep printing this statement while wasd was held")
    omniGame.removeInputReciever(showcaseReciever);
})

//game.createScene()

// NOTE: SCENE SWITCHING OCCURS HERE
game.currentScene = game[5];
game.currentScene = game[3];
game.addCircle(300,300, 20);
setInterval(()=>{
    game.currentScene = game[0];
},1000)

console.table(game.scenes);

let game3d = new Game3D();

game3d.renderScene();

game.setBackgroundColor("rgba(0,100,150,0.5)")

let direction = 1;
let directiony = 1;
var speed = 3;
let speed2 = 10;
let speed3 = 10;
let gravity = 1.1;

// For less delay between the initial scene and the changing scene, render it before the onStep()
game.renderScene()
// Make sure to always render the scene or else it will not update
game.onStep(()=>{
    if(!game.isCurrentScene(scene)){
        game.renderScene(); // same as scene.render(HTMLCanvasElement)
        return;
    }
    //regPoly2.sides = Math.round(speed);
    speed2+=gravity
    testingSussy.y+=speed2;
    testingSussy.x+=speed3;
    
    if(testingSussy.bottom>=game.bottom){
        testingSussy.y-=speed2*2;
        speed2*=-0.4;
    }
    if(testingSussy.right>=game.right){
        testingSussy.x-=speed3*2;
        speed3*=-0.1;
    }
    if(testingSussy.left>=game.left){
        testingSussy.x-=speed3*2;
        speed3*=-0.1;
    }
    // you can use atext.textValue to do the same
    advLbl.x+=1;
    atext.setText(Math.round(testingBuddy.bottom));
    advLbl.setText(parseFloat(testingBuddy.fillColor.substr(4,6)).toString() + " " + Math.round(testingBuddy.y/testingBuddy.x))

    letterIndex = 0;
    advLbl.letters.forEach((letter)=>{
        if(letterIndex==0 && letter.x>600){
            advLbl.x = 0;
        }
        if(letter.x>600){
            letter.x = letter.x-(600+letter.width);
        }
        letterIndex+=1;
    })
    //polyGroup.x-=5;
    //regPoly2.y+=5;
    //game2.renderScene();

    //if(regPoly2.top>game2.bottom){
    //    regPoly2.setBottom(game2.top)
    //}
    //if(polyGroup.right<game.left){
    //    polyGroup.setLeft(game.right)
    //}
    
    testingBuddy.x += direction * speed;
    testingBuddy.y += directiony * speed;
    testingBuddy.dashOffset-= (direction/Math.abs(direction))*(directiony/Math.abs(directiony));
    if (testingBuddy.right > game.right - direction * speed || testingBuddy.left < game.left - direction * speed) {
        direction *= -1;
        testingBuddy.fillColor = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`
        //game.playNote(testingBuddy.y,"sine");
    }
    if (testingBuddy.bottom > game.bottom - directiony * speed || testingBuddy.top < game.top - directiony * speed) {
        directiony *= -1;
        testingBuddy.fillColor = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`
        //game.playNote(testingBuddy.x,"sine");
    }
    
    image.y += 3;
    image2.y += 4;
    if(image.top > 600){
        image.setBottom(0);
        speed*=1.1;
        scene.remove(theREMOVALRECT);
        image.costumeNumber += 1;
    }

    if(image2.top > 600){
        image2.setBottom(0);
        image2.costumeNumber -= 1;
    }
    game.renderScene(); // same as scene.render(HTMLCanvasElement)
})
