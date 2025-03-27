/*

achievement names contain jokes

coolors.co

buy max eff upgrade button

encrypted safe files

btoa = encrypt
atob = decrypt

max efficiency upgrade -> plant efficiency x1000 and efficiency max increases!

illegal plants -> get caught -> 0 money / give a lot of money

sounds

difficulty

increasing taxes challenge

only summer challenge (peaceful)

IMPORTANT

GOLDEN TILES DO NOT SAVE!

make completed challenges save

font family in settings

tooltip break for achievements

fix tooltip on replant upgrade

change log in the main menu

plants which have grown need to be sold on market.

golden tiles which allow you to replant plant X times

fertiliser, nearby tiles are growing faster.

*/

/* 自定义变量 */
var autoPlantingCall = 0; // 自动种植调用次数

/* 自定义变量END */

spop.defaults = {
  icon: false,
  position: "bottom-right",
  autoclose: 4500,
}

var achievements = {
  wheat: {
    nameZh: "小麦",
    amount: [],
    achieved: [],
    achievementName: ["Baby steps...", "Learner...", "Farmer student.", "<img src=http://game-icons.net/icons/delapouite/originals/svg/farmer.svg>", "Can't... stop... clicking.", "Wheat so yellow...", "Well done... for playing so long.", "Wheat is soo cool", "Farming so fun", "Remember to mill the wheat!", "Get a tractor already!", "Super farmer", "Pro farmer", "You're getting good!", "Wheat so cheap.", "Try new plants.", "почему вы перевести данный текст?", "Plant problems ?", "You don't have to play wheat all the game...", "Flowers are better than wheat.", "Wheat > Flowers", "Haha you're not trying to win.", "Want 100% Achievements?", "So close...", "Keep going.", "One more to go!", "There ya go!"]
  },
  flower: {
    nameZh: "鲜花",
    amount: [],
    achieved: [],
    achievementName: ["Fresh start.", "Flowers so much better than wheat.", "Good luck getting next plant."],
  },
  herb: {
    nameZh: "草药",
    amount: [],
    achieved: [],
    achievementName: [],
  },
  grass: {
    nameZh: "牧草",
    amount: [],
    achieved: [],
    achievementName: [],
  },
  sunflower: {
    nameZh: "向日葵",
    amount: [],
    achieved: [],
    achievementName: [],
  },
  algae: {
    nameZh: "水藻",
    amount: [],
    achieved: [],
    achievementName: [],
  },
  corn: {
    nameZh: "玉米",
    amount: [],
    achieved: [],
    achievementName: [],
  },
  cabbage: {
    nameZh: "卷心菜",
    amount: [],
    achieved: [],
    achievementName: [],
  },
  jasmine: {
    nameZh: "茉莉",
    amount: [],
    achieved: [],
    achievementName: [],
  },
  strawberry: {
    nameZh: "草莓",
    amount: [],
    achieved: [],
    achievementName: [],
  },
  chocolate: {
    nameZh: "可可豆",
    amount: [],
    achieved: [],
    achievementName: [],
  },
  potato: {
    nameZh: "土豆",
    amount: [],
    achieved: [],
    achievementName: [],
  },
  coconut: {
    nameZh: "椰子",
    amount: [],
    achieved: [],
    achievementName: [],
  },
}


// 成就要求
var achievementNumbers = [1, 5, 10, 25, 50, 75, 100, 150, 250, 500, 750, 1000, 1250, 1500, 1750, 2000, 2250, 2500, 4000, 5000, 7500, 10000, 12500, 15000, 25000, 50000, 100000];
// 成就设置
for (var key in achievements) {
  var length = achievementNumbers.length;
  for (var g = 0; g < length; g++) {
    achievements[key].achieved[g] = false;
    achievements[key].amount[g] = achievementNumbers[g];
  }

  for (var d = 0; d < length; d++) {
    if (d == 0) {
      $('#achievements').append("<div style='text-align:center; margin:0 20px 0 20px;'>" + achievements[key].nameZh + "</div><div style=clear:both;></div>")
    }
    var id = key + achievements[key].amount[d];
    var element = '<div class=achievement id=' + id + '>?</div>';
    $('#achievements').append(element);
    if (d == length - 1) {//如果是最后一个成就，则添加一个空行
      $('#achievements').append('<div style="height:20px; width:100%; float:left;"></div>')
    }
  }

}

var i = 0;

for (i = 0; i < 1; i++) {
  var element = '<div class=tile id=cell' + i + ' onclick=plant(this);></div>';
  $('#map').append(element);
}


var keys = [];

$(document).keydown(function (e) {
  keys[e.keyCode] = true;
});

$(document).keyup(function (e) {
  delete keys[e.keyCode];
});

var FPS = 30;

var money = 0;

var tutorial = -1;

var challenge = "";
var debtLeft = 5000000;
var debtTimeLeft = (90 / 60) * 60 * 60; // 90 mins in sec

var raceTimeLeft = (120 / 60) * 60 * 60; // 2 hours in sec

var inspectionTimeLeft = 30;

var slotTime = 30;

var voice = 0;

var currentQuest = "5 wheat";
var questTimeLeft = 25;
var questCollected = 0;

var moreSpacePrice = 0.1;
var growthSpeedPrice = 1;
var replantPrice = 1;
var replantChance = 1;

var growthSpeedBoost = 1;
var profitBoost = 1;
var xpBoost = 1;

var currentSeason = 1;
// var seasons = ["Spring","Summer","Autumn","Winter"];
var seasons = ["春天", "夏天", "秋天", "冬天"];
var seasonTime = 60;

var growthSpeed = 1;

var holdingMouse = false;

var xp = 0;
var xpN = 1;
var level = 1;
var skillpoints = 0;

var fillAllBtnUnlocked = false;

var skilltree = {};

$(document).mousedown(function () {
  holdingMouse = true;
})
$(document).mouseup(function () {
  holdingMouse = false;
})


var wheat = {
  timeToGrow: 2,
  profit: 0.01,
  cost: 0,
  unlocked: true,
  efficiency: 1,
  effPrice: 0.01,
  efficiencyMax: 20,
  unlockPrice: 0,
  growsIn: "夏天",
  totalGrown: 0,
}
var flower = {
  timeToGrow: 10,
  profit: 1.01,
  cost: 1,
  unlocked: false,
  efficiency: 1,
  effPrice: 1,
  efficiencyMax: 20,
  unlockPrice: 5,
  growsIn: "春天",
  totalGrown: 0,
}
var herb = {
  timeToGrow: 20,
  profit: 2500 * 1.01,
  cost: 2500,
  unlocked: false,
  efficiency: 1,
  effPrice: 2500,
  efficiencyMax: 20,
  unlockPrice: 4000,
  growsIn: "夏天",
  totalGrown: 0,
}

var grass = {
  timeToGrow: 40,
  profit: 2.5e5 * 1.01,
  cost: 2.5e5,
  unlocked: false,
  efficiency: 1,
  effPrice: 2.5e5,
  efficiencyMax: 20,
  unlockPrice: 1.5e6,
  growsIn: "冬天",
  totalGrown: 0,
}
var sunflower = {
  timeToGrow: 70,
  profit: 8e9 * 1.01,
  cost: 8e9,
  unlocked: false,
  efficiency: 1,
  effPrice: 8e9,
  efficiencyMax: 20,
  unlockPrice: 8e10,
  growsIn: "夏天",
  totalGrown: 0,
}

var algae = {
  timeToGrow: 120,
  profit: 3e12 * 1.01,
  cost: 3e12,
  unlocked: false,
  efficiency: 1,
  effPrice: 3e12,
  efficiencyMax: 25,
  unlockPrice: 3e13,
  growsIn: "秋天",
  totalGrown: 0,
}

var corn = {
  timeToGrow: 200,
  profit: 2e15 * 1.01,
  cost: 2e15,
  unlocked: false,
  efficiency: 1,
  effPrice: 2e15,
  efficiencyMax: 25,
  unlockPrice: 3.14e16,
  growsIn: "夏天",
  totalGrown: 0,
}

var cabbage = {
  timeToGrow: 300,
  profit: 4e18 * 1.01,
  cost: 4e18,
  unlocked: false,
  efficiency: 1,
  effPrice: 4e18,
  efficiencyMax: 25,
  unlockPrice: 5e19,
  growsIn: "春天",
  totalGrown: 0,
}

var jasmine = {
  timeToGrow: 500,
  profit: 2e22 * 1.01,
  cost: 2e22,
  unlocked: false,
  efficiency: 1,
  effPrice: 2e22,
  efficiencyMax: 25,
  unlockPrice: 14.5e22,
  growsIn: "冬天",
  totalGrown: 0,
}

var strawberry = {
  timeToGrow: 800,
  profit: 2e25 * 1.01,
  cost: 2e25,
  unlocked: false,
  efficiency: 1,
  effPrice: 2e25,
  efficiencyMax: 25,
  unlockPrice: 2e26,
  growsIn: "春天",
  totalGrown: 0,
}

