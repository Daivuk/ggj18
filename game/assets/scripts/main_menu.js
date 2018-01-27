function updateMainMenu(dt)
{
    uniqueGlyphs = ""
    for(var i = 0; i < heroes.length; ++i)
    {
        var hero = heroes[i];
        hero_createNewMessage(hero);
        uniqueGlyphs += hero.displayMessage;
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
        uniqueGlyphs += hero.displayMessage;
    }

    uniqueGlyphs = removeDuplicatesFromArray(uniqueGlyphs);

    uniqueGlyphs = pickup_removeExistingFromArray(uniqueGlyphs);
}

function renderMainMenu()
{
    
}