var HERO_COLLISION_SIZE = 10;
var HERO_SPEED = 100;

var hacker = playSpriteAnim("hacker.spriteanim", "idle");

function hero_create(_index, _pos, _color)
{
    var hero = {
        index: _index,
        position: new Vector2(_pos),
        color: new Color(_color)
    };

    return hero;
}

function hero_render(hero)
{
    SpriteBatch.drawSpriteAnim(hacker, hero.position);
}

function hero_update(hero, dt)
{
    var nextPosition = new Vector2(hero.position.add(GamePad.getLeftThumb(hero.index).mul(dt * HERO_SPEED)));

    hero.position = tiledMap.collision(hero.position, nextPosition, new Vector2(HERO_COLLISION_SIZE, HERO_COLLISION_SIZE));
}