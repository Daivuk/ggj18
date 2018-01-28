var CENTER_RECT = new Rect();
var CENTRE_TILE_PROXIMITY = 1.5;

function updateInit(dt)
{
    HERO_SPAWN_PROXIMITY = TILE_HEIGHT * 5;
    CENTER_RECT = new Rect(
        CENTRE_POSITION.x - CENTRE_TILE_PROXIMITY * TILE_HEIGHT,
        CENTRE_POSITION.y - CENTRE_TILE_PROXIMITY * TILE_HEIGHT,
        CENTRE_TILE_PROXIMITY * TILE_HEIGHT * 2,
        CENTRE_TILE_PROXIMITY * TILE_HEIGHT * 2);

    gameState = GameStateEnum.MAIN_MENU;
}

function renderInit()
{
    
}