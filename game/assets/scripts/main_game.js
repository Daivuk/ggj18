function updateGame(dt)
{
    heroes_update(dt)

    pickups_update(dt);

    splatters_update(dt);

    map_update(dt);

    gibs_update(dt);
}

function renderGame()
{
    // Render the map
    tiledMap.renderLayer(0); // Ground

    splatters_render(); // Blood

    tiledMap.renderLayer(1); // Walls

    // Draw entities
    renderables.sort(function(a, b){return a.position.y < b.position.y ? -1 : 1});
    for (var i = 0; i < renderables.length; ++i)
    {
        var entity = renderables[i];
        entity.renderFn(entity);
    }

    // hud
    for (var i = 0; i < heroes.length; ++i)
    {
        var hero = heroes[i];
        hero_drawHUD(hero);
    }
}

function renderGameGlow()
{
    // Render the map
    map_renderGlow();

    for(var i = 0; i < renderables.length; ++i)
    {
        var entity = renderables[i];
        entity.renderGlowFn(entity);
    }
}
