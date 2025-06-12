iniPoki();
PokiSDK.gameLoadingStart();
function iniPoki()
{

    PokiSDK.init().then(
        () => {
            // successfully initialized
            console.log("PokiSDK initialized");
            // continue to game
        }   
    ).catch(
        () => {
            // initialized but the user has an adblock
            console.log("Adblock enabled");
            // feel free to kindly ask the user to disable AdBlock, like forcing weird usernames or showing a sad face; be creative!
            // continue to the game
        }   
    );
    PokiSDK.setDebug(false);

}


var LANGS_OBJ    = {
		"en" : 0,
		"de" : 1,
		"nl" : 2
	};
	var selectedLang = LANGS_OBJ.en;
	try {
		var search       = location.search.substring(1);
		var searchParams = JSON.parse(
			"{\"" + decodeURI(search).replace(/"/g, "\\\"").replace(/&/g, "\",\"").replace(/=/g, "\":\"") + "\"}");

		selectedLang = LANGS_OBJ[ searchParams.locale ] || LANGS_OBJ.en;
	} catch (e) {}

	//lang
	var lenguajeManual = true;
	var lenguajeEl     = selectedLang;
	//end lang
        
    var APP = null;
    var hiloStart = null;    
    var timeToStartGame = 300;
	 hiloStart = setInterval(esperaJuegoListo,30);
	
	function esperaJuegoListo()
	{
		if(APP != null)
		{		
			PokiSDK.gameLoadingFinished();
			onGameLoad();
			clearInterval(hiloStart);          
			hiloStart = setInterval(empezarJuego,timeToStartGame);
		}
	}
	function empezarJuego()
	{
		//APP._fillMode = "KEEP_ASPECT";
		clearInterval(hiloStart);       
		APP.start();		
		
		if(isMobile.any())
			{
				window.innerWidth  = document.body.offsetWidth;
				window.innerHeight = document.body.offsetHeight;				
				var width  = Math.min(window.innerWidth, window.innerHeight);
				var height = Math.max(window.innerWidth, window.innerHeight);
				APP.resizeCanvas(width, height);
			}
	}
	
	var isMobile = {
            Android: function() {
                return navigator.userAgent.match(/Android/i);
            },
            BlackBerry: function() {
                return navigator.userAgent.match(/BlackBerry/i);
            },
            iOS: function() {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i);
            },
            Opera: function() {
                return navigator.userAgent.match(/Opera Mini/i);
            },
            Windows: function() {
                return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
            },
            any: function() {
                return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
            }
        };
        
    var landscapeMode = false;
	var randomLevels = true;
	var soundOff      = true;
	var rotate        = document.getElementById("rotate");
	var width, height;
	if (window.isMobile.any() && window.innerHeight < window.innerWidth) {
		landscapeMode      = true;
		width              = window.innerWidth;
		height             = window.innerHeight;
		window.innerWidth  = height;
		window.innerHeight = width;
	}        

	function loadjscssfile(filename, filetype) {
		if (filetype == "js") { //if filename is a external JavaScript file
			var fileref = document.createElement("script");
			fileref.setAttribute("type", "text/javascript");
			fileref.setAttribute("src", filename);
		} else if (filetype == "css") { //if filename is an external CSS file
			var fileref = document.createElement("link");
			fileref.setAttribute("rel", "stylesheet");
			fileref.setAttribute("type", "text/css");
			fileref.setAttribute("href", filename);
		}
		if (typeof fileref != "undefined")
			document.getElementsByTagName("head")[ 0 ].appendChild(fileref);
	}


ASSET_PREFIX = "";
SCRIPT_PREFIX = "";
SCENE_PATH = "903849.json";
CONTEXT_OPTIONS = {
    'antialias': false,
    'alpha': true,
    'preserveDrawingBuffer': false,
    'preferWebGl2': false
};
SCRIPTS = [ 29839202, 29819814, 29820339, 29819954, 29820152, 29819949, 29820392, 29820137, 29819344, 29820143, 29820135, 29820129, 29820133, 29820039, 29820136, 29819940, 29819328, 29819737, 29819322, 29819970, 29820134, 29820141, 29819957, 29820142, 29820128, 29820083, 29820138, 29820140, 29820139, 29820144, 29820302, 29819313, 29819855, 29820388, 29819967, 29820433, 29819568, 29820307, 29820617, 30994850, 30996296 ];
CONFIG_FILENAME = "config.json";
INPUT_SETTINGS = {
    useKeyboard: true,
    useMouse: true,
    useGamepads: false,
    useTouch: true
};
pc.script.legacy = false;
PRELOAD_MODULES = [
];

(
		function() {
			"use strict";
		
			var scope          = {};

			function getScore() {
				return _globalScore;
			}

			var startInterval;
			Object.defineProperty(scope, "quickstartGame", {
				value : function quickstartGame() {
					clearTimeout(startInterval);
					try {
						if (window.gameFinished) return;
                     if (_control && _control.screen2D.findByName("Logo").enabled) {
						    skipMenu = true;
                        if(_control != null)
                           _control.finalForzado();
                     }
                     else{
							startInterval = setTimeout(scope.quickstartGame, 300);
						}
                     
					} catch (e) {}
				}
			});
			Object.defineProperties(window, {
				onGameUpdate : {
					value : function(scoreAdded) {
					
					}
				},
				onGameLoad : {
					value : function onGameLoad(time) {
						if (window.gameFinished) return;
						console.log("GAME LOAD WAS CALLED!!! ", time);
						if (landscapeMode) {
							window.innerWidth  = height;
							window.innerHeight = width;
                         rotate = document.getElementById("rotate");
							rotate.style.display = "block";
						}
						if (window.isMobile.any()) {
							window.addEventListener("resize", ChangeOrientation, false);
							window.addEventListener("orientationchange", ChangeOrientation, false);
						}
					}
				},

				onGameStart : {
					value : function onGameStart() {
					
					}
				},

				onGameEnd : {
					value : function onGameEnd() {					
						Object.defineProperty(window, "gameFinished", {
							value : true
						});
					}
				}
			});

			function ChangeOrientation() {
				window.innerWidth  = document.body.offsetWidth;
				window.innerHeight = document.body.offsetHeight;
				if (document.body.offsetHeight < document.body.offsetWidth) {
					rotate.style.display = "block";
				} else {
					rotate.style.display = "none";
				}
				var width  = Math.min(window.innerWidth, window.innerHeight);
				var height = Math.max(window.innerWidth, window.innerHeight);
				APP.resizeCanvas(width, height);
			}

			
		}
	)();





