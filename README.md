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
<script defer src="https://cdn.jsdelivr.net/gh/TheRedEncryption/GMScript@1.0.1-alpha/GMScript.js"> </script>
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
    <script defer src="main.js"></script>
</head>
<body>
    <p>My Canvas Game!</p>
</body>
</html>
```
JS File (main.js)
```js
let game = new Game();
let scene = game.currentScene;
let rectangle = scene.addRectangle(100,100,300,300,"orange")

let circle = new Circle(500, 100, 50, fillColor = "teal", isFilled = true, strokeColor = "navy");
scene.addSprite(circle)
game.onStep(()=>{
  circle.x+=5;
});
```