var chocolate = {
  timeToGrow: 1400,
  profit: 2.048e29 * 1.01,
  cost: 2.048e29,
  unlocked: false,
  efficiency: 1,
  effPrice: 2.048e29,
  efficiencyMax: 25,
  unlockPrice: 80.0e29,
  growsIn: "秋天",
  totalGrown: 0,
}

var potato = {
  timeToGrow: 2500,
  profit: 8.192e32 * 1.01,
  cost: 8.192e32,
  unlocked: false,
  efficiency: 1,
  effPrice: 8.192e32,
  efficiencyMax: 25,
  unlockPrice: 21.92e32,
  growsIn: "秋天",
  totalGrown: 0,
}

var coconut = {
  timeToGrow: 4650,
  profit: 3.2768e36 * 1.01,
  cost: 3.2768e36,
  unlocked: false,
  efficiency: 1,
  effPrice: 3.2768e36,
  efficiencyMax: 25,
  unlockPrice: 1.2768e37,
  growsIn: "夏天",
  totalGrown: 0,
}



var plantsZh = ["小麦", "鲜花", "草药", "牧草", "向日葵", "水藻", "玉米", "卷心菜", "茉莉", "草莓", "巧克力", "土豆", "椰子"];
var plants = ["wheat", "flower", "herb", "grass", "sunflower", "algae", "corn", "cabbage", "jasmine", "strawberry", "chocolate", "potato", "coconut"];

for (var i = 1; i <= 60; i++) {
  if (i == 30) {
    $('#fpsOption').append("<option value=" + i + " selected>" + i + " FPS</option>");
    continue;
  }
  $('#fpsOption').append("<option value=" + i + ">" + i + " FPS</option>");
}
for (var ii = 10; ii <= 75; ii++) {
  if (ii == 75) {
    $('#tileSizeOption').append("<option value=" + ii + "px selected>" + ii + " px</option>");
    continue;
  }
  $('#tileSizeOption').append("<option value=" + ii + "px>" + ii + " px</option>");
}

//批量添加农作物下拉列表的可选值
for (var i = 0; i < plants.length; i++) {
  var elem1 = '<button id=' + plants[i] + 'EffBtn onclick=upEff("' + plants[i] + '") title="每次购买，当前利润乘数增加0.01">' + plantsZh[i] + ' 收益</button>';
  var elem2 = '<div class="upbar-container"><div class="upbar" id=' + plants[i] + 'EffBar></div></div>';
  $('#upgradesTab').append(elem1, elem2);
  var price = window[plants[i]].cost;
  var elem3 = '<option value="' + plants[i] + '" id="' + plants[i] + '">' + plantsZh[i] + ' $' + simplify(price) + '</option>';
  $('#plant').append(elem3);
  var unlockPrice = window[plants[i]].unlockPrice;
  var title = "$" + (simplify(unlockPrice));
  var elem4 = '<button onclick=unlock("' + plants[i] + '"); id=' + plants[i] + 'UnlockBtn title="' + title + '" class=info></button>';
  $('#unlockTab').append(elem4);
}

//种植事件
// 定义一个函数，用于种植植物
function plant(obj, type) {
  var item = type;
  var plantIndex = plantsZh[$('#plant').prop('selectedIndex')]; // 获取当前选中的植物索引
  if (!type) var item = $('#plant').val();


  var profit = window[item].profit;
  var timeToGrow = window[item].timeToGrow;
  var efficiency = window[item].efficiency;

  if (money < window[item].cost) return;
  if (obj.innerHTML !== "") return;

  money -= window[item].cost;
  var time = $(obj).attr('data-time');
  if (time > 0) return;
  $(obj).attr('data-time', 200);
  var id = obj.id;
  var price = window[item].cost;
  add("<span style='color: red;'>" + "-$" + simplify(price) + "</span>", "log", 0, 100);
  var element = "<div class=plant data-time=" + timeToGrow + " data-timeMax=" + timeToGrow + " data-profit=" + profit + " data-type=" + item + " data-type-zh=" + plantIndex + " data-efficiency=" + efficiency + "></div>";
  $(obj).html(element);
}

