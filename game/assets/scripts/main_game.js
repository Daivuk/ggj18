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

    pickups_render();

    heroes_render();
}