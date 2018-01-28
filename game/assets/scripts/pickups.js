var PICKUP_HERO_COLLISION_TILE_RADIUS = 2;
var MAX_PICKUPS = 4;
var PICKUP_SPAWN_INTERVAL_SEC = 1;
var ACQUIRE_RADIUS = 10;
var PICKUP_CENTER_SPAWN_TILE_RADIUS = 3;

var circuitTexture = getTexture("circuit.png");
var pickupColor = Color.fromHexRGB(0xa1ef79);
var glyphTexture = getTexture("sga.png");


var pickupSpawnTime = PICKUP_SPAWN_INTERVAL_SEC;

var pickups = [];
var uniqueGlyphs;


/*
function pickup_create(_pos)
{
    if (uniqueGlyphs.length == 0)
    {
        print("OUT OF UNIQUE GLYPHS!!")
        return null;
    }

    var glyphIndex = Random.randInt(0, uniqueGlyphs.length - 1);

    var pickup = {
        position: new Vector2(_pos),
        glyph: uniqueGlyphs[glyphIndex],
        floatAnim: new NumberAnim(),
        renderFn: pickup_render,
        renderGlowFn: pickup_renderGlow,
    }

    var charIndex = pickup.glyph.charCodeAt() - ("a").charCodeAt();
    var x = charIndex >= 13 ? (charIndex - 13) : charIndex;
    var y = charIndex >= 13 ? .5 : 0;
    pickup.uvs = new Vector4(x / 13, y, (x + 1) / 13, y + .25);

    uniqueGlyphs = uniqueGlyphs.replaceAt(glyphIndex, '');

    pickup.floatAnim.playSingle(-2, 2, .45, Tween.EASE_BOTH, Loop.PING_PONG_LOOP);


    renderables.push(pickup);

    return pickup;
}
*/

function pickup_create(_pos, glyph)
{
    var pickup = {
        position: new Vector2(_pos),
        glyph: glyph,
        floatAnim: new NumberAnim(),
        renderFn: pickup_render,
        renderGlowFn: pickup_renderGlow,
    }

    var charIndex = pickup.glyph.charCodeAt() - ("a").charCodeAt();
    var x = charIndex >= 13 ? (charIndex - 13) : charIndex;
    var y = charIndex >= 13 ? .5 : 0;
    pickup.uvs = new Vector4(x / 13, y, (x + 1) / 13, y + .25);
    
    pickup.floatAnim.playSingle(-2, 2, .45, Tween.EASE_BOTH, Loop.PING_PONG_LOOP);

    renderables.push(pickup);

    return pickup;
}

function pickup_spawn(glyph)
{
    var foundSpot = false;
    var spawnPos = new Vector2(0, 0);

    while(!foundSpot)
    {
        var foundCollision = false;

        // Get a random tile spot
        var tileX = Random.randInt(0, tiledMap.getSize().x);
        var tileY = Random.randInt(0, tiledMap.getSize().y);

        // Get the actual spawn position for the pickup
        spawnPos.x = tileX * TILE_HEIGHT + HALF_TILE_HEIGHT;
        spawnPos.y = tileY * TILE_HEIGHT + HALF_TILE_HEIGHT;

        // Check for collision against the centre area
        if(Vector2.distance(CENTRE_POSITION, spawnPos) < PICKUP_CENTER_SPAWN_TILE_RADIUS * TILE_HEIGHT)
        {
            continue;
        }

        // Check for collision against other pickups
        foundCollision = pickup_collision(spawnPos, 0.001);
        
        if(foundCollision)
        {
            continue;
        }

        // Make sure we don't spawn too close to a player
        foundCollision = hero_collision(spawnPos, PICKUP_HERO_COLLISION_TILE_RADIUS * TILE_HEIGHT);

        if(foundCollision)
        {
            continue;
        }

        // Returns true if we didn't collide with any walls in the map
        foundSpot = tiledMap.getCollision(tileX, tileY);
    }
    
    var pickup = pickup_create(spawnPos, glyph);

    if (pickup)
    {
        pickups.push(pickup);
        playSound("GGJ18SFX_InfoSpawn0" + Random.randInt(1, 4) + ".wav", .25);
    }

}

function pickups_clear()
{
    for(var i = 0; i < pickups.length; ++i)
    {
        for(var r = 0; r < renderables.length; ++r)
        {
            if(pickups[i] == renderables[r])
            {
                renderables.splice(r, 1);
                break;
            }
        }
    }
    
    pickups = [];
}

function pickup_getDrawPosition(pickup)
{
    var ret = new Vector2(pickup.position.x, pickup.position.y + pickup.floatAnim.get());
    // ret.x = Math.round(ret.x);
    // ret.y = Math.round(ret.y);
    return ret;
}

function pickup_render(pickup)
{
    var pos = pickup_getDrawPosition(pickup);

    SpriteBatch.drawSprite(circuitTexture, pos);
    SpriteBatch.drawSpriteWithUVs(glyphTexture, pos, pickup.uvs, pickupColor);
}

function pickup_renderGlow(pickup)
{
    var pos = pickup_getDrawPosition(pickup);

    SpriteBatch.drawSprite(circuitTexture, pos, Color.BLACK);
    SpriteBatch.drawSpriteWithUVs(glyphTexture, pos, pickup.uvs, pickupColor.mul(.5));
}

function pickups_update(dt)
{
    /*
    pickupSpawnTime -= dt;

    if(pickupSpawnTime < 0)
    {
        if(uniqueGlyphs.length > 0 && pickups.length < MAX_PICKUPS)
        {
            pickup_spawn();
        }

        pickupSpawnTime = PICKUP_SPAWN_INTERVAL_SEC;
    }
    */
}

function pickups_acquire(position)
{
    var collisionIndex = -1;

    // Check for collision against other pickups
    for(var i = 0; i < pickups.length; ++i)
    {
        if(Vector2.distance(pickups[i].position, position) < ACQUIRE_RADIUS)
        {
            var pickup = pickups.splice(i, 1)[0];

            playSound("GGJ18SFX_CollectDecode0" + Random.randInt(1, 4) + ".wav");

            // remove from renderables since it has been acquired by the hero
            for(var j = 0; j < renderables.length; ++j)
            {
                if (renderables[j] == pickup)
                {
                    renderables.splice(j, 1);
                    break;
                }
            }

            uniqueGlyphs += pickup.glyph;

            return pickup;
        }
    }

    return null;
}

function pickup_collision(position, radius)
{
    for(var i = 0; i < pickups.length; ++i)
    {
        if(Vector2.distance(pickups[i].position, position) < radius)
        {
            return true;
        }
    }
    
    return false;
}
