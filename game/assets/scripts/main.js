Random.randomizeSeed(); // QBASIC equivalent: RANDOMIZE TIMER

function isAJustDown(i)
{
    if (i == 0) return GamePad.isJustDown(i, Button.A) || Input.isJustDown(Key.SPACE_BAR);
    if (i == 1) return GamePad.isJustDown(i, Button.A) || Input.isJustDown(Key.ENTER);
    return GamePad.isJustDown(i, Button.A);
}

function isAJustUp(i)
{
    if (i == 0) return GamePad.isJustUp(i, Button.A) || Input.isJustUp(Key.SPACE_BAR);
    if (i == 1) return GamePad.isJustUp(i, Button.A) || Input.isJustUp(Key.ENTER);
    return GamePad.isJustUp(i, Button.A);
}

function isADown(i)
{
    if (i == 0) return GamePad.isDown(i, Button.A) || Input.isDown(Key.SPACE_BAR);
    if (i == 1) return GamePad.isDown(i, Button.A) || Input.isDown(Key.ENTER);
    return GamePad.isJustDown(i, Button.A);
}

function isXJustDown(i)
{
    if (i == 0) return GamePad.isJustDown(i, Button.X) || Input.isJustDown(Key.E);
    if (i == 1) return GamePad.isJustDown(i, Button.X) || Input.isJustDown(Key.RIGHT_SHIFT);
    return GamePad.isJustDown(i, Button.X);
}

function isXDown(i)
{
    if (i == 0) return GamePad.isDown(i, Button.X) || Input.isDown(Key.E);
    if (i == 1) return GamePad.isDown(i, Button.X) || Input.isDown(Key.RIGHT_SHIFT);
    return GamePad.isJustDown(i, Button.X);
}

function isBJustDown(i)
{
    if (i == 0) return GamePad.isJustDown(i, Button.B) || Input.isJustDown(Key.TAB);
    if (i == 1) return GamePad.isJustDown(i, Button.B) || Input.isJustDown(Key.BACKSPACE);
    return GamePad.isJustDown(i, Button.B);
}

function isStartJustDown(i)
{
    if (i == 0) return GamePad.isJustDown(i, Button.START) || Input.isJustDown(Key.F);
    return GamePad.isJustDown(i, Button.START);
}

function getAxis(i)
{
    var axis = GamePad.getLeftThumb(i);
    if (i == 0)
    {
        if (Input.isDown(Key.A)) axis.x -= 1;
        if (Input.isDown(Key.D)) axis.x += 1;
        if (Input.isDown(Key.W)) axis.y -= 1;
        if (Input.isDown(Key.S)) axis.y += 1;
        if (axis.lengthSquared() > 1) axis = axis.normalize();
    }
    else if (i == 1)
    {
        if (Input.isDown(Key.LEFT)) axis.x -= 1;
        if (Input.isDown(Key.RIGHT)) axis.x += 1;
        if (Input.isDown(Key.UP)) axis.y -= 1;
        if (Input.isDown(Key.DOWN)) axis.y += 1;
        if (axis.lengthSquared() > 1) axis = axis.normalize();
    }

    return axis;
}

var GameStateEnum = {
    INIT: 1,
    MAIN_MENU: 2,
    GAME: 3,
    END_GAME: 4,
    END_GAME_LIMBO: 5
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
var bloomRT = Texture.createRenderTarget(resolution);

var encryptedFont = getFont("sga.fnt");
var encryptedMessage;

var cam_scale = 1;

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

    cam_scale = scale;
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
        case GameStateEnum.END_GAME_LIMBO:
            updateEndGameLimbo(dt);
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
        case GameStateEnum.END_GAME_LIMBO:
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
    Renderer.setFilterMode(FilterMode.LINEAR);
    
    SpriteBatch.begin();
    SpriteBatch.setFilter(FilterMode.LINEAR);
    SpriteBatch.setBlend(BlendMode.PREMULTIPLIED);

    switch(gameState)
    {
        case GameStateEnum.INIT:
            break;
        case GameStateEnum.MAIN_MENU:
            renderMainMenuGLOW();
            break;
        case GameStateEnum.END_GAME_LIMBO:
        case GameStateEnum.GAME:
            renderGameGlow();
            break;
        case GameStateEnum.END_GAME:
            renderEndGameGlow();
            break;
        default:
            break;
    }

    SpriteBatch.end();
}

var blurAnim = new NumberAnim();
blurAnim.playSingle(15, 17, .2, Tween.EASE_BOTH, Loop.PING_PONG_LOOP);

function render()
{
    // Draw everything into the bloom first
    Renderer.pushRenderTarget(bloomRT);
    Renderer.clear(new Color(0, 0, 0, 1));
    renderGlow();
    Renderer.popRenderTarget();
    bloomRT.blur(blurAnim.get() / cam_scale);

    // Draw the world on the main RT
    Renderer.pushRenderTarget(mainRT);
    Renderer.clear(new Color(0, 0, 0, 1));
    renderWorld();

    // Apply the bloom on top
    SpriteBatch.begin(cameraTransform);
    SpriteBatch.setFilter(FilterMode.LINEAR);
    SpriteBatch.setBlend(BlendMode.ADD);
    SpriteBatch.drawRect(bloomRT, new Rect(0, 0, resolution), new Color(3));
    SpriteBatch.end();
    Renderer.popRenderTarget();

    // Draw the final image
    Renderer.clear(new Color(0, 0, 0, 1));
    SpriteBatch.begin();
    SpriteBatch.setFilter(FilterMode.NEAREST);
    SpriteBatch.setBlend(BlendMode.OPAQUE);
    SpriteBatch.drawRect(mainRT, new Rect(0, 0, Renderer.getResolution()));
    SpriteBatch.end();
}

function renderUI()
{
}
