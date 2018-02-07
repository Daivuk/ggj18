var rains = [];
var RAIN_SPACING = 12;
var TRAIL_LEN = 15;
var RAIN_DELAY = .1;
var RAIN_COUNT = 20;
var RAIN_OPACITY = .4;

function matrixRain_start(startOffsetX)
{
    rains = [];
    for (var i = 0; i < RAIN_COUNT; ++i)
    {
        var rain = {
            startOffset: startOffsetX,
            position: new Vector2(
                Math.floor(Random.randNumber(startOffsetX, resolution.x) / RAIN_SPACING) * RAIN_SPACING + RAIN_SPACING * .5,
                Math.floor(Random.randNumber(resolution.y) / RAIN_SPACING + TRAIL_LEN) * RAIN_SPACING),
            trail: [],
            delay: Random.randNumber(RAIN_DELAY)
        };
        rains.push(rain);
    }
}

function getRandSymbol()
{
    var symbolCode = Random.randInt(aCODE, aCODE + 25);
    return String.fromCharCode(symbolCode);
}

function matrixRain_update(dt)
{
    for (var i = 0; i < rains.length; ++i)
    {
        var rain = rains[i];
        rain.delay -= dt;
        if (rain.delay < 0)
        {
            rain.delay += RAIN_DELAY;
            rain.position.y += RAIN_SPACING;
            rain.trail.splice(0, 0, getRandSymbol());
            if (rain.trail.length > TRAIL_LEN)
            {
                rain.trail.pop();
            }
            if (rain.position.y > resolution.y + TRAIL_LEN * RAIN_SPACING)
            {
                rain.position = new Vector2(
                    Math.floor(Random.randNumber(rain.startOffset, resolution.x) / RAIN_SPACING) * RAIN_SPACING + RAIN_SPACING * .5,
                    Math.floor(Random.randNumber(resolution.y / 2) / RAIN_SPACING) * RAIN_SPACING);
                rain.trail = [];
            }
        }
    }
}

function matrixRain_render()
{
    var colorFrom = new Color(.7, 1, .3).mul(.4 * RAIN_OPACITY);
    var color = new Color(0, 1, 0).mul(.4 * RAIN_OPACITY);
    for (var i = 0; i < rains.length; ++i)
    {
        var rain = rains[i];
        var pos = new Vector2(rain.position);
        for (var j = 0; j < rain.trail.length; ++j)
        {
            var percent = j / rain.trail.length;
            var invPercent = 1 - percent;
            SpriteBatch.drawText(
                encryptedFont, 
                rain.trail[j], 
                pos, 
                Vector2.TOP_LEFT, 
                Color.lerp(colorFrom, color.mul(invPercent), percent));
            pos.y -= RAIN_SPACING;
        }
    }
}

function matrixRain_renderGlow()
{
    var colorFrom = new Color(1, 1, .7).mul(.6 * RAIN_OPACITY);
    var color = new Color(0, 1, 0).mul(.6 * RAIN_OPACITY);
    for (var i = 0; i < rains.length; ++i)
    {
        var rain = rains[i];
        var pos = new Vector2(rain.position);
        for (var j = 0; j < rain.trail.length / 4; ++j)
        {
            var percent = j / (rain.trail.length / 4);
            var invPercent = 1 - percent;
            SpriteBatch.drawText(
                encryptedFont, 
                rain.trail[j], 
                pos, 
                Vector2.TOP_LEFT, 
                Color.lerp(colorFrom, color.mul(invPercent), percent));
            pos.y -= RAIN_SPACING;
        }
    }
}
