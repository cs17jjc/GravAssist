class GameState{
    constructor(currentLevel){
        this.currentLevel = currentLevel;
    }
    static initial(){
        return new GameState(LevelState.blank(100, 100, createVector(50, 50, 0)));
    }
    static updateLevelState(gameState,inputArr){
        return new GameState(LevelState.updateLevelState(gameState.currentLevel,inputArr));
    }

    static update(gameState, inputsArr){
        return GameState.updateLevelState(gameState,inputsArr);
    }

    static draw(gameState){
        fill(255);
        push();
        
        const playerTileX = Math.trunc(gameState.currentLevel.playerPosition.x / LevelState.tileSize);
        const playerTileY = Math.trunc(gameState.currentLevel.playerPosition.y / LevelState.tileSize);
        
        const renderTilesX = R.range(Math.trunc(Math.max(0,playerTileX - (width/2)/LevelState.tileSize)),Math.trunc(Math.min(gameState.currentLevel.width,playerTileX + ((width/2)/LevelState.tileSize) + 1)));
        const renderTilesY = R.range(Math.trunc(Math.max(0,playerTileY - (height/2)/LevelState.tileSize)),Math.trunc(Math.min(gameState.currentLevel.height,playerTileY + ((height/2)/LevelState.tileSize) + 2)));
        
        R.forEach((x) => {
            R.forEach((y) => {
                if(gameState.currentLevel.tiles[x][y].isWall){
                    if(gameState.currentLevel.tiles[x][y].isOpaque){
                        fill(255);
                        stroke(255);
                    }
                    
                } else {
                    fill(50);
                    stroke(50);
                }
                rect(x*LevelState.tileSize - gameState.currentLevel.playerPosition.x + (width/2),
                     y*LevelState.tileSize - gameState.currentLevel.playerPosition.y + (height/2),
                     LevelState.tileSize,LevelState.tileSize);
            },
            renderTilesY);
        },
        renderTilesX);

        fill(255,0,0);
        stroke(250,0,0);
        ellipse(width/2,height/2,25,25);
        pop();
    }
}