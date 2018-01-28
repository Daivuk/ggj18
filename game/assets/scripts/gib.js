var GIB_MIN_VELOCITY_X = 30;
var GIB_MAX_VELOCITY_X = 300;
var GIB_MIN_VELOCITY_Y = 300;
var GIB_MAX_VELOCITY_Y = 500;
var GIB_ANGULAR_SPEED = 300
var GIB_COLLISION_SIZE = 5;
var GIB_COUNT = 16;
var GIB_GRAVITY = 10;
var GIB_RESTITUTION = 0.666;

var gibs = [];
var gibTexture = getTexture("circuit.png"); //TODO. they're not robots

function gib_create(_pos, _texture, _velocityX, _velocityY, _angularSpeed) {

    var gib = {
        position: new Vector2(_pos),
        sourcePos: new Vector2(_pos),
        texture: _texture,
        velocityX: _velocityX,
        velocityY: _velocityY,
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
    for (var i = 0; i < GIB_COUNT; ++i)
    {
        if (i % 2 == 0)
        {
            gibs.push(
                gib_create(
                    _sourcePosition, 
                    null, 
                    Random.randInt(GIB_MIN_VELOCITY_X, GIB_MAX_VELOCITY_X),
                    -Random.randInt(GIB_MIN_VELOCITY_Y, GIB_MAX_VELOCITY_Y),
                    GIB_ANGULAR_SPEED));        
        }
        else 
        {
            gibs.push(
                gib_create(
                    _sourcePosition, 
                    null, 
                    -Random.randInt(GIB_MIN_VELOCITY_X, GIB_MAX_VELOCITY_X),
                    -Random.randInt(GIB_MIN_VELOCITY_Y, GIB_MAX_VELOCITY_Y),
                    -GIB_ANGULAR_SPEED));        
        }
    }
}

function gibs_update(dt) {

    for(var i = 0; i < gibs.length; ++i)
    {
        var gib = gibs[i];
        gib.velocityY += GIB_GRAVITY;

        var nextPosition = new Vector2(gib.position.x + gib.velocityX * dt, gib.position.y + gib.velocityY * dt);

        // Apply collision to the movement
        //gib.position = tiledMap.collision(gib.position, nextPosition, new Vector2(GIB_COLLISION_SIZE, GIB_COLLISION_SIZE));
        gib.position = nextPosition;

        gib.rotation += (gib.angularSpeed * dt);
        if (gib.position.y > gib.sourcePos.y)
        {
            gib.velocityY *= -GIB_RESTITUTION; // BOING!

            if (gib.velocityY < 5.0 && gib.velocityY > -5.0) // despawn if it doesn't bounce high enough
            {                
                for (var i = 0; i < renderables.length; ++i)
                {
                    if (renderables[i]== gib)
                    {
                        renderables.splice(i, 1);
                    }
                }

                for (var i = 0; i < gibs.length; ++i)
                {
                    if (gibs[i]== gib)
                    {
                        gibs.splice(i, 1);
                    }
                }
            }
        }
    }
}

function gib_render(gib) {

    SpriteBatch.drawSprite(gibTexture, gib.position, Color.WHITE, gib.rotation, 1.0);

}

function gib_renderGlow(gib) {
    // leave blank for now, unless you want the gibs to glow? lol
}