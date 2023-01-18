let game = new Game()

let scene = game[0];

// Suprisingly the layer of each of them is based on the order they are rendered in even after clearing and drawing again
// Probably because of the array of them but shush
let polygon = new Polygon(300,100,[[0,0],[300,300],[300,500],[0,500]]);
scene.addSprite(polygon);

let testingBuddy = new Circle(500,550,50,"teal",true,"navy").setLineWidth(15);
testingBuddy.name = "Swift" // YIPPEEEEEEEEEE
scene.addSprite(testingBuddy);


let text = new Label("Mogus", 0, 0, "cyan", true, "black").setFont("Noto Serif Toto", 50).setAlignment("left","top")
scene.addSprite(text)
console.font("https://fonts.google.com/noto/specimen/Noto+Serif+Toto")

let image = new ImageSprite("./direwarning.png", 100, 100);
scene.addSprite(image);

let regPoly = new RegularPolygon(300,100,100,10,"navy", true, "rgb(0,50,137)").setLineWidth(25);
scene.addSprite(regPoly)


game.renderScene();

scene.addSprite(new Circle(regPoly.points[0][0], regPoly.points[0][1], 7, "gold", true, "black")); // regPoly "focus" point
let direction = 1;
let directiony = 1;
let speed = 5;

game.onStep(()=>{

    game.renderScene(); // same as scene.render(HTMLCanvasElement)
    testingBuddy.x += direction * speed;
    testingBuddy.y += directiony * speed;
    if(testingBuddy.right>game.right-direction*speed || testingBuddy.left<game.left-direction*speed){
       direction*=-1;
    }
    if(testingBuddy.bottom>game.bottom-directiony*speed || testingBuddy.top<game.top-directiony*speed){
       directiony*=-1;
    }
    //image.move(1)
    image.y += 1;
    if(image.bottom < 0){
        image.setTop(600);
        speed += 2;
    }
    if(image.right < 0){
        image.setLeft(600);
    }
})
