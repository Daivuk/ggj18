function glyph_create(value)
{
    var glyph = {
        index: _index,
        position: new Vector2(_pos),
        color: new Color(_color),
        dir: "w"
    };

    hero.spriteAnim = playSpriteAnim("hacker" + _index + ".spriteanim", "idle_e");

    return hero;
}