/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function TicTacToe() {
  var horizontalCellNumber = 3;
  var verticalCellNumber = 3;
  var cellInARowToWin = 3;
  var cellsEl = [//TODO gen from rows number
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
  var cellsVal = [//TODO gen from rows number
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

  var checkWinnable = function (expectedValue, lastLowestEmptySlotsNumber, XStartingPoint, YStartingPoint, XEndingPoint, YEndingPoint, XCheckDirection, YCheckDirection) {
    var winnableCoord = undefined;
    var emptySlotsNumber;
    var lowestEmptySlotsNumber = typeof lastLowestEmptySlotsNumber !== 'undefined' ? lastLowestEmptySlotsNumber : (cellInARowToWin + 1);// to get at least 1 empty line
    var stillOk;//TODO Init maybe

    for (var i = YStartingPoint; i < YEndingPoint; i++) {
      for (var j = XStartingPoint; j < XEndingPoint; j++) {
        emptySlotsNumber = 0;
        stillOk = true;
        for (var k = 0; k < cellInARowToWin && stillOk; k++) {
          if (cellsVal[i + (YCheckDirection * k)][j + (XCheckDirection * k)] === undefined) {
            emptySlotsNumber++;
            if (emptySlotsNumber >= lowestEmptySlotsNumber) {
              stillOk = false;
            }
          } else if (cellsVal[i + (YCheckDirection * k)][j + (XCheckDirection * k)] !== expectedValue) {
            stillOk = false;
          }
        }
        if (stillOk) {
          lowestEmptySlotsNumber = emptySlotsNumber;
          console.log(i + " " + j);//TODO delete
          if (emptySlotsNumber === 0) {
            winnableCoord = {
              missingSlots: emptySlotsNumber,
              y: [],
              x: []
            };
            for (var k = 0; k < cellInARowToWin; k++) {
              winnableCoord['y'].push(i + (YCheckDirection * k));
              winnableCoord['x'].push(j + (XCheckDirection * k));
            }
            return winnableCoord;

          } else {
            winnableCoord = {
              missingSlots: emptySlotsNumber,
              y: [],
              x: []
            };
            for (var k = 0; k < cellInARowToWin; k++) {
              if (cellsVal[i + (YCheckDirection * k)][j + (XCheckDirection * k)] === undefined) {
                winnableCoord['y'].push(i + (YCheckDirection * k));
                winnableCoord['x'].push(j + (XCheckDirection * k));
//                break;//TODO delete maybe
              }
            }
          }

        }
      }
    }
    return winnableCoord;
  };
  var checkWinnableHorizontalFromParameters = function (expectedValue, lastLowestEmptySlotsNumber) {
    var XStartingPoint = 0;
    var YStartingPoint = 0;
    var XEndingPoint = cellsVal.length - cellInARowToWin + 1;
    var YEndingPoint = cellsVal.length;
    var XCheckDirection = 1;
    var YCheckDirection = 0;

    return checkWinnable(expectedValue, lastLowestEmptySlotsNumber, XStartingPoint, YStartingPoint, XEndingPoint, YEndingPoint, XCheckDirection, YCheckDirection);

  };
  var checkWinnableVerticalFromParameters = function (expectedValue, lastLowestEmptySlotsNumber) {
    var XStartingPoint = 0;
    var YStartingPoint = 0;
    var XEndingPoint = cellsVal.length;
    var YEndingPoint = cellsVal.length - cellInARowToWin + 1;
    var XCheckDirection = 0;
    var YCheckDirection = 1;

    return checkWinnable(expectedValue, lastLowestEmptySlotsNumber, XStartingPoint, YStartingPoint, XEndingPoint, YEndingPoint, XCheckDirection, YCheckDirection);

  };
  var checkWinnableDiagonalTopLeftFromParameters = function (expectedValue, lastLowestEmptySlotsNumber) {
    var XStartingPoint = 0;
    var YStartingPoint = 0;
    var XEndingPoint = cellsVal.length - cellInARowToWin + 1;
    var YEndingPoint = cellsVal.length - cellInARowToWin + 1;
    var XCheckDirection = 1;
    var YCheckDirection = 1;

    return checkWinnable(expectedValue, lastLowestEmptySlotsNumber, XStartingPoint, YStartingPoint, XEndingPoint, YEndingPoint, XCheckDirection, YCheckDirection);

  };
  var checkWinnableDiagonalTopRightFromParameters = function (expectedValue, lastLowestEmptySlotsNumber) {
    var XStartingPoint = cellInARowToWin - 1;
    var YStartingPoint = 0;
    var XEndingPoint = cellsVal.length;
    var YEndingPoint = cellsVal.length - cellInARowToWin + 1;
    var XCheckDirection = -1;
    var YCheckDirection = 1;

    return checkWinnable(expectedValue, lastLowestEmptySlotsNumber, XStartingPoint, YStartingPoint, XEndingPoint, YEndingPoint, XCheckDirection, YCheckDirection);

  };
  var checkWinDiagonalTopLeft = function (expectedValue) {
    return checkWinnableDiagonalTopLeftFromParameters(expectedValue, 1);
  };
  var checkWinDiagonalTopRight = function (expectedValue) {
    return checkWinnableDiagonalTopRightFromParameters(expectedValue, 1);
  };
  var checkWinVertical = function (expectedValue) {
    return checkWinnableVerticalFromParameters(expectedValue, 1);
  };
  var checkWinHorizontal = function (expectedValue) {
    return checkWinnableHorizontalFromParameters(expectedValue, 1);
  };

  /*
   //  var checkWinnableDiagonalTopLeft = function (expectedValue, lastLowestEmptySlotsNumber) {
   ////    var counter = 0;
   ////    var winnableCoord = [];
   //    var winnableCoord = undefined;
   //    var emptySlotsNumber;
   ////    var lowestEmptySlotsNumber = lastLowestEmptySlotsNumber | (cellInARowToWin + 1);// to get at least 1 empty line
   //    var lowestEmptySlotsNumber = typeof lastLowestEmptySlotsNumber !== 'undefined' ? lastLowestEmptySlotsNumber : (cellInARowToWin + 1);// to get at least 1 empty line
   //
   //    var stillOk = true;//TODO unInit
   //    for (var i = 0; i < cellsVal.length - cellInARowToWin + 1; i++) {
   //      for (var j = 0; j < cellsVal.length - cellInARowToWin + 1; j++) {
   //        emptySlotsNumber = 0;
   //        stillOk = true;
   //        for (var k = 0; k < cellInARowToWin && stillOk; k++) {
   //          if (cellsVal[i + k][j + k] === undefined) {
   //            emptySlotsNumber++;
   //            if (emptySlotsNumber >= lowestEmptySlotsNumber) {
   //              stillOk = false;
   //            }
   //          } else if (cellsVal[i + k][j + k] !== expectedValue) {
   //            stillOk = false;
   //          }
   //        }
   //        if (stillOk) {
   //          lowestEmptySlotsNumber = emptySlotsNumber;
   //          console.log(i + " " + j);//TODO delete
   //          if (emptySlotsNumber === 0) {
   //            winnableCoord = {
   //              missingSlots: emptySlotsNumber,
   //              x: [],
   //              y: []
   //            };
   //            for (var k = 0; k < cellInARowToWin; k++) {
   //              winnableCoord['y'].push(i + k);
   //              winnableCoord['x'].push(j + k);
   //            }
   //            return winnableCoord;
   //
   //          } else {
   //            winnableCoord = {
   //              missingSlots: emptySlotsNumber,
   //              x: [],
   //              y: []
   //            };
   //            for (var k = 0; k < cellInARowToWin; k++) {
   //              if (cellsVal[i + k][j + k] === undefined) {
   //                winnableCoord['y'].push(i + k);
   //                winnableCoord['x'].push(j + k);
   ////                break;//TODO delete maybe
   //              }
   //            }
   //          }
   //
   //        }
   //      }
   //    }
   //    return winnableCoord;
   //  };
   //  var checkWinDiagonalTopLeft = function (expectedValue) {
   ////    var counter = 0;
   //    var stillOk = true;
   //    for (var i = 0; i < cellsVal.length - cellInARowToWin + 1; i++) {
   //      for (var j = 0; j < cellsVal.length - cellInARowToWin + 1; j++) {
   //        stillOk = true;
   //        for (var k = 0; k < cellInARowToWin && stillOk; k++) {
   //          if (cellsVal[i + k][j + k] !== expectedValue) {
   //            stillOk = false;
   //          }
   //        }
   //        if (stillOk) {
   //          return true;
   //        }
   //      }
   //    }
   //    return false;
   //  };
   //  var checkWinDiagonalTopRight = function (expectedValue) {
   //    var stillOk = true;
   //    for (var i = 0; i < cellsVal.length - cellInARowToWin + 1; i++) {
   //      for (var j = cellInARowToWin - 1; j < cellsVal.length; j++) {
   //        stillOk = true;
   //        for (var k = 0; k < cellInARowToWin && stillOk; k++) {
   //          if (cellsVal[i + k][j - k] !== expectedValue) {
   //            stillOk = false;
   //          }
   //        }
   //        if (stillOk) {
   //          return true;
   //        }
   //      }
   //    }
   //    return false;
   //  };
   //  var checkWinDiagonal = function (expectedValue) {
   //    return    checkWinDiagonalTopLeft(expectedValue) ||
   ////    return    !!checkWinnableDiagonalTopLeft(expectedValue, 0) || //TODO change
   //        checkWinDiagonalTopRight(expectedValue);
   //  };
   //  var checkWinHorizontal = function (expectedValue) {
   //    var stillOk = true;
   //    for (var i = 0; i < cellsVal.length; i++) {
   //      for (var j = 0; j < cellsVal.length - cellInARowToWin + 1; j++) {
   //        stillOk = true;
   //        for (var k = 0; k < cellInARowToWin && stillOk; k++) {
   //          if (cellsVal[i][j + k] !== expectedValue) {
   //            stillOk = false;
   //          }
   //        }
   //        if (stillOk) {
   //          return true;
   //        }
   //      }
   //    }
   //    return false;
   //  };
   //  var checkWinVertical = function (expectedValue) {
   //    var stillOk = true;
   //    for (var i = 0; i < cellsVal.length - cellInARowToWin + 1; i++) {
   //      for (var j = 0; j < cellsVal.length; j++) {
   //        stillOk = true;
   //        for (var k = 0; k < cellInARowToWin && stillOk; k++) {
   //          if (cellsVal[i + k][j] !== expectedValue) {
   //            stillOk = false;
   //          }
   //        }
   //        if (stillOk) {
   //          return true;
   //        }
   //      }
   //    }
   //    return false;
   //  };*/ //TODO delete

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
    var diagTL = checkWinDiagonalTopLeft(expectedValue);
    var diagTR = checkWinDiagonalTopRight(expectedValue);
    var isOver = isComplete();
    //TODO get win location

//    console.log("___" + expectedValue + "___");//TODO delete
//    console.log("hor : " + hor);
//    console.log("vert : " + vert);
//    console.log("diagTL : " + diagTL);
//    console.log("diagTR : " + diagTR);
//    console.log("isOver : " + isOver);
    console.log("___" + expectedValue + "___");//TODO delete
    console.log(hor);
    console.log(vert);
    console.log(diagTL);
    console.log(diagTR);
    console.log(hor || vert || diagTL || diagTR);
    console.log("isOver : " + isOver);

    var winLines = [];
    if (hor) {
      winLines.push(hor);
    }
    if (vert) {
      winLines.push(vert);
    }
    if (diagTL) {
      winLines.push(diagTL);
    }
    if (diagTR) {
      winLines.push(diagTR);
    }

    if (winLines.length !== 0) {
      return winLines;
    }
    else if (isOver) {
      return true;
    } else {
      return false;
    }
  };
  var endingAnimation = function (endResults) {
    if (endResults === true) { //endResults not an array: board complete

//    } else if (){
    } else {
      for (var i = 0; i < endResults.length; i++) {
        var tempObj = endResults[i];
        var tempLength = tempObj.x.length;
        for (var j = 0; j < tempLength; j++) {
          cellsEl[tempObj.y[j]][tempObj.x[j]].children().addClass("won");
        }
      }
    }
  };
  var swapFirstPlayer = function () {
    isUserFirstPlayer = !isUserFirstPlayer;
  };
  var swapPlayer = function () {
    isUserPlaying = !isUserPlaying;
  };
  var ending = function (endResults) {
    console.log("end");//TODO delete
    endingAnimation(endResults);
    window.setTimeout(restart, 2000);
  };
  var getBestMove = function (value) {
    var funArr = [
      checkWinnableHorizontalFromParameters,
      checkWinnableVerticalFromParameters,
      checkWinnableDiagonalTopLeftFromParameters,
      checkWinnableDiagonalTopRightFromParameters
    ];
    var bestMissingSlots = (cellInARowToWin + 1);// to get at least 1 empty line
    var bestMove;
    var tempMove;
    for (var i = 0; i < funArr.length && bestMissingSlots > 1; i++) {
      tempMove = funArr[i](value, bestMissingSlots);
      if (tempMove !== undefined) {
        bestMissingSlots = tempMove.missingSlots;
        bestMove = tempMove;
      }
    }
    return bestMove;
  }
  var AIPlays = function (selfValue, enemyValue) {

    //TODO AI choice

    var bestMove = getBestMove(selfValue);

    if (bestMove && bestMove.missingSlots == 1) {
      AISelectCell(bestMove.y[0], bestMove.x[0]);
    } else {

      var bestEnemyMove = getBestMove(enemyValue);
      if (bestEnemyMove && bestEnemyMove.missingSlots == 1) {
        AISelectCell(bestEnemyMove.y[0], bestEnemyMove.x[0]);
      } else if (bestMove) {
        AISelectCell(bestMove.y[0], bestMove.x[0]);
      } else if (bestEnemyMove) {
        AISelectCell(bestEnemyMove.y[0], bestEnemyMove.x[0]);
      } else {

        //TODO delete
        var isChosen = false;
        for (var i = 0; i < cellsVal.length && !isChosen; i++) {
          for (var j = 0; j < cellsVal.length && !isChosen; j++) {
            if (cellsVal[i][j] === undefined) {
              AISelectCell(i, j);
              isChosen = true;
            }
          }
        } //TODO delete
      }
    }

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
    var curVal = getCurValue();
    var endResults = isGameOver(curVal);
    if (endResults) {
      ending(endResults);
    } else {
      swapPlayer();
      if (!isUserPlaying) { // if player's turn, stop and wait
        AIPlays(getCurValue(), curVal);
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

//  cellsVal = [
//    [
//      undefined,
//      'o',
//      'x'
//    ], [
//      'x',
//      undefined,
//      undefined
//    ], [
//      'o',
//      'o',
//      undefined
//    ]
//  ];
//  console.log('diag');
//  console.log('o : ' + checkWinnableDiagonalTopLeft('o'));
//  console.log('x : ' + checkWinnableDiagonalTopLeft('x'));
//
//  console.log(checkWinnableDiagonalTopLeft('o', 3));
//  console.log(checkWinnableDiagonalTopLeft('x'));

//  console.log(checkWinnableDiagonalTopLeftFromParameters('o'));
//  console.log(checkWinnableDiagonalTopLeftFromParameters('x', 4));

//  console.log(checkWinnableDiagonalTopRightFromParameters('o', 4));
//  console.log(checkWinnableDiagonalTopRightFromParameters('x', 4));
//
//  console.log(checkWinnableVerticalFromParameters('o', 4));
//  console.log(checkWinnableVerticalFromParameters('x', 4));

//  console.log(checkWinnableHorizontalFromParameters('o', 4));
//  console.log(checkWinnableHorizontalFromParameters('x', 4));


}
$(document).ready(function () {
  var game = new TicTacToe();
}
);