function engine() {
  $('#skillpoints').html("剩余技能点: " + skillpoints + "");
  FPS = $('#fps').val();
  $('#season').html(seasons[currentSeason] + "<br>(" + challenge + ")");
  $('#money').html("金钱: $" + simplify(money));
  $('#moreSpaceBtn').html("+1 土地 (" + $('.tile').length + ")<br>$" + simplify(moreSpacePrice));
  $('#growthSpeedBtn').html("加速生长" + "<br>$" + simplify(growthSpeedPrice));
  $('#replantUpgradeBtn').html("重种概率(" + replantChance + "%)<br>$" + simplify(replantPrice));
  // $('#replantUpgradeBtn').attr('title', "$" + simplify(replantPrice));

  $('#seasonbar').html((format(seasonTime)));
  var perc = (seasonTime / 60 * 100);
  var color = "rgb(" + Math.floor(255 - (2.55 * perc)) + "," + Math.round(2.55 * perc) + ",0)";
  $('#seasonbar').css({
    width: perc + "%",
    backgroundColor: color,
  })
  seasonTime -= 1 / FPS;

  if (seasonTime <= 0) {
    currentSeason++;
    if (currentSeason >= seasons.length) {
      currentSeason = 0;
    }
    achievementUnlocked("<code style=font-size:20px;>" + seasons[currentSeason] + " 已经开始!</code>", false)

    // 设置农作物选择列表
    seasonTime = 60;
    for (var y = 0; y < plants.length; y++) {
      $('#' + plants[y]).html(plantsZh[y] + " $" + simplify(window[plants[y]].cost));
      var p = window[plants[y]];

      if (p.growsIn == seasons[currentSeason].toLowerCase()) {
        $('#' + plants[y]).html(plantsZh[y] + " $" + simplify(window[plants[y]].cost) + " ☀");
      }
    }

  }


  if (currentSeason == 0) {
    Math.random() < 0.5 ? add("|", "log", 0, $(window).width() - 100, true) : add(".", "log", 0, $(window).width() - 100, true);
  }
  // winter
  if (currentSeason == 3) {
    if (Math.random() < 1) {
      Math.random() < 0.5 ? add("❄", "log", 0, $(window).width() - 100, true) : add("❆", "log", 0, $(window).width() - 100, true);
    }
  }

  $('#moreSpaceBtn').css({
    backgroundColor: "grey",
    border: "2px solid black",
  })
  if (money >= moreSpacePrice) {
    $("#moreSpaceBtn").css({
      backgroundColor: "#4CAF50",
      border: "2px solid darkgreen",
    })
  }

  $('#growthSpeedBtn').css({
    backgroundColor: "grey",
    border: "2px solid black",
  })
  if (money >= growthSpeedPrice) {
    $("#growthSpeedBtn").css({
      backgroundColor: "#4CAF50",
      border: "2px solid darkgreen",
    })
  }
  $('#replantUpgradeBtn').css({
    backgroundColor: "grey",
    border: "2px solid black",
  })
  if (money >= replantPrice) {
    $('#replantUpgradeBtn').css({
      backgroundColor: "#4CAF50",
      border: "2px solid darkgreen",
    })
  }

  var length = $('.tile').length;

  var mps = 0;

  /* 遍历所有土地-元素 */
  for (var i = 0; i < length; i++) {
    $('#cell' + i).removeAttr("data-time");
    var $cell = $('#cell' + i);
    var element = $('#cell' + i).find(".plant"); //获取土地控件

    var time = parseFloat($(element).attr("data-time"));

    if (time <= 0) continue;
    var type = $(element).attr('data-type');


    if (type) {
      var canGrowIn = window[type].growsIn;
      canGrowIn = canGrowIn.toLowerCase();
      // doesnt grow in winter and is winter
      var grow = true;
      if (canGrowIn !== "winter" && currentSeason == 3) {
        if (Math.random() < 0.5) {
          grow = false;
          newTime = parseFloat(time);
        }
      }

      var thisSeason = seasons[currentSeason].toLowerCase();
      if (canGrowIn == thisSeason && grow) {
        var newTime = parseFloat(time) - (growthSpeed * growthSpeedBoost) / FPS * 3;
      }
      else {
        if (grow) {
          var newTime = parseFloat(time) - (growthSpeed * growthSpeedBoost) / FPS;
        }
      }
      var object = window[type];
      var profit = object.profit * object.efficiency - object.cost
      var speed = (object.timeToGrow / growthSpeed);
      mps += ((profit) / speed) * growthSpeedBoost;
    }
    $('#mps').html(simplify(mps) + " / 秒");
    // summer
    if (currentSeason == 1) {
      $('#sun').css({
        opacity: 1,
      })
    }
    // winter
    if (currentSeason == 3) {
      $('#sun').css({
        opacity: 0.5,
      })
    }



    $(element).attr('data-time', newTime);
    var maxTime = $(element).attr('data-timeMax');
    var perc = 100 - (newTime / maxTime) * 100;

    // var plantt = $(element).attr('data-type');
    var plantt = $(element).attr('data-type-zh');
    $cell.attr('data-type', $(element).attr('data-type')); //


    plantt = String(plantt);

    plantt = "<span>" + plantt + "</span>"
    var extra = "";
    if ($('#plantTime').hasClass("active")) {
      /*
      
      var totalTime = 100/growthSpeed * growthSpeedBoost;
      var time = totalTime * (buildValue/100);
      var timeLeft = totalTime - time;
      
      */
      var timeLeft = $(element).attr('data-time') / ((growthSpeed * growthSpeedBoost));

      if (canGrowIn !== "winter" && currentSeason == 3) {
        timeLeft *= 3;
      }
      if (canGrowIn == thisSeason) {
        timeLeft /= 3;
      }

      extra += "" + format(timeLeft) + "";
      $(element).html("<b>" + plantt + "</b><br>" + extra);

    }
    if ($('#plantTime').hasClass("active") == false) {
      $(element).html("<b>" + plantt + "</b><br>" + Math.ceil(perc) + "%"); //显示百分比
    }

    //种植植物的成熟度颜色
    var color = "rgba(" + Math.floor(255 - (2.55 * perc)) + "," + Math.round(2.55 * perc) + ",0,0.8)";
    //移除成熟的植物
    if (perc > 99) {
      $(element).remove();
      $(element).css({
        backgroundColor: "white",
      })
      $cell.removeAttr("data-type");

      // 50 % of replanting a plant

      // 0.5% of plant being next level

      var rand = Math.random() * 100;
      var replantEnabled = $('#replantEnable').hasClass("active");
      if (rand <= replantChance && replantEnabled) {
        if (Math.random() < 0.005) {
          var newPlant = plants.indexOf(type) + 1;
          plant($("#cell" + i)[0], plants[newPlant]);
        }
        plant($("#cell" + i)[0], type);
      }

      var profit = $(element).attr('data-profit');
      var efficiency = $(element).attr('data-efficiency');


      var plantToAdd = $(element).attr('data-type');
      window[plantToAdd].totalGrown++;

      add("<span style='color: green;'>" + "+$" + simplify(profit * efficiency) + "</span>", "log", 0, 100);

      money += parseFloat(profit) * parseFloat(efficiency) * profitBoost;
      xp += parseFloat(profit * efficiency * 10 * xpBoost);
      var quest = currentQuest.split(" ");
      if (quest[1] == $(element).attr('data-type')) {
        questCollected++;
      }

      //如果自动种植勾选
      if ($('#autoPlantingEnable').hasClass("active") && autoPlantingCall == 0) {
        autoPlantingCall++;
        autoPlantingLoop();//调用一次自动种植
      }

      continue;
    }
    $(element).css({
      backgroundColor: color,
      width: perc + "%",

    })
  }



  for (var s = 0; s < plants.length; s++) {
    var p = window[plants[s]];
    $('#' + plants[s]).css("display", "none");
    if (p.unlocked) {
      $('#' + plants[s]).css("display", "block");
    }
    var info = plantsZh[s] + " 利润乘数<br>$" + simplify(window[plants[s]].effPrice);

    $('#' + plants[s] + "EffBtn").html(info);
    $('#' + plants[s] + "UnlockBtn").html("解锁 " + plantsZh[s])
    if (p.unlocked) {
      $('#' + plants[s] + "UnlockBtn").css({ display: "none" })
    }
    var price = p.effPrice;
    $('#' + plants[s] + "EffBtn").css({ backgroundColor: "grey" })
    if (money >= price) {
      $('#' + plants[s] + "EffBtn").css({ backgroundColor: "#4CAF50" })
    }
    $('#' + plants[s] + "UnlockBtn").css({
      backgroundColor: "grey",
      border: "2px solid black",
    })
    if (money >= p.unlockPrice) {
      $('#' + plants[s] + "UnlockBtn").css({
        backgroundColor: "#4CAF50",
        border: "2px solid darkgreen",
      })
    }

    $('#' + plants[s] + "EffBtn").hide();
    $('#' + plants[s] + "EffBar").parent().hide();

    var selectedPlant = $('#plant').val();

    $('#' + selectedPlant + "EffBtn").show();
    $('#' + selectedPlant + "EffBar").parent().show();

    $('#' + plants[s + 1] + "UnlockBtn").hide();
    if (window[plants[s]].unlocked) {
      $('#' + plants[s + 1] + "UnlockBtn").show();
    }

    if (money >= p.cost) {
      $('#' + plants[s]).css({ backgroundColor: "#4CAF50" })
    } else {
      $('#' + plants[s]).css({ backgroundColor: "grey" })
    }
    var obj = plants[s];
    var perc = window[obj].efficiency / window[obj].efficiencyMax * 100;
    var color = "rgb(" + Math.floor(255 - (2.55 * perc)) + "," + Math.round(2.55 * perc) + ",0)";
    $('#' + obj + "EffBar").html("x" + (Math.round(window[obj].efficiency * 100)) / 100);
    $('#' + obj + "EffBar").css({
      width: perc + "%",
      backgroundColor: color,
    })

    var l = window[obj].efficiency;
    var lMax = window[obj].efficiencyMax;

    if (window[obj].efficiency >= window[obj].efficiencyMax) {
      window[obj].efficiencyMax += 25;
      window[obj].effPrice *= 0.2;
    }


  }

  if (money >= 1e6) {
    $('#buyFillBtn').css({ backgroundColor: "#4CAF50" })
  }
  if (money < 1e6) {
    $('#buyFillBtn').css({ backgroundColor: "grey" })
  }

  //左侧农作物信息
  var selected = $('#plant').val();
  var object = window[selected];
  info = "<ul>";
  info += "<li>利润: $" + simplify((object.profit * object.efficiency - object.cost) * profitBoost) + "</li><li>费用: $" + simplify(object.cost) + "</li><li>生长速度: " + Math.floor((object.timeToGrow / growthSpeed * 100) / growthSpeedBoost) / 100 + "s<li>种植季节: " + object.growsIn + "</li>";
  document.getElementById("info").innerHTML = info + "</ul>";

  var perc = xp / xpN * 100;

  $('#levelbar').css({
    width: perc + "%",
  })
  $('#levelbar').html(simplify(xp) + "/" + simplify(xpN) + " Level " + level)

  if (xp >= xpN) {
    level++;
    xp -= xpN;
    xpN *= Math.PI * 2;
    skillpoints++;
  }

  if (fillAllBtnUnlocked) {
    $('#fillAllBtn').prop("disabled", false);
    $('#buyFillBtn').remove();
  }


  var achievementPercentage = 0;

  var totalAchievementLength = 0;
  var achieved = 0;

  for (var key in achievements) {
    totalAchievementLength += achievements[key].amount.length;
    for (var m = 0; m < achievements[key].amount.length; m++) {
      if (achievements[key].achieved[m]) {
        achieved++;
      }
    }
  }
  achievementPercentage = achieved / totalAchievementLength * 100;

  $('#achievementPercentage').html("<strong>成就 (" + Math.round(achievementPercentage * 10) / 10 + "%)</strong>")


  $('#menuUnlock').hide();
  $('#menuUpgrades').hide();
  $('#menuSkill').hide();
  $('#menuAchievements').hide();
  $('#menuStats').hide();

  if (level >= 2) $('#menuUpgrades').show();
  if (level >= 3) $('#menuUnlock').show();
  if (level >= 4) $('#menuSkill').show();
  if (level >= 5) $('#menuAchievements').show();
  if (level >= 6) $('#menuStats').show();

  var size = parseInt($('#tileSize').val());

  var fontSize = Math.floor(size / 4)

  $('.tile').css({
    width: size,
    height: size,
    fontSize: fontSize + "px",
  })
  $('#menuSkill').css({
    color: "black",
  })
  if (skillpoints >= 1) {
    $('#menuSkill').css({
      color: "red",
    })
  }
  var sun = $('#sunEnabled').hasClass("active");
  if (!sun) { $('#sun').hide(); }
  if (sun) { $('#sun').show(); }



  setTimeout(engine, 1000 / FPS);
}
engine();

function tutNext() {
  tutorial++;
}

