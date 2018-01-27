var CENTER_RECT = new Rect();

function updateInit(dt)
{
    HERO_SPAWN_PROXIMITY = TILE_HEIGHT * 5;
    CENTER_RECT = new Rect(
        CENTRE_POSITION.x - CENTER_TILE_PROXIMITY * TILE_HEIGHT,
        CENTRE_POSITION.y - CENTER_TILE_PROXIMITY * TILE_HEIGHT,
        CENTER_TILE_PROXIMITY * TILE_HEIGHT * 2,
        CENTER_TILE_PROXIMITY * TILE_HEIGHT * 2);

    gameState = GameStateEnum.MAIN_MENU
}

function renderInit()
{
    
}