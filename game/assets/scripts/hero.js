var HERO_COLLISION_SIZE = 10;
var HERO_SPEED = 60;
var HERO_PICKUP_OFFSET = new Vector2(0, 0);
var HERO_DISABLE_TIME = 5;
var HERO_TASER_USE_INTERVAL = 3;
var HERO_TASER_CHARGE_TIME = 1;
var HERO_TASER_PROXIMITY = 10;
var HERO_SPAWN_PROXIMITY = 0;
var HERO_SPAWN_CENTER_TILE_RADIUS = 7;
var HERO_INTERACTION_PROGRESS_MAX = 3.0;
var INTERACTION_BAR_WIDTH = 10;
var INTERACTION_BAR_HEIGHT = 3;
var HERO_SPAWN_TIME = .5;

var aCODE = ("a").charCodeAt();
var ACODE = ("A").charCodeAt();

var glowCircleTexture = getTexture("glowCircle.png")

var chevronAnim = playSpriteAnim("chevron.spriteanim", "idle");

var HeroState = {
    IDLE: 1,
    TASED: 2,
    TASER_CHARGING: 3,
    TASER_CHARGED: 4,
    TASER_DISCHARGING: 5,
    DISABLED: 6,
    ELECTROCUTED: 7,
    INTERACTING: 8,
    SPAWNING: 9,
    VOID: 10,
    MENU: 11
}

function hero_create(_index, _pos, _color)
{
    var hero = {
        index: _index,
        position: new Vector2(_pos),
        color: new Color(_color),
        dir: "w",
        taserCharge: 0,
        state: HeroState.MENU,
        disableTimer: 0,
        interactionProgress: 0,
        spriteAnim: playSpriteAnim("hacker" + _index + ".spriteanim", "idle_e"),
        taseReadySpriteAnim: playSpriteAnim("taseReady.spriteanim", "idle_e"),
        renderFn: hero_render,
        renderGlowFn: hero_renderGlow,
        points: 0,
        spawnTime: HERO_SPAWN_TIME,
        messageAppearTime: 0,
        playing: false,
        bounceAnim: 0
    };

    renderables.push(hero);

    return hero;
}

function hero_createNewMessage(hero) {

    var message = generateMessage(8);

    hero.glyphMap = []; // reset
    hero.displayMessage = ""; // reset

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
}

function hero_getRandomEncryptedGlyph(hero)
{
    if (hero_hasFullMessage(hero))
    {
        return '';
    }
    while(true)
    {
        var glyph = hero.displayMessage[Random.randInt(0, hero.displayMessage.length - 1)];
        if (glyph >= 'a' && glyph <= 'z')
        {
            return glyph;
        }
    }
}

function hero_revealGlyph(hero, glyph)
{
    var revealed = false;
    var hadFullMessage = hero_hasFullMessage(hero);
    for (var i = 0; i < hero.displayMessage.length; ++i)
    {
        if (hero.displayMessage[i] == glyph)
        {
            hero.displayMessage = hero.displayMessage.replaceAt(i, hero.glyphMap[i].decrypted);
            hero.glyphMap[i].color.playSingle(Color.WHITE, hero.color.mul(.5), 3, Tween.EASE_IN);
            revealed = true;
            break; // only reveal one glyph at a time.
        }
    }

    if (hero_hasFullMessage(hero) && !hadFullMessage)
    {
        playSound("GGJ18SFX_FullyDecoded.wav");
    }

    return revealed;
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
    if (hero.state == HeroState.DISABLED ||
        hero.state == HeroState.VOID ||
        hero.state == HeroState.MENU)
    {
        return;
    }

    var percent = (hero.bounceAnim * 10) % 2;
    if (percent > 1) percent = 1 - (percent - 1);
    percent = 1 - (1 - percent) * (1 - percent);
    SpriteBatch.drawSpriteAnim(hero.spriteAnim, 
        new Vector2(hero.position.x, hero.position.y));

    if (hero.state == HeroState.TASER_CHARGED)
    {
        SpriteBatch.drawSpriteAnim(hero.taseReadySpriteAnim, hero_getTaserPos(hero));
    }
    if (hero.state == HeroState.TASER_DISCHARGING)
    {
        SpriteBatch.drawSpriteAnim(hero.taseReadySpriteAnim, hero_getTaserPos(hero), Color.WHITE, 0, 2);
    }
    if (hero.state == HeroState.INTERACTING)
    {
        var barPosition = new Vector2(17 * TILE_HEIGHT + 3, 8 * TILE_HEIGHT);
        var barSize = new Vector2(INTERACTION_BAR_WIDTH * hero.interactionProgress / HERO_INTERACTION_PROGRESS_MAX, INTERACTION_BAR_HEIGHT);
        SpriteBatch.drawRect(null, new Rect(barPosition, barSize), new Color(0, 1, 1, 1));
    }

    if (hero.state == HeroState.SPAWNING)
    {
        var invPercent = hero.spawnTime / HERO_SPAWN_TIME;
        var percent = 1 - invPercent;
        SpriteBatch.drawBeam(null, hero.position, 
            new Vector2(hero.position.x, hero.position.y - 1000),
            percent * 8, hero.color.mul(invPercent));
    }
}

