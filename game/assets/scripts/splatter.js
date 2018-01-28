var splatters = [];

function splatter_create(_position, _texture)
{
    var splatter = {
        position: new Vector2(_position),
        texture: _texture,
        timer: 10,
        angle: Math.floor(Random.randNumber(0, 360) / 90) * 90
    };

    splatters.push(splatter);
}

function splatters_update(dt)
{
    for (var i = 0; i < splatters.length; ++i)
    {
        var splatter = splatters[i];
        splatter.timer -= dt;
        if (splatter.timer < 0)
        {
            splatters.splice(i--, 1);
            continue;
        }
    }
}

function splatters_render()
{
    for (var i = 0; i < splatters.length; ++i)
    {
        var splatter = splatters[i];
        SpriteBatch.drawSprite(splatter.texture, splatter.position, 
            new Color(Math.min(splatter.timer / 5, 1)), splatter.angle);
    }
}
