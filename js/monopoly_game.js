var deedNames = ["mediterranean", "baltic", "reading railroad", "oriental", "vermont", "connecticut",
    "st. charles", "electric company", "states", "virginia", "pennsylvania railroad", "st. james", "tennessee", "new york",
    "kentucky", "indiana", "illinois", "Body Odor railroad", "atlantic", "ventnor", "water works", "marvin gardens",
    "pacific", "north cackalackey", "pennsylvania", "short line railroad", "park place", "boardwalk"
];

var deedColorGroup = ["indigo", "indigo", "railroad", "light_blue", "light_blue", "light_blue",
    "violet", "utility", "violet", "violet", "railroad", "orange", "orange", "orange",
    "red", "red", "red", "railroad", "yellow", "yellow", "utility", "yellow",
    "green", "green", "green", "railroad", "blue", "blue"
];

var deedPrices = [60, 60, 200, 100, 100, 120,
    140, 175, 140, 160, 200, 180, 180, 200,
    220, 220, 240, 200, 260, 260, 175, 280,
    300, 300, 320, 200, 350, 400
];

var deedsRequiredForMonopoly = [2, 2, 0, 3, 3, 3,
    3, 2, 3, 3, 0, 3, 3, 3,
    3, 3, 3, 0, 3, 3, 2, 3,
    3, 3, 3, 0, 2, 2
];

var deedRents = [
    [2],
    [4],
    [25],
    [6],
    [6],
    [8],
    [10],
    [8],
    [10],
    [12],
    [25],
    [14],
    [14],
    [16],
    [18],
    [18],
    [20],
    [25],
    [22],
    [22],
    [8],
    [24],
    [26],
    [26],
    [28],
    [25],
    [35],
    [50]
];

var actionSpace = [new ActionSpace('go'), new ActionSpace('community chest', DrawCommunityChest), new ActionSpace('chance', DrawChanceCard),
    new ActionSpace('income tax', PayIncomeTax), new ActionSpace('jail / just visiting'), new ActionSpace('free parking'),
    new ActionSpace('go to jail', SpecialAction.goToJail), new ActionSpace('luxury tax', PayLuxuryTax)
];

var deeds = [];
var chanceDiscardPile = [];
var communityChestDiscardPile = [];

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

var tokens = ['car', 'iron', 'ship', 'wheelbarrow', 'thimble', 'cannon', 'train', 'horse', 'hat', 'shoe', 'dog'];

var activePlayer = null;

function CreateMonopolyBoard() {
    monopolyboard = [actionSpace[0], deeds[0], actionSpace[1], deeds[1], actionSpace[3], deeds[2],
        deeds[3], actionSpace[2], deeds[4], deeds[5], actionSpace[4],
        deeds[6], deeds[7], deeds[8], deeds[9], deeds[10],
        deeds[11], actionSpace[1], deeds[12], deeds[13], actionSpace[5],
        deeds[14], actionSpace[2], deeds[15], deeds[16], deeds[17],
        deeds[18], deeds[19], deeds[20], deeds[21], actionSpace[6],
        deeds[22], deeds[23], actionSpace[1], deeds[24], deeds[25],
        actionSpace[2], deeds[26], actionSpace[7], deeds[27]
    ];
}

function ActionSpace(name, callback) {
    this.name = name;
    this.action = callback;
}

function boolIsUnowned(deed) {
    return deed.owner == null;
}

