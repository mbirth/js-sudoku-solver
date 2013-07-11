function SudokuBoard( dim ) {
    this.dim = Number( dim );
    this.dim2 = this.dim * this.dim;
    this.BASE_SET = '123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    this.set = this.BASE_SET.substr(0, this.dim2);
    this.board = new Array( this.dim2 );
    this.checkDiags = false;
    this.changed = false;

    for (var r=0; r<this.dim2; r++) {
        this.board[r] = new Array( this.dim2 );
        for (var c=0; c<this.dim2; c++) {
            this.board[r][c] = new SudokuCell(0, this);
        }
    }

    this.loadString = function( boarddef, alsoCheckDiags ) {
        var boardString = '';
        for ( var i=0; i<boarddef.length; i++ ) {
            if ( boarddef.charAt(i) != '.' && this.set.indexOf( boarddef.charAt(i) ) == -1 ) continue;
            boardString += boarddef.charAt(i);
        }
        if ( boardString.length != this.dim2 * this.dim2 ) {
            console.error( 'Bad board definition! (Need %d chars, got %d.)', (this.dim2*this.dim2), boardString.length );
            document.write( 'Bad board definition! (Need ' + (this.dim2*this.dim2) + ' chars, got ' + boardString.length + '.)' );
            return false;
        }
        for ( var i=0;i<boardString.length; i++ ) {
            var r = Math.floor( i / this.dim2 );
            var c = i % this.dim2;
            this.board[r][c].setValue( boardString.charAt(i) );
            this.board[r][c].resetChangeFlag();
        }
        this.checkDiags = ( alsoCheckDiags );
        console.log( 'Board loaded.' );
    }

    this.setCheckDiags = function( newValue ) {
        this.checkDiags = ( newValue );
    }

    this.cellAt = function( r, c ) {
        return this.board[r][c];
    }

    this.resetChangeFlags = function() {
        for ( var r=0; r<this.dim2; r++ ) {
            for ( var c=0; c<this.dim2; c++ ) {
                this.cellAt( r, c ).resetChangeFlag();
            }
        }
        this.changed = false;
    }

    this.hasChanged = function() {
        return this.changed;
    }

    this.print = function() {
        var html = '';
        html += '<table class="sudoku">';
        for ( var r=0; r<this.dim2; r++ ) {
            html += '<tr>';
            for ( var c=0; c<this.dim2; c++ ) {
                cssclass = '';
                if ( r%this.dim == 0 ) cssclass = 'tborder';
                if ( c%this.dim == 0 ) cssclass += ' lborder';
                if ( this.cellAt( r, c).hasChanged() ) cssclass += ' changed';
                if ( cssclass.length > 0 ) cssclass = ' class="' + cssclass + '"';
                background = '';
                value = this.cellAt( r, c ).getValue();
                if ( value == '.' ) {
                    background  = ' background="cellMask.php?dim=' + this.dim + '&mask=' + this.cellAt(r,c).getMask();
                    if ( this.cellAt( r, c ).hasChanged() ) background += '&changed=1';
                    background += '"';
                    value = '';
                }
                html += '<td' + cssclass + background + '>' + value + '</td>';
            }
            html += '</tr>';
        }
        html += '</table>';
        var body = document.getElementsByTagName( 'body' );
        body[0].innerHTML += html;
    }
}