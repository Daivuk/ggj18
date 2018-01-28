Random.randomizeSeed(); // QBASIC equivalent: RANDOMIZE TIMER

var GameStateEnum = {
    INIT: 1,
    MAIN_MENU: 2,
    GAME: 3,
    END_GAME: 4
};

var gameState = GameStateEnum.INIT;

var renderables = [];

var tiledMap = getTiledMap("arena.tmx");
var TILE_HEIGHT = tiledMap.getTileSize();
var HALF_TILE_HEIGHT = TILE_HEIGHT * 0.5;
var CENTRE_POSITION = new Vector2(17 * TILE_HEIGHT + HALF_TILE_HEIGHT, 8 * TILE_HEIGHT + HALF_TILE_HEIGHT);

var cameraTransform = new Matrix();
var invCameraTransform = new Matrix();
var resolution = new Vector2(480, 272);

var heroes = [
    hero_create(0, new Vector2(6, 2).mul(TILE_HEIGHT).add(HALF_TILE_HEIGHT), Color.fromHexRGB(0x007dc7)),
    hero_create(1, new Vector2(28, 1).mul(TILE_HEIGHT).add(HALF_TILE_HEIGHT), Color.fromHexRGB(0x3fc778)),
    hero_create(2, new Vector2(28, 15).mul(TILE_HEIGHT).add(HALF_TILE_HEIGHT), Color.fromHexRGB(0xffce00)),
    hero_create(3, new Vector2(6, 14).mul(TILE_HEIGHT).add(HALF_TILE_HEIGHT), Color.fromHexRGB(0xff8b9c))
];

var mainRT = Texture.createScreenRenderTarget();
var bloomRT = Texture.createScreenRenderTarget();

var encryptedFont = getFont("sga.fnt");
var encryptedMessage;

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

    // always update the camera regardless of the state.
    updateCamera();

    switch(gameState)
    {
        case GameStateEnum.INIT:
            updateInit(dt);
            break;
        case GameStateEnum.MAIN_MENU:
            updateMainMenu(dt);
            break;
        case GameStateEnum.GAME:
            updateGame(dt);
            break;
        case GameStateEnum.END_GAME:
            updateEndGame(dt);
            break;
        default:
            break;
    }
}

function renderWorld()
{
    Renderer.setBlendMode(BlendMode.PREMULTIPLIED);
    Renderer.setFilterMode(FilterMode.NEAREST);

    SpriteBatch.begin(cameraTransform);
    SpriteBatch.setFilter(FilterMode.NEAREST);
    SpriteBatch.setBlend(BlendMode.PREMULTIPLIED);
    SpriteBatch.drawRect(null, new Rect(-100, -100, 1, 1)); // To avoid glitch

    switch(gameState)
    {
        case GameStateEnum.INIT:
            renderInit();
            break;
        case GameStateEnum.MAIN_MENU:
            renderMainMenu();
            break;
        case GameStateEnum.GAME:
            renderGame();
            break;
        case GameStateEnum.END_GAME:
            renderEndGame();
            break;
        default:
            break;
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

    switch(gameState)
    {
        case GameStateEnum.INIT:
            break;
        case GameStateEnum.MAIN_MENU:
            break;
        case GameStateEnum.GAME:
            renderGameGlow();
            break;
        case GameStateEnum.END_GAME:
            break;
        default:
            break;
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
    Renderer.pushRenderTarget(mainRT);
    Renderer.clear(new Color(0, 0, 0, 1));
    renderWorld();

    // Apply the bloom on top
    SpriteBatch.begin();
    SpriteBatch.setFilter(FilterMode.LINEAR);
    SpriteBatch.setBlend(BlendMode.ADD);
    SpriteBatch.drawRect(bloomRT, new Rect(0, 0, Renderer.getResolution()), new Color(3));
    SpriteBatch.end();
    Renderer.popRenderTarget();

    // Draw the final image
    Renderer.clear(new Color(0, 0, 0, 1));
    SpriteBatch.begin();
    SpriteBatch.setFilter(FilterMode.LINEAR);
    SpriteBatch.setBlend(BlendMode.OPAQUE);
    SpriteBatch.drawRect(mainRT, new Rect(0, 0, Renderer.getResolution()));
    SpriteBatch.end();
}

function renderUI()
{
}