function tut() {
  if (tutorial == 1) {
    $('#arrow').animate({
      left: "150px",
    })
    $('#tutorialMsg').html("欢迎来到农场<br>点击此方块种植小麦<br>持续种植，直到你得到$0.1 .");
    $('#tutorialMsg').animate({
      left: "250px",
    })
    $("#arrow").pointat({ target: "#cell0" });
    if (money >= 0.1) {
      tutorial++;
    }
    if (voice == 0) {
      voice++;
      speak("欢迎来到农场,点击此方块种植小麦.持续种植，直到你得到$0.1 .")
    }
  }
  if (tutorial == 2) {
    $('#arrow').animate({
      left: "800px",
      top: "150px",
    })
    $('#tutorialMsg').html("<label>2/7</label>点击升级并购买土地升级.");
    $('#tutorialMsg').animate({
      left: "650px",
      top: "100px",
    })
    $("#arrow").pointat({ target: "#menuUpgrades" });
    if ($('.tile').length >= 2) {
      tutorial++;
    }
    if (voice == 1) {
      voice++;
      speak("点击升级并购买土地升级.")
    }
  }
  if (tutorial == 3) {
    $('#arrow').animate({
      left: "800px",
      top: "150px",
    })
    $('#tutorialMsg').html("<label>3/7</label>现在继续种植小麦，将小麦利润乘数提高到1.3倍");
    $('#tutorialMsg').animate({
      left: "650px",
      top: "100px",
    })
    $("#arrow").pointat({ target: "#menuUpgrades" });
    if (wheat.efficiency >= 1.3) {
      tutorial++;
    }
    if (voice == 2) {
      voice++;
      speak("现在继续种植小麦，将小麦利润乘数提高到1.3倍")
    }
  }
  if (tutorial == 4) {
    $('#arrow').animate({
      left: "800px",
      top: "150px",
    })
    $('#tutorialMsg').html("<label>4/7</label>干得好!<br>现在继续种植，直到达到3级.<br><b>记住</b>您也可以单击并按住鼠标左键，然后将鼠标悬停或滑过方块上以快速种植.");
    $('#tutorialMsg').animate({
      left: "650px",
      top: "100px",
    })
    $("#arrow").pointat({ target: "#cell0" });
    if (level >= 3) {
      tutorial++;
    }
    if (voice == 3) {
      voice++;
      speak("干得好!现在继续种植，直到达到3级.记住您也可以单击并按住鼠标左键，然后将鼠标悬停在方块上以快速种植")
    }
  }
  if (tutorial == 5) {
    $('#arrow').animate({
      left: "300px",
      top: "250px",
    })
    $('#tutorialMsg').html("<label>5/7</label>干得好！在这里你可以看到植物统计数据，注意有<b>生长</b>，它告诉你植物生长最快的季节。<br><button onclick=tutNext();>Next</button>");
    $('#tutorialMsg').animate({
      left: "450px",
      top: "200px",
    })
    $("#arrow").pointat({ target: "#info" });
    if (voice == 4) {
      voice++;
      speak("干得好！在这里你可以看到植物的统计数据，注意有“种植季节”，告诉你植物生长最快的季节。")
    }
  }
  if (tutorial == 6) {
    $('#arrow').animate({
      left: "500px",
      top: "150px",
    })
    $('#tutorialMsg').html("<label>6/7</label>一旦你解锁了新植物，它们就会出现在这个下拉列表中.<button onclick=tutNext();>Next</button>");
    $('#tutorialMsg').animate({
      left: "650px",
      top: "100px",
    })
    $("#arrow").pointat({ target: "#plant" });
    if (voice == 5) {
      voice++;
      speak("一旦你解锁了新植物，它们就会出现在这个下拉列表中.")
    }
  }
  if (tutorial == 7) {
    $('#arrow').animate({
      left: "80%",
      top: "350px",
    })
    $('#tutorialMsg').html("<label>7/7</label>您还可以单击此按钮隐藏屏幕上部分菜单。玩得高兴!<button onclick=tutNext();>Close</button>");
    $('#tutorialMsg').animate({
      left: "75%",
      top: "200px",
    })
    $("#arrow").pointat({ target: "#openMenuBtn" });
    if (voice == 6) {
      voice++;
      speak("您还可以单击此按钮隐藏屏幕上部分菜单。玩得高兴!")
    }
  }
  if (tutorial >= 8 || tutorial == 0) {
    $('#tutorialMsg').remove();
    $('#arrow').remove();
  }

  if (tutorial > 0) {
    $('#arrow').css({
      display: "block",
    })
  }
  $('#challengeOption').show();
  if (challenge) {
    $('#challengeOption').hide();
  }
  $('#currentChallenge').html("您当前的挑战: " + challenge);
  if (!challenge) {
    $('#currentChallenge').html("你没有游戏记录.");
  }
  var chal = $('#challengeOption').val();
  if (chal == "winter only") $('#challengeDesc').html("冬天已经持续了很长一段时间，但雪花无法阻止你！");
  if (chal == "hideout") $('#challengeDesc').html("政府已经宣布农业为非法，并且会不定期检查每个农场。确保你不会被抓到！");
  if (chal == "race") $('#challengeDesc').html("与你的邻居竞争最佳植物比赛。要想获胜，你必须在时间限制之前到达茉莉！");
  if (chal == "debt") $('#challengeDesc').html("你的祖父已经负债累累，现在这个债务已经传给了你。确保在时间限制之前偿还债务！");
  if (chal == "quest chaos") $('#challengeDesc').html("你的老板最近对你请了这么多天假很不满意，他度假的时候给你安排了很多工作。多么不公平！");
  if (chal == "missing plants") $('#challengeDesc').html("曾经有过一场瘟疫，一半的植物都消失了！但这无法阻止你成为历史上最伟大的农民！");
  if (chal == "five slots") $('#challengeDesc').html("地面已经被未知的生物感染。他们喜欢土地，如果需要的话，他们会为土地而战。你最多只能有5个土地，否则他们会注意到你。");
  if (chal == "slot loss") $('#challengeDesc').html("未知的生物再次发动攻击！这次，如果你有超过2个土地，他们每30秒就会攻击一次。（每30秒失去1个土地。）");
  if (chal == "wheat only") $('#challengeDesc').html("除了小麦之外，每种植物都被未知的生物毒害了。你只能种植小麦，但因为它是唯一的植物，所以升级变得更便宜了。");
  if (chal == "no upgrades") $('#challengeDesc').html("现在是公元前300年，技术还没有发展，你必须依赖国王给你的唯一土地。");


  setTimeout(tut, 500);
}
tut();

function roundTo(number, dp) {
  if (!dp) dp = 2;
  dp = Math.pow(10, dp);
  return Math.floor((number * dp)) / dp;
}


function buyMoreSpace() {
  i = $('.tile').length;
  var element = '<div class=tile id=cell' + i + ' onclick=plant(this);></div>';
  if (money >= moreSpacePrice) {
    money -= moreSpacePrice;
    add("<span style='color: red;'>" + "-$" + simplify(moreSpacePrice) + "</span>", "log", 0, 100);
    moreSpacePrice *= 1.35;
    $('#map').append(element);
  }
}

function buyMoreGrowthSpeed() {
  if (money >= growthSpeedPrice) {
    money -= growthSpeedPrice;
    add("<span style='color: red;'>" + "-$" + simplify(growthSpeedPrice) + "</span>", "log", 0, 100);
    growthSpeedPrice *= 10;
    growthSpeed += 0.5;
  }
}

function buyReplantChance() {
  if (money >= replantPrice && replantChance < 25) {
    money -= replantPrice;
    replantPrice *= 2;
    replantChance++;
    tooltip();
    $('#replantUpgradeBtn').attr('title', "$" + simplify(replantPrice));
  }
}



