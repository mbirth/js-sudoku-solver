var SudokuChecks = {

    'unique' : function( board, r, c ) {
        var set = ~board.cellAt( r, c).getMask();

        // row / column / diagonale
        for ( var i=0; i<board.dim2; i++) {
            if ( i != c ) {  // row
                board.cellAt( r, i ).setMask( board.cellAt( r, i ).getMask() & set );
            }
            if ( i != r ) {  // column
                board.cellAt( i, c ).setMask( board.cellAt( i, c ).getMask() & set );
            }
            if ( board.checkDiags ) {
                if ( r == c && i != r ) {  // diagonale \
                    board.cellAt( i, i ).setMask( board.cellAt( i, i ).getMask() & set );
                }
                if ( r == board.dim2-c-1 && i != r ) {  // diagonale /
                    board.cellAt( i, board.dim2-i-1 ).setMask ( board.cellAt( i, board.dim2-i-1 ).getMask() & set );
                }
            }
        }

        // square
        var rb = Math.floor( r / board.dim ) * board.dim;  // row base for this square
        var cb = Math.floor( c / board.dim ) * board.dim;  // col base for this square
        for ( var i=rb; i<rb+board.dim; i++ ) {
            for ( var j=cb; j<cb+board.dim; j++ ) {
                if ( i != r || j != c ) {
                    board.cellAt( i, j ).setMask( board.cellAt( i, j ).getMask() & set );
                }
            }
        }
    },

    'onePlace' : function( cells ) {
        if ( !cells[0] ) return;
        for ( var i=0; i<cells[0].boardObj.dim2; i++ ) {  // walk all possible values
            var n = 0;
            var p = (1 << i);
            var x = -1;
            for ( var k in cells ) {
                if ( ( cells[k].getValue() == '.' ) && ( p & cells[k].getMask() ) ) {
                    n++;
                    x = k;
                }
            }
            if ( n == 1 ) {
                cells[x].setMask( p );
                cells[x].setValue( cells[0].boardObj.set.charAt( Math.log(p)/Math.log(2) ) );
            }
        }
    },

    'oneUnknown' : function( cells ) {
        for ( var c in cells ) {
            if ( cells[c].getValue() == '.' && cells[c].getUnknownsCount() == 1 ) {
                var valid = cells[c].getMask();
                var val   = cells[c].boardObj.set.charAt( Math.log( valid ) / Math.log( 2 ) );
                cells[c].setValue( val );
            }
        }
    },

    'twoValPlaces' : function( cells ) {
        if ( !cells[0] ) return;
        console.group( 'twoValPlaces: %o', cells );
        for ( var i=0; i<cells[0].boardObj.dim2-1; i++ ) {   // walk all possible 2s combinations
            for ( var j=i+1; j<cells[0].boardObj.dim2; j++ ) {
                var n = 0;
                var p = (1 << i) | (1 << j);
                console.log( 'Now checking mask: %o', p );
                for ( var k in cells ) {
                    if ( ( cells[k].getValue() == '.' ) && ( cells[k].getMask() & p == p ) ) {
                        n++;
                        console.log( '%d: %d, %d (%o, %o)', n, p, cells[k].getMask(), ( p & cells[k].getMask() ), ( ( p & cells[k].getMask() ) == p ) );
                    }
                }
                if ( n > 0 ) console.info( 'Have %d matches.', n );
                if ( n == 2 ) {
                    for ( var k in cells ) {
                        if ( ( cells[k].getValue() == '.' ) && ( cells[k].getMask() == p ) ) {
                            cells[k].setMask( p );
                        } else if ( cells[k].getValue() == '.' ) {
                            cells[k].setMask( cells[k].getMask() & ~p );
                        }
                    }
                }
            }
        }
        console.groupEnd();
    }
};