function SudokuCell( initVal, boardObj ) {
    this.boardObj = boardObj;
    this.changed = false;
    this.value = 0;
    this.set = ( 1 << this.boardObj.dim2 ) - 1;  // all

    this.setMask = function( newSet ) {
        if ( newSet != this.set ) {
            this.set = newSet;
            this.changed = true;
            this.boardObj.changed = true;
        }
    }

    this.setValue = function( newValue ) {
        if ( newValue == this.value ) return false;
        setidx = this.boardObj.set.indexOf( newValue );
        if ( setidx != -1 ) {
            this.value = newValue;
            this.setMask( 1 << setidx );
            this.changed = true;
            this.boardObj.changed = true;
            return true;
        } else if ( newValue == -1 ) {
            this.value = 0;
            this.setMask( ( 1 << this.boardObj.dim2 ) - 1 );  // all
            this.changed = true;
            this.boardObj.changed = true;
        }
        return false;
    }

    this.setValue( initVal );   // init cell

    this.getValue = function() {
        if ( this.value == 0 ) return '.';
        return this.value;
    }

    this.getMask = function() {
        return this.set;
    }

    this.getUnknownsCount = function() {
        var result = 0;
        for (var n=0; n<this.boardObj.dim2; n++) {
            if ( (1 << n) & this.set ) result++;
        }
        return result;
    }

    this.hasChanged = function() {
        return this.changed;
    }

    this.resetChangeFlag = function() {
        this.changed = false;
    }
}