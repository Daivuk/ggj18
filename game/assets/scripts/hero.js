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

var HeroState = {
    IDLE: 1,
    TASED: 2,
    TASER_CHARGING: 3,
    TASER_CHARGED: 4,
    TASER_DISCHARGING: 5,
    DISABLED: 6
}

function hero_create(_index, _pos, _color)
{
    var hero = {
        index: _index,
        position: new Vector2(_pos),
        color: new Color(_color),
        dir: "w",
        taserCharge: 0,
        state: HeroState.IDLE,
        disableTimer: HERO_DISABLE_TIME,
        spriteAnim: playSpriteAnim("hacker" + _index + ".spriteanim", "idle_e"),
        taseReadySpriteAnim: playSpriteAnim("taseReady.spriteanim", "idle_e"),
        renderFn: hero_render,
        renderGlowFn: hero_renderGlow,
        points: 0
    };

    renderables.push(hero);

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

function hero_getTaserPos(hero)
{
    if (hero.dir == "e")
    {
        if (hero.state == HeroState.TASER_DISCHARGING)
            return new Vector2(hero.position.x + 21, hero.position.y - 1);
        else
            return new Vector2(hero.position.x + 15, hero.position.y - 1);
    }
    else
    {
        return new Vector2(hero.position.x - 9, hero.position.y - 1);
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

    if (hero.state == HeroState.TASER_CHARGED)
    {
        SpriteBatch.drawSpriteAnim(hero.taseReadySpriteAnim, hero_getTaserPos(hero));
    }
    if (hero.state == HeroState.TASER_DISCHARGING)
    {
        SpriteBatch.drawSpriteAnim(hero.taseReadySpriteAnim, hero_getTaserPos(hero), Color.WHITE, 0, 2);
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

    if (hero.state == HeroState.TASER_CHARGED)
    {
        SpriteBatch.drawSpriteAnim(hero.taseReadySpriteAnim, hero_getTaserPos(hero), new Color(.5));
    }
    if (hero.state == HeroState.TASER_DISCHARGING)
    {
        SpriteBatch.drawSpriteAnim(hero.taseReadySpriteAnim, hero_getTaserPos(hero), new Color(.5), 0, 2);
    }
}

function hero_update(hero, dt)
{
    if(hero.state == HeroState.DISABLED)
    {
        return;
    }

    var leftThumb = GamePad.getLeftThumb(hero.index);

    // Get the next position according to thumb movement
    var speed = hero.state == HeroState.TASER_CHARGED ? HERO_SPEED * 1.5 : HERO_SPEED;
    var nextPosition = new Vector2(hero.position.add(leftThumb.mul(dt * speed)));

    // Apply collision to the movement
    if (hero.state != HeroState.TASER_DISCHARGING)
    {
        hero.position = tiledMap.collision(hero.position, nextPosition, new Vector2(HERO_COLLISION_SIZE, HERO_COLLISION_SIZE));
    }

    // Pick up items
    if (hero.state == HeroState.IDLE)
    {
        var pickup = pickups_acquire(hero.position.add(HERO_PICKUP_OFFSET));

        if(pickup != null)
        {
            hero_revealGlyph(hero, pickup.glyph);
        }
    }

    // Handle taser
    switch (hero.state)
    {
        case HeroState.IDLE:
        {
            if (GamePad.isDown(hero.index, Button.A))
            {
                hero.state = HeroState.TASER_CHARGING;
            }
            break;
        }
        case HeroState.TASER_CHARGING:
        {
            if (GamePad.isDown(hero.index, Button.A))
            {
                hero.taserCharge += dt;
                if(hero.taserCharge > HERO_TASER_CHARGE_TIME)
                {
                    hero.state = HeroState.TASER_CHARGED;
                    hero.taserCharge = HERO_TASER_CHARGE_TIME;
                }
            }
            else
            {
                hero.taserCharge = 0;
                hero.state = HeroState.IDLE;
            }
            break;
        }
        case HeroState.TASER_CHARGED:
        {
            if (!GamePad.isDown(hero.index, Button.A))
            {
                for(var i = 0; i < heroes.length; ++i)
                {
                    if(i == hero.index)
                    {
                        continue;
                    }
                    else
                    {
                        var otherHero = heroes[i];
    
                        if (hero.dir == "e")
                        {
                            if (new Rect(hero.position.x + 8, hero.position.y - 12, 16, 24).contains(otherHero.position))
                            {
                                hero_tasered(otherHero);
                            }
                        }
                        else
                        {
                            if (new Rect(hero.position.x - 12 - 16, hero.position.y - 12, 16, 24).contains(otherHero.position))
                            {
                                hero_tasered(otherHero);
                            }
                        }
                    }
                }
                hero.state = HeroState.TASER_DISCHARGING;
            }
            break;
        }
        case HeroState.TASER_DISCHARGING:
        {
            hero.taserCharge -= dt * 2;
            if (hero.taserCharge <= 0)
            {
                hero.state = HeroState.IDLE;
            }
            break;
        }
    }

    // Handle interacting with the transmitter
    if(GamePad.isJustDown(hero.index, Button.X) && heroesInCentre < 2 && map_isInCentre(hero.position) && hero_hasFullMessage(hero))
    {
        hero.points++;

        print("hero " + hero.index + " entered a code and now has " + hero.points + " points");

        hero_createNewMessage(hero);

        regenerateUniqueGlyphs();
    }

    if(GamePad.isJustDown(hero.index, Button.Y))
    {
        gibs_spawn(hero.position);
    }

    // Pick anim
    var anim = "idle";
    if (leftThumb.length() > 0.1) anim = "run";

    if (hero.state == HeroState.TASER_CHARGED ||
        hero.state == HeroState.TASER_CHARGING ||
        hero.state == HeroState.TASER_DISCHARGING)
        anim += "taser";

    // Point the character in the right direction
    if (Math.abs(leftThumb.x) > 0.001 &&
        hero.state != HeroState.TASER_DISCHARGING)
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

    if (hero.state == HeroState.TASER_CHARGING)
    {
        hero.taseReadySpriteAnim.play("idle_" + hero.dir);
    }
    if (hero.state == HeroState.TASER_DISCHARGING)
    {
        hero.taseReadySpriteAnim.play("tase_" + hero.dir);
        anim = "idletaser";
    }

    hero.spriteAnim.play(anim + "_" + hero.dir);
}

function hero_taser_update(hero, dt)
{
    if(hero.state == HeroState.TASED || hero.state == HeroState.DISABLED)
    {
        hero.state = HeroState.DISABLED

        hero.disableTimer -= dt;

        if(hero.disableTimer < 0)
        {
            hero_respawn(hero);
        }
    }
}

function hero_respawn(hero)
{
    hero.state = HeroState.IDLE;
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
    if(hero.state != HeroState.DISABLED)
    {
        hero.state = HeroState.TASED;
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