var deedNames = ["mediterranean", "baltic", "reading railroad", "oriental", "vermont", "connecticut", 
                "st. charles", "electric company", "states", "virginia", "pennsylvania railroad", "st. james", "tennessee", "new york", 
                "kentucky", "indiana", "illinois", "B&O railroad", "atlantic", "ventnor", "water works", "marvin", 
                "pacific", "north carolina", "pennsylvania", "short line railroad", "park place", "boardwalk"];

var deedPrices = [60,60,200,100,100,120,
            140,175,140,160,200,180,180,200,
            220,220,240,200,260,260,175,280,
            300,300,320,200,350,400];

var deedsRequiredForMonopoly = [2,2,0,3,3,3,
    3,2,3,3,0,3,3,3,
    3,3,3,0,3,3,2,3,
    3,3,3,0,2,2];

var deedRents = [[2],[4],[25],[6],[6],[8],[10],[8],[10],[12],[25],[14],[14],[16],[18],[18],[20],[25],[22],[22],[8],[24],[26],[26],
[28],[25],[35],[50]];

var actionSpace = [new ActionSpace('go'), new ActionSpace('community chest', DrawCommunityChest), new ActionSpace('chance', DrawChanceCard),
                new ActionSpace('income tax', PayIncomeTax), new ActionSpace('jail / just visiting'), new ActionSpace('free parking'),
                new ActionSpace('go to jail'), new ActionSpace('luxury tax', PayLuxuryTax)];

var deeds = [];

var monopolyboard;
var playerID = 0;

function DrawCommunityChest() {
    // todo
    console.error("Not Implemented");
}

function DrawChanceCard() {
    // todo
    console.error("Not Implemented");
}

function PayIncomeTax() {
    // todo
    console.error("Not Implemented");
}

function PayLuxuryTax() {
    // todo
    console.error("Not Implemented");
}

var tokens = ['car','iron','ship', 'wheelbarrow'];

var activePlayer = null;

function CreateMonopolyBoard() {
    monopolyboard = [actionSpace[0], deeds[0], actionSpace[1], deeds[1],actionSpace[3], deeds[2],
                deeds[3], actionSpace[2], deeds[4], deeds[5],actionSpace[4],
                deeds[6], deeds[7], deeds[8], deeds[9], deeds[10],
                deeds[11], actionSpace[1], deeds[12], deeds[13], actionSpace[5],
                deeds[14], actionSpace[2], deeds[15], deeds[16], deeds[17],
                deeds[18], deeds[19], deeds[20], deeds[21],actionSpace[6],
                deeds[22], deeds[23], actionSpace[1], deeds[24], actionSpace[1],
                deeds[25], actionSpace[2], deeds[26],actionSpace[7], deeds[27]];
}

function ActionSpace(name, callback) {
    this.name = name;
    this.action = callback;
}

function boolIsUnowned(deed) {
    return deed.owner == null;
}

var SpecialAction = {
    passedGo : function (player) {
        player.cash += 200;
        console.log('The ' +player.piece +' passed Go. Cash:  $' + player.cash);
    },
    advNearest : function (dest) {
        switch (dest) {
            case 'utility':
                if(activePlayer != null) {
                    if(activePlayer.currentlocation < 12) {
                        activePlayer.currentlocation = 12;
                    } else {
                        activePlayer.currentlocation = 28;
                    }
                }
                console.error("Not FULLY Implemented");
                break;
            case 'railroad':
                console.error("Not Implemented");
                break;
        }
    },
    goBackThreeSpaces : function () {
        if(activePlayer != null) {
            activePlayer.currentlocation -= 3;
        }
    },
    goToJail : function() {
        if(activePlayer != null) {
            activePlayer.currentlocation = 10;
            activePlayer.inJail = true;
            activePlayer.jailRollCount = 1;
        }
    },
    payToGetOutOfJail : function () {
        if(activePlayer != null) {
            activePlayer.cash -= 50;
        }
    },
    bankrupt : function () {
        console.error("Not Implemented");
    },
    houseRepairs25Hotel100 : function () {
        // todo
        console.error("Not Implemented");
    },
    payEachPlayer50 : function () {
        // todo
        console.error("Not Implemented");
    }
};