function hero_drawHUD(hero)
{
    var blockY = (resolution.y / 4) * hero.index - 4;
    if(gameState != GameStateEnum.MAIN_MENU && hero.playing)
    {
        var x = 0;
        var y = blockY;

        var count = [0, 0];
        var countI = 0;
        for (var i = 0; i < hero.glyphMap.length; ++i)
        {
            if (hero.displayMessage[i] == " ")
            {
                ++countI;
                continue;
            }
            count[countI]++;
        }
        var offsetX = 40 - (count[0] * 14 / 2);
        for (var i = 0; i < hero.glyphMap.length; ++i)
        {
            if (hero.displayMessage[i] == " ")
            {
                y += 14;
                x = 0;
                offsetX = 40 - (count[1] * 14 / 2);
                continue;
            }
            var percent = (hero.messageAppearTime) - i;
            var char;
            if (percent > 0)
            {
                percent = Math.min(1, percent / 2);
                var invPercent = 1 - percent;
                var code = hero.displayMessage[i].charCodeAt();
                if (code >= aCODE && code <= "z".charCodeAt())
                    char = String.fromCharCode(((code - aCODE) + 26 * invPercent) % 26 + aCODE);
                else if (code >= ACODE && code <= "Z".charCodeAt())
                    char = String.fromCharCode(((code - ACODE) + 26 * invPercent) % 26 + ACODE);
                SpriteBatch.drawText(
                    encryptedFont, 
                    char, 
                    new Vector2(offsetX + x + 2, 4 + y + 2), 
                    Vector2.TOP_LEFT, 
                    Color.BLACK);
                SpriteBatch.drawText(
                    encryptedFont, 
                    char, 
                    new Vector2(offsetX + x, 4 + y), 
                    Vector2.TOP_LEFT, 
                    hero.glyphMap[i].color.get());
            }
            x += 14;
        }
    }

    if (hero.state == HeroState.DISABLED ||
        hero.state == HeroState.VOID)
    {
        return;
    }

    var heroBrightness = hero.playing ? 1.0 : 0.5;
    SpriteBatch.drawSpriteAnim(hero.spriteAnim, new Vector2(40, 60 + blockY), new Color(heroBrightness, heroBrightness, heroBrightness, 1), 0, 1.5);

    for (var i = 0; i < hero.points; ++i)
    {
        SpriteBatch.drawSpriteAnim(chevronAnim, new Vector2(16, 46 + blockY + i * 8));
    }
}

