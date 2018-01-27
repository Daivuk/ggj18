var PICKUP_HERO_COLLISION_RADIUS = 0;
var MAX_PICKUPS = 4;
var PICKUP_SPAWN_INTERVAL_SEC = 5;
var CENTRE_POSITION = new Vector2(0, 0);

var pickupSpawnTime = PICKUP_SPAWN_INTERVAL_SEC;

var pickups = [];

function pickup_create(_pos)
{
    var pickup = {
        position: new Vector2(_pos),
    }

    return pickup;
}

function pickup_spawn()
{
    var foundSpot = false;
    var spawnPos = new Vector2(0, 0);

    while(!foundSpot)
    {
        var foundCollision = false;

        // Get a random tile spot
        var tileX = Math.round(Math.random() * tiledMap.getSize().x);
        var tileY = Math.round(Math.random() * tiledMap.getSize().y);

        // Get the actual spawn position for the pickup
        spawnPos.x = tileX * TILE_HEIGHT + HALF_TILE_HEIGHT;
        spawnPos.y = tileY * TILE_HEIGHT + HALF_TILE_HEIGHT;

        // Check for collision against the centre area
        if(Vector2.distance(CENTRE_POSITION, spawnPos) < 3 * TILE_HEIGHT)
        {
            continue;
        }

        // Check for collision against other pickups
        for(var i = 0; i < pickups.length; ++i)
        {
            if(Vector2.distanceSquared(pickups[i].position, spawnPos) < 0.001)
            {
                foundCollision = true;
                break;
            }
        }

        if(foundCollision)
        {
            continue;
        }

        // Make sure we don't spawn too close to a player
        for(var i = 0; i < heroes.length; ++i)
        {
            if(Vector2.distance(heroes[i].position, spawnPos) < PICKUP_HERO_COLLISION_RADIUS)
            {
                foundCollision = true;
                break;
            }
        }

        if(foundCollision)
        {
            continue;
        }

        // Returns true if we didn't collide with any walls in the map
        foundSpot = tiledMap.getCollision(tileX, tileY);
    }
    
    pickups.push(pickup_create(spawnPos));
}

function pickup_render(pickup)
{
    SpriteBatch.drawRect(null, new Rect(pickup.position.sub(new Vector2(5, 5)), new Vector2(10, 10)));
}

function pickups_render()
{
    for(var i = 0; i < pickups.length; ++i)
    {
        pickup_render(pickups[i]);
    }
}

function pickups_update(dt)
{
    pickupSpawnTime -= dt;

    if(pickupSpawnTime < 0)
    {
        if(pickups.length < MAX_PICKUPS)
        {
            pickup_spawn();
        }

        pickupSpawnTime = PICKUP_SPAWN_INTERVAL_SEC;
    }
}