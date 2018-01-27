var CENTER_TILE_PROXIMITY = 1.5;

var heroesInCentre = 0;

function map_update(dt)
{
    heroesInCentre = 0;

    for(var i = 0; i < heroes.length; ++i)
    {
        var hero = heroes[i];

        if(map_isInCentre(hero.position) && !hero.disabled)
        {
            heroesInCentre++;
        }
    }

    if(heroesInCentre < 2)
    {
        // Change visual state here
    }
}

function map_isInCentre(position)
{
    return Vector2.distance(position, CENTRE_POSITION) < CENTER_TILE_PROXIMITY * TILE_HEIGHT;
}