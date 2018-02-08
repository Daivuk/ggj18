var title;
var subtitle;
var pressAToJoin;
var orSpaceOrEnter;
var pressStartOrFToPlay = null;

function startMainMenu()
{
    gameState = GameStateEnum.MAIN_MENU;

    title = animtext_create("^044MESSENGER HACKERS");
    subtitle = animtext_create(generateMessage(8).toUpperCase(), 1);
    pressAToJoin = animtext_create("^333PRESS ^050A^333 TO JOIN", 3);
    orSpaceOrEnter = animtext_create("^333OR SPACE OR ENTER", 4);
    pressStartOrFToPlay = null;

    matrixRain_start(5 * TILE_HEIGHT);
}

function updateMainMenu(dt)
{
    for(var i = 0; i < 4; ++i)
    {
        var hero = heroes[i];

        if(hero.playing && isStartJustDown(i))
        {
            startGame()
            break;
        }

        if(isAJustDown(i))
        {
            if(!hero.playing)
            {
                hero.playing = true;
            }
            else
            {
                hero.spriteAnim.play("idletaser_e");
                playSound("GGJ18SFX_TaserOut.wav");
            }
        }

        
        if(isAJustUp(i))
        {
            hero.spriteAnim.play("idle_e");
        }

        if(isBJustDown(i))
        {
            if(hero.playing)
            {
                hero.playing = false;
            }
            
            hero.spriteAnim.play("idle_e");
        }
    }

    animtext_update(title, dt);
    animtext_update(subtitle, dt);
    animtext_update(pressAToJoin, dt);
    animtext_update(orSpaceOrEnter, dt);
    if (!pressStartOrFToPlay)
    {
        for (var i = 0; i < heroes.length; ++i)
        {
            var hero = heroes[i];

            if (hero.playing)
            {
                pressStartOrFToPlay = animtext_create("^333PRESS START OR F TO PLAY");
                break;
            }
        }
    }
    if (pressStartOrFToPlay) animtext_update(pressStartOrFToPlay, dt);

    if (subtitle.time > 64) subtitle = animtext_create(generateMessage(8).toUpperCase());

    matrixRain_update(dt);
}

function delayed_spawn(hero, delay)
{
    setTimeout(function()
    {
        hero_respawn(hero);
    }, delay * 1000);
}

var delays = [1, 1.5, 2, 2.5];

function startGame()
{
    var playingPlayers = 0;
    music_play("GG18musicB.ogg");
    
    for(var i = 0; i < heroes.length; ++i)
    {
        var hero = heroes[i];
        if(hero.playing)
        {
            playingPlayers++;
            hero_createNewMessage(hero);
        }

    }

    for (var i = 0; i < heroes.length; ++i)
    {
        if (heroes[i].playing && !hero_hasPickupAvailable(heroes[i]))
        {
            pickup_spawn(hero_getRandomEncryptedGlyph(heroes[i]));
        }
    }
    
    switch(playingPlayers)
    {
        case 1: HERO_INTERACTION_PROGRESS_MAX = 3;
        break;
        case 2: HERO_INTERACTION_PROGRESS_MAX = 2.5;
        break;
        case 3: HERO_INTERACTION_PROGRESS_MAX = 2.5;
        break;
        case 4: HERO_INTERACTION_PROGRESS_MAX = 2;
        break;
    }

    gameState = GameStateEnum.GAME

    for (var i = 0; i < heroes.length; ++i)
    {
        var hero = heroes[i];

        if(hero.playing)
        {
            /*var delayIndex = Random.getNext(delays.length);
            var delay = delays[delayIndex];
            delays.splice(delayIndex, 1);
            delayed_spawn(hero, delay);*/
            hero_respawn(hero);
        }
    }
}

function regenerateUniqueGlyphs(hero)
{
    uniqueGlyphs = ""
    //for(var i = 0; i < heroes.length; ++i)
    {
        if(hero.playing)
        {
            for(var j = 0; j < hero.glyphMap.length; ++j)
            {
                if (hero.glyphMap[j].encrypted !== ' ') {uniqueGlyphs += hero.glyphMap[j].encrypted;}
            }
        }
        hero.messageAppearTime = 0;
    }

    uniqueGlyphs = removeDuplicatesFromArray(uniqueGlyphs);

    pickups_clear();
}

function renderMainMenu()
{
    renderGame(); // lel

    SpriteBatch.drawRect(null, new Rect(5 * TILE_HEIGHT, 0, 25 * TILE_HEIGHT, 17 * TILE_HEIGHT), new Color(0, 0, 0, 1));

    matrixRain_render();

    var position = new Vector2((resolution.x - 5 * TILE_HEIGHT) / 2 + 5 * TILE_HEIGHT, 100);

    SpriteBatch.end();
    var _41 = cameraTransform._41;
    var _42 = cameraTransform._42;
    cameraTransform._41 = 0;
    cameraTransform._42 = 0;
    SpriteBatch.begin(cameraTransform.mul(Matrix.createScale(1.5).mul(Matrix.createTranslation(new Vector3(_41, _42, 0)))));//.mul(Matrix.createTranslation(new Vector3(cameraTransform.translation().mul(-.75))))));
    animtext_render(title, new Vector2(position.x / 1.5, 4), new Color(0, 1, 1));
    SpriteBatch.end();
    cameraTransform._41 = _41;
    cameraTransform._42 = _42;
    SpriteBatch.begin(cameraTransform);
    animtext_render(subtitle, new Vector2(position.x, 4 + 24), new Color(1, 0, 1));
    
    animtext_render(pressAToJoin, position);
    position.y += 12;
    animtext_render(orSpaceOrEnter, position);
    
    if(pressStartOrFToPlay)
    {
        var position = new Vector2((resolution.x - 5 * TILE_HEIGHT) / 2 + 5 * TILE_HEIGHT, 150);
        animtext_render(pressStartOrFToPlay, position);
    }
}

function renderMainMenuGLOW()
{
    var position = new Vector2((resolution.x - 5 * TILE_HEIGHT) / 2 + 5 * TILE_HEIGHT, 100);

    matrixRain_renderGlow();

    SpriteBatch.end();
    SpriteBatch.begin(Matrix.createScale(1.5));
    animtext_renderGlow(title, new Vector2(position.x / 1.5, 4), new Color(0, 1, 1));
    SpriteBatch.end();
    SpriteBatch.begin();
    animtext_renderGlow(subtitle, new Vector2(position.x, 4 + 24), new Color(1, 0, 1));

    animtext_renderGlow(pressAToJoin, position);
    position.y += 12;
    animtext_renderGlow(orSpaceOrEnter, position);
    
    if(pressStartOrFToPlay)
    {
        var position = new Vector2((resolution.x - 5 * TILE_HEIGHT) / 2 + 5 * TILE_HEIGHT, 150);
        animtext_renderGlow(pressStartOrFToPlay, position);
    }
}
