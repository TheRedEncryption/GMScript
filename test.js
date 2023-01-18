let game = new Game()
let scene = game[0];
let rect = new Circle(50,50,50,"teal",true,"navy").setLineWidth(15);
scene.addSprite(rect);
game.renderScene();
game.addGoogleFont("Exo2","https://fonts.gstatic.com/s/exo2/v20/7cH1v4okm5zmbvwkAx_sfcEuiD8jvvKsNtC_nps.woff2")
scene.addSprite(new Label("Mogus", 0, 0, "Exo2", 50, null, false, "black"))

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