var tiledMap = getTiledMap("arena.tmx");
var cameraTransform = new Matrix();
var invCameraTransform = new Matrix();
var resolution = new Vector2(560, 304);

function updateCamera()
{
    // Fit the map into the display
    var screenRes = Renderer.getResolution();
    var scale = screenRes.x / resolution.x;
    var newH = resolution.y * scale;
    var diffH = screenRes.y - newH;
    cameraTransform = 
        Matrix.createTranslation(new Vector3(0, diffH / scale / 2, 0)).mul(
        Matrix.createScale(new Vector3(scale, scale, 1)));
}

function update(dt)
{
    // Quit game with escape
    if (Input.isJustDown(Key.ESCAPE)) quit();

    updateCamera();
}

var hacker = playSpriteAnim("hacker.spriteanim", "idle");

function render()
{
    Renderer.clear(new Color(0, 0, 0, 1));

    SpriteBatch.begin(cameraTransform);
    SpriteBatch.setFilter(FilterMode.NEAREST);

    // Render the map
    tiledMap.render();

    SpriteBatch.drawSpriteAnim(hacker, new Vector2(100, 100));

    SpriteBatch.end();
}

function renderUI()
{
}
