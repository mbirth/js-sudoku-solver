class @SudokuBoard
    BASE_SET: '123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'

    constructor: (dim) ->
        @dim = Number(dim)
        @dim2 = @dim * @dim
        @set = @BASE_SET.substr(0, @dim2)
        @board = new Array(@dim2)
        @checkDiags = false
        @changed = false

        for r in [0...@dim2] by 1
            @board[r] = new Array(@dim2)
            for c in [0...@dim2] by 1
                @board[r][c] = new SudokuCell(0, @)

    loadString: (boarddef, alsoCheckDiags) ->
        boardString = ''
        for i in [0...boarddef.length] by 1
            continue if boarddef.charAt(i) isnt '.' and @set.indexOf(boarddef.charAt(i)) is -1
            boardString += boarddef.charAt(i)
        if boardString.length isnt @dim2*@dim2
            console.error('Bad board definition! (Need %d chars, got %d.)', (@dim2*@dim2), boardString.length)
            document.write('Bad board definition! (Need ' + (@dim2*@dim2) + ' chars, got ' + boardString.length + '.)')
            return false
        for i in [0...boardString.length] by 1
            r = Math.floor(i / @dim2)
            c = i % @dim2
            @board[r][c].setValue(boardString.charAt(i))
            @board[r][c].setOriginal(true) unless boardString.charAt(i) is '.'
            @board[r][c].resetChangeFlag()
        @setCheckDiags(alsoCheckDiags)
        console.log('Board loaded.')

    setCheckDiags: (newValue) ->
        @checkDiags = ( newValue )

    cellAt: (r, c) ->
        return @board[r][c]

    resetChangeFlags: ->
        for r in [0...@dim2] by 1
            for c in [0...@dim2] by 1
                @cellAt(r, c).resetChangeFlag()
        @changed = false

    hasChanged: ->
        return @changed

    print: ->
        html = ''
        html += '<table class="sudoku">'
        for r in [0...@dim2] by 1
            html += '<tr>'
            for c in [0...@dim2] by 1
                cssclass = ''
                cssclasses = []
                cssclasses.push('tborder') if r % @dim is 0
                cssclasses.push('lborder') if c % @dim is 0
                cssclasses.push('changed') if @cellAt(r, c).hasChanged()
                cssclasses.push('original') if @cellAt(r, c).isOriginal()
                value = @cellAt(r, c).getValue()
                if value is '.'
                    value = ''
                    mask = @cellAt(r, c).getMask()
                    for m in [0...@dim2]
                        testm = 1 << m
                        if testm & mask
                            value += '<div class="hint-square hint' + (m+1) + '"></div>'
                    cssclasses.push('mask' + mask)
                cssclass = ' class="' + cssclasses.join(' ') + '"' if cssclasses.length > 0
                html += "<td#{cssclass}>#{value}</td>"
            html += '</tr>'
        html += '</table>'
        body = document.getElementsByTagName('body')
        body[0].innerHTML += html
