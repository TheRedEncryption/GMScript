let game = new Game()
let scene = game[0];
let rect = new Rectangle(20,400,100,50,undefined,false,"cyan").setLineWidth(15);
scene.addSprite(rect);
game.renderScene();

let direction = 1;
let directiony = 1;
game.onStep(()=>{
    game.renderScene(); // same as scene.render(HTMLCanvasElement)
    rect.x += direction * 5
    rect.y += directiony * 5;
    if(rect.right>game.right-direction*5 || rect.left<game.left-direction*5){
        direction*=-1;
    }
    if(rect.bottom>game.bottom-directiony*5 || rect.top<game.top-directiony*5){
        directiony*=-1;
    }
})