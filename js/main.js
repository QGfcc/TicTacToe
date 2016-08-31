/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function TicTacToe() {
  var horizontalCellNumber = 3;
  var verticalCellNumber = 3;
  var cellInARowToWin = 3;
  var cellsEl = [
    [
      $("#cell1"),
      $("#cell2"),
      $("#cell3")
    ], [
      $("#cell4"),
      $("#cell5"),
      $("#cell6")
    ], [
      $("#cell7"),
      $("#cell8"),
      $("#cell9")
    ]
  ];
  var cellsVal = [
    [
      undefined,
      undefined,
      undefined
    ], [
      undefined,
      undefined,
      undefined
    ], [
      undefined,
      undefined,
      undefined
    ]
  ];
//  var glyphiconX = "glyphicon glyphicon-remove";
//  var iconX = '<span class="glyphicon glyphicon-remove"></span>';
  var iconX = $('<span class="glyphicon glyphicon-remove"></span>');
//  var glyphiconO = "fa fa-circle-o";
//  var iconO = '<i class="fa fa-circle-o"></i>';
  var iconO = $('<i class="fa fa-circle-o"></i>');
  var isUserFirstPlayer = true;
  var isUserPlaying = true;
  var isUserX = false;

  var displaySelection = function (cellX, cellY) {
    if (cellsVal[cellX][cellY] === "x") {
      cellsEl[cellX][cellY].append(iconX.clone());
//      cellsEl[cellX][cellY].text("x");
    } else {
      cellsEl[cellX][cellY].append(iconO.clone());
//      cellsEl[cellX][cellY].text("o");
    }
  };
  var userSelectCell = function (cellX, cellY) {
//    isUserPlaying = !isUserPlaying;
//    if (isUserPlaying && cellsVal[cellX][cellY] === undefined) {
//      isUserX = !isUserX;//TODO delete
    if (isUserX) {
      cellsVal[cellX][cellY] = "x";
    } else {
      cellsVal[cellX][cellY] = "o";
    }
    displaySelection(cellX, cellY);
//      routine();
//    }
  };
  var userClickCell = function (cellX, cellY) {
//    isUserPlaying = !isUserPlaying;
    if (isUserPlaying && cellsVal[cellX][cellY] === undefined) {
//      isUserX = !isUserX;//TODO delete
//      if (isUserX) {
//        cellsVal[cellX][cellY] = "x";
//      } else {
//        cellsVal[cellX][cellY] = "o";
//      }
//      displaySelection(cellX, cellY);
      userSelectCell(cellX, cellY);
      routine();
    }
  };
  var AISelectCell = function (cellX, cellY) {
    if (isUserX) {
      cellsVal[cellX][cellY] = "o";
    } else {
      cellsVal[cellX][cellY] = "x";
    }
    displaySelection(cellX, cellY);
  };
  var setCellListener = function () {
    for (var i = 0; i < cellsEl.length; i++) {
      for (var j = 0; j < cellsEl[i].length; j++) {
        cellsEl[i][j].click(userClickCell.bind(this, i, j));
      }
    }
  };
  var cleanCells = function () {
    for (var i = 0; i < cellsEl.length; i++) {
      for (var j = 0; j < cellsEl[i].length; j++) {
        cellsEl[i][j].text("");//TODO to check
        cellsVal[i][j] = undefined;
      }
    }
  };
  var checkWinDiagonalTopLeft = function (expectedValue) {
//    var counter = 0;
    var stillOk = true;
    for (var i = 0; i < cellsVal.length - cellInARowToWin + 1; i++) {
      for (var j = 0; j < cellsVal.length - cellInARowToWin + 1; j++) {
        stillOk = true;
        for (var k = 0; k < cellInARowToWin && stillOk; k++) {
          if (cellsVal[i + k][j + k] !== expectedValue) {
            stillOk = false;
          }
        }
        if (stillOk) {
          return true;
        }
      }
    }
    return false;
  };
  var checkWinDiagonalTopRight = function (expectedValue) {
    var stillOk = true;
    for (var i = 0; i < cellsVal.length - cellInARowToWin + 1; i++) {
      for (var j = cellInARowToWin - 1; j < cellsVal.length; j++) {
        stillOk = true;
        for (var k = 0; k < cellInARowToWin && stillOk; k++) {
          if (cellsVal[i + k][j - k] !== expectedValue) {
            stillOk = false;
          }
        }
        if (stillOk) {
          return true;
        }
      }
    }
    return false;
  };
  var checkWinDiagonal = function (expectedValue) {
    return    checkWinDiagonalTopLeft(expectedValue) ||
        checkWinDiagonalTopRight(expectedValue);
  };
  var checkWinHorizontal = function (expectedValue) {
    var stillOk = true;
    for (var i = 0; i < cellsVal.length; i++) {
      for (var j = 0; j < cellsVal.length - cellInARowToWin + 1; j++) {
        stillOk = true;
        for (var k = 0; k < cellInARowToWin && stillOk; k++) {
          if (cellsVal[i][j + k] !== expectedValue) {
            stillOk = false;
          }
        }
        if (stillOk) {
          return true;
        }
      }
    }
    return false;
  };
  var checkWinVertical = function (expectedValue) {
    var stillOk = true;
    for (var i = 0; i < cellsVal.length - cellInARowToWin + 1; i++) {
      for (var j = 0; j < cellsVal.length; j++) {
        stillOk = true;
        for (var k = 0; k < cellInARowToWin && stillOk; k++) {
          if (cellsVal[i + k][j] !== expectedValue) {
            stillOk = false;
          }
        }
        if (stillOk) {
          return true;
        }
      }
    }
    return false;
  };
  var isComplete = function () {
    for (var i = 0; i < cellsVal.length; i++) {
      for (var j = 0; j < cellsVal.length; j++) {
        if (cellsVal[i][j] === undefined) {
          return false;
        }
      }
    }
    return true;
  };
  var isGameOver = function (expectedValue) {
    var hor = checkWinHorizontal(expectedValue);
    var vert = checkWinVertical(expectedValue);
    var diag = checkWinDiagonal(expectedValue);
    var isOver = isComplete();
    console.log("___" + expectedValue + "___");//TODO delete
    console.log("hor : " + hor);
    console.log("vert : " + vert);
    console.log("diag : " + diag);
    console.log("isOver : " + isOver);
    if (hor || vert || diag) {
//      return 1;
      return true;
    } else if (isOver) {
//      return -1;
      return true;
    } else {
//      return 0;
      return false;
    }
  };
  var endingAnimation = function () {

  };
  var swapFirstPlayer = function () {
    isUserFirstPlayer = !isUserFirstPlayer;
  };
  var swapPlayer = function () {
    isUserPlaying = !isUserPlaying;
  };
  var ending = function () {
    console.log("end");//TODO delete
    endingAnimation();
    restart();//TODO unComment
  };
  var AIPlays = function () {
    var isChosen = false;
    for (var i = 0; i < cellsVal.length && !isChosen; i++) {
      for (var j = 0; j < cellsVal.length && !isChosen; j++) {
        if (cellsVal[i][j] === undefined) {
          AISelectCell(i, j);
          isChosen = true;
        }
      }
    }
    //TODO AI choice
    routine();
  };
  var getCurValue = function () {
    if ((isUserPlaying && isUserX) || ((!isUserPlaying) && (!isUserX))) {
      return 'x';
    } else {
      return 'o';
    }
  };
  var routine = function () {
    if (isGameOver(getCurValue())) {
      ending();
    } else {
      swapPlayer();
      if (!isUserPlaying) { // if player's turn, stop and wait
        AIPlays();
      }
    }
  };
  var start = function () {
    isUserPlaying = isUserFirstPlayer;
    routine();
  };
  var restart = function () {
    swapFirstPlayer();//TODO maybe put it in ending
    cleanCells();
    start();
  };
  $('#restartBtn').click(restart.bind(this));//TODO delete
  setCellListener();
  start();


/////////TODO delete tests
//  cellsVal = [
//    [
//      'x',
//      'x',
//      undefined
//    ], [
//      'undefined',
//      undefined,
//      undefined
//    ], [
//      'x',
//      'x',
//      undefined
//    ]
//  ];
//  console.log('hor');
//  console.log('o : ' + checkWinHorizontal('o'));
//  console.log('x : ' + checkWinHorizontal('x'));
//  cellsVal = [
//    [
//      'x',
//      undefined,
//      undefined
//    ], [
//      'x',
//      undefined,
//      undefined
//    ], [
//      'x',
//      'x',
//      'o'
//    ]
//  ];
//  console.log('vert');
//  console.log('o : ' + checkWinVertical('o'));
//  console.log('x : ' + checkWinVertical('x'));
//  cellsVal = [
//    [
//      'o',
//      undefined,
//      'x'
//    ], [
//      undefined,
//      'x',
//      undefined
//    ], [
//      'x',
//      'o',
//      'o'
//    ]
//  ];
//  console.log('diag');
//  console.log('o : ' + checkWinDiagonal('o'));
//  console.log('x : ' + checkWinDiagonal('x'));


}
$(document).ready(function () {
  var game = new TicTacToe();
});