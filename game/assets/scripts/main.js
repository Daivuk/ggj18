var tiledMap = getTiledMap("arena.tmx");
var TILE_HEIGHT = tiledMap.getTileSize();

var cameraTransform = new Matrix();
var invCameraTransform = new Matrix();
var resolution = new Vector2(480, 272);

var heroes = [];
heroes.push(hero_create(0, new Vector2(6, 2).mul(TILE_HEIGHT).add(TILE_HEIGHT * 0.5), new Color(1, 0, 0, 1)));
heroes.push(hero_create(1, new Vector2(28, 1).mul(TILE_HEIGHT).add(TILE_HEIGHT * 0.5), new Color(0, 1, 0, 1)));
heroes.push(hero_create(2, new Vector2(28, 15).mul(TILE_HEIGHT).add(TILE_HEIGHT * 0.5), new Color(0, 0, 1, 1)));
heroes.push(hero_create(3, new Vector2(6, 14).mul(TILE_HEIGHT).add(TILE_HEIGHT * 0.5), new Color(1, 1, 0, 1)));

var bloomRT = Texture.createScreenRenderTarget();

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

function renderWorld()
{
    Renderer.setBlendMode(BlendMode.PREMULTIPLIED);
    Renderer.setFilterMode(FilterMode.NEAREST);

    SpriteBatch.begin(cameraTransform);
    SpriteBatch.setFilter(FilterMode.NEAREST);
    SpriteBatch.setBlend(BlendMode.PREMULTIPLIED);

    // Render the map
    tiledMap.renderLayer(0); // Ground
    tiledMap.renderLayer(1); // Walls

    for(var i = 0; i < 4; ++i)
    {
        hero_render(heroes[i]);
    }

    SpriteBatch.end();
}

function renderGlow()
{
    Renderer.setBlendMode(BlendMode.PREMULTIPLIED);
    Renderer.setFilterMode(FilterMode.NEAREST);
    
    SpriteBatch.begin(cameraTransform);
    SpriteBatch.setFilter(FilterMode.NEAREST);
    SpriteBatch.setBlend(BlendMode.PREMULTIPLIED);

    // Render the map
    tiledMap.renderLayer(2);

    for(var i = 0; i < 4; ++i)
    {
        hero_renderGlow(heroes[i]);
    }

    SpriteBatch.end();
}

function render()
{
    // Draw everything into the bloom first
    Renderer.pushRenderTarget(bloomRT);
    Renderer.clear(new Color(0, 0, 0, 1));
    renderGlow();
    Renderer.popRenderTarget();
    bloomRT.blur(16);

    // Draw the world on the main RT
    Renderer.clear(new Color(0, 0, 0, 1));
    renderWorld();

    // Apply the bloom on top
    SpriteBatch.begin();
    SpriteBatch.setFilter(FilterMode.LINEAR);
    SpriteBatch.setBlend(BlendMode.ADD);
    SpriteBatch.drawRect(bloomRT, new Rect(0, 0, Renderer.getResolution()), new Color(3));
    SpriteBatch.end();
}

function renderUI()
{
}