var chanceDeck = [new Card('Advance to "Go", collect $200',200,0,0,false,null),
                  new Card('Advance to Illinois Ave. If you pass Go, collect $200.',200,0,24,true,null),
                  new Card('Advance to St. Charles Place. If you pass Go, collect $200.',200,0,11,true,null),
                  new Card('Advance token to nearest Utility. If unowned, you may buy it from the Bank.' +
                  ' If owned, throw dice and pay owner a total ten times the amount thrown.',0,0,null,true,SpecialAction.advNearest('utility')),
                  new Card('Advance token to the nearest Railroad and pay owner twice the rental to which' +
                  ' he/she is otherwise entitled. If Railroad is unowned, you may buy it from the Bank.',0,0,null,true,SpecialAction.advNearest('railroad')),
                  new Card('Advance token to the nearest Railroad and pay owner twice the rental to which' +
                  ' he/she is otherwise entitled. If Railroad is unowned, you may buy it from the Bank.',0,0,null,true,SpecialAction.advNearest('railroad')),
                  new Card('Bank pays you dividend of $50.',50,0,null,false,null),
                  new Card('Get out of Jail Free. This card may be kept until needed, or traded/sold.',0,0,null,false,null),
                  new Card('Go Back Three {3} Spaces.',0,0,null,false,SpecialAction.goBackThreeSpaces()),
                  new Card('Go to Jail. Go directly to Jail. Do not pass Go, do not collect $200.',0,0,10,false,SpecialAction.goToJail()),
                  new Card('Make General Repairs On All Your Properties.  For Each House Pay $25, For Each Hotel $100',0,0,null,false,SpecialAction.houseRepairs25Hotel100()),
                  new Card('You Have Been Elected Chairman Of The Board, Pay Each Player $50',0,0,null,false,SpecialAction.payEachPlayer50()),
                  new Card('Your Building And Loan Matures.  Collect $150',150,0,null,false,null),
                  new Card('Take A Walk On The Board Walk.  Advance Token To Board Walk',0,0,40,false,null),
                  new Card('Take A Ride On The Reading.  If You Pass Go, Collect $200',200,0,5,false,null),
                  new Card('Pay Poor Tax Of $15',0,15,null,false,null)];
                  
var communityDeck = [];


function roll2Dice(player) {
    var d1, d2;
    player.rolledDoubles = false;
    d1 = Math.ceil(Math.random() * 6);
    d2 = Math.ceil(Math.random() * 6);
    if(d1 === d2) {
        player.rolledDoubles = true;
        console.log(player.piece + ' rolled doubles ' + d1 + " "+ d2);
    }
    return d1 + d2;
}

function Player(piece, playerNumber) {
    this.playerID = playerNumber;
    this.piece = piece;
    this.cash = 1500;
    this.deeds = [];
    this.currentlocation = 0;
    this.rolledDoubles = false;
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
    this.buyIfUnowned = function () {
        var space = this.currentlocation;
        var theDeed = monopolyboard[space];
        if(monopolyboard[space].boolIsOwned == false) {
            theDeed.owner = this;
            this.cash -= theDeed.price;
            theDeed.boolIsOwned = true;
            this.deeds.push(theDeed.name);
        } else {
            if(theDeed.hasOwnProperty('GetRentDue')) {
                var theRent = theDeed.GetRentDue();
                this.cash -= theRent;
                console.log(this.piece + ' paid ' + theRent);
                theDeed.owner.cash += theRent;
                console.log(theDeed.owner.piece + ' now has ' + theDeed.owner.cash)
            } else {
                // check for special action
            }

        }
    }
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
    this.ID = ID;
    this.name = deedNames[ID];
    this.owner = null;
    this.boolIsOwned = false;
    this.price = deedPrices[ID];
    this.level = 0;
    this.totalDeedsInGroup = deedsRequiredForMonopoly[ID];
    this.monopoly = false;
    this.GetRentDue = function () {
        if(this.monopoly && this.level == 0) {
            return deedRents[this.ID][this.level] * 2;
        } else {
            return deedRents[this.ID][this.level];
        }
    }
}

function DeedDeck() {
    deeds = [];
    for(var i = 0, len = deedNames.length; i < len; i++)  {
        deeds.push(new Deed(i));
    }
}

function SelectToken(numberOfTokens) {
    tokens = shuffle(tokens);
    
    return tokens.slice(0,numberOfTokens);
}

function playerManager(numberOfPlayers) {
    this.players = [];
    rndTokens = SelectToken(numberOfPlayers);
    
    while(numberOfPlayers > 0) {
        this.players.push(new Player(rndTokens[numberOfPlayers-1], playerID++));
        numberOfPlayers--;
    }
}

function Test(turns, players)  {
    chanceCards = shuffle(chanceDeck);
    playerManager = new playerManager(players);
    DeedDeck();
    CreateMonopolyBoard();

    // console.log(deeds.length + ' deeds generated.');

    for(var i = 0; i < turns; i++) {
        for(var j = 0; j < players; j++) {
            activePlayer = playerManager.players[j];
            let dieRoll = roll2Dice(activePlayer);
            activePlayer.move(dieRoll);
            console.log('The ' + activePlayer.piece + ' rolled ' + dieRoll + ' and landed on ' 
                        + monopolyboard[activePlayer.currentlocation].name);
            if(activePlayer.currentlocation == 30) {
                console.log('Player ' + (j + 1) + ' went to jail!');
                SpecialAction.goToJail(activePlayer);
                SpecialAction.payToGetOutOfJail(activePlayer);
                break;
            }
            activePlayer.buyIfUnowned();
        }
    }

    for(var j = 0; j < players; j++) {
        let thePlayer = playerManager.players[j];
        let deedReport = '';
        thePlayer.deeds.forEach( function (e,i,a) {deedReport += e + ", "} );
        console.log('\n\nThe ' + thePlayer.piece + ' has $' + thePlayer.cash + "\n" + deedReport);
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