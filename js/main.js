/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function TicTacToe() {
  var horizontalCellNumber = 8;
//  var verticalCellNumber = 6;
  var verticalCellNumber = horizontalCellNumber;
  var cellInARowToWin = 5;
//  var cellsEl = [//TODO gen from rows number
//    [
//      $("#cell1"),
//      $("#cell2"),
//      $("#cell3")
//    ], [
//      $("#cell4"),
//      $("#cell5"),
//      $("#cell6")
//    ], [
//      $("#cell7"),
//      $("#cell8"),
//      $("#cell9")
//    ]
//  ];
//  var cellsVal = [//TODO gen from rows number
//    [
//      undefined,
//      undefined,
//      undefined
//    ], [
//      undefined,
//      undefined,
//      undefined
//    ], [
//      undefined,
//      undefined,
//      undefined
//    ]
//  ];
  var cellsEl;
  var cellsVal;

//  var iconX = $('<span class="glyphicon glyphicon-remove"></span>');
//  var iconO = $('<i class="fa fa-circle-o"></i>');
  var iconX = $('<span class="value">X</span>');
  var iconO = $('<span class="value">O</span>');
  var isPlayer1FirstPlayer = true;
  var isPlayer1Playing = true;
  var isPlayer1X = false; //TODO get in GUI
  var isPlayer1AI = false; //TODO get in GUI
//  var isPlayer1AI = true;
//  var isPlayer2AI = false;//TODO get in GUI
  var isPlayer2AI = true;
  var isHinting = false; //TODO get in GUI //TODO set to false
  var lastHint = undefined;
  var scoreDraw = 0;
  var scorePlayer1 = 0;
  var scorePlayer2 = 0;
  var endingTimeoutDuration = 1500;


  var buildGrid = function () { //TODO get in GUI
//    var grid = $('<div class="grid"></div>');
    var grid = $('#grid');
    grid.text(""); // empty grid before rebuilding
    var row = $('<div class="row"></div>');
    var cell = $('<div class="cell"></div>');
    cellsEl = [];
    cellsVal = [];
    for (var i = 0; i < verticalCellNumber; i++) {
      var curRow = row.clone();
      var curElLine = [];
      var curValLine = [];
      for (var j = 0; j < horizontalCellNumber; j++) {
        curCell = cell.clone();
        curElLine.push(curCell);
        curRow.append(curCell);
        curValLine.push(undefined);
      }
      cellsEl.push(curElLine);
      cellsVal.push(curValLine);
      grid.append(curRow);
    }
  };
  var displaySelection = function (cellX, cellY) {
    cellsEl[cellX][cellY].text(""); // to clean potential hint
    if (cellsVal[cellX][cellY] === "x") {
      cellsEl[cellX][cellY].append(iconX.clone());
//      cellsEl[cellX][cellY].text("x");
    } else {
      cellsEl[cellX][cellY].append(iconO.clone());
//      cellsEl[cellX][cellY].text("o");
    }
  };
  var displayHint = function (cellX, cellY, currentValue) {
    cellsEl[cellX][cellY].text(""); // to clean potential hint
    if (currentValue === "x") {
      lastHint = (iconX.clone()).addClass('hint');
    } else {
      lastHint = (iconO.clone()).addClass('hint');
    }
    cellsEl[cellX][cellY].append(lastHint);
  };
  var removeHint = function () {
    if (lastHint) {
      lastHint.remove();
    }
  };
  var toggleHint = function () {
    isHinting = !isHinting;
    if (isHinting) {
      var values = getValues();
      AIHints(values.cur, values.next);
    } else {
      removeHint();
    }
  };
  var togglePlayer2AI = function () {
    isPlayer2AI = !isPlayer2AI;
    var values = getValues();
    if (!isAUserPlaying()) {
      AIPlays(values.cur, values.next);
    }
  };
  var togglePlayerValues = function () {
    isPlayer1X = !isPlayer1X;
  };
  var loadParameters = function () {
    var hor = $('#lineNumber');//TODO put in initial declarations
    var vert = $('#columnNumber');
    var inARow = $('#cellInARowToWin');
//    var player1X = $('#firstPlayerX');
//    var player1X = $('#firstPlayerX:checked');
    var player1X = $('input[name=firstPlayerX]:checked');
    player1X.parents().addClass("active"); //in case the browser override the html checkings(remember the last checkings)
//    var player1X = $('input[name=firstPlayerX]:checked');

    horizontalCellNumber = hor.val();
    verticalCellNumber = vert.val();
    cellInARowToWin = inARow.val();
//    isPlayer1X = player1X.is(":checked");
    isPlayer1X = !!player1X.val();
  };
  var selectCell = function (cellX, cellY) {
    var curVal = getValues().cur;
    cellsVal[cellX][cellY] = curVal;
    displaySelection(cellX, cellY);
  };
  var isAUserPlaying = function () {
    return (isPlayer1Playing && !isPlayer1AI) || (!isPlayer1Playing && !isPlayer2AI);
  };
  var userClickCell = function (cellX, cellY) {
    if (isAUserPlaying() && cellsVal[cellX][cellY] === undefined) {
//      userSelectCell(cellX, cellY);
      selectCell(cellX, cellY);
      routine();
    }
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
        cellsEl[i][j].text("");
        cellsVal[i][j] = undefined;
      }
    }
  };
  var getWinnable = function (expectedValue, lastLowestEmptySlotsNumber, XStartingPoint, YStartingPoint, XEndingPoint, YEndingPoint, XCheckDirection, YCheckDirection, maxEpmtySlotsMemory, minEpmtySlotsMemory) {
    var winnableCoord = undefined;
    var emptySlotsNumber;
    var lowestEmptySlotsNumber = typeof lastLowestEmptySlotsNumber !== 'undefined' ? lastLowestEmptySlotsNumber : (cellInARowToWin + 1); // to get at least 1 empty line
    var maxEpmtySlotsMemory = typeof maxEpmtySlotsMemory !== 'undefined' ? maxEpmtySlotsMemory : -1; // if not specified, dont store and return
    var minEpmtySlotsMemory = typeof minEpmtySlotsMemory !== 'undefined' ? minEpmtySlotsMemory : -1;
    if (maxEpmtySlotsMemory > -1) { //initialize memory array
      var winnableCoordMemory = [];
      for (var i = 0; i < maxEpmtySlotsMemory + 1; i++) {
        winnableCoordMemory.push([]);
      }
    }
    var stillOk;

    for (var i = YStartingPoint; i < YEndingPoint; i++) {
      for (var j = XStartingPoint; j < XEndingPoint; j++) {
        emptySlotsNumber = 0;
        stillOk = true;
        for (var k = 0; k < cellInARowToWin && stillOk; k++) {
          if (cellsVal[i + (YCheckDirection * k)][j + (XCheckDirection * k)] === undefined) {
            emptySlotsNumber++;
            if (
                emptySlotsNumber >= lowestEmptySlotsNumber &&
                (
                    emptySlotsNumber > maxEpmtySlotsMemory ||
                    emptySlotsNumber < minEpmtySlotsMemory
                    )
                ) {
              stillOk = false;
            }
          } else if (cellsVal[i + (YCheckDirection * k)][j + (XCheckDirection * k)] !== expectedValue) {
            stillOk = false;
          }
        }
        if (stillOk) {
          lowestEmptySlotsNumber = emptySlotsNumber;
          if (emptySlotsNumber === 0) {
            winnableCoord = {
              missingSlots: emptySlotsNumber,
              coords: []
            };
            for (var k = 0; k < cellInARowToWin; k++) {
              winnableCoord.coords.push(
                  {
                    y: i + (YCheckDirection * k),
                    x: j + (XCheckDirection * k)
                  }
              );
            }
            if (emptySlotsNumber <= maxEpmtySlotsMemory && emptySlotsNumber >= minEpmtySlotsMemory) {
              winnableCoordMemory[emptySlotsNumber].push(winnableCoord);
            } else {
              return winnableCoord;
            }

          } else {
            winnableCoord = {
              missingSlots: emptySlotsNumber,
              coords: []
            };
            for (var k = 0; k < cellInARowToWin; k++) {
              if (cellsVal[i + (YCheckDirection * k)][j + (XCheckDirection * k)] === undefined) {
                winnableCoord.coords.push(
                    {
                      y: i + (YCheckDirection * k),
                      x: j + (XCheckDirection * k)
                    }
                );
              }
            }
            if (emptySlotsNumber <= maxEpmtySlotsMemory && emptySlotsNumber >= minEpmtySlotsMemory) {
              winnableCoordMemory[emptySlotsNumber].push(winnableCoord);
            }
          }

        }
      }
    }
    if (maxEpmtySlotsMemory > -1) {
      return winnableCoordMemory;
    } else {
      return winnableCoord;
    }
  };
  var getWinnableHorizontal = function (expectedValue, lastLowestEmptySlotsNumber, maxEpmtySlotsMemory, minEpmtySlotsMemory) {
    var XStartingPoint = 0;
    var YStartingPoint = 0;
    var XEndingPoint = cellsVal[0].length - cellInARowToWin + 1;
    var YEndingPoint = cellsVal.length;
    var XCheckDirection = 1;
    var YCheckDirection = 0;
    return getWinnable(expectedValue, lastLowestEmptySlotsNumber, XStartingPoint, YStartingPoint, XEndingPoint, YEndingPoint, XCheckDirection, YCheckDirection, maxEpmtySlotsMemory, minEpmtySlotsMemory);
  };
  var getWinnableVertical = function (expectedValue, lastLowestEmptySlotsNumber, maxEpmtySlotsMemory, minEpmtySlotsMemory) {
    var XStartingPoint = 0;
    var YStartingPoint = 0;
    var XEndingPoint = cellsVal[0].length;
    var YEndingPoint = cellsVal.length - cellInARowToWin + 1;
    var XCheckDirection = 0;
    var YCheckDirection = 1;
    return getWinnable(expectedValue, lastLowestEmptySlotsNumber, XStartingPoint, YStartingPoint, XEndingPoint, YEndingPoint, XCheckDirection, YCheckDirection, maxEpmtySlotsMemory, minEpmtySlotsMemory);
  };
  var getWinnableDiagonalTopLeft = function (expectedValue, lastLowestEmptySlotsNumber, maxEpmtySlotsMemory, minEpmtySlotsMemory) {
    var XStartingPoint = 0;
    var YStartingPoint = 0;
    var XEndingPoint = cellsVal[0].length - cellInARowToWin + 1;
    var YEndingPoint = cellsVal.length - cellInARowToWin + 1;
    var XCheckDirection = 1;
    var YCheckDirection = 1;
    return getWinnable(expectedValue, lastLowestEmptySlotsNumber, XStartingPoint, YStartingPoint, XEndingPoint, YEndingPoint, XCheckDirection, YCheckDirection, maxEpmtySlotsMemory, minEpmtySlotsMemory);
  };
  var getWinnableDiagonalTopRight = function (expectedValue, lastLowestEmptySlotsNumber, maxEpmtySlotsMemory, minEpmtySlotsMemory) {
    var XStartingPoint = cellInARowToWin - 1;
    var YStartingPoint = 0;
    var XEndingPoint = cellsVal[0].length;
    var YEndingPoint = cellsVal.length - cellInARowToWin + 1;
    var XCheckDirection = -1;
    var YCheckDirection = 1;
    return getWinnable(expectedValue, lastLowestEmptySlotsNumber, XStartingPoint, YStartingPoint, XEndingPoint, YEndingPoint, XCheckDirection, YCheckDirection, maxEpmtySlotsMemory, minEpmtySlotsMemory);
  };
  var checkWinnableHorizontal = function (expectedValue, lastLowestEmptySlotsNumber) {
    return getWinnableHorizontal(expectedValue, lastLowestEmptySlotsNumber);
  };
  var checkWinnableVertical = function (expectedValue, lastLowestEmptySlotsNumber) {
    return getWinnableVertical(expectedValue, lastLowestEmptySlotsNumber);
  };
  var checkWinnableDiagonalTopLeft = function (expectedValue, lastLowestEmptySlotsNumber) {
    return getWinnableDiagonalTopLeft(expectedValue, lastLowestEmptySlotsNumber);
  };
  var checkWinnableDiagonalTopRight = function (expectedValue, lastLowestEmptySlotsNumber) {
    return getWinnableDiagonalTopRight(expectedValue, lastLowestEmptySlotsNumber);
  };
  var checkWinDiagonalTopLeft = function (expectedValue) {
    return checkWinnableDiagonalTopLeft(expectedValue, 1);
  };
  var checkWinDiagonalTopRight = function (expectedValue) {
    return checkWinnableDiagonalTopRight(expectedValue, 1);
  };
  var checkWinVertical = function (expectedValue) {
    return checkWinnableVertical(expectedValue, 1);
  };
  var checkWinHorizontal = function (expectedValue) {
    return checkWinnableHorizontal(expectedValue, 1);
  };
  var isComplete = function () {
    for (var i = 0; i < cellsVal.length; i++) {
      for (var j = 0; j < cellsVal[0].length; j++) {
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
  var getAllWinnable = function (expectedValue, maxEpmtySlotsMemory, minEpmtySlotsMemory) {
    maxEpmtySlotsMemory = typeof maxEpmtySlotsMemory !== 'undefined' ? maxEpmtySlotsMemory : cellInARowToWin;
    var funArr = [
      getWinnableHorizontal,
      getWinnableVertical,
      getWinnableDiagonalTopLeft,
      getWinnableDiagonalTopRight
    ];
    var allWinnableByCell = [];
    var allWinnableByLine = [];
    for (var i = 0; i < maxEpmtySlotsMemory + 1; i++) {
      allWinnableByCell.push([]);
    }
    var curWinnable;
    var curWinnableCoords;
    var IDCounter = -1;
    for (var i = 0; i < funArr.length; i++) {
      curWinnable = funArr[i](expectedValue, undefined, maxEpmtySlotsMemory, minEpmtySlotsMemory);
      for (var j = 0; j < curWinnable.length; j++) { //looping all arrays of array ranked by number of missing slots
        for (var k = 0; k < curWinnable[j].length; k++) { //looping array of coord with same number of missing slots
          IDCounter++;
          curWinnableCoords = curWinnable[j][k].coords;
          allWinnableByLine.push(curWinnableCoords);
          for (var l = 0; l < curWinnableCoords.length; l++) {
            curWinnableCoords[l].ID = IDCounter;
            allWinnableByCell[j].push(curWinnableCoords[l]);
          }
        }
      }
    }
    return {
      byCell: allWinnableByCell,
      byLine: allWinnableByLine
    };
  };
  var coordsComparator = function (a, b) {
    if (a.y < b.y) {
      return -1;
    } else if (a.y > b.y) {
      return +1;
    } else if (a.y === b.y) {
      if (a.x < b.x) {
        return -1;
      } else if (a.x > b.x) {
        return +1;
      } else if (a.x === b.x) {
        return 0;
      }
    }
  };
  var isCoordsEqual = function (a, b) {
    return a.x === b.x && a.y === b.y;
  };
  var filterUniqueCoords = function (cur, index, arr) {
    var isNext = false;
    var isPrev = false;
    if (arr[index + 1]) {
      isNext = isCoordsEqual(cur, arr[index + 1]);
    }
    if (arr[index - 1]) {
      isPrev = isCoordsEqual(cur, arr[index - 1]);
    }
    return isNext || isPrev;
  };
  var filterNonUniqueCoords = function (cur, index, arr) {
    if (arr[index + 1] && isCoordsEqual(cur, arr[index + 1])) {
      return false;
    }
    return true;
  };
  var getForkMove = function (allWinnableByCell) {
    var allForkable = [];
//    if (allWinnableByCell.length >= 3) {
    if (allWinnableByCell.length >= 2) { //TODO check
      allWinnableByCell[2].sort(coordsComparator);
      allForkable = allWinnableByCell[2].filter(filterUniqueCoords);
      return allForkable;
    }
  };
  var getNextTurnForkMove = function (allWinnable) {
    var allWinnableByCell = allWinnable.byCell;
    var allWinnableByLine = allWinnable.byLine;
    var allNextTurnForkable = [];
    if (allWinnableByCell.length >= 3 &&
        allWinnableByCell[2].length >= 2 &&
        allWinnableByCell[3].length >= 1) {
      for (var i = 0; i < allWinnableByCell[2].length; i++) {
        if (allWinnableByCell[2][i]) {
          var firstCell = allWinnableByCell[2][i];
          for (var j = 0; j < allWinnableByCell[3].length; j++) {
            if (allWinnableByCell[3][j] && isCoordsEqual(allWinnableByCell[3][j], firstCell)) {
              var ID = allWinnableByCell[3][j].ID;
              var curLine = allWinnableByLine[ID];
              for (var k = 0; curLine && k < curLine.length; k++) {
                if (!isCoordsEqual(curLine[k], firstCell)) {
                  var secondCell = curLine[k];
                  for (var l = i; l < allWinnableByCell[2].length; l++) {
                    if (allWinnableByCell[2][l] && isCoordsEqual(allWinnableByCell[2][l], secondCell)) {
//                      allNextTurnForkable.push([firstCell, secondCell]);
//                      allNextTurnForkable.push([firstCell, allWinnableByCell[2][l]]);
                      allNextTurnForkable.push(
                          {
                            checkMoves: [firstCell, allWinnableByCell[2][l]],
                            lastMove: secondCell
                          }
                      );
                    }
                  }
                }
              }
            }
          }
        }
      }
      return allNextTurnForkable;
    }
  };
//  var checkNextTurnForkMove = function (allWinnable, enemyAllWinnable, allNextTurnForkable) {
  var checkNextTurnForkMove = function (allWinnable, enemyAllWinnable, allNextTurnForkable, returningAllCoords) {
    /* check if the next move (that will put enemy in check) will
     * make the enemy play somewhere he misses only 2 moves
     * and thus put the current player in check (and thus
     * counter the fork move)*/
    var returningAllCoords = (typeof returningAllCoords === 'undefined') ? false : true;
    if (returningAllCoords) {
      var allCheckedNextTurnMoves = [];
    }
    var isOk;
    var isCurNTFMoveChecked = false;
    if (allNextTurnForkable &&
        allNextTurnForkable.length > 0 &&
        enemyAllWinnable &&
        enemyAllWinnable.byCell &&
        enemyAllWinnable.byCell.length > 2) {//TODO check
      for (var i = 0; i < allNextTurnForkable.length; i++) {
        isCurNTFMoveChecked = false;
        var NTForkableMoves = allNextTurnForkable[i];
        var NTForkableCheckMoves = NTForkableMoves.checkMoves;
        for (var j = 0; j < NTForkableCheckMoves.length && !isCurNTFMoveChecked; j++) {
          var NTForkableCell = NTForkableCheckMoves[j];
          var lineID = NTForkableCell.ID;
          var line = allWinnable.byLine[lineID];
          for (var l = 0; l < line.length && !isCurNTFMoveChecked; l++) {
            if (!isCoordsEqual(NTForkableCell, line[l])) {
              isOk = true;
              for (var m = 0; m < enemyAllWinnable.byCell[2].length && isOk; m++)
                if (isCoordsEqual(enemyAllWinnable.byCell[2][m], line[l])) {
                  isOk = false;
                }
              if (isOk) {
                if (returningAllCoords) {
                  isCurNTFMoveChecked = true;
                  allCheckedNextTurnMoves.push(NTForkableMoves);
                } else {
                  return {y: NTForkableCell.y,
                    x: NTForkableCell.x};
                }
              }
            }
          }
        }
      }
      return allCheckedNextTurnMoves;
    }
  };
  var getCommonCoords = function (coordsList) {
    var commonCoords = [];
    var curCommonCoord;
    var tempCC;
    if (coordsList.length > 1) {
      commonCoords = coordsList[0];
      commonCoords.sort(coordsComparator);
      commonCoords = commonCoords.filter(filterNonUniqueCoords);

      for (var i = 1; i < coordsList.length; i++) {
        tempCC = [];
        for (var j = 0; j < commonCoords.length; j++) {
          curCommonCoord = commonCoords[j];
          isCommon = false;
          for (var k = 0; k < coordsList[i].length && !isCommon; k++) {
            if (isCoordsEqual(curCommonCoord, coordsList[i][k])) {
              tempCC.push(curCommonCoord);
              isCommon = true;
            }
          }
        }
        commonCoords = tempCC;
      }
      return commonCoords;
    } else if (coordsList.length === 1) {
      return coordsList[0];
    }
  };
  var counterNextTurnForkMove = function (enemyAllWinnable, enemyAllNextTurnForkable) {

    var movesLinesCoords;
    var movesLinesCoordsList = [];
    var NTForkableCell;
    var lineID;
    var line;
    var ENTForkableMoves;
    if (enemyAllNextTurnForkable &&
        enemyAllNextTurnForkable.length > 0 &&
        enemyAllWinnable &&
        enemyAllWinnable.byLine) {//TODO check
      for (var i = 0; i < enemyAllNextTurnForkable.length; i++) {
        ENTForkableMoves = [];
        for (var x = 0; x < enemyAllNextTurnForkable[i].checkMoves.length; x++) {
          ENTForkableMoves.push(enemyAllNextTurnForkable[i].checkMoves[x]);
        }
        ENTForkableMoves.push(enemyAllNextTurnForkable[i].lastMove);
        movesLinesCoords = [];
        for (var j = 0; j < ENTForkableMoves.length; j++) {
          NTForkableCell = ENTForkableMoves[j];
          lineID = NTForkableCell.ID;
          line = enemyAllWinnable.byLine[lineID];
          for (var k = 0; k < line.length; k++) {
            movesLinesCoords.push(line[k]);
          }
        }
        movesLinesCoordsList.push(movesLinesCoords);
      }
      var commonCoords = getCommonCoords(movesLinesCoordsList);
      return commonCoords;
    }

  };
  var counterForkMove = function (enemyAllWinnable, enemyAllForkable) { //TODO TO TEST
    var forkableMovesLinesList = [];
    var forkableMoveLine;
    for (var i = 0; i < enemyAllForkable.length; i++) {
      var curForkable = enemyAllForkable[i];
      var counter = 1;
      var forkableMoveLine = [];
      for (var j = 0; j < enemyAllWinnable.byLine[curForkable.ID].length; j++) {
        forkableMoveLine.push(enemyAllWinnable.byLine[curForkable.ID][j]);
      }
      while ((i + 1) < enemyAllForkable.length && isCoordsEqual(curForkable, enemyAllForkable[i + 1])) {
        for (var j = 0; j < enemyAllWinnable.byLine[enemyAllForkable[i + 1].ID].length; j++) {
          forkableMoveLine.push(enemyAllWinnable.byLine[enemyAllForkable[i + 1].ID][j]);
        }
        i++;
        counter++;
      }
      if (counter > 2) {
        return enemyAllForkable[i];
      }
      else {
        forkableMovesLinesList.push(forkableMoveLine);
      }
    }
    return getCommonCoords(forkableMovesLinesList);

  };
  var getClosestMove = function (value) {
    var funArr = [
      checkWinnableHorizontal,
      checkWinnableVertical,
      checkWinnableDiagonalTopLeft,
      checkWinnableDiagonalTopRight
    ];
    var bestMissingSlots = (cellInARowToWin + 1); // to get at least 1 empty line
    var closestMove;
    var tempMove;
    for (var i = 0; i < funArr.length && bestMissingSlots > 1; i++) {
      tempMove = funArr[i](value, bestMissingSlots);
      if (tempMove !== undefined) {
        bestMissingSlots = tempMove.missingSlots;
        closestMove = tempMove;
      }
    }
    return closestMove;
  };
  var AIBestMove = function (selfValue, enemyValue) {
    var closestMove = getClosestMove(selfValue);
    if (closestMove && closestMove.missingSlots === 1) {
//      return {y: closestMove.coords[0].y, x: closestMove.coords[0].x};
      return closestMove.coords[0];
    }
    var closestEnemyMove = getClosestMove(enemyValue);
    if (closestEnemyMove && closestEnemyMove.missingSlots === 1) {
//      return {y: closestEnemyMove.coords[0].y, x: closestEnemyMove.coords[0].x};
      return closestEnemyMove.coords[0];
    }
    //    var allWinnable = getAllWinnable(expectedValue, 3, 2);//TODO unComment
    var allWinnable = getAllWinnable(selfValue, 3, 0);
    var allForkable = getForkMove(allWinnable.byCell);
    if (allForkable.length > 0) {
//      return {y: allForkable[0].y, x: allForkable[0].x};
      return allForkable[0];
    }
    var enemyAllWinnable = getAllWinnable(enemyValue, 3, 0);
    var allNextTurnForkable = getNextTurnForkMove(allWinnable);
    if (allNextTurnForkable && allNextTurnForkable.length > 0) {
      var nextTurnForkMove = checkNextTurnForkMove(allWinnable, enemyAllWinnable, allNextTurnForkable);
      if (nextTurnForkMove) {
        return nextTurnForkMove;
      }
    }
    var enemyAllForkable = getForkMove(enemyAllWinnable.byCell);
    if (enemyAllForkable.length > 2) {
      var forkableCounter = counterForkMove(enemyAllWinnable, enemyAllForkable);//TODO check
      if (forkableCounter.length > 0) {
        return forkableCounter[0];
      }
    } else if (enemyAllForkable.length > 0) {
//      return {y: enemyAllForkable[0].y, x: enemyAllForkable[0].x};
      return enemyAllForkable[0];
    }
    var enemyAllNextTurnForkable = getNextTurnForkMove(enemyAllWinnable);
    if (enemyAllNextTurnForkable && enemyAllNextTurnForkable.length > 0) {
//      var enemyNextTurnForkMove = checkNextTurnForkMove(enemyAllWinnable, allWinnable, enemyAllNextTurnForkable);
      var enemyNextTurnForkMove = checkNextTurnForkMove(enemyAllWinnable, allWinnable, enemyAllNextTurnForkable, true);
      if (enemyNextTurnForkMove && enemyNextTurnForkMove.length > 0) {
//        var counterResults = counterNextTurnForkMove(enemyAllWinnable, enemyAllNextTurnForkable);
        var counterResults = counterNextTurnForkMove(enemyAllWinnable, enemyNextTurnForkMove);
        //    if (enemyAllNextTurnForkable && enemyAllNextTurnForkable.length > 0) {//TODO check
        if (counterResults && counterResults.length > 0) {//TODO check
          return counterResults[0];
//      return {y: enemyAllNextTurnForkable[0][0].y,
          //        x: enemyAllNextTurnForkable[0][1].x};
        }
      }
    }
    if (closestMove) {
//      return {y: closestMove.coords[0].y, x: closestMove.coords[0].x};
      return closestMove.coords[0];
    } else if (closestEnemyMove) {
//      return {y: closestEnemyMove.coords[0].y, x: closestEnemyMove.coords[0].x};
      return closestEnemyMove.coords[0];
    } else {
      //TODO delete
      var isChosen = false;
      for (var i = 0; i < cellsVal.length && !isChosen; i++) {
        for (var j = 0; j < cellsVal[i].length && !isChosen; j++) {
          if (cellsVal[i][j] === undefined) {
            return {y: i, x: j};
          }
        }
      } //TODO delete
    }
  };
  var AIPlays = function (selfValue, enemyValue) {
    var bestMove = AIBestMove(selfValue, enemyValue);
    selectCell(bestMove.y, bestMove.x);
    routine();
  };
  var AIHints = function (selfValue, enemyValue) {
    var bestMove = AIBestMove(selfValue, enemyValue);
    displayHint(bestMove.y, bestMove.x, selfValue);
  };
  var updateScores = function (isDraw) {
    if (isDraw) {
      scoreDraw++;
      $('#scoreDraw').text(scoreDraw);
    } else if (isPlayer1Playing) {
      scorePlayer1++;
      $('#scorePlayer1').text(scorePlayer1);
    } else {
      scorePlayer2++;
      $('#scorePlayer2').text(scorePlayer2);
    }
  };
  var resetScores = function () { //TODO get in GUI
    scoreDraw = 0;
    $('#scoreDraw').text(scoreDraw);
    scorePlayer1 = 0;
    $('#scorePlayer1').text(scorePlayer1);
    scorePlayer2 = 0;
    $('#scorePlayer2').text(scorePlayer2);
  };
  var endingAnimation = function (endResults) {
    if (endResults === true) { //endResults not an array: board complete
      updateScores(true);
    } else {
      for (var i = 0; i < endResults.length; i++) {
        var tempObj = endResults[i];
        var tempLength = tempObj.coords.length;
        for (var j = 0; j < tempLength; j++) {
          cellsEl[tempObj.coords[j].y][tempObj.coords[j].x].children().addClass("won");
        }
      }
      updateScores(false);
    }
  };
  var swapFirstPlayer = function () {
    isPlayer1FirstPlayer = !isPlayer1FirstPlayer;
  };
  var swapPlayerIndicator = function () {
    if (isPlayer1Playing) {
      $('.scoreLabel:first-child').addClass('currentPlayer');
      $('.scoreLabel:last-child').removeClass('currentPlayer');
//      $('.scoreLabel:first-child').addClass('currentPlayer btn');
//      $('.scoreLabel:last-child').removeClass('currentPlayer btn');
    } else {
      $('.scoreLabel:first-child').removeClass('currentPlayer ');
      $('.scoreLabel:last-child').addClass('currentPlayer');
//      $('.scoreLabel:first-child').removeClass('currentPlayer btn');
//      $('.scoreLabel:last-child').addClass('currentPlayer btn');
    }
  };
  var swapPlayer = function () {
    isPlayer1Playing = !isPlayer1Playing;
    swapPlayerIndicator();
  };
  var ending = function (endResults) {
    endingAnimation(endResults);
    window.setTimeout(restart, endingTimeoutDuration);
  };
  var getValues = function () {
    if ((isPlayer1Playing && isPlayer1X) || ((!isPlayer1Playing) && (!isPlayer1X))) {
      return {cur: 'x', next: 'o'};
    } else {
      return {cur: 'o', next: 'x'};
    }
  };
  var routine = function () {
    var values = getValues();//TODO make two player possible
    var endResults = isGameOver(values.cur);
    if (isHinting) {
      removeHint();
    }
    if (endResults) {
      ending(endResults);
    } else {
      swapPlayer();
      values = getValues();
//      if (!isPlayer1Playing) { // if player's turn, stop and wait
      if (!isAUserPlaying()) { // if player's turn, stop and wait
        AIPlays(values.cur, values.next);
      } else if (isHinting) {
        AIHints(values.cur, values.next);
      }
    }
  };
  var start = function () {
    isPlayer1Playing = isPlayer1FirstPlayer;
    routine();
  };
  var restart = function () {
    swapFirstPlayer(); //TODO maybe put it in ending
    cleanCells();
    start();
  };
  var reload = function () {
    loadParameters();
    buildGrid();
    setCellListener();
    swapFirstPlayer();
    restart();

  };
  $('#restartBtn').click(restart.bind(this)); //TODO delete
  $('#hintBtn').click(toggleHint.bind(this)); //TODO delete
  $('#rebuild').click(reload.bind(this)); //TODO delete
  $('#secondPlayerAI').click(togglePlayer2AI.bind(this));
  $('#resetScoreBtn').click(resetScores.bind(this));
  loadParameters();
  resetScores();
  buildGrid();
  setCellListener();
  swapFirstPlayer();//routine will swap it again => get the right first player
  start();
}
$(document).ready(function () {
  var game = new TicTacToe();
});