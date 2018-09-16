$(document).ready(function() {
    console.log("Document ready");
    generateGameArea(20);
    gameData = generateGameData();

    $('html').keypress(function(key){switch (parseInt(key.keyCode)){
      case 97: if(gameData.paused){}else{gameData.newDirection[gameData.newDirection.length] = 'left'}; break;
      case 119: if(gameData.paused){}else{gameData.newDirection[gameData.newDirection.length] = 'up'}; break;
      case 100: if(gameData.paused){}else{gameData.newDirection[gameData.newDirection.length] = 'right'}; break;
      case 115: if(gameData.paused){}else{gameData.newDirection[gameData.newDirection.length] = 'down'}; break;
      case 32: if(!gameData.paused){gameData.paused=true;$('.instructions').replaceWith("<div class=\'instructions\'><strong>PAUSED</strong></div>")}else{gameData.paused=false;$('.instructions').replaceWith("<div class=\'instructions\'>Press <strong>WASD</strong> to start<br><strong>SPACE</strong> to pause<br><strong>R</strong> for rainbow<br><strong>C</strong> to change color</div>")};
      case 114: if(gameData.rainbow){gameData.rainbow=false;gameData.snakeColor=-1;}else{gameData.rainbow=true};
      case 99: if(gameData.snakeColor+1===gameData.snakeColorList.length){gameData.snakeColor=0}else{gameData.snakeColor++}for(i=0;i<gameData.activeSquares.length;i++){$('#'+gameData.activeSquares[i]+'-tile').css('background-color',gameData.snakeColorList[gameData.snakeColor]);};break;
      case 113: if(gameData.gameOver){for(i=0;i<gameData.activeSquares.length;i++){$('#'+gameData.activeSquares[i]+'-tile').css('background-color','slategray');}$('#'+gameData.fruitSquare+'-tile').css('background-color','slategray');gameData = generateGameData();$('.instructions').replaceWith("<div class=\'instructions\'>Press <strong>WASD</strong> to start<br><strong>SPACE</strong> to pause<br><strong>R</strong> for rainbow<br><strong>C</strong> to change color</div>");} break;
      default: console.log('.');return;
    }
    if (!gameData.gameRunning && key.keyCode != 13) {
      gameData.gameRunning = true;
      gameTick();
    }
  });
});

var gameOver = function() {
  console.log('game over');
  console.log(gameData)
  gameData.gameOver = true;
}

var gameTick = function() {
  gameData.lastTick = Date.now();
  var tick = setInterval(function(){
    gameUpdate()
  },1)
}

var gameUpdate = function() {
  if(gameData.paused){
    return;
  }
  if (Date.now() - gameData.lastTick >= gameData.tickrate) {
    gameData.lastTick = Date.now();
    if(gameData.gameOver) {
      $('.score').replaceWith("<div class=\'score\'>Game Over - " + (gameData.activeSquares.length-1) + "</div>");
      $('.instructions').replaceWith("<div class=\'instructions\'>Press <strong>Q</strong> to restart</div>");
      $('.score').css('font-size','3vw');
      $('.score').css('cursor','pointer');
      gameData.gameRunning = false; 
      return;
    }
    if (gameData.rainbow) {
      if(gameData.snakeColor+1===gameData.snakeColorList.length){
        gameData.snakeColor=0;
      }
      else {
        gameData.snakeColor++;
      }
      for(let i = 0;i<gameData.activeSquares.length;i++) {
        $('#'+gameData.activeSquares[i]+'-tile').css('background-color',gameData.snakeColorList[gameData.snakeColor]);
      }
    }
    if (gameData.newDirection.length > 1) {
      checkNextMove();
    }
    moveSnake();
    $('.score').replaceWith("<div class=\'score\'>" + (gameData.activeSquares.length-1) + "</div>");
  }
};

