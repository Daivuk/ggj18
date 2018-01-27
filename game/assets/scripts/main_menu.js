function updateMainMenu(dt)
{

    for(var i = 0; i < heroes.length; ++i)
    {
        var hero = heroes[i];
        hero_createNewMessage(hero);
    }

    gameState = GameStateEnum.GAME
}

function renderMainMenu()
{
    
}