var HERO_COLLISION_SIZE = 10;
var HERO_SPEED = 50;
var HERO_PICKUP_OFFSET = new Vector2(0, 0);
var HERO_DISABLE_TIME = 2;
var HERO_TASER_USE_INTERVAL = 3;
var HERO_TASER_CHARGE_TIME = 1;
var HERO_TASER_PROXIMITY = 10;
var HERO_SPAWN_PROXIMITY = 0;
var HERO_SPAWN_CENTER_TILE_RADIUS = 7;

var glowCircleTexture = getTexture("glowCircle.png")

function hero_create(_index, _pos, _color)
{
    var hero = {
        index: _index,
        position: new Vector2(_pos),
        color: new Color(_color),
        dir: "w",
        taserEnabled: false,
        taserTimer: HERO_TASER_USE_INTERVAL,
        taserOn: false,
        taserCharge: 0,
        tasered: false,
        disabled: false,
        disableTimer: HERO_DISABLE_TIME
    };

    hero.spriteAnim = playSpriteAnim("hacker" + _index + ".spriteanim", "idle_e");

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
            decrypted: originalGlyph.toUpperCase(), // upper case are decrypted and visible on screen
            color: new ColorAnim(hero.color)
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
            hero.displayMessage = hero.displayMessage.replaceAt(i, hero.glyphMap[i].decrypted);
            hero.glyphMap[i].color.playSingle(Color.WHITE, hero.color.mul(.5), 3, Tween.EASE_IN);
        }
    }
}

function hero_hideGlyph(hero, glyph)
{
    for (var i = 0; i < hero.glyphMap.length; ++i)
    {
        if (hero.glyphMap[i].encrypted == glyph)
        {
            hero.displayMessage = hero.displayMessage.replaceAt(i, hero.glyphMap[i].encrypted);
        }
    }
}

function hero_hideAllGlyph(hero)
{
    for (var i = 0; i < hero.displayMessage.length; ++i)
    {
        hero.displayMessage = hero.displayMessage.replaceAt(i, hero.glyphMap[i].encrypted);
    }
}

function hero_render(hero)
{
    SpriteBatch.drawSpriteAnim(hero.spriteAnim, hero.position);
    SpriteBatch.drawSpriteAnim(hero.spriteAnim, new Vector2(40, 48 + 70 * hero.index), Color.WHITE, 0, 2);
    
    for (var i = 0; i < hero.glyphMap.length; ++i)
    {
        SpriteBatch.drawText(encryptedFont, hero.displayMessage[i], new Vector2(4+(8*i), 4 + 70 * hero.index), Vector2.TOP_LEFT, hero.glyphMap[i].color.get());
    }
}

function heroes_render()
{
    for(var i = 0; i < heroes.length; ++i)
    {
        hero_render(heroes[i]);
    }
}

function hero_hasFullMessage(hero)
{
    for (var i = 0; i < hero.glyphMap.length; ++i)
    {
        var c = hero.displayMessage[i];
        if ((c < "A" || c > "Z") && c != " ") return false;
    }
    return true;
}

function hero_renderGlow(hero)
{
    SpriteBatch.drawSprite(glowCircleTexture, new Vector2(hero.position.x, hero.position.y + 2), hero.color);

    SpriteBatch.drawSpriteAnim(hero.spriteAnim, hero.position, Color.BLACK);
    var hasWord = hero_hasFullMessage(hero);
    for (var i = 0; i < hero.glyphMap.length; ++i)
    {
        if (hero.glyphMap[i].color.isPlaying() || hasWord)
        {
            SpriteBatch.drawText(encryptedFont, hero.displayMessage[i], new Vector2(4+(8*i), 4 + 70 * hero.index), Vector2.TOP_LEFT, hero.glyphMap[i].color.get());
        }
    }
}

