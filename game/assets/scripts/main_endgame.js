var faceFrameCount = 60
var victorHero = null;

var hqTransmissionReceived;
var wellDone;
var pressStartToContinue;

function updateEndGame(dt)
{
    if (faceFrameCount > 0)
    {
        faceFrameCount--;
        //updateGame(dt);
        if (faceFrameCount == 0)
        {
            hqTransmissionReceived = animtext_create("HQ RECEIVED TRANSMISSION");
            wellDone = animtext_create("WELL DONE", 1.5);
            pressStartToContinue = animtext_create("^333PRESS START TO CONTINUE", 3);
        }
    }
    else
    {
        if (isStartJustDown(0) ||
            isStartJustDown(1) ||
            isStartJustDown(2) ||
            isStartJustDown(3))
        {
            startMainMenu();

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
        animtext_update(hqTransmissionReceived, dt);
        animtext_update(wellDone, dt);
        animtext_update(pressStartToContinue, dt);
    }
    victorHero.spriteAnim.play("idle_e");
    matrixRain_update(dt);
}

function renderEndGame()
{
    if (faceFrameCount > 0)
    {
        renderGame();
    }

    SpriteBatch.drawRect(null, new Rect(0, 0, resolution), new Color(.0, .0, .0, (60.0 - faceFrameCount)/ 60.0));

    matrixRain_render();

    var center = resolution.div(2);
    if (hqTransmissionReceived)
    {
        animtext_render(hqTransmissionReceived, new Vector2(center.x, center.y - 80), victorHero.color);
        animtext_render(wellDone, new Vector2(center.x, center.y + 20), victorHero.color);
    }
    // SpriteBatch.drawText(encryptedFont, "HQ RECEIVED TRANSMISSION", new Vector2(center.x, center.y - 80), Vector2.CENTER, new Color(victorHero.color));
    // SpriteBatch.drawText(encryptedFont, "WELL DONE", new Vector2(center.x, center.y + 20), Vector2.CENTER, new Color(victorHero.color));
    SpriteBatch.drawSpriteAnim(victorHero.spriteAnim, new Vector2(center), Color.WHITE, 0, 3);

    if (faceFrameCount <= 0)
    {
        animtext_render(pressStartToContinue, new Vector2(center.x, resolution.y - 20));
    }
}

function renderEndGameGlow()
{
    var center = resolution.div(2);
    matrixRain_renderGlow();
    
    if (hqTransmissionReceived)
    {
        animtext_renderGlow(hqTransmissionReceived, new Vector2(center.x, center.y - 80), victorHero.color);
        animtext_renderGlow(wellDone, new Vector2(center.x, center.y + 20), victorHero.color);
    }
    // SpriteBatch.drawText(encryptedFont, "HQ RECEIVED TRANSMISSION", new Vector2(center.x, center.y - 80), Vector2.CENTER, new Color(victorHero.color).mul(.5));
    // SpriteBatch.drawText(encryptedFont, "WELL DONE", new Vector2(center.x, center.y + 20), Vector2.CENTER, new Color(victorHero.color).mul(.5));
    SpriteBatch.drawSpriteAnim(victorHero.spriteAnim, new Vector2(center), Color.BLACK, 0, 3);
    if (faceFrameCount <= 0)
    {
        animtext_render(pressStartToContinue, new Vector2(center.x, resolution.y - 20));
    }
}