function hero_drawGLOW(hero)
{
    var hasWord = hero_hasFullMessage(hero);
    var blockY = (resolution.y / 4) * hero.index - 4;
    var x = 0;
    var y = blockY;

    var count = [0, 0];
    var countI = 0;
    for (var i = 0; i < hero.glyphMap.length; ++i)
    {
        if (hero.displayMessage[i] == " ")
        {
            ++countI;
            continue;
        }
        count[countI]++;
    }
    var offsetX = 40 - (count[0] * 14 / 2);
    for (var i = 0; i < hero.glyphMap.length; ++i)
    {
        if (hero.displayMessage[i] == " ")
        {
            y += 14;
            x = 0;
            offsetX = 40 - (count[1] * 14 / 2);
            continue;
        }

        var percent = (hero.messageAppearTime) - i;
        var char;
        if (percent > 0)
        {
            percent = Math.min(1, percent / 2);
            var invPercent = 1 - percent;
            var code = hero.displayMessage[i].charCodeAt();
            if (code >= aCODE && code <= "z".charCodeAt())
                char = String.fromCharCode(((code - aCODE) + 26 * invPercent) % 26 + aCODE);
            else if (code >= ACODE && code <= "Z".charCodeAt())
                char = String.fromCharCode(((code - ACODE) + 26 * invPercent) % 26 + ACODE);
            SpriteBatch.drawText(
                encryptedFont, 
                char, 
                new Vector2(offsetX + x, 4 + y), 
                Vector2.TOP_LEFT, 
                hero.glyphMap[i].color.get().mul(invPercent));
        }

        if (hero.glyphMap[i].color.isPlaying() || hasWord)
        {
            SpriteBatch.drawText(
                encryptedFont, 
                hero.displayMessage[i], 
                new Vector2(offsetX + x, 4 + y), 
                Vector2.TOP_LEFT, 
                hero.glyphMap[i].color.get().mul(.5));
        }

        x += 14;
    }

    if (hero.state == HeroState.INTERACTING)
    {
        var barPosition = new Vector2(17 * TILE_HEIGHT + 3, 8 * TILE_HEIGHT);
        var barSize = new Vector2(INTERACTION_BAR_WIDTH * hero.interactionProgress / HERO_INTERACTION_PROGRESS_MAX, INTERACTION_BAR_HEIGHT);
        SpriteBatch.drawRect(null, new Rect(barPosition, barSize), new Color(0, 1, 1, 1));
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
    if (hero.state == HeroState.DISABLED ||
        hero.state == HeroState.VOID ||
        !hero.playing)
    {
        return;
    }

    SpriteBatch.drawSprite(glowCircleTexture, new Vector2(hero.position.x, hero.position.y + 2), hero.color);

    SpriteBatch.drawSpriteAnim(hero.spriteAnim, hero.position, Color.BLACK);

    if (hero.state == HeroState.TASER_CHARGED)
    {
        SpriteBatch.drawSpriteAnim(hero.taseReadySpriteAnim, hero_getTaserPos(hero), new Color(.5));
    }
    if (hero.state == HeroState.TASER_DISCHARGING)
    {
        SpriteBatch.drawSpriteAnim(hero.taseReadySpriteAnim, hero_getTaserPos(hero), new Color(.5), 0, 2);
    }

    if (hero.state == HeroState.SPAWNING)
    {
        var invPercent = hero.spawnTime / HERO_SPAWN_TIME;
        var percent = 1 - invPercent;
        SpriteBatch.drawBeam(null, hero.position, 
            new Vector2(hero.position.x, hero.position.y - 1000),
            percent * 4, hero.color.mul(invPercent));
    }
}

function hero_update(hero, dt)
{
    if (hero.state != HeroState.INTERACTING)
    {
        if (hero.transmissionSound)
        {
            hero.transmissionSound.stop();
            hero.transmissionSound = null;
        }
    }
    if (hero.state == HeroState.SPAWNING)
    {
        hero.spawnTime -= dt;
        if (hero.spawnTime <= 0)
        {
            hero.state = HeroState.IDLE;
        }
        return;
    }
    if (hero.state == HeroState.DISABLED ||
        hero.state == HeroState.ELECTROCUTED ||
        hero.state == HeroState.VOID)
    {
        return;
    }

    var lastMessageAppearTime = hero.messageAppearTime;
    hero.messageAppearTime += dt * 8;
    if (hero.messageAppearTime <= hero.glyphMap.length)
    {
        if (Math.floor(lastMessageAppearTime) < Math.floor(hero.messageAppearTime))
        {
            playSound("GGJ18SFX_InfoSpawn0" + Random.randInt(1, 4) + ".wav");
        }
    }

    var leftThumb = GamePad.getLeftThumb(hero.index);
    
    if(hero.state == HeroState.INTERACTING)
    {
        if(GamePad.isDown(hero.index, Button.X) && centerReady)
        {
            hero.interactionProgress += dt;

            if(hero.interactionProgress > HERO_INTERACTION_PROGRESS_MAX)
            {
                hero.state = HeroState.IDLE;

                hero_interactionSuccess(hero);
            }
        }
        else
        {
            hero.interactionProgress = 0;

            hero.state = HeroState.IDLE;
        }
    }
    else
    {
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
                if (hero_revealGlyph(hero, pickup.glyph)) // if the hero picked up a glyph he/she needs...
                {
                    var glyph = hero_getRandomEncryptedGlyph(hero);
                    if (glyph != '')
                    {
                        pickup_spawn(glyph);
                    }
                }   
                else // or else, put it back to the game (anywhere else)
                {
                    pickup_spawn(pickup.glyph);
                }                 
            }
        }

        hero_handle_taser(hero, dt);
        

        // Handle interacting with the transmitter
        if(GamePad.isJustDown(hero.index, Button.X) && heroesInCentre < 2 && map_isInCentre(hero.position) && hero_hasFullMessage(hero))
        {
            hero.state = HeroState.INTERACTING;
            playSound("GGJ18SFX_TransmissionStart.wav");
            hero.transmissionSound = getSound("GGJ18SFX_TransmissionLoop.wav").createInstance();
            hero.transmissionSound.setLoop(true);
            hero.transmissionSound.play();
        }

        if(GamePad.isJustDown(hero.index, Button.Y))
        {
            // Add cheats here
            
            //gibs_spawn(hero.position);
            hero.displayMessage = hero.displayMessage.toUpperCase();
        }
    }

    // Pick anim
    var anim = "idle";

    if(hero.state != HeroState.INTERACTING)
    {
        if (leftThumb.length() > 0.1)
        {
            anim = "run";
        }

        if (hero.state == HeroState.TASER_CHARGED ||
            hero.state == HeroState.TASER_CHARGING ||
            hero.state == HeroState.TASER_DISCHARGING)
            anim += "taser";
    }

    if (anim == "run" || anim == "runtaser") hero.bounceAnim += dt;
    else hero.bounceAnim = 0;

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

