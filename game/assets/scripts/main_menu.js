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
    for(var i = 0; i < heroes.length; ++i)
    {
        var hero = heroes[i];
        if(hero.playing)
        {
            hero_createNewMessage(hero);
        }
    }

    regenerateUniqueGlyphs();

    gameState = GameStateEnum.GAME

    for (var i = 0; i < heroes.length; ++i)
    {
        var hero = heroes[i];

        if(hero.playing)
        {
            var delayIndex = Random.getNext(delays.length);
            var delay = delays[delayIndex];
            delays.splice(delayIndex, 1);
            delayed_spawn(hero, delay);
        }
    }
}

function regenerateUniqueGlyphs()
{
    uniqueGlyphs = ""
    for(var i = 0; i < heroes.length; ++i)
    {
        var hero = heroes[i];

        if(hero.playing)
        {
            for(var j = 0; j < hero.glyphMap.length; ++j)
            {
                if (hero.glyphMap[j].encrypted !== ' ') {uniqueGlyphs += hero.glyphMap[j].encrypted;}
            }
        }
    }

    uniqueGlyphs = removeDuplicatesFromArray(uniqueGlyphs);

    pickups_clear();
}

function renderMainMenu()
{
    renderGame();
}