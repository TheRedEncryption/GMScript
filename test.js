//!SECTION asas

let game = new Game()
console.log(game[0]);
let scene = game.currentScene;

// Suprisingly the layer of each of them is based on the order they are rendered in even after clearing and drawing again
// Probably because of the array of them but shush

let polygon = new Polygon([[0,0],[275,0],[225,250],[275,600],[0,600]]);
let polygon2 = new Polygon([[600,0],[325,0],[375,250],[325,600],[600,600]]);
scene.addSprite(polygon);
scene.addSprite(polygon2);

let polyGroup = new Group(new Rectangle(275,500,100,100,"rgb(137,50,255)"), new Rectangle(250,400,100,100,"rgb(100,137,255)"), new Rectangle(225,300,100,100,"rgb(150,150,255)"))
scene.addGroup(polyGroup);

game.addLine(0,600,600,0,"orange").setLineWidth(1)
scene.addLabel("testing the scene things",300,300,"orange",true,"rgba(117,85,0,.5)").setFont("Noto Serif Toto", 53).setAlignment("center","center").setLineWidth(2).bolden().italicize();
scene.addLabel("right aligned",game.right,500,"black",true,"white").setFont("Noto Serif Toto", 50).setAlignment("right","center").setLineWidth(1)

polyGroup.addSprite(new Rectangle(200,200,100,100,"cyan"))

let testingBuddy = new Circle(500,100,50,"teal",true,"navy").setLineWidth(15);
testingBuddy.name = "Swift" // YIPPEEEEEEEEEE
scene.addSprite(testingBuddy);

let testingSussy = new Rectangle(150,50,50,50,"blue");
scene.addSprite(testingSussy);


let atext = new Label("Text", 0, 0, "cyan", true, "black").setFont("Noto Serif Toto", 50).setAlignment("left","top");
console.error(atext.right)
scene.addSprite(atext)
console.font("https://fonts.google.com/noto/specimen/Noto+Serif+Toto")


let direWarning = new Image()
direWarning.src = "./direwarning.png"
let image = new ImageSprite([direWarning,"./info.png","./warning.png"], 100, 100);
scene.addSprite(image);

let image2 = new ImageSprite([direWarning,"./info.png","./warning.png"], 50, 100);
scene.addSprite(image2);
image2.setScale(1.5);
let theREMOVALRECT = scene.addRectangle(100,100,300,300,"orange").setLineWidth(20).setLineRounding("round")

let regPoly = new RegularPolygon(300,200,100,3,"orange", true, "rgb(137,50,0)").setLineWidth(25).setLineRounding("round");
scene.addSprite(regPoly)

let regPoly2 = new RegularPolygon(300,200,100,3,"orange", true, "rgb(137,50,0)").setLineWidth(25).setLineRounding("round");
scene.addSprite(regPoly2)
//scene.setGravity() // create floor for this later

let collisionImg1 = scene.addImage("direwarning.png", 500,0)
let collisionImg2 = scene.addImage("tre.png", 450,25).setScale(0.20)
console.error(collisionImg2.left,collisionImg2.top,collisionImg2.right,collisionImg2.bottom,collisionImg2.width,collisionImg2.height)
let collisionLabel1 = scene.addLabel("A", 500,0,null, false, "teal").setFont("Noto Serif Toto", 50)
let collisionLabel2 = scene.addLabel("check console", 260,25,null, false, "teal").setFont("Noto Serif Toto", 50)
let collisionRect1 = scene.addRectangle(500,0,collisionImg1.width, collisionImg1.height,null, false, "teal")
let collisionRect2 = scene.addRectangle(260,25,collisionImg2.width, collisionImg2.height,null, false, "teal")
let collisionRect3 = scene.addRectangle(500,125,50,50,"rgba(137,40,137,0.5)", true, "teal").setScale(0.995)
// Read comment on line below
console.warn(`collisionImg1 hits `, collisionImg1.hits([collisionImg2]), `and the boolean value: `, collisionImg1.hits([collisionImg2]).length!=0?"TRUE":"FALSE") // Sometimes this doesn't hit anything and sometimes it hits the other image, it seems based on the load time of the image. Recreate by hitting ctrl + f5 instead of f5
console.warn(`collisionRect1 hits `, collisionRect1.hits([collisionRect2]), `and the boolean value: `, collisionRect1.hits([collisionRect2]).length!=0?"TRUE":"FALSE")
console.warn(`collisionLabel1 hits `, collisionLabel1.hits([collisionLabel2]), `and the boolean value: `, collisionLabel1.hits([collisionLabel2]).length!=0?"TRUE":"FALSE")

let advLbl = new AdvancedLabel("Baller", 300,300, "red").setFont("arial", 50).setText("More baller than before").bolden().italicize();
scene.addSprite(advLbl);

//scene.setGravity(600)

game.addInputReciever("z", ()=>{
    console.info("M" + Math.floor(Math.random()*10) + "o" + Math.floor(Math.random()*10) + "g" + Math.floor(Math.random()*10) + "u" + Math.floor(Math.random()*10) + "s" + Math.floor(Math.random()*10));
})

game.renderScene();

scene.addSprite(new Circle(regPoly.points[0][0], regPoly.points[0][1], 7, "gold", true, "black")); // regPoly "focus" point

let omniGame = new TopDownGame();


omniGame.sword = new Line(omniGame.player.x+omniGame.player.radius+10, omniGame.player.y,omniGame.player.x+omniGame.player.radius+50, omniGame.player.y).setLineWidth(4);
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

let game3d = new Game3D();

game3d.renderScene();

game.setBackgroundColor("rgba(0,100,150,0.5)")

let direction = 1;
let directiony = 1;
var speed = 3;
let speed2 = 10;
let speed3 = 20;
let gravity = 1.1;

game.onStep(()=>{
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
    
    game.renderScene(); // same as scene.render(HTMLCanvasElement)
    
    testingBuddy.x += direction * speed;
    testingBuddy.y += directiony * speed;
    if(testingBuddy.right>game.right-direction*speed || testingBuddy.left<game.left-direction*speed){
       direction*=-1;
       testingBuddy.fillColor = `rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`
       game.playNote(testingBuddy.y,"sine");
    }
    if(testingBuddy.bottom>game.bottom-directiony*speed || testingBuddy.top<game.top-directiony*speed){
        directiony*=-1;
        testingBuddy.fillColor = `rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`
        game.playNote(testingBuddy.x,"sine");
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
})
