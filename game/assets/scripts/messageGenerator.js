var _worddb = [null, null, null, 
    _loadWordDb("word3db.json"),
    _loadWordDb("word4db.json"),
    _loadWordDb("word5db.json")
];

var _messageWordCombinations = [
    null, null, null, 
    [[3]],                                     // 3 letter message
    [[3]],                                     // 4 letter message
    [[5]],                                     // 5 letter message
    [[3, 3]],                                  // 6 letter message
    [[3, 4],[4, 3]],                           // 7 letter message
    [[3, 5], [5, 3], [4, 4]],                  // 8 letter message
    [[4, 5], [5, 4], [3, 3, 3]],               // 9 letter message
    [[3, 3, 4], [3, 4, 3], [4, 3, 3], [5, 5]], // 10 letter message

];

function _loadWordDb(datafile) {
    var reader = new BinaryFileReader(datafile);
    return JSON.parse(reader.readString());
}

// VALID RANGE: 3-5
function generateWord(letterCount) 
{
    while(true)
    {
        var db = _worddb[letterCount];
        var randomIndex = Random.randInt(0, db.length - 1);
        var randomWord = db[randomIndex].word;

        if (randomWord.indexOf(' ') >= 0) { continue; } // some words have spaces.. I dont' have time to clean them because it's a game jam lololol

        return randomWord;
    }
}

// VALID RANGE: 3-10
function generateMessage(letterCount)
{
    var combinations = _messageWordCombinations[letterCount];
    var randomIndex = Random.randInt(0, combinations.length - 1);
    var randomCombination = combinations[randomIndex];

    var message = ""

    for (var i = 0; i < randomCombination.length; ++i)
    {
        message += generateWord(randomCombination[i]) + " ";
    }

    return message.trim();
}