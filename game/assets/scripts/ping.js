var pings = [];
var PING_TIME = .15;

function ping_create(_position, _texture, _color)
{
    var ping = {
        position: new Vector2(_position),
        texture: _texture,
        timer: PING_TIME,
        color: _color
    };

    pings.push(ping);
}

function pings_update(dt)
{
    for (var i = 0; i < pings.length; ++i)
    {
        var ping = pings[i];
        ping.timer -= dt;
        if (ping.timer < 0)
        {
            pings.splice(i--, 1);
            continue;
        }
    }
}

function pings_renderGlow()
{
    for (var i = 0; i < pings.length; ++i)
    {
        var ping = pings[i];
        var invPercent = ping.timer / PING_TIME;
        var percent = 1 - invPercent;
        SpriteBatch.drawSprite(ping.texture, ping.position, 
            ping.color.mul(invPercent), 0, 1 + percent * 4);
    }
}
