var curLang;

function initLang(){
	curLang = localStorage.getItem("curLang");
}

function getText(section, index){
	return game.cache.getJSON('langs').langs[curLang][section].texts[index];
}

function setLang(l){
	curLang = l;
}

function createLanguageFlags(){
	game.add.button(19, 437, 'flags', function(){updateLanguage("PT_BR")}, this, 0, 0, 0);
	game.add.button(56, 363, 'flags', function(){updateLanguage("EN")}, this, 1, 1, 1);
	game.add.button(93, 363, 'flags', function(){updateLanguage("ES")}, this, 2, 2, 2);
	game.add.button(130, 363, 'flags', function(){updateLanguage("GE")}, this, 3, 3, 3);
	game.add.button(19, 400, 'flags', function(){updateLanguage("RU")}, this, 4, 4, 4);
	game.add.button(56, 400, 'flags', function(){updateLanguage("JP")}, this, 5, 5, 5);
	game.add.button(93, 400, 'flags', function(){updateLanguage("IT")}, this, 6, 6, 6);
	game.add.button(130, 400, 'flags', function(){updateLanguage("FR")}, this, 7, 7, 7);
	game.add.button(19, 363, 'flags', function(){updateLanguage("ZH")}, this, 8, 8, 8);
}

function updateLanguage(newLang){
	setLang(newLang);
	localStorage.setItem("curLang", curLang);
	game.state.start(game.state.current)
}