function simplify(number) {
  var simplifyNumbers = $("#simplifyNumbers").hasClass("active");
  if (!simplifyNumbers) return (Math.floor(number * 100) / 100).toLocaleString();
  var show = number;

  // var numberNames = ["","thousand","million","billion","trillion","quadrillion","quintillion","sextillion","septillion","octillion","nonillion","decillion","undecillion","duodecillion","tredecillion","quattuordecillion","quindecillion","sexdecillion","septendecillion","octodecillion","novemdecillion","vigintillion","unvigintillion","duovigintillion","tresvigintillion","quattuorvigintillion","quinvigintillion","sesvigintillion","septemvigintillion","Octovigintillion","Novemvigintillion","Trigintillion","Untrigintillion","Duotrigintillion","Trestrigintillion","Quattuortrigintillion","Quintrigintillion","Sestrigintillion","Septentrigintillion","Octotrigintillion","Noventrigintillion","Quadragintillion","Unquadragintillion","Duoquadragintillion","Tresquadragintillion","Quattuorquadragintillion","Quindragintillion","Sesquadragintillion","Septenquadragintillion","Octoquadragintillion","Novenquadragintillion","Quinquagintillion","Unquinquagintillion","Duoquinquagintillion","Tresquinquagintillion","Quattuorquinquagintillion","Quinquinquagintillion","Sesquinquagintillion","Septenquinquagintillion","Octoquinquagintillion","Novenquinquagintillion","Sexagintillion","Unsexagintillion","Duosexagintillion","Tresexagintillion","Quattuorsexagintillion","Quinsexagintillion","Sesexagintillion","Septensexagintillion","Octosexagintillion","Novensexagintillion","Septuagintillion","Unseptuagintillion","Duoseptuagintillion","Treseptuagintillion","Quattuorseptuagintillion","Quinseptuagintillion","Seseptuagintillion","Septenseptuagintillion","Octoseptuagintillion","Novenseptuagintillion","Octogintillion","Unoctogintillion","Duooctogintillion","Tresoctogintillion","Quattuoroctogintillion","Quinoctogintillion","Sexoctogintillion","Septemoctogintillion","Octooctogintillion","Novemoctogintillion","Nonagintillion","Unnonagintillion","Duononagintillion","Trenonagintillion","Quattuornonagintillion","Quinnonagintillion","Sexnonagintillion","Septenonagintillion","Octononagintillion","Novenonagintillion","Centillion","Uncentillion","Duocentillion","Trescentillion"]
  var numberNames = ["", "x10<sup>3</sup>", "10<sup>6</sup>", "10<sup>9</sup>", "10<sup>12</sup>", "10<sup>15</sup>", "10<sup>18</sup>", "10<sup>21</sup>", "10<sup>24</sup>", "10<sup>27</sup>", "10<sup>30</sup>", "10<sup>33</sup>", "10<sup>36</sup>", "10<sup>39</sup>", "10<sup>42</sup>", "10<sup>45</sup>", "10<sup>48</sup>", "10<sup>51</sup>", "10<sup>54</sup>", "10<sup>57</sup>", "10<sup>60</sup>", "10<sup>63</sup>", "10<sup>66</sup>", "10<sup>69</sup>", "10<sup>72</sup>", "10<sup>75</sup>", "10<sup>78</sup>", "10<sup>81</sup>", "10<sup>84</sup>", "10<sup>87</sup>", "10<sup>90</sup>", "10<sup>93</sup>", "10<sup>96</sup>", "10<sup>99</sup>", "10<sup>102</sup>", "10<sup>105</sup>", "10<sup>108</sup>", "10<sup>111</sup>", "10<sup>114</sup>", "10<sup>117</sup>", "10<sup>120</sup>", "10<sup>123</sup>", "10<sup>126</sup>", "10<sup>129</sup>", "10<sup>132</sup>", "10<sup>135</sup>", "10<sup>138</sup>", "10<sup>141</sup>", "10<sup>144</sup>", "10<sup>147</sup>", "10<sup>150</sup>", "10<sup>153</sup>", "10<sup>156</sup>", "10<sup>159</sup>", "10<sup>162</sup>", "10<sup>165</sup>", "10<sup>168</sup>", "10<sup>171</sup>", "10<sup>174</sup>", "10<sup>177</sup>", "10<sup>180</sup>", "10<sup>183</sup>", "10<sup>186</sup>", "10<sup>189</sup>", "10<sup>192</sup>", "10<sup>195</sup>", "10<sup>198</sup>", "10<sup>201</sup>", "10<sup>204</sup>", "10<sup>207</sup>", "10<sup>210</sup>", "10<sup>213</sup>", "10<sup>216</sup>", "10<sup>219</sup>", "10<sup>222</sup>", "10<sup>225</sup>", "10<sup>228</sup>", "10<sup>231</sup>", "10<sup>234</sup>", "10<sup>237</sup>", "10<sup>240</sup>", "10<sup>243</sup>", "10<sup>246</sup>", "10<sup>249</sup>", "10<sup>252</sup>", "10<sup>255</sup>", "10<sup>258</sup>", "10<sup>261</sup>", "10<sup>264</sup>", "10<sup>267</sup>", "10<sup>270</sup>", "10<sup>273</sup>", "10<sup>276</sup>", "10<sup>279</sup>", "10<sup>282</sup>", "10<sup>285</sup>", "10<sup>288</sup>", "10<sup>291</sup>", "10<sup>294</sup>", "10<sup>297</sup>", "10<sup>300</sup>", "10<sup>303</sup>", "10<sup>306</sup>", "10<sup>309</sup>", "10<sup>312</sup>"];

  for (var g = 1; g < numberNames.length; g++) {
    if (number >= Math.pow(10, g * 3) && number < Math.pow(10, (g * 3) + 3)) {
      return Math.floor(show / Math.pow(10, (g * 3) - 2)) / 100 + " " + numberNames[g];
      break;
    }

    if (g == numberNames.length - 1) {
      return Math.floor(show * 100) / 100;
    }
  }
}

setInterval(function () {
  $('.animation').each(function () {
    $(this).animate({
      top: $(window).height() - 50,
      opacity: 0.2,
    }, 1000, "swing", function () {
      $(this).remove();
    })
  });

}, 100);

function add(value, id, min, max, enabled) {
  var popups = $("#numberPopUps").hasClass("active");
  if (!popups && !enabled) return;
  var rand = Math.floor((Math.random() * max) + min);
  var element = '<div class=animation style="left: RANDpx; top: -20px;">' + value + '</div>';
  element = element.replace(/RAND/gi, rand);
  $("#" + id).append(element);
}

// $('select').selectmenu();

function fillAll() {
  var checked = $('#useSelectedPlant').hasClass("active");
  var tileLength = $('.tile').length;
  var reversed = [];
  for (var l = 0; l < plants.length; l++) {
    reversed[l] = plants[plants.length - 1 - l]
  }

  if (checked) {
    for (var i = 0; i < tileLength; i++) {
      var selected = $('#plant').val();
      var tile = $('#cell' + i);
      var unlocked = window[selected].unlocked;
      var price = window[selected].cost;
      if (tile.html() == "" && unlocked && money >= price) {
        plant(tile[0], selected);
      }
    }
    return;
  }

  for (var f = 0; f < tileLength; f++) {
    for (var g = 0; g < plants.length; g++) {
      var tile = $('#cell' + f);
      var unlocked = window[reversed[g]].unlocked;
      var price = window[reversed[g]].cost;
      if (tile.html() == "" && unlocked && money >= price) {
        plant(tile[0], reversed[g]);
        break;
      }

    }
  }
}

function upEff(obj) {
  var price = window[obj].effPrice;
  if (money >= price && window[obj].efficiency < window[obj].efficiencyMax) {
    money -= price;
    window[obj].effPrice *= 1.005;
    window[obj].efficiency += 0.01;
    var perc = window[obj].efficiency / window[obj].efficiencyMax * 100;

  }
}

function unlock(obj) {
  var price = window[obj].unlockPrice;
  if (money >= price) {
    money -= price;
    $('#' + obj + "UnlockBtn").remove();
    window[obj].unlocked = true;
    var name = "$" + window[obj].cost + " " + obj;
  }
}

function buyFill() {
  if (money >= 1e6) {
    money -= 1e6;
    fillAllBtnUnlocked = true;
    $('#fillAllBtn').prop("disabled", false);
    $('#buyFillBtn').remove();
  }
}



function achievementUnlocked(text, title) {
  var hasClass = $('.ach').hasClass('achieved');
  if (hasClass) return;
  if (!title) title = false;
  if (title) $('.title').html("Achievement unlocked!");
  $('.detail').html(text);
  $('.ach').addClass("achieved");
  setTimeout(function () {
    $('.ach').removeClass("achieved");
  }, 5000)
}


window.onmouseover = function (e) {
  if (!holdingMouse) return;
  if (e.target.innerHTML) {
    return;
  }
  // className == "tile"
  if (e.target.innerHTML == "" && e.target.className == "tile") {
    plant(e.target);
  }
};


for (var i = 0; i < plants.length; i++) {
  var obj = plants[i];
  var perc = window[obj].efficiency / window[obj].efficiencyMax * 100;
  $('#' + obj + "EffBar").html("x" + (Math.round(window[obj].efficiency * 100)) / 100);
  $('#' + obj + "EffBar").css({
    width: perc + "%",
  })
}


$('.checkbox').click(function () {
  $(this).toggleClass("active");
  var selector = $(this).hasClass("active");
  $(this).html("")

  /* 如果点击的设置项是自动种植，则调用自动种植函数 */
  if ($(this).attr("id") == "autoPlantingEnable") {
    autoPlantingLoop(true);
  }
});


function openNav() {
  $('#navbar').animate({
    width: "200px",
    right: "10px",
  })
  $('#contents').animate({
    right: "250px",
  })
}

function closeNav() {
  $('#navbar').animate({
    width: "0px",
    right: "-250px",
  })
  $('#contents').animate({
    right: "-500px",
  })
}

jQuery.fn.clickToggle = function (a, b) {
  var ab = [b, a];
  return this.on("click", function () { ab[this._tog ^= 1].call(this); });
};

$("#openMenuBtn").clickToggle(function () {
  closeNav();
}, function () {
  openNav();
});


/////////////////////////////////
//        IN PROGRESS          //
/////////////////////////////////
var property = ["cost", "efficiency", "efficiencyMax", "effPrice", "growsIn", "profit", "timeToGrow", "unlocked", "unlockPrice", "totalGrown"];
var variables = ["xp", "xpN", "level", "growthSpeed", "currentSeason", "moreSpacePrice", "growthSpeedPrice", "money", "skillpoints", "fillAllBtnUnlocked", "challenge", "debtLeft", "debtTimeLeft", "raceTimeLeft", "inspectionTimeLeft", "questTimeLeft", "questCollected", "currentQuest", "slotTime", "replantPrice", "replantChance", "seasonTime"];

