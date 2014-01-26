// Generated by CoffeeScript 1.6.3
(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  this.SudokuSolver = (function() {
    function SudokuSolver() {}

    SudokuSolver.uniqueAll = function(board) {
      var c, r, _i, _j, _ref, _ref1;
      for (r = _i = 0, _ref = board.dim2; _i < _ref; r = _i += 1) {
        for (c = _j = 0, _ref1 = board.dim2; _j < _ref1; c = _j += 1) {
          if (board.cellAt(r, c).getValue() !== '.') {
            SudokuChecks.unique(board, r, c);
          }
        }
      }
      return true;
    };

    SudokuSolver.getSquareCellsForCell = function(board, r, c) {
      var sqrid;
      sqrid = Math.floor(r / board.dim) * board.dim + Math.floor(c / board.dim);
      return this.getSquareCells(board, sqrid);
    };

    SudokuSolver.getSquareCells = function(board, squareid) {
      var cb, i, rb, result, _i, _ref;
      result = [];
      rb = Math.floor(squareid / board.dim) * board.dim;
      cb = squareid % board.dim * board.dim;
      for (i = _i = 0, _ref = board.dim2; _i < _ref; i = _i += 1) {
        result.push(board.cellAt(rb + Math.floor(i / board.dim), cb + (i % board.dim)));
      }
      return result;
    };

    SudokuSolver.getRowCells = function(board, row) {
      var i, result, _i, _ref;
      result = [];
      for (i = _i = 0, _ref = board.dim2; _i < _ref; i = _i += 1) {
        result.push(board.cellAt(row, i));
      }
      return result;
    };

    SudokuSolver.getColCells = function(board, col) {
      var i, result, _i, _ref;
      result = [];
      for (i = _i = 0, _ref = board.dim2; _i < _ref; i = _i += 1) {
        result.push(board.cellAt(i, col));
      }
      return result;
    };

    SudokuSolver.getSquareColCells = function(board, squareid, squarecol) {
      var cx, i, rb, result, _i, _ref;
      result = [];
      rb = Math.floor(squareid / board.dim) * board.dim;
      cx = squareid % board.dim * board.dim + squarecol;
      for (i = _i = 0, _ref = board.dim; _i < _ref; i = _i += 1) {
        result.push(board.cellAt(cx, rb + i));
      }
      return result;
    };

    SudokuSolver.getSquareNonColCells = function(board, squareid, squarecol) {
      var cx, i, j, rb, result, _i, _j, _ref, _ref1;
      result = [];
      rb = Math.floor(squareid / board.dim) * board.dim;
      cx = squareid % board.dim * board.dim;
      for (i = _i = 0, _ref = board.dim; _i < _ref; i = _i += 1) {
        if (i === squarecol) {
          continue;
        }
        for (j = _j = 0, _ref1 = board.dim; _j < _ref1; j = _j += 1) {
          result.push(board.cellAt(cx + i, rb + j));
        }
      }
      return result;
    };

    SudokuSolver.getNonSquareColCells = function(board, squareid, squarecol) {
      var cx, i, rb, result, _i, _j, _ref, _ref1, _results;
      result = [];
      rb = Math.floor(squareid / board.dim) * board.dim;
      cx = squareid % board.dim * board.dim + squarecol;
      for (i = _i = 0, _ref = board.dim2; _i < _ref; i = _i += 1) {
        if (__indexOf.call((function() {
          _results = [];
          for (var _j = rb, _ref1 = rb + board.dim; rb <= _ref1 ? _j < _ref1 : _j > _ref1; rb <= _ref1 ? _j++ : _j--){ _results.push(_j); }
          return _results;
        }).apply(this), i) >= 0) {
          continue;
        }
        result.push(board.cellAt(cx, i));
      }
      return result;
    };

    SudokuSolver.getSquareRowCells = function(board, squareid, squarerow) {
      var cb, i, result, ry, _i, _ref;
      result = [];
      cb = squareid % board.dim * board.dim;
      ry = Math.floor(squareid / board.dim) * board.dim + squarerow;
      for (i = _i = 0, _ref = board.dim; _i < _ref; i = _i += 1) {
        result.push(board.cellAt(cb + i, ry));
      }
      return result;
    };

    SudokuSolver.getSquareNonRowCells = function(board, squareid, squarerow) {
      var cb, i, j, result, ry, _i, _j, _ref, _ref1;
      result = [];
      cb = squareid % board.dim * board.dim;
      ry = Math.floor(squareid / board.dim) * board.dim;
      for (i = _i = 0, _ref = board.dim; _i < _ref; i = _i += 1) {
        if (i === squarerow) {
          continue;
        }
        for (j = _j = 0, _ref1 = board.dim; _j < _ref1; j = _j += 1) {
          result.push(board.cellAt(cb + j, ry + i));
        }
      }
      return result;
    };

    SudokuSolver.getNonSquareRowCells = function(board, squareid, squarerow) {
      var cb, i, result, ry, _i, _j, _ref, _ref1, _results;
      result = [];
      cb = squareid % board.dim * board.dim;
      ry = Math.floor(squareid / board.dim) * board.dim + squarerow;
      for (i = _i = 0, _ref = board.dim2; _i < _ref; i = _i += 1) {
        if (__indexOf.call((function() {
          _results = [];
          for (var _j = cb, _ref1 = cb + board.dim; cb <= _ref1 ? _j < _ref1 : _j > _ref1; cb <= _ref1 ? _j++ : _j--){ _results.push(_j); }
          return _results;
        }).apply(this), i) >= 0) {
          continue;
        }
        result.push(board.cellAt(i, ry));
      }
      return result;
    };

    SudokuSolver.runAllRows = function(board, func) {
      var i, rowcells, _i, _ref, _results;
      _results = [];
      for (i = _i = 0, _ref = board.dim2; _i < _ref; i = _i += 1) {
        rowcells = this.getRowCells(board, i);
        _results.push(SudokuChecks[func](rowcells));
      }
      return _results;
    };

    SudokuSolver.runAllColumns = function(board, func) {
      var colcells, i, _i, _ref, _results;
      _results = [];
      for (i = _i = 0, _ref = board.dim2; _i < _ref; i = _i += 1) {
        colcells = this.getColCells(board, i);
        _results.push(SudokuChecks[func](colcells));
      }
      return _results;
    };

    SudokuSolver.runAllSquares = function(board, func) {
      var i, sqrcells, _i, _ref, _results;
      _results = [];
      for (i = _i = 0, _ref = board.dim2; _i < _ref; i = _i += 1) {
        sqrcells = this.getSquareCells(board, i);
        _results.push(SudokuChecks[func](sqrcells));
      }
      return _results;
    };

    SudokuSolver.runBothDiags = function(board, func) {
      var diag1, diag2, i, _i, _ref;
      if (!board.checkDiags) {
        return;
      }
      diag1 = [];
      diag2 = [];
      for (i = _i = 0, _ref = board.dim2; _i < _ref; i = _i += 1) {
        diag1.push(board.cellAt(i, i));
        diag2.push(board.cellAt(i, board.dim2 - i - 1));
      }
      SudokuChecks[func](diag1);
      return SudokuChecks[func](diag2);
    };

    SudokuSolver.runSpecialColumns = function(board, func) {
      var blockCol, blockRest, c, colRest, s, _i, _ref, _results;
      blockCol = [];
      blockRest = [];
      colRest = [];
      _results = [];
      for (s = _i = 0, _ref = board.dim2; _i < _ref; s = _i += 1) {
        _results.push((function() {
          var _j, _ref1, _results1;
          _results1 = [];
          for (c = _j = 0, _ref1 = board.dim; _j < _ref1; c = _j += 1) {
            blockCol = this.getSquareColCells(board, s, c);
            blockRest = this.getSquareNonColCells(board, s, c);
            colRest = this.getNonSquareColCells(board, s, c);
            _results1.push(SudokuChecks[func](blockCol, blockRest, colRest));
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    SudokuSolver.runSpecialRows = function(board, func) {
      var blockRest, blockRow, r, rowRest, s, _i, _ref, _results;
      blockRow = [];
      blockRest = [];
      rowRest = [];
      _results = [];
      for (s = _i = 0, _ref = board.dim2; _i < _ref; s = _i += 1) {
        _results.push((function() {
          var _j, _ref1, _results1;
          _results1 = [];
          for (r = _j = 0, _ref1 = board.dim; _j < _ref1; r = _j += 1) {
            blockRow = this.getSquareRowCells(board, s, r);
            blockRest = this.getSquareNonRowCells(board, s, r);
            rowRest = this.getNonSquareRowCells(board, s, r);
            _results1.push(SudokuChecks[func](blockRow, blockRest, rowRest));
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    SudokuSolver.oneUnknownAll = function(board) {
      var c, cells, r, _i, _j, _ref, _ref1;
      cells = [];
      for (r = _i = 0, _ref = board.dim2; _i < _ref; r = _i += 1) {
        for (c = _j = 0, _ref1 = board.dim2; _j < _ref1; c = _j += 1) {
          cells.push(board.cellAt(r, c));
        }
      }
      return SudokuChecks.oneUnknown(cells);
    };

    SudokuSolver.onePlaceRow = function(board) {
      return this.runAllRows(board, 'onePlace');
    };

    SudokuSolver.onePlaceColumn = function(board) {
      return this.runAllColumns(board, 'onePlace');
    };

    SudokuSolver.onePlaceSquare = function(board) {
      return this.runAllSquares(board, 'onePlace');
    };

    SudokuSolver.onePlaceDiag = function(board) {
      return this.runBothDiags(board, 'onePlace');
    };

    SudokuSolver.twoValPlacesSquare = function(board) {
      return this.runAllSquares(board, 'twoValPlaces');
    };

    SudokuSolver.twoValPlacesRow = function(board) {
      return this.runAllRows(board, 'twoValPlaces');
    };

    SudokuSolver.twoValPlacesColumn = function(board) {
      return this.runAllColumns(board, 'twoValPlaces');
    };

    SudokuSolver.twoValPlacesDiag = function(board) {
      return this.runBothDiags(board, 'twoValPlaces');
    };

    SudokuSolver.oneColumnForValue = function(board) {
      return this.runSpecialColumns(board, 'rowMatch');
    };

    SudokuSolver.oneRowForValue = function(board) {
      return this.runSpecialRows(board, 'rowMatch');
    };

    SudokuSolver.solveBoard = function(board) {
      var body, c, checks, description, i;
      checks = {
        'uniqueAll': 'Value must be unique in row, column' + (board.checkDiags ? ', square and diagonales.' : ' and square.'),
        'onePlaceSquare': 'Value has only one place in square.',
        'onePlaceRow': 'Value has only one place in row.',
        'onePlaceColumn': 'Value has only one place in column.',
        'onePlaceDiag': 'Value has only one place in diagonale.',
        'twoValPlacesSquare': 'Only two possible places for pair in square.',
        'twoValPlacesRow': 'Only two possible places for pair in row.',
        'twoValPlacesColumn': 'Only two possible places for pair in column.',
        'twoValPlacesDiag': 'Only two possible places for pair in diagonale.',
        'oneUnknownAll': 'Only one possible value left.',
        'oneColumnForValue': 'Only one possible column for value.',
        'oneRowForValue': 'Only one possible row for value.'
      };
      i = 1;
      while (true) {
        console.time('Checking board.');
        board.resetChangeFlags();
        description = '';
        for (c in checks) {
          description = checks[c];
          this[c](board);
          if (board.hasChanged()) {
            break;
          }
        }
        if (board.hasChanged()) {
          console.info('%i. Board was changed by "%s".', i, description);
          body = document.getElementsByTagName('body');
          body[0].innerHTML += i + '. ' + description + '<br />';
          board.print();
        }
        i++;
        console.timeEnd('Checking board.');
        if (!(board.hasChanged() && i < 100)) {
          break;
        }
      }
      return 0;
    };

    return SudokuSolver;

  })();

}).call(this);
