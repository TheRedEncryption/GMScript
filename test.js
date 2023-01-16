let game = new Game()
let scene = game[0];
let rect = new Rectangle(20,400,100,50,undefined,false,"cyan");
rect.lineWidth = 4
//let rect = new Sprite("rect", 10, 10)
scene.addSprite(rect);
console.log(scene);
game.renderScene(); // same as scene.render(HTMLCanvasElement)