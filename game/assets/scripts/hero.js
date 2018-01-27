var HERO_COLLISION_SIZE = 10;
var HERO_SPEED = 50;

var hacker = playSpriteAnim("hacker.spriteanim", "idle");

function hero_create(_index, _pos, _color)
{
    var hero = {
        index: _index,
        position: new Vector2(_pos),
        color: new Color(_color)
    };

    hero.spriteAnim = playSpriteAnim("hacker.spriteanim", "idle_e");

    return hero;
}

function hero_render(hero)
{
    SpriteBatch.drawSpriteAnim(hero.spriteAnim, hero.position);
}

function hero_update(hero, dt)
{
    var leftThumb = GamePad.getLeftThumb(hero.index);

    // Get the next position according to thumb movement
    var nextPosition = new Vector2(hero.position.add(leftThumb.mul(dt * HERO_SPEED)));

    // Apply collision to the movement
    hero.position = tiledMap.collision(hero.position, nextPosition, new Vector2(HERO_COLLISION_SIZE, HERO_COLLISION_SIZE));

    // Point the character in the right direction
    if(Math.abs(leftThumb.x) > 0.001)
    {
        if(leftThumb.x > 0)
        {
            hero.spriteAnim.play("idle_e")
        }
        else
        {
            hero.spriteAnim.play("idle_w")
        }
    }
}