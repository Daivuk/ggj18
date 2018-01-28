var heroesInCentre = 0;
var rotatingLight = new NumberAnim();
var angle = 0;
var centerReady = false;

var alertTexture = getTexture("alert.png");

function map_update(dt)
{
    var lastCount = heroesInCentre;
    heroesInCentre = 0;

    var wasReady = centerReady;

    centerReady = false;
    for(var i = 0; i < heroes.length; ++i)
    {
        var hero = heroes[i];

        if(map_isInCentre(hero.position) && hero.state != HeroState.DISABLED)
        {
            heroesInCentre++;
            
        }

        centerReady |= hero_hasFullMessage(hero);
    }

    if (heroesInCentre >= 2) centerReady = false;

    if (wasReady && !centerReady)
    {
        // Turn red
        tiledMap.setTileAt(1, CENTRE_POSITION.x / TILE_HEIGHT, CENTRE_POSITION.y / TILE_HEIGHT, 228 + 1);
        tiledMap.setTileAt(2, CENTRE_POSITION.x / TILE_HEIGHT, CENTRE_POSITION.y / TILE_HEIGHT, 228 + 1 + 2);
    }
    if (!wasReady && centerReady)
    {
        // Turn green
        tiledMap.setTileAt(1, CENTRE_POSITION.x / TILE_HEIGHT, CENTRE_POSITION.y / TILE_HEIGHT, 180 + 1);
        tiledMap.setTileAt(2, CENTRE_POSITION.x / TILE_HEIGHT, CENTRE_POSITION.y / TILE_HEIGHT, 180 + 1 + 2);
    }

    angle += Math.PI * dt;
}

function map_isInCentre(position)
{
    return CENTER_RECT.contains(position);
}

var PI = 3.1415926536;

function map_renderGlow()
{
    tiledMap.renderLayer(2);

    if (centerReady)
    {
        for (var i = 0; i < 4; ++i)
        {
            SpriteBatch.drawSprite(alertTexture, 
                new Vector2(CENTRE_POSITION.x + Math.cos(angle) * TILE_HEIGHT * 1.5, 
                            CENTRE_POSITION.y + Math.sin(angle) * TILE_HEIGHT * 1.5), 
                new Color(.35));
            angle += PI / 2;
        }
    }
}
