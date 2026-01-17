const { klipyKey } = require('../config.js');

// SearchGif function
// Input: search term, key
// Output: returns object, containing url and shortURL
const searchGif = async function (search) {
    const tenorSearch = await fetch("https://api.klipy.com/v2/search?q=" + search + "&key=" + klipyKey + "&limit=" + 20 + "&contentfilter=high&random=1");
    const results = await tenorSearch.json();
    const random = Math.floor(Math.random() * results.results.length);
    let returns = {
        url: results.results[random].itemurl,
        shortURL: results.results[random].media_formats.gif.url
    }
    return returns
}

module.exports = {
    searchGif,
};