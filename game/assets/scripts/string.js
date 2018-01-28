String.prototype.replaceAt=function(index, replacement) {
    var replacementSize = replacement.length;
    if (replacementSize == 0) replacementSize = 1;
    return this.substr(0, index) + replacement+ this.substr(index + replacementSize);
}