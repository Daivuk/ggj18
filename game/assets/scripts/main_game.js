function updateGame(dt)
{
    heroes_update(dt)

    pickups_update(dt);

    map_update(dt);
}

function renderGame()
{
    // Render the map
    tiledMap.renderLayer(0); // Ground
    tiledMap.renderLayer(1); // Walls

    // Draw entities
    renderables.sort(function(a, b){return a.position.y < b.position.y ? -1 : 1});
    for (var i = 0; i < renderables.length; ++i)
    {
        var entity = renderables[i];
        entity.renderFn(entity);
    }

}