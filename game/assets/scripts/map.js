var heroesInCentre = 0;
var rotatingLight = new NumberAnim();
var angle = 0;
var centerReady = false;
var transmissionEffectTimer = 0;
var flyingSymbols = [];

var alertTexture = getTexture("alert.png");

function getHeroInCenter()
{
    var count = 0;
    for(var i = 0; i < heroes.length; ++i)
    {
        var hero = heroes[i];

        if(!hero.playing) continue;

        if(map_isInCentre(hero.position) && hero.state != HeroState.DISABLED)
        {
            count++;
        }
    }

    return count;
}

function map_update(dt)
{
    var lastCount = heroesInCentre;
    heroesInCentre = 0;

    var wasReady = centerReady;

    centerReady = false;
    for(var i = 0; i < heroes.length; ++i)
    {
        var hero = heroes[i];

        if(!hero.playing) continue;

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
    while (angle >= Math.PI * 2) angle -= Math.PI * 2;

    if (transmissionEffectTimer > 0)
    {
        transmissionEffectTimer -= dt;
        if (transmissionEffectTimer < 0)
        {
            transmissionEffectTimer = 0;
        }
    }

    var pos = new Vector2(17.5, 8.5).mul(TILE_HEIGHT);
    for (var i = 0; i < flyingSymbols.length; ++i)
    {
        var flyingSymbol = flyingSymbols[i];
        flyingSymbol.delay -= dt;
        if (flyingSymbol.delay <= 0)
        {
            if (flyingSymbol.progress == 0)
            {
                ping_create(new Vector2(pos.x + flyingSymbol.xOffset, pos.y), glowCircleTexture, new Color(0, 1, 1));
            }
            flyingSymbol.progress += dt * 300;
            if (flyingSymbol.progress > 1000)
            {
                flyingSymbols.splice(i--, 1);
            }
        }
    }
}

function map_isInCentre(position)
{
    return CENTER_RECT.contains(position);
}

var PI = 3.1415926536;

function map_render()
{
    var pos = new Vector2(17.5, 8.5).mul(TILE_HEIGHT);

    if (transmissionEffectTimer > 0)
    {
        var invPercent = transmissionEffectTimer;
        var percent = 1 - invPercent;

        SpriteBatch.drawBeam(null, pos, 
            new Vector2(pos.x, pos.y - 1000),
            percent * 32, new Color(0, 1, 1).mul(invPercent));
    }

    for (var i = 0; i < flyingSymbols.length; ++i)
    {
        var flyingSymbol = flyingSymbols[i];
        if (flyingSymbol.delay <= 0)
            SpriteBatch.drawText(
                encryptedFont, 
                flyingSymbol.glyph, 
                new Vector2(pos.x + flyingSymbol.xOffset, pos.y - flyingSymbol.progress), 
                Vector2.CENTER, 
                new Color(0, 1, 1));
    }
}

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

    if (transmissionEffectTimer > 0)
    {
        var invPercent = transmissionEffectTimer;
        var percent = 1 - invPercent;

        var pos = new Vector2(17.5, 8.5).mul(TILE_HEIGHT);
        SpriteBatch.drawBeam(null, pos, 
            new Vector2(pos.x, pos.y - 1000),
            percent * 16, new Color(0, 1, 1).mul(invPercent));

        if (transmissionEffectTimer > .75)
        {
            var overlayPercent = (transmissionEffectTimer - .75) / .25;
            SpriteBatch.drawRect(null, new Rect(0, 0, resolution), 
                new Color(0, 1, 1).mul(overlayPercent));
        }
    }
    var pos = new Vector2(17.5, 8.5).mul(TILE_HEIGHT);
    for (var i = 0; i < flyingSymbols.length; ++i)
    {
        var flyingSymbol = flyingSymbols[i];
        if (flyingSymbol.delay <= 0)
            SpriteBatch.drawText(
                encryptedFont, 
                flyingSymbol.glyph, 
                new Vector2(pos.x + flyingSymbol.xOffset, pos.y - flyingSymbol.progress), 
                Vector2.CENTER, 
                new Color(0, 1, 1).mul(.5));
    }
}
