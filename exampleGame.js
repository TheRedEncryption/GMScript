let exampleGame = new OmnidirectionalGame(isOpenBorders=true);
exampleGame.name="EXAMPLE GAME"
exampleGame.addRectangle(0,0,600,600,null, false, "black").setLineWidth(100)
exampleGame.addImage("info.png", 450,150)
exampleGame.isCenteredCamera = true;
scene = exampleGame[0];
scene.addLabel("testing the scene things",300,300,"orange",true,"rgb(117,85,0)").setFont("Noto Serif Toto", 40).setAlignment("center","center").setLineWidth(2)
scene.addLabel("right aligned",exampleGame.right-60,500,"black",true,"white").setFont("Noto Serif Toto", 35).setAlignment("right","center").setLineWidth(1)
scene.setSpriteLayer(exampleGame.player,"top")
exampleGame.player.fillColor="rgb(137,58,0)"
exampleGame.player.strokeColor="black"
exampleGame.player.setLineWidth(5)
//game.wasdReciever[1] = function(input){
//    console.log(input)
//}
scene.addLabel("I swear this is intentional", 300, -100,"orange",true,"rgb(117,85,0)").setFont("Noto Serif Toto", 40).setAlignment("center","center").setLineWidth(2)
scene.addLabel("I swear this is intentional", 300, 660,"orange",true,"rgb(117,85,0)").setFont("Noto Serif Toto", 40).setAlignment("center","center").setLineWidth(2)