function saveTest() {
  achievementUnlocked("<code style=font-size:20px;>游戏已保存!</code>", false);
  var saveFile = {};
  for (var i = 0; i < plants.length; i++) {
    for (var j = 0; j < property.length; j++) {
      saveFile[plants[i] + property[j]] = window[plants[i]][property[j]];

    }
  }
  var variabless = {};
  for (var i = 0; i < variables.length; i++) {
    variabless[variables[i]] = window[variables[i]];
  }

  localStorage["variabless"] = JSON.stringify(variabless);
  localStorage["saveFile"] = JSON.stringify(saveFile);

  var tiles = "";

  for (var i = 0; i < $('.tile').length; i++) {
    var cell = $('#cell' + i);
    if (i < $('.tile').length - 1) {
      tiles += "|";
    }
  }
  localStorage["tiles"] = tiles;

  localStorage["skilltree"] = JSON.stringify(skilltree);

  localStorage["achievements"] = JSON.stringify(achievements);

}

function loadTest() {
  var saveFile = JSON.parse(localStorage.getItem("saveFile"));
  if (!saveFile) return;
  achievementUnlocked("<code style=font-size:20px;>游戏已加载!</code>", false);
  for (var i = 0; i < plants.length; i++) {
    for (var j = 0; j < property.length; j++) {
      if (!plants[i] || !property[j]) continue;
      if (property[j] == "cost" || property[j] == "growsIn" || property[j] == "profit" || property[j] == "unlockPrice") continue;
      window[plants[i]][property[j]] = saveFile[plants[i] + property[j]];
    }
  }
  var tiles = localStorage.getItem("tiles");

  tiles = tiles.split("|");
  $('.tile').remove();
  for (var i = 0; i < tiles.length; i++) {
    var element = '<div class=tile id=cell' + i + ' onclick=plant(this);></div>';
    $('#map').append(element);
    $('#cell' + i).html(tiles[i]);
  }
  var variabless = JSON.parse(localStorage["variabless"]);

  for (var i = 0; i < variables.length; i++) {
    if (!variabless[variables[i]]) continue;
    window[variables[i]] = variabless[variables[i]];
  }
  // skill tree

  skilltree = JSON.parse(localStorage["skilltree"]);

  achievements = JSON.parse(localStorage["achievements"]);

  for (var key in achievements) {
    for (var s = 0; s < achievements[key].amount.length; s++) {
      if (achievements[key].achieved[s]) {
        $('#' + key + achievements[key].amount[s]).html("");
        var title = "种植 " + achievements[key].amount[s].toLocaleString() + " " + achievements[key].nameZh + "(s).";
        $('#' + key + achievements[key].amount[s]).html("<img src=http://game-icons.net/icons/delapouite/originals/svg/trophy-cup.svg class=info title='" + title + "'>");
      }
    }
  }
}


setTimeout(loadTest, 100);

setInterval(saveTest, 30000);



var ml = [
  10, 2, 10, 10,
  10, 4, 10, 10,
  14, 6, 14, 14,
  10, 8, 10, 10
];
/* var n = [
  "Growth speed I","Space I","Profit I","More XP I",
  "Growth speed II","Space II","Profit II","More XP II",
  "Growth speed III","Space III","Profit III","More XP III",
  "Growth speed IV","Space IV","Profit IV","More XP IV"
];
var t = [
  "growthSpeed","space","profit","xp",
  "growthSpeed","space","profit","xp",
  "growthSpeed","space","profit","xp",
  "growthSpeed","space","profit","xp",
]; */
var n = [
  "生长速度 I", "土地 I", "利润 I", "更多XP I",
  "生长速度 II", "土地 II", "利润 II", "更多XP II",
  "生长速度 III", "土地 III", "利润 III", "更多XP III",
  "生长速度 IV", "土地 IV", "利润 IV", "更多XP IV"
];
var t = [
  "生长速度", "土地", "利润", "xp",
  "生长速度", "土地", "利润", "xp",
  "生长速度", "土地", "利润", "xp",
  "生长速度", "土地", "利润", "xp",
];
var g = [
  1, 2, 1, 2,
  5, 3, 2, 5,
  10, 4, 5, 10,
  20, 5, 10, 15,
];
for (var i = 0; i < 16; i++) {
  skilltree["btn" + i] = {
    level: 0,
    maxlevel: ml[i],
    name: n[i],
    type: t[i],
    gives: g[i],
  }
}

for (var a = 0; a < 16; a++) {
  var maxlevel = skilltree["btn" + a].maxlevel;
  var upgradeType = skilltree["btn" + a].type;

  var element = '<button disabled data-level=0 data-maxlevel=' + maxlevel + ' onclick="levelUp(this);"></button>';
  $('#skilltree').append(element);
}
// tooltips on top of buttons!
// resetable skill tree !

//https://silviomoreto.github.io/bootstrap-select/examples/

function loop() {

  var length = $('#skilltree > button').length;
  var rowNumber = 4;
  for (var i = 0; i < length; i++) {
    var btn = $('#skilltree > button')[i];

    var level = skilltree["btn" + i].level;
    var maxlevel = skilltree["btn" + i].maxlevel;

    var nextBtn = $('#skilltree > button')[i + rowNumber];

    var name = skilltree["btn" + i].name;
    var gives = skilltree["btn" + i].gives;
    var type = skilltree["btn" + i].type;

    var perc = level * gives + "% +" + gives + "%";
    var msg = level * gives + "%";
    if (type == "space") {
      perc = perc.replace(/%/g, "");
      msg = msg.replace(/%/g, "");
    }


    btn.innerHTML = "<b>" + name + "</b><br>lvl " + level + " / " + maxlevel + "<br>" + perc;
    if (i < 4) {
      btn.disabled = false;
    }
    var nextBtnLevel = Math.floor(maxlevel);
    if (level >= nextBtnLevel && nextBtn) {
      nextBtn.disabled = false;
    }
    if (maxlevel == level) {
      btn.style.backgroundColor = "green";
      btn.style.border = "2px solid darkgreen";
      btn.innerHTML = name + "<br>最大等级<br>" + msg;
    }
  }

  $('#skillpoints').html("剩余技能点: " + skillpoints + "");

  /////////////////////////////////
  //       ACHIEVEMENTS          //
  /////////////////////////////////


  for (var key in achievements) {
    var amount = achievements[key].amount;
    var obj = window[key].totalGrown;
    for (var i = 0; i < amount.length; i++) {
      var achieved = achievements[key].achieved[i];
      if (obj >= amount[i] && achieved == false) {
        var text = achievements[key].achievementName[i] + "<br><span class=achievementText>种植 " + amount[i].toLocaleString() + " " + achievements[key].nameZh + "</span>";
        achievements[key].achieved[i] = true;
        text = text.replace(/undefined/g, "Achievement Unlocked!")
        window[key].efficiency += 0.04 * i + 0.04;

        // spop("&#127942;"+text+"<br> <span class=achievementRewardText>+"+(4*i+4)+"% "+key+" 利润乘数!</span>");
        spop("&#127942;" + text + "<br> <span class=achievementRewardText>+" + (4 * i + 4) + "% " + achievements[key].nameZh + " 利润乘数!</span>");

        // var title = achievements[key].achievementName[i]+"\nGrow "+amount[i].toLocaleString()+" "+key+"(s).";
        var title = "种植 " + amount[i].toLocaleString() + " " + achievements[key].nameZh + "(s).";
        $('#' + key + amount[i]).html("<img src=http://game-icons.net/icons/delapouite/originals/svg/trophy-cup.svg class=info title='" + title + "'>");
        tooltip();
        // $('#'+key+amount[i]).attr('title',title);
        // $('#'+key+amount[i]).addClass('info');
      }
    }
  }
  var stats = "";
  stats += "技能树<br>经验值提升: " + xpBoost + "x<br>利润提升: " + profitBoost + "x<br>增长速度提升: " + growthSpeedBoost + "x<hr>";
  for (var l = 0; l < plants.length; l++) {
    var p = window[plants[l]];
    if (p.unlocked == false) continue;
    // stats += plants[l]+": <br>总增长: "+(p.totalGrown).toLocaleString()+"<br>售价: $"+(p.profit * p.efficiency * profitBoost).toLocaleString()+"<hr>";
    stats += plantsZh[l] + ": <br>总增长: " + (p.totalGrown).toLocaleString() + "<br>售价: $" + (p.profit * p.efficiency * profitBoost).toLocaleString() + "<hr>";
  }


  $('#stats').html(stats);





  setTimeout(loop, 100);
}
loop();

