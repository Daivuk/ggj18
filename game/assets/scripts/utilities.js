
function removeDuplicatesFromArray( ar ) {
    var unique = [];
  
    for (var i = 0; i < ar.length; ++i ) {

        if (ar[i] == ' ') continue;

        var isUnique = true;
        for (var j = 0; j < unique.length; ++j)
        {
            if (ar[i] == unique[j])
            {
                isUnique = false;
                break;
            }
        }

        if (isUnique)
        {
            unique += ar[i];
        }
    };

    return unique;
  } 