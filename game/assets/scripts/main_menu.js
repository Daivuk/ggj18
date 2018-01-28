function updateMainMenu(dt)
{
    for(var i = 0; i < 4; ++i)
    {
        if(heroes[i].playing && GamePad.isJustDown(i, Button.START))
        {
            startGame()
            break;
        }

        if(GamePad.isJustDown(i, Button.A))
        {
            var hero = heroes[i];
            if(!hero.playing)
            {
                hero.playing = true;
            }
        }

        if(GamePad.isJustDown(i, Button.B))
        {
            var hero = heroes[i];
            if(hero.playing)
            {
                hero.playing = false;
            }
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

    for(var i = 0; i < heroes.length; ++i)
    {
        var hero = heroes[i];
        if(hero.playing)
        {
            playingPlayers++;
            hero_createNewMessage(hero);
            pickup_spawn(hero_getRandomEncryptedGlyph(hero));
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

    SpriteBatch.drawRect(null, new Rect(5 * TILE_HEIGHT, 0, 25 * TILE_HEIGHT, 17 * TILE_HEIGHT), new Color(0, 0, 0, 0.7));

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
    SpriteBatch.drawText(encryptedFont, "PRESS ^090A^999 TO JOIN", position, Vector2.TOP);

    if(heroesPlaying)
    {
        var position = new Vector2((resolution.x - 5 * TILE_HEIGHT) / 2 + 5 * TILE_HEIGHT, 150);
        SpriteBatch.drawText(encryptedFont, "PRESS START TO PLAY", position, Vector2.TOP);
    }
}