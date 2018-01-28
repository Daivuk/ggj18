function updateMainMenu(dt)
{
    uniqueGlyphs = ""
    for(var i = 0; i < heroes.length; ++i)
    {
        var hero = heroes[i];
        hero_createNewMessage(hero);

        for(var j = 0; j < hero.glyphMap.length; ++j)
        {
            if (hero.glyphMap[j].encrypted !== ' ') {uniqueGlyphs += hero.glyphMap[j].encrypted;}
        }
    }

    uniqueGlyphs = removeDuplicatesFromArray(uniqueGlyphs);

    gameState = GameStateEnum.GAME
}

function regenerateUniqueGlyphs()
{
    uniqueGlyphs = ""
    for(var i = 0; i < heroes.length; ++i)
    {
        var hero = heroes[i];
        for(var j = 0; j < hero.glyphMap.length; ++j)
        {
            if (hero.glyphMap[j].encrypted !== ' ') {uniqueGlyphs += hero.glyphMap[j].encrypted;}
        }
    }

    uniqueGlyphs = removeDuplicatesFromArray(uniqueGlyphs);

    pickups_clear();
}

function renderMainMenu()
{
    
}