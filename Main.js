var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
var canvasWidth = c.width;
var canvasHeight = c.height;
var gameState = GameState.initial();
var inputs = Inputs.empty();
inputs.attachInputs();

document.addEventListener('keydown', (e) => {
    inputs.update(e.key,true);
});
document.addEventListener('keyup', (e) => {
    inputs.update(e.key,false);
});

let mySongData = zzfxM(...song);
let myAudioNode = zzfxP(...mySongData);
myAudioNode.loop = true;
myAudioNode.start();
var musicToggle = true;
var soundToggle = true;


function draw(ctx){
    ctx.clearRect(0,0,canvasWidth,canvasHeight);
    gameState.update(inputs.getInputs(),soundToggle);
    ctx.save();
    gameState.draw(ctx);
    ctx.restore();
    ctx.font = "15px Courier New";
    ctx.fillStyle = rgbToHex(0,220,0);
    ctx.fillText("Toggle M",canvasWidth*0.01,canvasHeight*0.92);
    if(soundToggle){
        ctx.font = "23px Courier New";
        ctx.fillText("🔊",canvasWidth*0.01,canvasHeight*0.98);
    }
    if(musicToggle){
        ctx.font = "40px Courier New";
        ctx.fillText("♬",canvasWidth*0.05,canvasHeight*0.98);
    }
    
    
    

    if(!inputs.prevStates.includes("MUTE") && inputs.getInputs().includes("MUTE")){
        if(musicToggle && soundToggle){
            soundToggle = !soundToggle;
        } else if(musicToggle && !soundToggle){
            musicToggle = !musicToggle;
        } else if(!musicToggle && !soundToggle){
            soundToggle = !soundToggle;
        } else if(!musicToggle && soundToggle){
            musicToggle = !musicToggle;
        }

        if(!musicToggle){
            myAudioNode.disconnect();
        } else {
            myAudioNode.connect(zzfxX.destination);
        }
    }
    inputs.prevStates = inputs.getInputs();
}


setInterval(() => draw(ctx),50);
