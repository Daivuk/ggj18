function updateGame(dt)
{
    for(var i = 0; i < heroes.length; ++i)
    {
        var hero = heroes[i];
        hero_update(hero, dt);
    }
}

function renderGame()
{
    // Render the map
    tiledMap.renderLayer(0); // Ground
    tiledMap.renderLayer(1); // Walls

    for(var i = 0; i < heroes.length; ++i)
    {
        var hero = heroes[i];
        hero_render(hero);
    }
}