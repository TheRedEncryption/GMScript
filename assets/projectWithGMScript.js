const GAME = new Game()
GAME.backgroundColor = "#36393F"
let SCENE = GAME[0];

/**NOTES on what to improve 
 * FIXME: Make key holding work for any key
 * A "renderSceneAuto" might be useful because i keep forgetting
 * FIXME: Make adding the input recievers easier and iterable
 * iterable meaning you don't have to set up a reciever just so you can change each property 
 * FIXME: Make mouseDown event accessible using addInputReciever
 */

// Frequencys from https://pages.mtu.edu/~suits/notefreqs.html

let keyTops = 200;
let bangerAlert = GAME.addCircle(300,500,50,"rgb(230,127,75)", true, "gray").setLineStyle(10, [10,10])

let whiteNotesTop = []
let whiteKeyWidth = 38;
let whiteKeyHeight = 150;
let whiteKeyColor = "rgb(240,240,240)"
let whiteKeyDarkColor = "rgb(160,160,160)";
for(var i = 0; i < 13; i++){
    whiteNotesTop.push(GAME.addRectangle((whiteKeyWidth+2)*i+30, keyTops, whiteKeyWidth, whiteKeyHeight, whiteKeyColor));
}
whiteNotesTop[0].frequency = 130.81;
whiteNotesTop[1].frequency = 146.83;
whiteNotesTop[2].frequency = 164.81;
whiteNotesTop[3].frequency = 174.61;
whiteNotesTop[4].frequency = 196.00;
whiteNotesTop[5].frequency = 220.00;
whiteNotesTop[6].frequency = 246.94;
whiteNotesTop[7].frequency = 261.63;
whiteNotesTop[8].frequency = 293.66;
whiteNotesTop[9].frequency = 329.63;
whiteNotesTop[10].frequency = 349.23;
whiteNotesTop[11].frequency = 392.00;
whiteNotesTop[12].frequency = 440.00;


let blackNotesTop = []
let blackKeyWidth = whiteKeyWidth/2;
let blackKeyHeight = 100;
let blackKeyColor = "rgb(40,40,40)"
let blackKeyDarkColor = "rgb(120,120,120)"
excludeArr = [2,6,9,13,16]
for(var i = 0; i < 12; i++){
    if(excludeArr.includes(i)){
        continue;
    }
    blackNotesTop.push(GAME.addRectangle((blackKeyWidth+1)*i*2+30+whiteKeyWidth*(3/4), keyTops, blackKeyWidth, blackKeyHeight, blackKeyColor));
}

GAME.addInputReciever("mouse", (x, y, relativeX, relativeY, pressedButtons)=>{
    var hitsmth = false;
    blackNotesTop.forEach((noteKey)=>{
        if(noteKey.hits([relativeX, relativeY])){
            noteKey.fillColor = blackKeyDarkColor;
            hitsmth = true;
            if(pressedButtons==1){
                GAME.playNote(noteKey.frequency, noteType)
            }
        }
        else{
            noteKey.fillColor = blackKeyColor;
        }
    })
    whiteNotesTop.forEach((noteKey)=>{
        if(noteKey.hits([relativeX, relativeY]) && !hitsmth){
            noteKey.fillColor = whiteKeyDarkColor;
            if(pressedButtons==1){
                GAME.playNote(noteKey.frequency, noteType)
            }
        }
        else{
            noteKey.fillColor = whiteKeyColor;
        }
    })
})


