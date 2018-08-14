var monopolyboard = ['go','mediterranean','community chest','baltic','income tax','reading railroad',
                'oriental','chance','vermont','connecticut','jail / visiting','st. charles','electric company',
                'states','virginia','pennsylvania railroad','st. james','community chest','tennessee','new york',
                'free parking','kentucky','chance','indiana','illinois','B&O railroad','atlantic','ventnor',
                'water works','marvin','go to jail','pacific','north carolina','community chest','pennsylvania',
                'community chest','short line railroad','chance','park place','luxury tax','boardwalk'];

var properties = ["mediterranean", "baltic", "reading railroad", "oriental", "vermont", "connecticut", 
                "st. charles", "electric company", "states", "virginia", "pennsylvania railroad", "st. james", "tennessee", "new york", 
                "kentucky", "indiana", "illinois", "B&O railroad", "atlantic", "ventnor", "water works", "marvin", 
                "pacific", "north carolina", "pennsylvania", "short line railroad", "park place", "boardwalk"];

var prices = [60,60,200,100,100,120,
              140,175,140,160,200,180,180,200,
              220,220,240,200,260,260,175,280,
              300,300,320,200,350,400];

var deedsRequiredForMonopoly = [2,2,0,3,3,3,
                                3,2,3,3,0,3,3,3,
                                3,3,3,0,3,3,2,3,
                                3,3,3,0,2,2];

var tokens = ['car','iron','ship', 'wheelbarrow'];

var SpecialAction = {
    passedGo : function (player) {
        player.cash += 200;
        console.log('Passed Go. Cash:  $' + player.cash);
    },
    advNearest : function (dest) {
        switch (dest) {
            case 'utility':
                //todo
                break;
            case 'railroad':
                //todo
                break;
        }
    },
    goToJail : function(player) {
        player.currentlocation = 10;
        player.inJail = true;
        player.jailRollCount = 1;
    },
    payToGetOutOfJail : function (player) {
        player.cash -= 50;
    },
    bankrupt : function () {
        //todo
    }
};

var chanceDeck = [new Card('Advance to "Go", collect $200',200,0,0,false,null),
                  new Card('Advance to Illinois Ave. If you pass Go, collect $200.',200,0,24,true,null),
                  new Card('Advance to St. Charles Place. If you pass Go, collect $200.',200,0,11,true,null),
                  new Card('Advance token to nearest Utility. If unowned, you may buy it from the Bank.' +
                  ' If owned, throw dice and pay owner a total ten times the amount thrown.',0,0,0,true,SpecialAction.advNearest('utility'))];
var communityDeck = [];


function roll2Dice(player) {
    var d1, d2;
    d1 = Math.ceil(Math.random() * 6);
    d2 = Math.ceil(Math.random() * 6);
    return d1 + d2;
}

function Player(piece) {
    this.piece = piece;
    this.cash = 1500;
    this.deeds = [];
    this.currentlocation = 0;
    this.move = function (roll) {
        this.currentlocation += roll;
		if(this.currentlocation >= 40) {
            this.currentlocation %= 40;
            SpecialAction.passedGo(this);
        }
    };
    this.inJail = false;
    this.jailRollCount = 0;
    this.getOutOfJailFreeCard = false;
}

function Card(msg, collect, pay, move, boolGoCollect, specialAction) {
    this.msg = msg;
    this.collect = collect;
    this.pay = pay;
    this.move = move;
    this.boolGoCollect = boolGoCollect;
    this.specialAction = specialAction;
}

function Deed(ID) {
    this.name = properties[ID];
    this.owner = null;
    this.price = prices[ID];
    this.level = 0;
    this.totalDeedsInGroup = deedsRequiredForMonopoly[ID];
    this.monopoly = false;
}

function SelectToken(numberOfTokens) {
    tokens = shuffle(tokens);
    
    return tokens.slice(0,numberOfTokens);
}

function playerManager(numberOfPlayers) {
    this.players = [];
    rndTokens = SelectToken(numberOfPlayers);
    
    while(numberOfPlayers > 0) {
        this.players.push(new Player(rndTokens[numberOfPlayers-1]));
        numberOfPlayers--;
    }
}

function Test(turns, players)  {
    chanceCards = shuffle(chanceDeck);
    playerManager = new playerManager(players);
    deeds = []
    for(var i = 0, len = properties.length; i < len; i++)  {
        deeds.push(new Deed(i));
    }

    console.log(deeds.length + ' deeds generated.');

    for(var i = 0; i < turns; i++) {
        for(var j = 0; j < players; j++) {
            let dieRoll = roll2Dice(playerManager.players[j]);
            playerManager.players[j].move(dieRoll);
            if(playerManager.players[j].currentlocation == 30) {
                console.log('Player ' + (j + 1) + ' went to jail!');
                SpecialAction.goToJail(playerManager.players[j]);
                SpecialAction.payToGetOutOfJail(playerManager.players[j]);
            }
            console.log('The ' + playerManager.players[j].piece + ' rolled ' + dieRoll + ' and landed on ' 
                        + monopolyboard[playerManager.players[j].currentlocation]);
        }
    }

    for(var j = 0; j < players; j++) {
        console.log('The ' + playerManager.players[j].piece + ' has $' + playerManager.players[j].cash);
    }
}

function shuffle(array) {
    var m = array.length, t, i;
  
    // While there remain elements to shuffle…
    while (m) {
  
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);
  
      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
  
    return array;
  };

var playerManager, chanceCards, communityChestCards, deeds = [];

Test(35,4);