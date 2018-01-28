var CENTER_RECT = new Rect();
var CENTRE_TILE_PROXIMITY = 1.5;
var music;

function updateInit(dt)
{
    HERO_SPAWN_PROXIMITY = TILE_HEIGHT * 5;
    CENTER_RECT = new Rect(
        CENTRE_POSITION.x - CENTRE_TILE_PROXIMITY * TILE_HEIGHT,
        CENTRE_POSITION.y - CENTRE_TILE_PROXIMITY * TILE_HEIGHT,
        CENTRE_TILE_PROXIMITY * TILE_HEIGHT * 2,
        CENTRE_TILE_PROXIMITY * TILE_HEIGHT * 2);

    gameState = GameStateEnum.MAIN_MENU;

    //playMusic("ingame.ogg", true);
    //if (Random.randBool()) music = getMusic("GG18musicA.ogg");
    //else music = getMusic("GG18musicB.ogg");
    music_play("Mixdown.ogg");

    Input.setMouseVisible(false);
}

function renderInit()
{
    
}

function music_play(filename)
{
    if (music)
    {
        music.stop();
        music = null;
    }
    music = getMusic(filename);
    music.setVolume(.5);
    music.play(true);
}
