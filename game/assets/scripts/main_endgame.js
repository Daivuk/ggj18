var faceFrameCount = 60
var victorHero = null;

function updateEndGame(dt)
{
    if (faceFrameCount > 0) faceFrameCount--;

}

function renderEndGame()
{

    if (faceFrameCount > 0)
    {
        renderGame();
    }

    SpriteBatch.drawRect(null, new Rect(0, 0, Renderer.getResolution()), new Color(.0, .0, .0, (60.0 - faceFrameCount)/ 60.0));

    //if (faceFrameCount <= 0)
    {
        var center = Renderer.getResolution().div(new Vector2(2, 2));
        SpriteBatch.drawText(encryptedFont, "HQ RECEIVED TRANSMISSION", new Vector2(center.x, 0), Vector2.TOP_LEFT, new Color(victorHero.color));
        SpriteBatch.drawText(encryptedFont, "WELL DONE", new Vector2(0, 100), Vector2.TOP_LEFT, new Color(victorHero.color));
        SpriteBatch.drawSpriteAnim(victorHero.spriteAnim, new Vector2(center), Color.WHITE);
    }

    
}