function levelUp(obj) {
  var index = $(obj).index() - 2;
  var level = skilltree["btn" + index].level;
  var maxlevel = skilltree["btn" + index].maxlevel;
  if (skillpoints <= 0 || level >= maxlevel) return;
  skillpoints--;
  var upgrades = skilltree["btn" + index].type;
  var index = $(obj).index() - 2;
  if (level >= maxlevel) return;
  var newLevel = parseInt(level) + 1;
  skilltree["btn" + index].level++;
  if (upgrades == "space") {
    var gives = skilltree["btn" + index].gives;
    for (var l = 0; l < gives; l++) {
      var id = $('.tile').length;
      var element = '<div class=tile id=cell' + id + ' onclick=plant(this);></div>';
      $('#map').append(element);
    }
  }
}

setInterval(function () {
  growthSpeedBoost = 1;
  xpBoost = 1;
  profitBoost = 1;
  for (var index = 0; index < 16; index++) {
    var l = skilltree["btn" + index].level;
    var gives = skilltree["btn" + index].gives;
    var type = skilltree["btn" + index].type;
    if (type == "growthSpeed") {
      growthSpeedBoost += (l * gives) / 100;
    }
    if (type == "xp") {
      xpBoost += (l * gives) / 100;
    }
    if (type == "profit") {
      profitBoost += (l * gives) / 100;
    }

  }
}, 2500);



function tooltip() {
  $('.info').tooltipster({
    delay: 100,
    animation: "grow",
    theme: 'tooltipster-punk',
    multiple: true,
  })
}
tooltip();
setInterval(tooltip, 2500);



function reset() {
  var input = prompt("输入 'yes' 确认重置游戏进度.");
  input = input.toLowerCase();
  if (input == "yes") {
    localStorage.clear();
    history.go(0);
  }
}


$('#game').hide();
$('#mainMenu').css({
  width: "100%",
  height: "100%",
})

function startGame() {
  if (!challenge) {
    challenge = $('#challengeOption').val();
  }
  $('#mainMenu').hide();
  $('#game').show();
  if ($('#tutorial').hasClass("active")) {
    tutorial = 1;
  }
  else {
    tutorial = 0;
  }
  if (challenge == "wheat only") {
    wheat.effPrice = 0.001;
    for (var b = 1; b < plants.length; b++) {
      $('#' + plants[b] + "UnlockBtn").prop("disabled", true);
    }
  }
  if (challenge == "no upgrades") {
    $('#map').html("");
    for (var i = 0; i < 5; i++) {
      var s = $('.tile').length;
      var element = '<div class=tile id=cell' + s + ' onclick=plant(this);></div>';
      $('#map').append(element);
    }
  }
}

function challenges() {
  if (challenge == "winter only") {
    currentSeason = 3;
  }
  if (challenge == "debt") {
    $('#menuDebt').show();
    debtTimeLeft -= 1;
  }
  if (challenge == "debt" && debtTimeLeft < 0) {
    alert("你输了！因为没有及时还清债务，你和你的家人被从农场赶出去了。没工作了！");
    localStorage.clear();
    history.go(0);
  }
  $('#timeLeft').html(format(debtTimeLeft));
  $('#debtLeft').html("$" + debtLeft.toLocaleString())
  if (challenge == "missing plants") {
    for (var k = 0; k < plants.length; k++) {
      if (k % 2 == 0) {
        $('#' + plants[k + 1] + "UnlockBtn").remove();
      }

    }
  }

  if (challenge == "race") {
    $('#raceTimeLeft').html(format(raceTimeLeft));
    raceTimeLeft -= 1;
    if (jasmine.unlocked) {
      alert("你赢得了比赛挑战！做得好!");
      localStorage.clear();
      history.go(0);
    }
    if (raceTimeLeft < 0) {
      alert("你输掉了比赛挑战！你的邻居打败了你，获得了所有的名声。祝你下次好运。");
      localStorage.clear();
      history.go(0);
    }
  }

  if (challenge == "hideout") {
    $('#raceTimeLeft').css({
      color: "black",
    })
    inspectionTimeLeft--;
    if (inspectionTimeLeft < 5) {
      $('#raceTimeLeft').css({
        color: "red",
      })
    }
    $('#raceTimeLeft').html("检查中: " + format(inspectionTimeLeft));
    if (inspectionTimeLeft <= 0) {
      for (var h = 0; h < $('.tile').length; h++) {
        var html = $('#cell' + h).html();

        if (html) {
          alert("政府抓到你务农了！你输了！祝你下次好运");
          localStorage.clear();
          history.go(0);
        }
      }
      inspectionTimeLeft = Math.floor(Math.random() * 60);
    }
  }
  var randomPlant = [];
  for (var j = 0; j < plants.length; j++) {
    if (window[plants[j]].unlocked) {
      randomPlant.push(plants[j]);
    }
  }
  $('#menuQuest').hide();
  if (challenge == "quest chaos") {
    $('#menuQuest').show();
    questTimeLeft--;
    $('#questTimeLeft').html(format(questTimeLeft));
    $('#quest').html("农场 " + currentQuest + "<br>收集: " + questCollected);
    var quest = currentQuest.split(" ");
    var amount = parseInt(quest[0]);
    if (questCollected >= amount) {
      // new quest
      var randPlant = randomPlant[Math.floor(Math.random() * randomPlant.length)];
      var randAmount = Math.floor(Math.random() * level * 10) + level * 3;
      var randTime = Math.floor((randAmount * 1.5 * window[randPlant].timeToGrow) / $('.tile').length);
      currentQuest = randAmount + " " + randPlant;
      questTimeLeft = randTime;
      questCollected = 0;
      speak("New task! Collect " + randAmount + " " + randPlant);
    }

    if (questCollected < amount && questTimeLeft < 0) {
      alert("You lost, your boss fires you due to 'laziness'.");
      localStorage.clear();
      history.go(0);
    }
  }

  if (challenge == "five slots") {
    var slots = $('.tile').length;
    if (slots >= 5) {
      for (var kk = 5; kk < slots; kk++) {
        $('#cell' + kk).remove();
      }
      $('#moreSpaceBtn').prop("disabled", true);
      $('#moreSpaceBtn').html("Maximum slots<br>reached!")
    }
  }

  if (challenge == "slot loss") {
    slotTime--;
    $('#raceTimeLeft').html("Lose slot in " + format(slotTime));
    if (slotTime <= 0) {
      var length = $('.tile').length;
      if (length > 5) {
        $('.tile').last().remove();
      }
      slotTime = 30;
    }
    if (slotTime <= 0) {
      slotTime = 1;
    }
  }
  if (challenge == "no upgrades") {
    $('#menuUpgrades').hide();
  }


  setTimeout(challenges, 1000);
}
challenges();

$('#debtBtn').click(function () {
  debtLeft -= money;
  money = 0;
  if (debtLeft < 0) {
    alert("Well done! You have helped your grandad and successfully won the challenge!");
    localStorage.clear();
    loadTest();
  }
});

function format(number) {
  var toDisplay = "";

  var time = number;

  if (time >= 3600) {
    var hours = Math.floor(time / 3600);
    time -= hours * 3600;
    toDisplay += hours + "h ";
  }
  if (time >= 60) {
    var minutes = Math.floor(time / 60);
    time -= minutes * 60;
    toDisplay += minutes + "min ";
  }
  toDisplay += Math.floor(time * 10) / 10 + "sec";

  return toDisplay;
}

$('#menuQuest').draggable({
  containment: '#game',
});

function speak(msg) {
  speechSynthesis.cancel();
  var toSay = new SpeechSynthesisUtterance(msg);
  var voices = window.speechSynthesis.getVoices();
  toSay.voice = voices[0];
  window.speechSynthesis.speak(toSay);
}
speak("");


function buyMaxEff() {
  for (var c = 0; c < 1000; c++) {
    upEff($('#plant').val())
  }
}


/* 自动种植函数 */
/* async function autoPlantingLoop() {
  var autoPlantingEnabled = $('#autoPlantingEnable').hasClass("active");

  // 使用自定义的sleep函数，利用Promise和setTimeout实现异步延迟
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  while (autoPlantingEnabled) {
    fillAll();  // 调用你的fillAll函数

    // 更新autoPlantingEnabled状态
    autoPlantingEnabled = $('#autoPlantingEnable').hasClass("active");

    // 异步等待一段时间
    await sleep(500);
  }
} */
async function autoPlantingLoop(defaultCall) {
  var autoPlantingEnabled = $('#autoPlantingEnable').hasClass("active");
  //如果是defaultCall为真，则视为第一次调用，设置autoPlantingCall为0以避免延迟
  if (defaultCall) {
    autoPlantingCall = 0;
  }

  // 使用自定义的sleep函数，利用Promise和setTimeout实现异步延迟
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  if (autoPlantingEnabled) {
    // 如果autoPlantingCall大于0，则视为非第一次调用，需要等待一段时间避免频繁调用
    if (autoPlantingCall > 0) { 
      await sleep(500); // 异步等待一段时间
    }
    fillAll();  // 调用fillAll函数在所有土地上种植

    autoPlantingCall = 0;
  }
}

