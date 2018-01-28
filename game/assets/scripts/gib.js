var GIB_MIN_VELOCITY_X = 30;
var GIB_MAX_VELOCITY_X = 100;
var GIB_MIN_VELOCITY_Y = 100;
var GIB_MAX_VELOCITY_Y = 300;
var GIB_ANGULAR_SPEED = 300
var GIB_COLLISION_SIZE = 5;
var GIB_COUNT = 16;
var GIB_GRAVITY = 700;
var GIB_RESTITUTION = 0.5;

var gibs = [];
var gibTexture = getTexture("gib.png"); //TODO. they're not robots

function gib_create(_pos, _texture, _velocityX, _velocityY, _velocityZ, _angularSpeed) {

    var gib = {
        position: new Vector2(_pos),
        positionZ: 0,
        sourcePos: new Vector2(_pos),
        texture: _texture,
        velocityX: _velocityX,
        velocityY: _velocityY,
        velocityZ: _velocityZ,
        rotation: 0,
        angularSpeed: _angularSpeed,
        renderFn: gib_render,
        renderGlowFn: gib_renderGlow,
    };

    renderables.push(gib);

    return gib;
}

function gibs_spawn(_sourcePosition)
{
    splatter_create(_sourcePosition, getTexture("blood.png"));
    for (var i = 0; i < GIB_COUNT; ++i)
    {
        gibs.push(
            gib_create(
                _sourcePosition, 
                null, 
                Random.randNumber(-GIB_MAX_VELOCITY_X, GIB_MAX_VELOCITY_X),
                Random.randNumber(-GIB_MAX_VELOCITY_X, GIB_MAX_VELOCITY_X),
                Random.randNumber(GIB_MIN_VELOCITY_Y, GIB_MAX_VELOCITY_Y),
                Random.randNumber(-GIB_ANGULAR_SPEED, GIB_ANGULAR_SPEED)));
    }
    playSound("GGJ18SFX_PlayerExplode0" + Random.randInt(1, 3) + ".wav");
}

function gib_bounce(gib, h)
{
    gib.positionZ = h;
    gib.velocityX *= GIB_RESTITUTION; // BOING!
    gib.velocityY *= GIB_RESTITUTION; // BOING!
    gib.velocityZ *= -GIB_RESTITUTION; // BOING!
    gib.angularSpeed *= GIB_RESTITUTION; // BOING!

    if (gib.velocityZ < 5.0) // despawn if it doesn't bounce high enough
    {
        return false;
    }

    splatter_create(gib.position, getTexture("blood.png"));

    return true;
}

function gibs_update(dt) {

    for(var i = 0; i < gibs.length; ++i)
    {
        var gib = gibs[i];
        gib.velocityZ -= GIB_GRAVITY * dt;

        var nextPosition = new Vector2(
            gib.position.x + gib.velocityX * dt, 
            gib.position.y + gib.velocityY * dt);
        gib.positionZ += gib.velocityZ * dt;

        // Apply collision to the movement
        // if (gib.positionZ < 12)
        {
            gib.position = tiledMap.collision(gib.position, nextPosition, new Vector2(GIB_COLLISION_SIZE, GIB_COLLISION_SIZE));
        }
        //gib.position = nextPosition;

        gib.rotation += (gib.angularSpeed * dt);
        // if (gib.positionZ < 12 && !tiledMap.getCollision(Math.floor(gib.position.x / TILE_HEIGHT), Math.floor(gib.position.y / TILE_HEIGHT)))
        // {
        //     if (!gib_bounce(gib, 12))
        //     {
        //         for (var j = 0; j < renderables.length; ++j)
        //         {
        //             if (renderables[j]== gib)
        //             {
        //                 renderables.splice(j, 1);
        //             }
        //         }

        //         gibs.splice(i--, 1);
        //         continue;
        //     }
        // }
        if (gib.positionZ < 0)
        {
            if (!gib_bounce(gib, 0))
            {
                for (var j = 0; j < renderables.length; ++j)
                {
                    if (renderables[j]== gib)
                    {
                        renderables.splice(j, 1);
                    }
                }

                gibs.splice(i--, 1);
                continue;
            }
        }
    }
}

function gib_render(gib) {

    SpriteBatch.drawSprite(gibTexture, 
        new Vector2(gib.position.x, gib.position.y - gib.positionZ), 
        Color.WHITE, Math.round(gib.rotation / 90) * 90, 1.0);

}

function gib_renderGlow(gib) {
    // leave blank for now, unless you want the gibs to glow? lol
}