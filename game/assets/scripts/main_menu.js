function updateMainMenu(dt)
{
    for(var i = 0; i < 4; ++i)
    {
        var hero = heroes[i];

        if(hero.playing && isStartJustDown(i))
        {
            startGame()
            break;
        }

        if(isAJustDown(i))
        {
            if(!hero.playing)
            {
                hero.playing = true;
            }
            else
            {
                hero.spriteAnim.play("idletaser_e");
                playSound("GGJ18SFX_TaserOut.wav");
            }
        }

        
        if(isAJustUp(i))
        {
            hero.spriteAnim.play("idle_e");
        }

        if(isBJustDown(i))
        {
            if(hero.playing)
            {
                hero.playing = false;
            }
            
            hero.spriteAnim.play("idle_e");
        }
    }
}

function delayed_spawn(hero, delay)
{
    setTimeout(function()
    {
        hero_respawn(hero);
    }, delay * 1000);
}

var delays = [1, 1.5, 2, 2.5];

function startGame()
{
    var playingPlayers = 0;
    music_play("GG18musicB.ogg");
    
    for(var i = 0; i < heroes.length; ++i)
    {
        var hero = heroes[i];
        if(hero.playing)
        {
            playingPlayers++;
            hero_createNewMessage(hero);
        }

    }

    for (var i = 0; i < heroes.length; ++i)
    {
        if (heroes[i].playing && !hero_hasPickupAvailable(heroes[i]))
        {
            pickup_spawn(hero_getRandomEncryptedGlyph(heroes[i]));
        }
    }
    
    switch(playingPlayers)
    {
        case 1: HERO_INTERACTION_PROGRESS_MAX = 3;
        break;
        case 2: HERO_INTERACTION_PROGRESS_MAX = 2.5;
        break;
        case 3: HERO_INTERACTION_PROGRESS_MAX = 2.5;
        break;
        case 4: HERO_INTERACTION_PROGRESS_MAX = 2;
        break;
    }

    gameState = GameStateEnum.GAME

    for (var i = 0; i < heroes.length; ++i)
    {
        var hero = heroes[i];

        if(hero.playing)
        {
            /*var delayIndex = Random.getNext(delays.length);
            var delay = delays[delayIndex];
            delays.splice(delayIndex, 1);
            delayed_spawn(hero, delay);*/
            hero_respawn(hero);
        }
    }
}

function regenerateUniqueGlyphs(hero)
{
    uniqueGlyphs = ""
    //for(var i = 0; i < heroes.length; ++i)
    {
        if(hero.playing)
        {
            for(var j = 0; j < hero.glyphMap.length; ++j)
            {
                if (hero.glyphMap[j].encrypted !== ' ') {uniqueGlyphs += hero.glyphMap[j].encrypted;}
            }
        }
        hero.messageAppearTime = 0;
    }

    uniqueGlyphs = removeDuplicatesFromArray(uniqueGlyphs);

    pickups_clear();
}


function renderMainMenu()
{
    renderGame();

    SpriteBatch.drawRect(null, new Rect(5 * TILE_HEIGHT, 0, 25 * TILE_HEIGHT, 17 * TILE_HEIGHT), new Color(0, 0, 0, 0.9));

    var heroesPlaying = false;

    for (var i = 0; i < heroes.length; ++i)
    {
        var hero = heroes[i];

        if(hero.playing)
        {
            heroesPlaying = true;
            break;
        }
    }
    var position = new Vector2((resolution.x - 5 * TILE_HEIGHT) / 2 + 5 * TILE_HEIGHT, 100);

    SpriteBatch.drawText(encryptedFont, "MESSENGER HACKERS", new Vector2(position.x, 4), Vector2.TOP);
    SpriteBatch.drawText(encryptedFont, title.toUpperCase(), new Vector2(position.x, 4 + 12), Vector2.TOP);

    SpriteBatch.drawText(encryptedFont, "^777PRESS ^090A^777 TO JOIN", position, Vector2.TOP);
    position.y += 12;
    SpriteBatch.drawText(encryptedFont, "^777OR SPACE OR ENTER", position, Vector2.TOP);

    if(heroesPlaying)
    {
        var position = new Vector2((resolution.x - 5 * TILE_HEIGHT) / 2 + 5 * TILE_HEIGHT, 150);
        SpriteBatch.drawText(encryptedFont, "^777PRESS START OR F TO PLAY", position, Vector2.TOP);
    }
}

function renderMainMenuGLOW()
{
    var position = new Vector2((resolution.x - 5 * TILE_HEIGHT) / 2 + 5 * TILE_HEIGHT, 100);

    SpriteBatch.drawText(encryptedFont, "MESSENGER HACKERS", new Vector2(position.x, 4), Vector2.TOP, new Color(.5));
    SpriteBatch.drawText(encryptedFont, title.toUpperCase(), new Vector2(position.x, 4 + 12), Vector2.TOP, new Color(.5));
}
