# Welcome to GMScript
### Features:
- **Versaitile** manipulation of on-screen elements inside of HTML Canvas
- Can be integrated **seamlessly** into whatever Canvas/JS project it is required in
- Great for **game development** and **data visualization**!

### Demo View
[GMScript Demo](https://theredencryption.github.io/GMScript/)

### Script tag
**Copy and paste** this tag inside the `<head>` of the HTML document to begin using GMScript!
```html
<script defer src="https://cdn.jsdelivr.net/gh/TheRedEncryption/GMScript@1.0.2-alpha/GMScript.js"> </script>
```

### Documentation
This **[link](https://theredencryption.github.io/GMScript/out/Game.html)** leads to some of the documentation for the Script, but it is unfinished. We _encourage_ looking at the source file **[here](https://github.com/TheRedEncryption/GMScript/blob/main/GMScript.js)** to see the specifics of what this can do.

### Example Code
HTML File (index.html)
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script defer src="https://cdn.jsdelivr.net/gh/TheRedEncryption/GMScript@1.0.2-alpha/GMScript.js"> </script>
    <script defer src="main.js"></script>
</head>
<body>
    <p>My Canvas Game!</p>
</body>
</html>
```
JS File (main.js)
```js
// Game canvas is by default 600 by 600 pixels
let game = new Game(); // Creates a game canvas
let scene = game.currentScene; // Gets the default scene
let rectangle = scene.addRectangle(0,100,300,300,"orange") // Creates a rectangle in the scene
rectangle.setBottom(600); // Sets the bottom of the rectangle; works with Top, Right, and Left as well
let circle = new Circle(50, 100, 50, fillColor = "teal", isFilled = true, strokeColor = "navy"); // Creates a circle
scene.addSprite(circle); // Adds the circle to the scene

game.renderScene(); // Renders the Scene; used here to load sprites when screen loads
// The code inside onStep() is run 60 times per second by default
game.onStep(()=>{
  circle.x+=5; // Moves the circle to the right
  game.renderScene(); // Renders the Scene; used here to render every time there is an update to the scene
});
```