var SpecialAction = {
    passedGo: function (player) {
        player.cash += 200;
        console.log('The ' + player.piece + ' passed Go. Cash:  $' + player.cash);
    },
    advNearest: function (dest) {
        switch (dest) {
            case 'utility':
                if (activePlayer != null) {
                    if (activePlayer.currentlocation < 12) {
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
    goBackThreeSpaces: function () {
        if (activePlayer != null) {
            activePlayer.currentlocation -= 3;
        }
    },
    goToJail: function () {
        if (activePlayer != null) {
            console.log('GO TO JAIL!')
            activePlayer.currentlocation = 10;
            activePlayer.inJail = true;
            activePlayer.jailRollCount = 1;
            activePlayer.doublesCount = 0;
        }
    },
    payToGetOutOfJail: function () {
        if (activePlayer != null) {
            activePlayer.cash -= 50;
            console.log('Just visiting.');
        }
    },
    bankrupt: function () {
        console.error("Not Implemented");
    },
    houseRepairs25Hotel100: function () {
        // todo
        console.error("Not Implemented");
    },
    streetRepairs: function () {
        // todo
        console.error("Not Implemented");
    },
    payEachPlayer50: function () {
        // todo
        console.error("Not Implemented");
    },
    collect50FromEveryPlayer: function () {
        // todo
        console.error("Not Implemented");
    }
};

var chanceDeck = [new Card('Advance to "Go", collect $200', 200, 0, 0, false, null),
    new Card('Advance to Illinois Ave. If you pass Go, collect $200.', 200, 0, 24, true, null),
    new Card('Advance to St. Charles Place. If you pass Go, collect $200.', 200, 0, 11, true, null),
    new Card('Advance token to nearest Utility. If unowned, you may buy it from the Bank.' +
        ' If owned, throw dice and pay owner a total ten times the amount thrown.', 0, 0, null, true, SpecialAction.advNearest('utility')),
    new Card('Advance token to the nearest Railroad and pay owner twice the rental to which' +
        ' he/she is otherwise entitled. If Railroad is unowned, you may buy it from the Bank.', 0, 0, null, true, SpecialAction.advNearest('railroad')),
    new Card('Advance token to the nearest Railroad and pay owner twice the rental to which' +
        ' he/she is otherwise entitled. If Railroad is unowned, you may buy it from the Bank.', 0, 0, null, true, SpecialAction.advNearest('railroad')),
    new Card('Bank pays you dividend of $50.', 50, 0, null, false, null),
    new Card('Get out of Jail Free. This card may be kept until needed, or traded/sold.', 0, 0, null, false, null),
    new Card('Go Back Three {3} Spaces.', 0, 0, null, false, SpecialAction.goBackThreeSpaces()),
    new Card('Go to Jail. Go directly to Jail. Do not pass Go, do not collect $200.', 0, 0, 10, false, SpecialAction.goToJail()),
    new Card('Make General Repairs On All Your Properties.  For Each House Pay $25, For Each Hotel $100', 0, 0, null, false, SpecialAction.houseRepairs25Hotel100()),
    new Card('You Have Been Elected Chairman Of The Board, Pay Each Player $50', 0, 0, null, false, SpecialAction.payEachPlayer50()),
    new Card('Your Building And Loan Matures.  Collect $150', 150, 0, null, false, null),
    new Card('Take A Walk On The Board Walk.  Advance Token To Board Walk', 0, 0, 40, false, null),
    new Card('Take A Ride On The Reading.  If You Pass Go, Collect $200', 200, 0, 5, false, null),
    new Card('Pay Poor Tax Of $15', 0, 15, null, false, null)
];

var communityDeck = [new Card('Pay School Tax of $150', 0, 150, null, false, null),
    new Card('Receive for services $25', 25, 0, null, false, null),
    new Card('Advance to "Go", collect $200', 200, 0, 0, false, null),
    new Card('You are assesed for street repairs $40 per house, $115 per hotel', 0, 0, null, false, SpecialAction.streetRepairs()),
    new Card('Life Insurance Matures, Collect $100', 100, 0, null, false, null),
    new Card('Income Tax Refund, collect $20', 20, 0, null, false, null),
    new Card("Doctor's Fee, Pay $50", 0, 50, null, false, null),
    new Card('From sale of stock collect $45', 45, 0, null, false, null),
    new Card('You won SECOND PRIZE! HA HA HA HA HA! COLLECT ten whole dollars', 10, 0, null, false, null),
    new Card('You inherit $100', 100, 0, null, false, null),
    new Card('Jesus Birthday, collect $100  Thanks baby Jesus!', 100, 0, null, false, null),
    new Card('Twin Babies!  Hooray! Pay hospital $50 per baby (that is $100 total).', 0, 100, null, false, null),
    new Card('Grand Opera Opening collect $50 from every player for opening night seats', 0, 0, null, false, SpecialAction.collect50FromEveryPlayer()),
    new Card('Get out of Jail Free. This card may be kept until needed, or traded/sold.', 0, 0, null, false, null),
    new Card('Bank error in your favor collect $200', 200, 0, null, false, null),
    new Card('Go to Jail. Go directly to Jail. Do not pass Go, do not collect $200.', 0, 0, 10, false, SpecialAction.goToJail())
];


function roll2Dice(player) {
    var d1, d2;
    player.rolledDoubles = false;
    d1 = Math.ceil(Math.random() * 6);
    d2 = Math.ceil(Math.random() * 6);
    if (d1 === d2) {
        player.rolledDoubles = true;
        if (d1 == 1) {
            console.log('SNAKE EYES! One-Two!');
        } else if (d1 == 6) {
            console.log('BOXCARS!');
        } else {
            console.log(player.piece + ' rolled doubles ' + d1 + " " + d2);
        }
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
    this.doublesCount = 0;
    this.move = function (roll) {
        this.currentlocation += roll;
        if (this.currentlocation > 39) {
            this.currentlocation %= 40;
            SpecialAction.passedGo(this);
        }
    };
    this.inJail = false;
    this.jailRollCount = 0;
    this.getOutOfJailFreeCard = false;
    this.logMessage = function (message) {
            console.log(this.piece + ' ' + message);
        },
        this.buyIfUnowned = function () {
            var space = this.currentlocation;
            var theDeed = monopolyboard[space];
            if (monopolyboard[space].boolIsOwned == false) {
                theDeed.owner = this;
                this.cash -= theDeed.price;
                theDeed.boolIsOwned = true;
                this.deeds.push(theDeed.name);
            } else {
                if (theDeed.hasOwnProperty('GetRentDue')) {
                    var theRent = theDeed.GetRentDue();
                    this.cash -= theRent;
                    console.log(this.piece + ' paid $' + theRent + ' and now has $' + this.cash);
                    theDeed.owner.cash += theRent;
                    console.log(theDeed.owner.piece + ' now has $' + theDeed.owner.cash)
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
    this.group = deedColorGroup[ID];
    this.owner = null;
    this.boolIsOwned = false;
    this.price = deedPrices[ID];
    this.level = 0;
    this.totalDeedsInGroup = deedsRequiredForMonopoly[ID];
    this.monopoly = false;
    this.mortgaged = false;
    this.GetRentDue = function () {
        // if(this.group = 'railroad') {
        //     return;
        // }
        if (this.monopoly && this.level == 0) {
            return deedRents[this.ID][this.level] * 2;
        } else {
            return deedRents[this.ID][this.level];
        }
    }
}

function DeedDeck() {
    deeds = [];
    for (var i = 0, len = deedNames.length; i < len; i++) {
        deeds.push(new Deed(i));
    }
}

function SelectToken(numberOfTokens) {
    tokens = shuffle(tokens);

    return tokens.slice(0, numberOfTokens);
}

function playerManager(numberOfPlayers) {
    this.players = [];
    rndTokens = SelectToken(numberOfPlayers);

    while (numberOfPlayers > 0) {
        this.players.push(new Player(rndTokens[numberOfPlayers - 1], playerID++));
        numberOfPlayers--;
    }
}

function SimulationLoop(turns, players) {
    chanceCards = shuffle(chanceDeck);
    playerManager = new playerManager(Math.min(players, 11));
    DeedDeck();
    CreateMonopolyBoard();

    // console.log(deeds.length + ' deeds generated.');

    for (var i = 0; i < turns; i++) {
        for (var j = 0; j < players; j++) {
            activePlayer = playerManager.players[j];

            let dieRoll = roll2Dice(activePlayer);
            activePlayer.move(dieRoll);

            console.log('The ' + activePlayer.piece + ' rolled ' + dieRoll + ' and landed on ' +
                monopolyboard[activePlayer.currentlocation].name);

            // This code should be moved to a Special Action
            if (activePlayer.currentlocation == 30) {
                console.log('Player ' + (j + 1) + ' went to jail!');
                SpecialAction.goToJail(activePlayer);
                SpecialAction.payToGetOutOfJail(activePlayer);
                break;
            }



            activePlayer.buyIfUnowned();

            if (activePlayer.rolledDoubles) {
                activePlayer.doublesCount++;
                if (activePlayer.doublesCount == 3) {
                    activePlayer.logMessage('rolled doubles three times!');
                    SpecialAction.goToJail(activePlayer);
                    activePlayer.logMessage('went to jail.');
                    SpecialAction.payToGetOutOfJail(activePlayer);
                    activePlayer.logMessage('paid to get out of jail.');
                    break;
                }
                j--;
                console.log(activePlayer.piece + ' roll again!');
            } else {
                activePlayer.doublesCount = 0;
                activePlayer.logMessage("'s doubles count reset to zero.");
            }
        }
    }

    for (var j = 0; j < players; j++) {
        let thePlayer = playerManager.players[j];
        let deedReport = '';
        thePlayer.deeds.forEach(function (e, i, a) {
            deedReport += e + ", "
        });
        console.log('\n\nThe ' + thePlayer.piece + ' has $' + thePlayer.cash + "\n" + deedReport);
    }
}

function shuffle(array) {
    var m = array.length,
        t, i;

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

SimulationLoop(35, 4);