let noteType = "square"
let setAmount = 10;
// Top row of white notes
GAME.addInputReciever("q", ()=>{
    GAME.playNote(whiteNotesTop[0].frequency,noteType);
    whiteNotesTop[0].fillColor = whiteKeyDarkColor;
    setTimeout(()=>{
        whiteNotesTop[0].fillColor = whiteKeyColor;
    },100)
    bangerAlert.radius+=setAmount;
})
GAME.addInputReciever("w", ()=>{
    GAME.playNote(whiteNotesTop[1].frequency,noteType)
    whiteNotesTop[1].fillColor = whiteKeyDarkColor;
    setTimeout(()=>{
        whiteNotesTop[1].fillColor = whiteKeyColor;
    },100)
    bangerAlert.radius+=setAmount;
})
GAME.addInputReciever("e", ()=>{
    GAME.playNote(whiteNotesTop[2].frequency,noteType)
    whiteNotesTop[2].fillColor = whiteKeyDarkColor;
    setTimeout(()=>{
        whiteNotesTop[2].fillColor = whiteKeyColor;
    },100)
    bangerAlert.radius+=setAmount;
})
GAME.addInputReciever("r", ()=>{
    GAME.playNote(whiteNotesTop[3].frequency,noteType)
    whiteNotesTop[3].fillColor = whiteKeyDarkColor;
    setTimeout(()=>{
        whiteNotesTop[3].fillColor = whiteKeyColor;
    },100)
    bangerAlert.radius+=setAmount;
})
GAME.addInputReciever("t", ()=>{
    GAME.playNote(whiteNotesTop[4].frequency,noteType)
    whiteNotesTop[4].fillColor = whiteKeyDarkColor;
    setTimeout(()=>{
        whiteNotesTop[4].fillColor = whiteKeyColor;
    },100)
    bangerAlert.radius+=setAmount;
})
GAME.addInputReciever("y", ()=>{
    GAME.playNote(whiteNotesTop[5].frequency,noteType)
    whiteNotesTop[5].fillColor = whiteKeyDarkColor;
    setTimeout(()=>{
        whiteNotesTop[5].fillColor = whiteKeyColor;
    },100)
    bangerAlert.radius+=setAmount;
})
GAME.addInputReciever("u", ()=>{
    GAME.playNote(whiteNotesTop[6].frequency,noteType)
    whiteNotesTop[6].fillColor = whiteKeyDarkColor;
    setTimeout(()=>{
        whiteNotesTop[6].fillColor = whiteKeyColor;
    },100)
    bangerAlert.radius+=setAmount;
})
GAME.addInputReciever("i", ()=>{
    GAME.playNote(whiteNotesTop[7].frequency,noteType)
    whiteNotesTop[7].fillColor = whiteKeyDarkColor;
    setTimeout(()=>{
        whiteNotesTop[7].fillColor = whiteKeyColor;
    },100)
    bangerAlert.radius+=setAmount;
})
GAME.addInputReciever("o", ()=>{
    GAME.playNote(whiteNotesTop[8].frequency,noteType)
    whiteNotesTop[8].fillColor = whiteKeyDarkColor;
    setTimeout(()=>{
        whiteNotesTop[8].fillColor = whiteKeyColor;
    },100)
    bangerAlert.radius+=setAmount;
})
GAME.addInputReciever("p", ()=>{
    GAME.playNote(whiteNotesTop[9].frequency,noteType)
    whiteNotesTop[9].fillColor = whiteKeyDarkColor;
    setTimeout(()=>{
        whiteNotesTop[9].fillColor = whiteKeyColor;
    },100)
    bangerAlert.radius+=setAmount;
})
GAME.addInputReciever("[", ()=>{
    GAME.playNote(whiteNotesTop[10].frequency,noteType)
    whiteNotesTop[10].fillColor = whiteKeyDarkColor;
    setTimeout(()=>{
        whiteNotesTop[10].fillColor = whiteKeyColor;
    },100)
    bangerAlert.radius+=setAmount;
})
GAME.addInputReciever("]", ()=>{
    GAME.playNote(whiteNotesTop[11].frequency,noteType)
    whiteNotesTop[11].fillColor = whiteKeyDarkColor;
    setTimeout(()=>{
        whiteNotesTop[11].fillColor = whiteKeyColor;
    },100)
    bangerAlert.radius+=setAmount;
})
GAME.addInputReciever("\\", ()=>{
    GAME.playNote(whiteNotesTop[12].frequency,noteType)
    whiteNotesTop[12].fillColor = whiteKeyDarkColor;
    setTimeout(()=>{
        whiteNotesTop[12].fillColor = whiteKeyColor;
    },100)
    bangerAlert.radius+=setAmount;
})

//Top row black notes
GAME.addInputReciever("2", ()=>{
    GAME.playNote(138.59,noteType)
    blackNotesTop[0].fillColor = blackKeyDarkColor
    setTimeout(()=>{
        blackNotesTop[0].fillColor = blackKeyColor
    },100)
    bangerAlert.radius+=setAmount;
})
GAME.addInputReciever("3", ()=>{
    GAME.playNote(155.56,noteType)
    blackNotesTop[1].fillColor = blackKeyDarkColor
    setTimeout(()=>{
        blackNotesTop[1].fillColor = blackKeyColor
    },100)
    bangerAlert.radius+=setAmount;
})
GAME.addInputReciever("5", ()=>{
    GAME.playNote(185.00,noteType)
    blackNotesTop[2].fillColor = blackKeyDarkColor
    setTimeout(()=>{
        blackNotesTop[2].fillColor = blackKeyColor
    },100)
    bangerAlert.radius+=setAmount;
})
GAME.addInputReciever("6", ()=>{
    GAME.playNote(207.65,noteType)
    blackNotesTop[3].fillColor = blackKeyDarkColor
    setTimeout(()=>{
        blackNotesTop[3].fillColor = blackKeyColor
    },100)
    bangerAlert.radius+=setAmount;
})
GAME.addInputReciever("7", ()=>{
    GAME.playNote(233.08,noteType)
    blackNotesTop[4].fillColor = blackKeyDarkColor
    setTimeout(()=>{
        blackNotesTop[4].fillColor = blackKeyColor
    },100)
    bangerAlert.radius+=setAmount;
})
GAME.addInputReciever("9", ()=>{
    GAME.playNote(277.18,noteType)
    blackNotesTop[5].fillColor = blackKeyDarkColor
    setTimeout(()=>{
        blackNotesTop[5].fillColor = blackKeyColor
    },100)
    bangerAlert.radius+=setAmount;
})
GAME.addInputReciever("0", ()=>{
    GAME.playNote(311.13,noteType)
    blackNotesTop[6].fillColor = blackKeyDarkColor
    setTimeout(()=>{
        blackNotesTop[6].fillColor = blackKeyColor
    },100)
    bangerAlert.radius+=setAmount;
})
GAME.addInputReciever("-", ()=>{
    GAME.playNote(369.99,noteType)
    blackNotesTop[7].fillColor = blackKeyDarkColor
    setTimeout(()=>{
        blackNotesTop[7].fillColor = blackKeyColor
    },100)
    bangerAlert.radius+=setAmount;
})
GAME.addInputReciever("=", ()=>{
    GAME.playNote(415.30,noteType)
    blackNotesTop[8].fillColor = blackKeyDarkColor
    setTimeout(()=>{
        blackNotesTop[8].fillColor = blackKeyColor
    },100)
    bangerAlert.radius+=setAmount;
})

GAME.onStep(()=>{
    GAME.renderScene();
    bangerAlert.dashOffset+=5;
    if(bangerAlert.radius>50){
        bangerAlert.radius/=1.01;
    }
})