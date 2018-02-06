function animtext_create(_text, _delay)
{
    if (typeof _delay === 'undefined') _delay = 0;
    var animtext = {
        text: _text,
        time: 0,
        delay: _delay
    };
    return animtext;
}

function animtext_update(animtext, dt)
{
    if (animtext.delay > 0)
    {
        animtext.delay -= dt;
        return;
    }
    lastTime = animtext.time;
    animtext.time += dt * 12;
    if (animtext.time <= animtext_getlen(animtext) + 8)
    {
        if (Math.floor(lastTime) < Math.floor(animtext.time))
        {
            playSound("GGJ18SFX_InfoSpawn0" + Random.randInt(1, 4) + ".wav", .5);
        }
    }
}

function animtext_getlen(animtext)
{
    var len = 0;
    for (var i = 0; i < animtext.text.length; ++i)
    {
        if (animtext.text[i] == '^')
        {
            i += 3;
            continue;
        }
        ++len;
    }
    return len;
}

function animtext_render(animtext, pos, color)
{
    if (typeof color === 'undefined') color = Color.WHITE;

    // We always center anim texts
    var len = animtext_getlen(animtext);
    var x = pos.x - len * 14 / 2;
    var y = pos.y;
    var cnt = 0;

    var prefix = "";
    for (var i = 0; i < animtext.text.length; ++i)
    {
        if (animtext.text[i] == '^')
        {
            prefix = animtext.text.substring(i, i + 4);
            i += 4;
        }
        if (animtext.text[i] == " ")
        {
            x += 14;
            continue;
        }
        var percent = (animtext.time) - cnt;
        var char;
        var newCode;
        if (percent > 0)
        {
            percent = Math.min(1, percent / 8);
            var invPercent = 1 - percent;
            var code = animtext.text[i].charCodeAt();
            if (code >= aCODE && code <= "z".charCodeAt())
                newCode = ((code - aCODE) + 26 * invPercent) % 26 + aCODE;
            else if (code >= ACODE && code <= "Z".charCodeAt())
                newCode = ((code - ACODE) + 26 * invPercent) % 26 + ACODE;
            if (newCode != code) char = String.fromCharCode(newCode).toLowerCase();
            else char = String.fromCharCode(newCode);
            SpriteBatch.drawText(
                encryptedFont, 
                char, 
                new Vector2(x + 2, y + 2), 
                Vector2.TOP_LEFT, 
                Color.BLACK);
            SpriteBatch.drawText(
                encryptedFont, 
                prefix + char, 
                new Vector2(x, y), 
                Vector2.TOP_LEFT, 
                color);
        }
        x += 14;
        ++cnt;
    }
}

function animtext_renderGlow(animtext, pos, color)
{
    if (typeof color === 'undefined') color = Color.WHITE;

    // We always center anim texts
    var len = animtext_getlen(animtext);
    var x = pos.x - len * 14 / 2;
    var y = pos.y;
    var cnt = 0;
    var prefix = "";
    for (var i = 0; i < animtext.text.length; ++i)
    {
        if (animtext.text[i] == '^')
        {
            prefix = animtext.text.substring(i, i + 4);
            i += 4;
        }
        if (animtext.text[i] == " ")
        {
            x += 14;
            continue;
        }
        var percent = (animtext.time) - cnt;
        var char;
        var newCode;
        if (percent > 0)
        {
            percent = Math.min(1, percent / 8);
            var invPercent = 1 - percent;
            var code = animtext.text[i].charCodeAt();
            if (code >= aCODE && code <= "z".charCodeAt())
                newCode = ((code - aCODE) + 26 * invPercent) % 26 + aCODE;
            else if (code >= ACODE && code <= "Z".charCodeAt())
                newCode = ((code - ACODE) + 26 * invPercent) % 26 + ACODE;
            if (newCode != code) char = String.fromCharCode(newCode).toLowerCase();
            else char = String.fromCharCode(newCode);
            SpriteBatch.drawText(
                encryptedFont, 
                prefix + char, 
                new Vector2(x, y), 
                Vector2.TOP_LEFT, 
                color.mul(invPercent));
        }
        x += 14;
        ++cnt;
    }
}
