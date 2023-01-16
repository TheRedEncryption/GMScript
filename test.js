let game = new Game()
let scene = game[0];
let rect = new Rectangle(400,400,50,50,undefined,false,"black");
rect.lineWidth = 15
//let rect = new Sprite("rect", 10, 10)
scene.addSprite(rect);
console.log(scene);
game.renderScene(); // same as scene.render(HTMLCanvasElement)