let newGame = new Game()
console.log(newGame[0]);
newGame[-1] = new Scene([new Sprite("testing value", 100, 100, "orange")]);
console.log("Data:")
console.log(newGame[-1]);