// 当页面加载完成后执行
$(document).ready(function () {
  function handlePlantChange() {
    // 获取当前选中的option元素
    var selectedOption = $('#plant').find('option:selected');

    // 从选中的option获取id值
    var optionId = selectedOption.attr('id');

    // 将选中的option的id值追加到select的id后面
    $('#plant').attr('class', optionId);

  }

  // 绑定change事件
  $('#plant').change(handlePlantChange);

  // 页面加载完成后，手动触发一次change事件
  $('#plant').trigger('change');
});



(function (c) { var b, d, a = { init: function (e) { d = { hookScroll: true, hookDrag: true, draggable: null, pointAtInit: true, defaultDirection: "up", angleLessThanFunc: null, angleGreaterThanFunc: null, getAngleFrom: null, passAngleTo: null, xCorrection: 0, yCorrection: 0, pause: false, rotateFunction: "jqrotate", changeTargetTo: "low" }; b = c.extend({}, d, e); return this.each(function () { var g = c("body").data("pointatcount"), f = c(this).data("myid.pointat"), i = ".pointat", h = this; f = +f || 0; i = ".pointat" + f; if (f > 0) { oldsettings = c(this).data("settings.pointat"); c.each(b, function (j, k) { if (k === d[j]) { b[j] = oldsettings[j]; } }); c(this).data("settings.pointat", b); } else { g = +g || 0; g++; i = ".pointat" + g; c(this).data("settings.pointat", b); c(this).data("myid.pointat", g); c("body").data("pointatcount", g); } if (b.hookScroll) { scrollnspace = "scroll" + i; c(window).bind(scrollnspace, function () { a.updateRotation.apply(h); }); } if (b.hookDrag) { if (b.draggable !== null) { c(b.draggable).bind("drag.pointat", function () { a.updateRotation.apply(h); }); } else { c(h).bind("drag.pointat", function () { a.updateRotation.apply(h); }); } } if (b.pointAtInit) { a.updateRotation.apply(this); } }); }, getAngle: function (h) { var g = c(this).data("settings.pointat"), e, f, i; if (!g) { c.error("Method getAngle used on an element that does not have jQuery.PointAt initialized."); } h = typeof h !== "undefined" ? h : g.target; if (h instanceof Array) { h = h[0]; } f = c(h).offset(); i = 0; if (g.getAngleFrom !== null) { e = c(g.getAngleFrom).offset(); } else { e = c(this).offset(); } i = Math.atan2(((f.left + g.xCorrection) - e.left), ((f.top + g.yCorrection) - e.top)) * 180 / Math.PI; i = 180 - Math.ceil(i); if (g.defaultDirection === "right") { i = i - 90; } else { if (g.defaultDirection === "down") { i = i - 180; } else { if (g.defaultDirection === "left") { i = i - 270; } else { if (g.defaultDirection === "up") { } else { i = i - parseInt(g.defaultDirection, 10); } } } } if (i < 0) { i = 360 + i; } else { if (i > 360) { i = 0 + i; } } return i; }, updateRotation: function () { return c(this).each(function () { var g = c(this).data("settings.pointat"), f = c(this).data("angle.pointat"), l = [], h, e, n, j, k = g.changeTargetTo, m = 370; if (!g) { c.error("Method updateRotation used on an element that does not have jQuery.PointAt initialized."); } if (g.target instanceof Array) { if (isNaN(f)) { if (g.changeTargetTo === "low") { f = 361; } else { if (g.changeTargetTo === "high") { f = -1; } else { f = -1; } } } if (g.changeTargetTo === "low") { k = 0; } else { if (g.changeTargetTo === "high") { k = 360; } } for (j = 0; j < g.target.length; j++) { h = a.getAngle.apply(this, [g.target[j]]); if (m > Math.abs(k - h)) { m = Math.abs(k - h); f = h; n = g.target[j]; } } e = c(this).data("currentTarget.pointat"); if (n !== e) { l = [n, e]; c(this).data("currentTarget.pointat", n); c(this).trigger("changedTarget", l); } } else { f = a.getAngle.apply(this); } if (g.pause === false) { l = [c(this).data("angle.pointat"), f]; c(this).trigger("beforeRotate", l); } if (g.angleLessThanFunc !== null) { if (f < g.angleLessThan) { g.angleLessThanFunc.apply(this); } } if (g.angleGreaterThanFunc !== null) { if (f > g.angleGreaterThan) { g.angleGreaterThanFunc.apply(this); } } if (g.passAngleTo !== null) { if (c(g.passAngleTo).is("input")) { c(g.passAngleTo).val(f); } else { c(g.passAngleTo).html(f); } } if (g.pause === false) { c(this).data("angle.pointat", f); c(this)[g.rotateFunction](f); } c(this).trigger("afterRotate", l); }); }, destroy: function () { return this.each(function () { var f = c(this).data("settings.pointat"), e, g; if (!f) { c.error("Method destroy used on an element that does not have jQuery.PointAt initialized."); } e = c(this).data("myid.pointat"); g = ".pointat"; e = +e || 0; g = ".pointat" + e; c(window).unbind(g); if (f.hookDrag) { if (f.draggable !== null) { c(f.draggable).unbind("drag.pointat"); } else { c(this).unbind("drag.pointat"); } } c(this).removeData("settings.pointat"); c(this).removeData("myid.pointat"); }); }, pause: function () { return this.each(function () { var e = c(this).data("settings.pointat"); if (e) { e.pause = true; c(this).data("settings.pointat", e); } else { c.error("Method pause used on an element that does not have jQuery.PointAt initialized."); } }); }, resume: function () { return this.each(function () { var e = c(this).data("settings.pointat"); if (e) { e.pause = false; c(this).data("settings.pointat", e); } else { c.error("Method resume used on an element that does not have jQuery.PointAt initialized."); } }); } }; c.fn.pointat = function (e) { if (a[e]) { return a[e].apply(this, Array.prototype.slice.call(arguments, 1)); } else { if (typeof e === "object" || !e) { return a.init.apply(this, arguments); } else { c.error("Method " + e + " does not exist on jQuery.pointat"); } } }; })(jQuery);



$.fn.jqrotate = function (degrees, options) { var options = $.extend({ animate: false }, options); return this.each(function () { var $this = $(this); var oObj = $this[0]; var deg2radians = Math.PI * 2 / 360; var rad = degrees * deg2radians; var costheta = Math.cos(rad); var sintheta = Math.sin(rad); a = parseFloat(costheta).toFixed(8); b = parseFloat(-sintheta).toFixed(8); c = parseFloat(sintheta).toFixed(8); d = parseFloat(costheta).toFixed(8); $this.css({ '-ms-filter': 'progid:DXImageTransform.Microsoft.Matrix(M11=' + a + ', M12=' + b + ', M21=' + c + ', M22=' + d + ',sizingMethod=\'auto expand\')', 'filter': 'progid:DXImageTransform.Microsoft.Matrix(M11=' + a + ', M12=' + b + ', M21=' + c + ', M22=' + d + ',sizingMethod=\'auto expand\')', '-moz-transform': "matrix(" + a + ", " + c + ", " + b + ", " + d + ", 0, 0)", '-webkit-transform': "matrix(" + a + ", " + c + ", " + b + ", " + d + ", 0, 0)", '-o-transform': "matrix(" + a + ", " + c + ", " + b + ", " + d + ", 0, 0)" }) }) };


//下载存档
function saveFileDownload() {
  saveTest();//先保存1次再下载存档

  const keys = ['variabless', 'achievements', 'saveFile', 'skilltree', 'tiles'];

  const mergedData = {};

  keys.forEach(key => {
    const data = localStorage.getItem(key);

    if (data) {
      try {
        const jsonData = JSON.parse(data);
        mergedData[key] = jsonData;
      } catch (e) {
        console.error(`解析存档数据时出错 ${key}:`, e);
        mergedData[key] = data;
        return;
      }
    } else {
      console.warn(`在localStorage中存档数据对应的key: ${key}`);
    }
  });

  const blob = new Blob([JSON.stringify(mergedData, null, 2)], { type: 'application/json' });

  const url = window.URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'IdlleFarmer-SaveFile.json';

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  window.URL.revokeObjectURL(url);
}


//触发上传存档按钮
function saveFileUpload() {
  document.getElementById('saveUploadInput').click();
}
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    uploadJsonFile(file);
  }
  event.target.value = '';
  history.go(0);
}
//上传存档
function uploadJsonFile(file) {
  const reader = new FileReader();

  reader.onload = function (e) {
    const contents = e.target.result;
    let jsonData;

    try {
      jsonData = JSON.parse(contents);
    } catch (e) {
      console.error("解析上传的存档时出错:", e);
      alert("上传的存档格式不正确，请上传有效的JSON文件。");
      return;
    }

    for (const key in jsonData) {
      if (jsonData.hasOwnProperty(key)) {
        localStorage.setItem(key, JSON.stringify(jsonData[key]));
      }
    }

    alert("存档上传成功！");
  };

  reader.readAsText(file);
}