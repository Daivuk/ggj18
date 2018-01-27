var HERO_COLLISION_SIZE = 10;
var HERO_SPEED = 50;
var HERO_PICKUP_OFFSET = new Vector2(0, 0);

function hero_create(_index, _pos, _color)
{
    var hero = {
        index: _index,
        position: new Vector2(_pos),
        color: new Color(_color),
        dir: "w"
    };

    hero.spriteAnim = playSpriteAnim("hacker" + (_index % 3) + ".spriteanim", "idle_e");

    return hero;
}

function hero_createNewMessage(hero) {

    var message = generateMessage(8);

    hero.glyphMap = []; // reset
    hero.displayMessage = ""; // reset
    hero.message = message;

    var indexShift = Random.randInt(0, 25);

    for(var i = 0; i < message.length; ++i)
    {
        var originalGlyph = message[i];

        if (originalGlyph == ' ')
        {
            shiftedGlyph = originalGlyph; // don't shift space;
        }
        else
        {
            var shiftedGlyph = String.fromCharCode(originalGlyph.charCodeAt() + indexShift);
            if (shiftedGlyph.charCodeAt() > 122) shiftedGlyph = String.fromCharCode(shiftedGlyph.charCodeAt() - 26);
        }

        hero.glyphMap.push({
            encrypted: shiftedGlyph,
            decrypted: originalGlyph.toUpperCase() // upper case are decrypted and visible on screen
        });

        hero.displayMessage += shiftedGlyph;
    }

    hero.message = hero.message.toUpperCase(); // decrypted
}

function hero_revealGlyph(hero, glyph)
{
    for (var i = 0; i < hero.glyphMap.length; ++i)
    {
        if (hero.glyphMap[i].encrypted == glyph)
        {
            hero.displayMessage[i] = hero.glyphMap[i].decrypted;
        }
    }
}

function hero_hideGlyph(hero, glyph)
{
    for (var i = 0; i < hero.glyphMap.length; ++i)
    {
        if (hero.glyphMap[i].encrypted == glyph)
        {
            hero.displayMessage[i] = hero.glyphMap[i].encrypted;
        }
    }
}

function hero_hideAllGlyph(hero)
{
    for (var i = 0; i < hero.displayMessage.length; ++i)
    {
        hero.displayMessage[i] = hero.glyphMap[i].encrypted;
    }
}

function hero_render(hero)
{
    SpriteBatch.drawSpriteAnim(hero.spriteAnim, hero.position);
    SpriteBatch.drawText(encryptedFont, hero.displayMessage, new Vector2(4, 4 + 70 * hero.index), Vector2.TOP_LEFT, new Color(1.0, 1.0, 1.0));
}

function heroes_render()
{
    for(var i = 0; i < heroes.length; ++i)
    {
        hero_render(heroes[i]);
    }
}

function hero_renderGlow(hero)
{
    SpriteBatch.drawSpriteAnim(hero.spriteAnim, hero.position, Color.BLACK);
}

function hero_update(hero, dt)
{
    var leftThumb = GamePad.getLeftThumb(hero.index);

    // Get the next position according to thumb movement
    var nextPosition = new Vector2(hero.position.add(leftThumb.mul(dt * HERO_SPEED)));

    // Apply collision to the movement
    hero.position = tiledMap.collision(hero.position, nextPosition, new Vector2(HERO_COLLISION_SIZE, HERO_COLLISION_SIZE));

    var pickup = pickups_acquire(hero.position.add(HERO_PICKUP_OFFSET));
    if(pickup != null)
    {
        // Do stuff with the pickup
    }

    // Pick anim
    var anim = "idle";
    if (leftThumb.length() > 0.1) anim = "run";

    // Point the character in the right direction
    if(Math.abs(leftThumb.x) > 0.001)
    {
        if(leftThumb.x > 0)
        {
            hero.dir = "e";
        }
        else
        {
            hero.dir = "w";
        }
    }

    hero.spriteAnim.play(anim + "_" + hero.dir)
    
    var pickup = pickups_acquire(hero.position.add(HERO_PICKUP_OFFSET));

    if(pickup != null)
    {
        print("picked up " + pickup.glyph);
        hero_revealGlyph(hero, pickup.glyph);
    }
}

function heroes_update(dt)
{
    for(var i = 0; i < heroes.length; ++i)
    {
        hero_update(heroes[i], dt);
    }
}