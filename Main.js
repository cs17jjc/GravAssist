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
var soundToggle = true;


function draw(ctx){
    ctx.clearRect(0,0,canvasWidth,canvasHeight);
    gameState.update(inputs.getInputs(),soundToggle);
    ctx.save();
    gameState.draw(ctx);
    ctx.restore();
    if(!inputs.prevStates.includes("MUTE") && inputs.getInputs().includes("MUTE")){
        if(soundToggle){
            myAudioNode.disconnect();
        } else {
            myAudioNode.connect(zzfxX.destination);
        }
        soundToggle = !soundToggle;
    }
    inputs.prevStates = inputs.getInputs();
}


setInterval(() => draw(ctx),50);
