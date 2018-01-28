var heroesInCentre = 0;
var rotatingLight = new NumberAnim();
var angle = 0;

var alertTexture = getTexture("alert.png");

function map_update(dt)
{
    var lastCount = heroesInCentre;
    heroesInCentre = 0;

    for(var i = 0; i < heroes.length; ++i)
    {
        var hero = heroes[i];

        if(map_isInCentre(hero.position) && hero.state != HeroState.DISABLED)
        {
            heroesInCentre++;
        }
    }

    if (lastCount <= 1 && heroesInCentre > 1)
    {
        // Turn red
        tiledMap.setTileAt(1, CENTRE_POSITION.x / TILE_HEIGHT, CENTRE_POSITION.y / TILE_HEIGHT, 228 + 1);
        tiledMap.setTileAt(2, CENTRE_POSITION.x / TILE_HEIGHT, CENTRE_POSITION.y / TILE_HEIGHT, 228 + 1 + 2);
    }
    if (lastCount > 1 && heroesInCentre <= 1)
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

    if (heroesInCentre >= 2)
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
