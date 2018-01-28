var faceFrameCount = 60
var victorHero = null;

function updateEndGame(dt)
{
    if (faceFrameCount > 0)
    {
        faceFrameCount--;
        updateGame(dt);
    }
    else
    {
        if (GamePad.isJustDown(0, Button.START) ||
            GamePad.isJustDown(1, Button.START) ||
            GamePad.isJustDown(2, Button.START) ||
            GamePad.isJustDown(3, Button.START))
        {
            gameState = GameStateEnum.MAIN_MENU;
            title = generateMessage(8);

            splatters = [];
            pings = [];
            gibs = [];
            renderables = [];
            pickups = [];
            faceFrameCount = 60;
            victorHero = null;
            heroesInCentre = 0;
            centerReady = false;
            transmissionEffectTimer = 0;
            flyingSymbols = [];

            heroes = [
                hero_create(0, new Vector2(6, 2).mul(TILE_HEIGHT).add(HALF_TILE_HEIGHT), Color.fromHexRGB(0x007dc7)),
                hero_create(1, new Vector2(28, 1).mul(TILE_HEIGHT).add(HALF_TILE_HEIGHT), Color.fromHexRGB(0x3fc778)),
                hero_create(2, new Vector2(28, 15).mul(TILE_HEIGHT).add(HALF_TILE_HEIGHT), Color.fromHexRGB(0xffce00)),
                hero_create(3, new Vector2(6, 14).mul(TILE_HEIGHT).add(HALF_TILE_HEIGHT), Color.fromHexRGB(0xff8b9c))
            ];

            return;
        }
    }
    victorHero.spriteAnim.play("idle_e");
}

function renderEndGame()
{
    if (faceFrameCount > 0)
    {
        renderGame();
    }

    SpriteBatch.drawRect(null, new Rect(0, 0, resolution), new Color(.0, .0, .0, (60.0 - faceFrameCount)/ 60.0));

    var center = resolution.div(2);
    SpriteBatch.drawText(encryptedFont, "HQ RECEIVED TRANSMISSION", new Vector2(center.x, center.y - 80), Vector2.CENTER, new Color(victorHero.color));
    SpriteBatch.drawText(encryptedFont, "WELL DONE", new Vector2(center.x, center.y + 20), Vector2.CENTER, new Color(victorHero.color));
    SpriteBatch.drawSpriteAnim(victorHero.spriteAnim, new Vector2(center), Color.WHITE, 0, 3);

    if (faceFrameCount <= 0)
    {
        SpriteBatch.drawText(encryptedFont, "PRESS START TO CONTINUE", new Vector2(center.x, resolution.y - 20), Vector2.BOTTOM, Color.WHITE);
    }
}

function renderEndGameGlow()
{
    var center = resolution.div(2);
    SpriteBatch.drawText(encryptedFont, "HQ RECEIVED TRANSMISSION", new Vector2(center.x, center.y - 80), Vector2.CENTER, new Color(victorHero.color).mul(.5));
    SpriteBatch.drawText(encryptedFont, "WELL DONE", new Vector2(center.x, center.y + 20), Vector2.CENTER, new Color(victorHero.color).mul(.5));
}
