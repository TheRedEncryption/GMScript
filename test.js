let game = new Game()

let scene = game[0];

let rect = new Circle(500,550,50,"teal",true,"navy").setLineWidth(15);
scene.addSprite(rect);

let text = new Label("Mogus", 0, 0, "cyan", true, "black").setFont("Noto Serif Toto", 50).setAlignment("left","top")
scene.addSprite(text)
console.font("https://fonts.google.com/noto/specimen/Noto+Serif+Toto")

let image = new ImageSprite("./direwarning.png", 100, 100);
scene.addSprite(image);

let regPoly = new RegularPolygon(300,100,50,5);

game.renderScene();
let direction = 1;
let directiony = 1;
let speed = 5;

game.onStep(()=>{

    game.renderScene(); // same as scene.render(HTMLCanvasElement)
    rect.x += direction * speed;
    rect.y += directiony * speed;
    if(rect.right>game.right-direction*speed || rect.left<game.left-direction*speed){
       direction*=-1;
    }
    if(rect.bottom>game.bottom-directiony*speed || rect.top<game.top-directiony*speed){
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
