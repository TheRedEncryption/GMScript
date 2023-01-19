let game = new Game()

let scene = game[0];

// Suprisingly the layer of each of them is based on the order they are rendered in even after clearing and drawing again
// Probably because of the array of them but shush

let polygon = new Polygon([[0,0],[275,0],[225,250],[275,600],[0,600]]);
let polygon2 = new Polygon([[600,0],[325,0],[375,250],[325,600],[600,600]]);
scene.addSprite(polygon);
scene.addSprite(polygon2);

let polyGroup = new Group(new Rectangle(275,500,100,100,"rgb(137,50,255)"), new Rectangle(250,400,100,100,"rgb(100,137,255)"), new Rectangle(225,300,100,100,"rgb(150,150,255)"))
scene.addGroup(polyGroup);

scene.addLabel("testing the scene methods",300,300,"orange",true,"rgb(117,85,0)").setFont("Noto Serif Toto", 50).setAlignment("center","center").setLineWidth(2)

polyGroup.addSprite(new Rectangle(200,200,100,100,"cyan"))

let testingBuddy = new Circle(500,100,50,"teal",true,"navy").setLineWidth(15);
testingBuddy.name = "Swift" // YIPPEEEEEEEEEE
scene.addSprite(testingBuddy);

let testingSussy = new Rectangle(150,50,50,50,"blue");
scene.addSprite(testingSussy);


let text = new Label("Text", 0, 0, "cyan", true, "black").setFont("Noto Serif Toto", 50).setAlignment("left","top")
scene.addSprite(text)
console.font("https://fonts.google.com/noto/specimen/Noto+Serif+Toto")

// FIXME - Image class can't go into ImageSprite
// let direWarning = new Image()
// direWarning.src = "./direwarning.png"
let image = new ImageSprite("./direwarning.png", 100, 100);
scene.addSprite(image);

let regPoly = new RegularPolygon(300,200,100,3,"orange", true, "rgb(137,50,0)").setLineWidth(25).setLineRounding("round");
scene.addSprite(regPoly)


game.renderScene();

scene.addSprite(new Circle(regPoly.points[0][0], regPoly.points[0][1], 7, "gold", true, "black")); // regPoly "focus" point
let regPoly2 = new RegularPolygon(300,500,100,5,"orange", true, "rgb(137,50,0)").setLineWidth(25).setLineRounding("round");
scene.addSprite(regPoly2)
let direction = 1;
let directiony = 1;
let speed = 1;
let speed2 = 10;
let speed3 = 20;
let gravity = 1.1;

game.onStep(()=>{
    regPoly2.sides= Math.round(speed);
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
    //polyGroup.x-=5;
    regPoly2.y+=5;
    if(regPoly2.top>game.bottom){
        regPoly2.setBottom(game.top)
    }
    if(polyGroup.right<game.left){
        polyGroup.setLeft(game.right)
    }
    game.renderScene(); // same as scene.render(HTMLCanvasElement)
    testingBuddy.x += direction * speed;
    testingBuddy.y += directiony * speed;
    if(testingBuddy.right>game.right-direction*speed || testingBuddy.left<game.left-direction*speed){
       direction*=-1;
       testingBuddy.fillColor = `rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`
    }
    if(testingBuddy.bottom>game.bottom-directiony*speed || testingBuddy.top<game.top-directiony*speed){
        directiony*=-1;
        testingBuddy.fillColor = `rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`
    }
    //image.move(1)
    image.y += 3;
    if(image.bottom < 0){
        image.setTop(600);
        speed *= 1.1;
    }
    if(image.top > 600){
        image.setBottom(0);
        speed*=1.1;
    }
    if(image.right < 0){
        image.setLeft(600);
    }
})