var checkNextMove = function() {
  if ((gameData.newDirection[1] === 'right' || gameData.newDirection[1] === 'left') && (gameData.direction === 'left' || gameData.direction === 'right')) {
    gameData.newDirection = gameData.newDirection.splice(1,1);
    checkNextMove();
  }
  else if ((gameData.newDirection[1] === 'down' || gameData.newDirection[1] === 'up') && (gameData.direction === 'down' || gameData.direction === 'up')) {
    gameData.newDirection = gameData.newDirection.splice(1,1);
    checkNextMove();
  }
  else {
    if (gameData.newDirection.length > 1) {
      gameData.direction = gameData.newDirection[1];
      gameData.newDirection = gameData.newDirection.splice(1,1);
      return;
    }
  }
}

var moveSnake = function() {
  let newLead = gameData.leadingSquare;
  switch(gameData.direction) {
    case 'left': if (gameData.leadingSquare % 20 === 0) {gameOver(); return;} else { for(let i = 0;i<gameData.activeSquares.length;i++){if(gameData.leadingSquare - 1 === gameData.activeSquares[i]){gameOver();return;}else{newLead = gameData.leadingSquare - 1}}} break;
    case 'right': if (gameData.leadingSquare % 20 === 19) {gameOver(); return;} else { for(let i = 0;i<gameData.activeSquares.length;i++){if(gameData.leadingSquare + 1 === gameData.activeSquares[i]){gameOver();return;}else{newLead = gameData.leadingSquare + 1}}} break;
    case 'down': if (gameData.leadingSquare > 379) {gameOver(); return;} else { for(let i = 0;i<gameData.activeSquares.length;i++){if(gameData.leadingSquare + 20 === gameData.activeSquares[i]){gameOver();return;}else{newLead = gameData.leadingSquare + 20}}} break;
    case 'up': if (gameData.leadingSquare < 20) {gameOver(); return;} else { for(let i = 0;i<gameData.activeSquares.length;i++){if(gameData.leadingSquare - 20 === gameData.activeSquares[i]){gameOver();return;}else{newLead = gameData.leadingSquare - 20}}} break;
  }
  var temporaryArray = [newLead];
  for (let i = 0; i < gameData.activeSquares.length - 1; i++) {
    temporaryArray[i+1] = gameData.activeSquares[i];
  }
  if (newLead === gameData.fruitSquare) {
    temporaryArray[temporaryArray.length] = gameData.activeSquares[gameData.activeSquares.length-1];
    generateFruit();
    gameData.tickrate = gameData.tickrate * gameData.tickIncrease
  }
  else {
    $('#' + gameData.activeSquares[gameData.activeSquares.length - 1] + "-tile").css('background-color','slategray');
  }
  gameData.activeSquares = temporaryArray;
  gameData.leadingSquare = newLead;
  for (let i = 0; i <gameData.activeSquares.length; i++) {
    $('#' + gameData.activeSquares[i] + '-tile').css('background-color',gameData.snakeColorList[gameData.snakeColor])
  }
}

var generateGameArea = function() {
  for (let i = 0; i < 400; i++) {
    $('#game-area').append("<div class=\'game-tile\' id=\'" + i + "-tile\'></div>");    
  }
  console.log('Game area generated');
}

var generateFruit = function() {
  var overlapping = false;
    for (let i = 0; i < gameData.activeSquares.length + 1; i++) {
      if (fruitSquare === gameData.leadingSquare || fruitSquare === gameData.activeSquares[i]) {
        overlapping = true
      }
    if (overlapping) {
      generateFruit();
    }
    else {
      gameData.fruitSquare = fruitSquare;
      $('#' + gameData.fruitSquare + '-tile').css('background-color','red');
    }
  }
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
    newDirection: [0],
    activeSquares: activeSquares,
    fruitSquare: fruitSquare,
    rainbow: false,
    snakeColor: 0,
    snakeColorList: ['#52ea3a','#42f4df','#4156f4','#b241f4','#f92cca','#ed1e29','#e59412','#e2f72a'],
    tickIncrease: 0.97,
    tickrate: 200,
    lastTick: 0,
    gameRunning: false,
    gameOver: false,
    paused: false
  }
}

var gameData;
