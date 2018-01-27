var TILE_HEIGHT = 16;

var heroes = [];
heroes.push(hero_create(0, new Vector2(6, 1).mul(TILE_HEIGHT).add(TILE_HEIGHT * 0.5), new Color(1, 0, 0, 1)));
heroes.push(hero_create(1, new Vector2(28, 1).mul(TILE_HEIGHT).add(TILE_HEIGHT * 0.5), new Color(0, 1, 0, 1)));
heroes.push(hero_create(2, new Vector2(28, 16).mul(TILE_HEIGHT).add(TILE_HEIGHT * 0.5), new Color(0, 0, 1, 1)));
heroes.push(hero_create(3, new Vector2(6, 17).mul(TILE_HEIGHT).add(TILE_HEIGHT * 0.5), new Color(1, 1, 0, 1)));

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

    for(var i = 0; i < 4; ++i)
    {
        hero_update(heroes[i], dt);
    }
}

function render()
{
    Renderer.clear(new Color(0, 0, 0, 1));

    SpriteBatch.begin(cameraTransform);
    SpriteBatch.setFilter(FilterMode.NEAREST);

    // Render the map
    tiledMap.render();

    for(var i = 0; i < 4; ++i)
    {
        hero_render(heroes[i]);
    }

    SpriteBatch.end();
}

function renderUI()
{
}