function hero_update(hero, dt)
{
    if(hero.disabled)
    {
        return;
    }

    var leftThumb = GamePad.getLeftThumb(hero.index);

    // Get the next position according to thumb movement
    var nextPosition = new Vector2(hero.position.add(leftThumb.mul(dt * HERO_SPEED)));

    // Apply collision to the movement
    hero.position = tiledMap.collision(hero.position, nextPosition, new Vector2(HERO_COLLISION_SIZE, HERO_COLLISION_SIZE));

    // Pick up items
    var pickup = pickups_acquire(hero.position.add(HERO_PICKUP_OFFSET));

    if(pickup != null)
    {
        hero_revealGlyph(hero, pickup.glyph);
    }

    // Handle taser
    if(hero.taserEnabled)
    {
        if(GamePad.isDown(hero.index, Button.A))
        {
            if(!hero.taserOn)
            {
                print("hero " + hero.index + " taser on");
                hero.taserOn = true;
            }

            hero.taserCharge += dt;

            if(hero.taserCharge > HERO_TASER_CHARGE_TIME)
            {
                hero.taserCharge = HERO_TASER_CHARGE_TIME + 1;
            }
        }
        else
        {
            if(hero.taserOn)
            {
                var chargeAmount = hero.taserCharge;
                hero.taserOn = false;
                hero.taserEnabled = false;
                hero.taserCharge = 0;

                if(chargeAmount < HERO_TASER_CHARGE_TIME)
                {
                    print("hero " + hero.index + " fired taser without enough charge");
                    return;
                }

                print("hero " + hero.index + " fired taser");

                for(var i = 0; i < heroes.length; ++i)
                {
                    if(i == hero.index)
                    {
                        continue;
                    }
                    else
                    {
                        var otherHero = heroes[i];

                        if(Vector2.distance(hero.position, otherHero.position) < HERO_TASER_PROXIMITY)
                        {
                            hero_tasered(otherHero);
                        }
                    }
                }
            }
        }
    }
    else
    {
        hero.taserTimer -= dt;

        if(hero.taserTimer < 0)
        {
            hero.taserEnabled = true;
            hero.taserTimer = HERO_TASER_USE_INTERVAL;
        }
    }

    if(GamePad.isJustDown(hero.index, Button.X) && heroesInCentre < 2 && map_isInCentre(hero.position))
    {
        print("hero " + hero.index + " is entering a code");
    }

    // Pick anim
    var anim = "idle";
    if (leftThumb.length() > 0.1) anim = "run";
    if (hero.taserOn) anim += "taser";

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
}

function hero_taser_update(hero, dt)
{
    if(hero.tasered || hero.disabled)
    {
        hero.disabled = true;

        hero.disableTimer -= dt;

        if(hero.disableTimer < 0)
        {
            hero_respawn(hero);
        }
    }
}

function hero_respawn(hero)
{
    hero.disabled = false;
    hero.tasered = false;
    hero.disableTimer = HERO_DISABLE_TIME;

    var foundSpot = false;
    var spawnPos = new Vector2(0, 0);

    while(!foundSpot)
    {
        var foundCollision = false;

        // Get a random tile spot
        var tileX = Random.randInt(0, tiledMap.getSize().x);
        var tileY = Random.randInt(0, tiledMap.getSize().y);

        // Get the actual spawn position for the pickup
        spawnPos.x = tileX * TILE_HEIGHT + HALF_TILE_HEIGHT;
        spawnPos.y = tileY * TILE_HEIGHT + HALF_TILE_HEIGHT;

        // Check for collision against the centre area
        if(Vector2.distance(CENTRE_POSITION, spawnPos) < HERO_SPAWN_CENTER_TILE_RADIUS * TILE_HEIGHT)
        {
            continue;
        }

        // Check for collision against pickups
        foundCollision = pickup_collision(spawnPos, 0.001);
        
        if(foundCollision)
        {
            continue;
        }

        // Make sure we don't spawn too close to a player
        foundCollision = hero_collision(spawnPos, HERO_SPAWN_PROXIMITY);

        if(foundCollision)
        {
            continue;
        }

        // Returns true if we didn't collide with any walls in the map
        foundSpot = tiledMap.getCollision(tileX, tileY);
    }
    
    hero.position = spawnPos;
}

function hero_tasered(hero)
{
    if(!hero.disabled && !hero.tasered)
    {
        print("hero " + hero.index + " tasered");
        hero.tasered = true;
    }
}

function heroes_update(dt)
{
    for(var i = 0; i < heroes.length; ++i)
    {
        hero_update(heroes[i], dt);
    }

    for(var i = 0; i < heroes.length; ++i)
    {
        hero_taser_update(heroes[i], dt);
    }
}

function hero_collision(position, radius)
{
    for(var i = 0; i < heroes.length; ++i)
    {
        if(Vector2.distance(heroes[i].position, position) < radius)
        {
            return true;
        }
    }

    return false;
}