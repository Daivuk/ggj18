var rains = [];
var RAIN_SPACING = 12;

function matrixRain_start(startOffsetX)
{
    rains = [];
    for (var i = 0; i < 20; ++i)
    {
        var rain = {
            position: new Vector2(
                Math.floor(Random.randNumber(startOffsetX, resolution.x) / RAIN_SPACING),
                Math.floor(Random.randNumber(resolution.y) / RAIN_SPACING))
        };
    }
}

function matrixRain_update(dt)
{

}

function matrixRain_render()
{

}

function matrixRain_renderGlow()
{

}
