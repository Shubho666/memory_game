let cardList = ["fa fa-diamond", "fa fa-paper-plane-o", "fa fa-anchor", "fa fa-bolt", "fa fa-cube", "fa fa-anchor", "fa fa-leaf", "fa fa-bicycle", "fa fa-diamond", "fa fa-bomb", "fa fa-leaf", "fa fa-bomb", "fa fa-bolt", "fa fa-bicycle", "fa fa-paper-plane-o", "fa fa-cube"];



$(".endgame").hide();

$(".restart").on("click", function() {
    newgame();
});

$(".newGame").on("click", function() {
    newgame();
});

function shuffle(array) {
    let current = array.length,
        temporary, random;

    while (current !== 0) {
        random = Math.floor(Math.random() * current);
        current -= 1;
        temporaryValue = array[current];
        array[current] = array[random];
        array[random] = temporaryValue;
    }

    return array;
}
cardList = shuffle(cardList);
let cards = document.getElementsByClassName("icon");
let openCardsId = [];
let openCards = [];
let clicked = []; //array of card id's that matched
let prev_card; //points to previously clicked card
let curr_card; //points to currently clicked card
let countmoves = 0;
let flag = 0;
let iD;
let timetaken;
for (let i = 0; i < cards.length; i++) {
    $(cards[i]).addClass(cardList[i]);
}
var startTime = new Date().getTime();


var x = setInterval(function() {
    var now = new Date().getTime();
    var distance1 = now - startTime;
    var hours = Math.floor((distance1 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance1 % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance1 % (1000 * 60)) / 1000);
    $(document.getElementsByClassName("timer")).html(hours + ": " + minutes + ": " + seconds);
    timetaken = hours + ": " + minutes + ": " + seconds;
}, 1000);

function checkIfOpen(card) {
    if (openCards.length === 0) {
        const fontType = document.getElementById($(card).attr("id")).getElementsByClassName("icon");
        openCards.push($(fontType).attr("class"));
        openCardsId.push(($(card).attr("id")));
        return 1;
    }
    return 0;
}

function updateStar() {
    if (countmoves >= 15 && flag == 0) {
        flag = 1;
        const z = document.getElementById("third");
        $(z).toggleClass("fa fa-star");
        $(z).toggleClass("fa fa-star-o");
    } else if (countmoves >= 25 && flag == 1) {
        flag = 2;
        const z = document.getElementById("second");
        $(z).toggleClass("fa fa-star");
        $(z).toggleClass("fa fa-star-o");
    }
}

function checkIfEqual(card) {
    const fontType = document.getElementById($(card).attr("id")).getElementsByClassName("icon");
    if ($(fontType).attr("class") === openCards[0])
        return 1;
    return 0;
}

function gameover() {
    $(".container").hide();
    $("#Time").html("With " + countmoves + " moves and " + (3 - flag) + " stars.Time taken: " + timetaken);
    $(".endgame").show();
}

function restart() {
    startTime = new Date().getTime();
    for (let i = 0; i < clicked.length; i++) {
        let card = document.getElementById(clicked[i]);
        $(card).toggleClass("match");
        $(card).toggleClass("vibrate");
        $(card).toggleClass("show");
        $(card).toggleClass("open");
    }
    let open = (document.getElementById(iD));
    if (!clicked.includes(iD) && !(open === null) && $(open).attr("class").includes("open")) {
        $(open).toggleClass("show");
        $(open).toggleClass("open");
    }
    clicked = [];
    openCards = [];
    openCardsId = [];
    flag = 0;
    countmoves = 0;
    let list = [];
    let s1 = $("#third");
    let s2 = $("#second")
    $(".moves").html(countmoves);
    if (s1.attr("class").includes("fa fa-star-o")) {
        s1.toggleClass("fa fa-star-o fa fa-star");
    }
    if (s2.attr("class").includes("fa fa-star-o")) {
        s2.toggleClass("fa fa-star-o fa fa-star");
    }

}

function newgame() {
    $(".endgame").hide();
    restart();
    cards = document.getElementsByClassName("icon");
    for (let i = 0; i < cards.length; i++) {
        $(cards[i]).removeClass(cardList[i]);
    }
    cards = document.getElementsByClassName("icon");
    cardList = shuffle(cardList);
    for (let i = 0; i < cards.length; i++) {
        $(cards[i]).addClass(cardList[i]);
    }
    $(".container").show();
}

function updateMoves() {
    countmoves++;
}
$(".card").on("click", function() {
    iD = $(this).attr("id");
    if (openCardsId[0] != iD && (clicked.length == 0 || !(clicked.includes(iD)))) {
        updateMoves();
        updateStar();
        $(".moves").html(countmoves);
        const check = checkIfOpen(this);
        curr_card = this;
        $(this).toggleClass("open");
        $(this).toggleClass("show");
        if (check === 0) {
            let x = checkIfEqual(this);
            if (iD == openCardsId[0])
                x = 0;
            if (x === 0) {
                prev_card = document.getElementById(openCardsId[0]);
                setTimeout(function() {
                    $(curr_card).toggleClass("open");
                    $(prev_card).toggleClass("open");
                    $(curr_card).toggleClass("mismatch");
                    $(prev_card).toggleClass("mismatch");
                    $(curr_card).toggleClass("vibrate");
                    $(prev_card).toggleClass("vibrate");
                }, 5);
                setTimeout(function() {
                    $(curr_card).toggleClass("show");
                    $(prev_card).toggleClass("show");
                    $(curr_card).toggleClass("mismatch");
                    $(prev_card).toggleClass("mismatch");
                    $(curr_card).toggleClass("vibrate");
                    $(prev_card).toggleClass("vibrate");
                }, 200);
                openCards.pop();
                openCardsId.pop();
            } else {
                clicked.push(openCardsId[0]);
                clicked.push(iD);
                prev_card = document.getElementById(openCardsId[0]);
                $(prev_card).toggleClass("match");
                $(this).toggleClass("match");
                $(curr_card).toggleClass("vibrate");
                $(prev_card).toggleClass("vibrate");
                openCards.pop();
                openCardsId.pop();
            }
        }
    }
    if (clicked.length == 16) {
        setTimeout(function() {
            gameover();
        }, 10);
    }
});
