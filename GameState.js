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
        
        const renderTilesX = R.range(Math.max(0,playerTileX - 50),Math.min(gameState.currentLevel.width,playerTileX + 50));
        const renderTilesY = R.range(Math.max(0,playerTileY - 50),Math.min(gameState.currentLevel.height,playerTileY + 50));
        
        R.forEach((x) => {
            R.forEach((y) => {
                if(gameState.currentLevel.tiles[x][y].isWall){
                    if(gameState.currentLevel.tiles[x][y].isOpaque){
                        fill(255);
                    }
                    
                } else {
                    fill(50);
                }
                rect(x*tileSize - gameState.currentLevel.playerPosition.x,
                     y*tileSize - gameState.currentLevel.playerPosition.y,
                     LevelState.tileSize,LevelState.tileSize);
            },
            renderTilesY);
        },
        renderTilesX);
        
        ellipse(width/2,height/2,25,25);
        pop();
    }
}