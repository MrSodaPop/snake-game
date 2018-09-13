$(document).ready(function() {
    console.log("Document ready");
    generateGameArea(20);
    gameData = generateGameData();

    $('.score').click(function(){
      if(gameData.gameOver) {
        location.reload();
      }
    })

    $('html').keypress(function(key){switch (parseInt(key.keyCode)){
      case 97: if (gameData.direction == 'left' || gameData.direction == 'right' || gameData.changeDirection == true){return;}else{gameData.newDirection = 'left'; gameData.changeDirection = true;} break;
      case 119: if (gameData.direction == 'up' || gameData.direction == 'down' || gameData.changeDirection == true){return;}else{gameData.newDirection = 'up'; gameData.changeDirection = true;} break;
      case 100: if (gameData.direction == 'left' || gameData.direction == 'right' || gameData.changeDirection == true){return;}else{gameData.newDirection = 'right'; gameData.changeDirection = true;} break;
      case 115: if (gameData.direction == 'up' || gameData.direction == 'down' || gameData.changeDirection == true){return;}else{gameData.newDirection = 'down'; gameData.changeDirection = true;} break;
      default: console.log('invalid key');
    }
    if (!gameData.gameRunning) {
      gameData.gameRunning = true;
      gameUpdate();
    }
  });
});

var gameOver = function() {
  console.log('game over');
  gameData.gameOver = true;
}

var gameUpdate = function() {
var interval = setInterval(function(){
  if(gameData.gameOver) {
    $('.score').replaceWith("<div class=\'score\'>Restart - " + (gameData.activeSquares.length-1) + "</div>");
    $('.score').css('font-size','3vw');
    $('.score').css('cursor','pointer');
    return;
  }
  if (gameData.changeDirection) {
    gameData.direction = gameData.newDirection;
    gameData.changeDirection = false;
  }
  moveSnake();
  $('.score').replaceWith("<div class=\'score\'>" + (gameData.activeSquares.length-1) + "</div>");
},gameData.tickrate)};

var moveSnake = function() {
  let newLead = gameData.leadingSquare;
  switch(gameData.direction) {
    case 'left': if (gameData.leadingSquare % 20 === 0) {gameOver(); return;} else { for(let i = 0;i<gameData.activeSquares.length;i++){if(gameData.leadingSquare - 1 === gameData.activeSquares[i]){gameOver();return;}else{newLead = gameData.leadingSquare - 1}}} break;
    case 'right': if (gameData.leadingSquare % 20 === 19) {gameOver(); return;} else { for(let i = 0;i<gameData.activeSquares.length;i++){if(gameData.leadingSquare + 1 === gameData.activeSquares[i]){gameOver();return;}else{newLead = gameData.leadingSquare + 1}}} break;
    case 'down': if (gameData.leadingSquare > 379) {gameOver(); return;} else { for(let i = 0;i<gameData.activeSquares.length;i++){if(gameData.leadingSquare + 20 === gameData.activeSquares[i]){gameOver();return;}else{newLead = gameData.leadingSquare + 20}}} break;
    case 'up': if (gameData.leadingSquare < 21) {gameOver(); return;} else { for(let i = 0;i<gameData.activeSquares.length;i++){if(gameData.leadingSquare - 20 === gameData.activeSquares[i]){gameOver();return;}else{newLead = gameData.leadingSquare - 20}}} break;
  }
  var temporaryArray = [newLead];
  for (let i = 0; i < gameData.activeSquares.length - 1; i++) {
    temporaryArray[i+1] = gameData.activeSquares[i];
  }
  if (newLead === gameData.fruitSquare) {
    temporaryArray[temporaryArray.length] = gameData.activeSquares[gameData.activeSquares.length - 1];
    generateFruit();
  }
  else {
    $('#' + gameData.activeSquares[gameData.activeSquares.length - 1] + "-tile").css('background-color','slategray');
  }
  gameData.activeSquares = temporaryArray;
  gameData.leadingSquare = newLead;
  for (let i = 0; i <gameData.activeSquares.length; i++) {
    $('#' + gameData.activeSquares[i] + '-tile').css('background-color','#52ea3a')
  }
}

var generateGameArea = function() {
  for (let i = 0; i < 400; i++) {
    $('#game-area').append("<div class=\'game-tile\' id=\'" + i + "-tile\'></div>");    
  }
  console.log('Game area generated');
}

var generateFruit = function() {
  var overlapping = true;
  while (overlapping) {
    fruitSquare = Math.floor(Math.random() * 400);
    overlapping = false;
    for (let i = 0; i < gameData.activeSquares.length + 1; i++) {
      if (fruitSquare === gameData.leadingSquare || fruitSquare === gameData.activeSquares[i]) {
        overlapping = true
      }
    }
  }
  gameData.fruitSquare = fruitSquare;
  $('#' + gameData.fruitSquare + '-tile').css('background-color','red');
};

generateGameData = function() {
  var leadingSquare = 190;
  var activeSquares = [leadingSquare];
  var fruitSquare = Math.floor(Math.random() * 400);
  while (fruitSquare === leadingSquare) {
    fruitSquare = Math.floor(Math.random() * 400);
  }
  $('#190-tile').css('background-color','#52ea3a');
  $('#' + fruitSquare + '-tile').css('background-color','red');
  return {
    leadingSquare: leadingSquare,
    direction: null,
    newDirection: null,
    changeDirection: false,
    activeSquares: activeSquares,
    fruitSquare: fruitSquare,
    tickrate: 120,
    gameRunning: false,
    gameOver: false
  }
}

var gameData;