function hero_handle_taser(hero, dt)
{
    // Handle taser
    switch (hero.state)
    {
        case HeroState.IDLE:
        {
            if (GamePad.isDown(hero.index, Button.A))
            {
                hero.state = HeroState.TASER_CHARGING;
                playSound("GGJ18SFX_TaserOut.wav");
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
                    playSound("GGJ18SFX_TaserCharged.wav");
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
    
                        if(!otherHero.playing)
                        {
                            continue;
                        }

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
                playSound("GGJ18SFX_TaserFire.wav");
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
}

function hero_taser_update(hero, dt)
{
    if( hero.state == HeroState.TASED || hero.state == HeroState.DISABLED || 
        hero.state == HeroState.ELECTROCUTED)
    {
        if (hero.state == HeroState.TASED)
        {
            playSound("GGJ18SFX_PlayerElectrocutedShort.wav");
            //hero.electrocuteSound = getSound("GGJ18SFX_PlayerElectrocuted.wav").createInstance();
            //hero.electrocuteSound.play();
            hero.spriteAnim = playSpriteAnim("electrocute.spriteanim", "idle");
            hero.state = HeroState.ELECTROCUTED;
            return;
        }

        hero.disableTimer -= dt;

        if (hero.state == HeroState.ELECTROCUTED)
        {
            if(hero.disableTimer > HERO_DISABLE_TIME - 1)
            {
                return;
            }
            else
            {
                //hero.electrocuteSound.stop();
                //hero.electrocuteSound = null;
                gibs_spawn(hero.position);
            }
        }

        hero.state = HeroState.DISABLED;

        if(hero.disableTimer < 0)
        {
            hero_respawn(hero);
        }
    }
}

function hero_interactionSuccess(hero)
{
    for (var i = 0; i < hero.displayMessage.length; ++i)
    {
        if (hero.displayMessage[i] == " ")
        {
            continue;
        }
        flyingSymbols.push({
            glyph: hero.displayMessage[i],
            xOffset: Random.randNumber(-16, 16),
            delay: i * .1,
            progress: 0
        });
    }

    if (hero.transmissionSound)
    {
        hero.transmissionSound.stop();
        hero.transmissionSound = null;
    }
    playSound("GGJ18SFX_TransmissionComplete.wav");

    hero_createNewMessage(hero);

    regenerateUniqueGlyphs(hero);

    for (var i = 0; i < heroes.length; ++i)
    {
        if (heroes[i].playing) 
        {
            pickup_spawn(hero_getRandomEncryptedGlyph(heroes[i]));
        }
    }

    hero.interactionProgress = 0;
    
    hero.points++;

    print("hero " + hero.index + " now has " + hero.points + " points");

    transmissionEffectTimer = 1;
}

function hero_respawn(hero)
{
    playSound("GGJ18SFX_PlayerRespawn.wav");

    hero.taserCharge = 0;
    hero.state = HeroState.SPAWNING;
    hero.disableTimer = HERO_DISABLE_TIME;
    hero.spriteAnim = playSpriteAnim("hacker" + hero.index + ".spriteanim", "idle_e");
    hero.taseReadySpriteAnim = playSpriteAnim("taseReady.spriteanim", "idle_e");
    hero.interactionProgress = 0;
    hero.spawnTime = HERO_SPAWN_TIME;
    hero.messageAppearTime = 0;

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
        var hero = heroes[i];
        if(hero.playing)
        {
            hero_update(hero, dt);
        }
    }

    for(var i = 0; i < heroes.length; ++i)
    {
        var hero = heroes[i];
        if(hero.playing)
        {
            hero_taser_update(heroes[i], dt);
        }
    }
}

function hero_collision(position, radius)
{
    for(var i = 0; i < heroes.length; ++i)
    {
        var hero = heroes[i];
        if(!hero.playing)
        {
            continue;
        }
        
        if(Vector2.distance(hero.position, position) < radius)
        {
            return true;
        }
    }

    return false;
}
