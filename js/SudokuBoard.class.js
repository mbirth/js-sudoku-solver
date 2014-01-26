// Generated by CoffeeScript 1.6.3
(function() {
  this.SudokuBoard = (function() {
    SudokuBoard.prototype.BASE_SET = '123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    function SudokuBoard(dim) {
      var c, r, _i, _j, _ref, _ref1;
      this.dim = Number(dim);
      this.dim2 = this.dim * this.dim;
      this.set = this.BASE_SET.substr(0, this.dim2);
      this.board = new Array(this.dim2);
      this.checkDiags = false;
      this.changed = false;
      for (r = _i = 0, _ref = this.dim2; _i < _ref; r = _i += 1) {
        this.board[r] = new Array(this.dim2);
        for (c = _j = 0, _ref1 = this.dim2; _j < _ref1; c = _j += 1) {
          this.board[r][c] = new SudokuCell(0, this);
        }
      }
    }

    SudokuBoard.prototype.loadString = function(boarddef, alsoCheckDiags) {
      var boardString, c, i, r, _i, _j, _ref, _ref1;
      boardString = '';
      for (i = _i = 0, _ref = boarddef.length; _i < _ref; i = _i += 1) {
        if (boarddef.charAt(i) !== '.' && this.set.indexOf(boarddef.charAt(i)) === -1) {
          continue;
        }
        boardString += boarddef.charAt(i);
      }
      if (boardString.length !== this.dim2 * this.dim2) {
        console.error('Bad board definition! (Need %d chars, got %d.)', this.dim2 * this.dim2, boardString.length);
        document.write('Bad board definition! (Need ' + (this.dim2 * this.dim2) + ' chars, got ' + boardString.length + '.)');
        return false;
      }
      for (i = _j = 0, _ref1 = boardString.length; _j < _ref1; i = _j += 1) {
        r = Math.floor(i / this.dim2);
        c = i % this.dim2;
        this.board[r][c].setValue(boardString.charAt(i));
        if (boardString.charAt(i) !== '.') {
          this.board[r][c].setOriginal(true);
        }
        this.board[r][c].resetChangeFlag();
      }
      this.setCheckDiags(alsoCheckDiags);
      return console.log('Board loaded.');
    };

    SudokuBoard.prototype.setCheckDiags = function(newValue) {
      return this.checkDiags = newValue;
    };

    SudokuBoard.prototype.cellAt = function(r, c) {
      return this.board[r][c];
    };

    SudokuBoard.prototype.resetChangeFlags = function() {
      var c, r, _i, _j, _ref, _ref1;
      for (r = _i = 0, _ref = this.dim2; _i < _ref; r = _i += 1) {
        for (c = _j = 0, _ref1 = this.dim2; _j < _ref1; c = _j += 1) {
          this.cellAt(r, c).resetChangeFlag();
        }
      }
      return this.changed = false;
    };

    SudokuBoard.prototype.hasChanged = function() {
      return this.changed;
    };

    SudokuBoard.prototype.print = function() {
      var body, c, cssclass, cssclasses, html, m, mask, r, testm, value, _i, _j, _k, _ref, _ref1, _ref2;
      html = '';
      html += '<table class="sudoku">';
      for (r = _i = 0, _ref = this.dim2; _i < _ref; r = _i += 1) {
        html += '<tr>';
        for (c = _j = 0, _ref1 = this.dim2; _j < _ref1; c = _j += 1) {
          cssclass = '';
          cssclasses = [];
          if (r % this.dim === 0) {
            cssclasses.push('tborder');
          }
          if (c % this.dim === 0) {
            cssclasses.push('lborder');
          }
          if (this.cellAt(r, c).hasChanged()) {
            cssclasses.push('changed');
          }
          if (this.cellAt(r, c).isOriginal()) {
            cssclasses.push('original');
          }
          value = this.cellAt(r, c).getValue();
          if (value === '.') {
            value = '';
            mask = this.cellAt(r, c).getMask();
            for (m = _k = 0, _ref2 = this.dim2; 0 <= _ref2 ? _k < _ref2 : _k > _ref2; m = 0 <= _ref2 ? ++_k : --_k) {
              testm = 1 << m;
              if (testm & mask) {
                value += '<div class="hint-square hint' + (m + 1) + '"></div>';
              }
            }
            cssclasses.push('mask' + mask);
          }
          if (cssclasses.length > 0) {
            cssclass = ' class="' + cssclasses.join(' ') + '"';
          }
          html += "<td" + cssclass + ">" + value + "</td>";
        }
        html += '</tr>';
      }
      html += '</table>';
      body = document.getElementsByTagName('body');
      return body[0].innerHTML += html;
    };

    return SudokuBoard;

  })();

}).call(this);
