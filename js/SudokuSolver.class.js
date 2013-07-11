var SudokuSolver = {

    'uniqueAll' : function( board ) {
        for ( var r=0; r<board.dim2; r++ ) {
            for ( var c=0; c<board.dim2; c++ ) {
                if ( board.cellAt( r, c ).getValue() != '.' ) {
                    SudokuChecks.unique( board, r, c );
                }
            }
        }
    },

    // returns all cells for the square of the specified cell
    'getSquareCellsForCell' : function( board, r, c ) {
        var sqrid = Math.floor( r / board.dim ) * board.dim + Math.floor( c / board.dim );
        return this.getSquareCells( board, sqrid );
    },

    'getSquareCells' : function( board, squareid ) {
        var result = new Array();
        var rb = Math.floor( squareid / board.dim ) * board.dim;   // base row for square
        var cb = squareid % board.dim * board.dim;   // base col for square
        for ( var i=0; i<board.dim2; i++ ) {
            result.push( board.cellAt( rb+Math.floor( i/board.dim ), cb+(i % board.dim) ) );
        }
        return result;
    },

    'getRowCells' : function( board, row ) {
        var result = new Array();
        for ( var i=0; i<board.dim2; i++ ) {
            result.push( board.cellAt( row, i ) );
        }
        return result;
    },

    'getColCells' : function( board, col ) {
        var result = new Array();
        for ( var i=0; i<board.dim2; i++ ) {
            result.push( board.cellAt( i, col ) );
        }
        return result;
    },

    'runAllRows' : function( board, func ) {
        for ( var i=0; i<board.dim2; i++ ) {  // walk all rows
            var rowcells = this.getRowCells( board, i );
            SudokuChecks[func]( rowcells );
        }
    },

    'runAllColumns' : function( board, func ) {
        for ( var i=0; i<board.dim2; i++ ) {  // walk all columns
            var colcells = this.getColCells( board, i );
            SudokuChecks[func]( colcells );
        }
    },

    'runAllSquares' : function( board, func ) {
        for ( var i=0; i<board.dim2; i++ ) {  // walk all squares
            var sqrcells = this.getSquareCells( board, i );
            SudokuChecks[func]( sqrcells );
        }
    },

    'runBothDiags' : function( board, func ) {
        if ( !board.checkDiags ) return;
        var diag1 = new Array();
        var diag2 = new Array();
        for ( var i=0; i<board.dim2; i++ ) {
            diag1.push( board.cellAt( i, i ) );
            diag2.push( board.cellAt( i, board.dim2-i-1 ) );
        }
        SudokuChecks[func]( diag1 );
        SudokuChecks[func]( diag2 );
    },

    'oneUnknownAll' : function( board ) {
        var cells = new Array();
        for ( var r=0; r<board.dim2; r++ ) {
            for ( var c=0; c<board.dim2; c++ ) {
                cells.push( board.cellAt( r, c ) );
            }
        }
        SudokuChecks.oneUnknown( cells );
    },

    'onePlaceRow' : function( board ) {  this.runAllRows( board, 'onePlace' );  },
    'onePlaceColumn' : function( board ) {  this.runAllColumns( board, 'onePlace' );  },
    'onePlaceSquare' : function( board ) {  this.runAllSquares( board, 'onePlace' );  },
    'onePlaceDiag' : function( board ) {  this.runBothDiags( board, 'onePlace' );  },
    'twoValPlacesSquare' : function( board ) {  this.runAllSquares( board, 'twoValPlaces' );  },
    'twoValPlacesRow' : function( board ) {  this.runAllRows( board, 'twoValPlaces' );  },
    'twoValPlacesColumn' : function( board ) {  this.runAllColumns( board, 'twoValPlaces' );  },
    'twoValPlacesDiag' : function( board ) {  this.runBothDiags( board, 'twoValPlaces' );  },

    'solveBoard' : function( board ) {
        var checks = {
            'uniqueAll': 'Value must be unique in row, column' + ((board.checkDiags)?', square and diagonales.':' and square.'),
            'onePlaceSquare': 'Value has only one place in square.',
            'onePlaceRow': 'Value has only one place in row.',
            'onePlaceColumn': 'Value has only one place in column.',
            'onePlaceDiag': 'Value has only one place in diagonale.',
            'twoValPlacesSquare': 'Only two possible places for pair in square.',
            'twoValPlacesRow': 'Only two possible places for pair in row.',
            'twoValPlacesColumn': 'Only two possible places for pair in column.',
            'twoValPlacesDiag': 'Only two possible places for pair in diagonale.',
            'oneUnknownAll': 'Only one possible value left.'
        };

        var i = 1;
        do {
            console.time( 'Checking board.' );
            board.resetChangeFlags();
            var description = '';
            for ( var c in checks ) {
                description = checks[c];
                this[c]( board );
                if ( board.hasChanged() ) break;
            }
            if ( board.hasChanged() ) {
                console.info( 'Board was changed by "%s".', description );
                var body = document.getElementsByTagName( 'body' );
                body[0].innerHTML += i + '. ' + description + '<br />';
                board.print();
            }
            i++;
            console.timeEnd( 'Checking board.' );
        } while ( board.hasChanged() && i<100);
    }

};