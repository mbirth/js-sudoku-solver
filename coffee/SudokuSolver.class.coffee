class @SudokuSolver

    @uniqueAll: (board) ->
        for r in [0...board.dim2] by 1
            for c in [0...board.dim2] by 1
                SudokuChecks.unique(board, r, c) if board.cellAt(r, c).getValue() isnt '.'
        return true

    # returns all cells for the square of the specified cell
    @getSquareCellsForCell: (board, r, c) ->
        sqrid = Math.floor(r / board.dim) * board.dim + Math.floor(c / board.dim)
        return @getSquareCells(board, sqrid)

    @getSquareCells: (board, squareid) ->
        result = []
        rb = Math.floor(squareid / board.dim) * board.dim   # base row for square
        cb = squareid % board.dim * board.dim   # base col for square
        for i in [0...board.dim2] by 1
            result.push(board.cellAt(rb + Math.floor(i / board.dim), cb + (i % board.dim)))
        return result

    @getRowCells: (board, row) ->
        result = []
        for i in [0...board.dim2] by 1
            result.push(board.cellAt(row, i))
        return result

    @getColCells: (board, col) ->
        result = []
        for i in [0...board.dim2] by 1
            result.push(board.cellAt(i, col))
        return result

    @runAllRows: (board, func) ->
        for i in [0...board.dim2] by 1    # walk all rows
            rowcells = @getRowCells(board, i)
            SudokuChecks[func](rowcells)

    @runAllColumns: (board, func) ->
        for i in [0...board.dim2] by 1   # walk all columns
            colcells = @getColCells(board, i)
            SudokuChecks[func](colcells)

    @runAllSquares: (board, func) ->
        for i in [0...board.dim2] by 1   # walk all squares
            sqrcells = @getSquareCells(board, i)
            SudokuChecks[func](sqrcells)

    @runBothDiags: (board, func) ->
        return if not board.checkDiags
        diag1 = []
        diag2 = []
        for i in [0...board.dim2] by 1
            diag1.push(board.cellAt(i, i))
            diag2.push(board.cellAt(i, board.dim2-i-1))
        SudokuChecks[func](diag1)
        SudokuChecks[func](diag2)

    @oneUnknownAll: (board) ->
        cells = []
        for r in [0...board.dim2] by 1
            for c in [0...board.dim2] by 1
                cells.push(board.cellAt(r, c))
        SudokuChecks.oneUnknown(cells)

    @onePlaceRow: (board) -> @runAllRows(board, 'onePlace')
    @onePlaceColumn: (board) -> @runAllColumns(board, 'onePlace')
    @onePlaceSquare: (board) -> @runAllSquares(board, 'onePlace')
    @onePlaceDiag: (board) -> @runBothDiags(board, 'onePlace')
    @twoValPlacesSquare: (board) -> @runAllSquares(board, 'twoValPlaces')
    @twoValPlacesRow: (board) -> @runAllRows(board, 'twoValPlaces')
    @twoValPlacesColumn: (board) -> @runAllColumns(board, 'twoValPlaces')
    @twoValPlacesDiag: (board) -> @runBothDiags(board, 'twoValPlaces')

    @solveBoard: (board) ->
        checks =
            'uniqueAll': 'Value must be unique in row, column' + if board.checkDiags then ', square and diagonales.' else ' and square.'
            'onePlaceSquare': 'Value has only one place in square.'
            'onePlaceRow': 'Value has only one place in row.'
            'onePlaceColumn': 'Value has only one place in column.'
            'onePlaceDiag': 'Value has only one place in diagonale.'
            'twoValPlacesSquare': 'Only two possible places for pair in square.'
            'twoValPlacesRow': 'Only two possible places for pair in row.'
            'twoValPlacesColumn': 'Only two possible places for pair in column.'
            'twoValPlacesDiag': 'Only two possible places for pair in diagonale.'
            'oneUnknownAll': 'Only one possible value left.'

        i = 1
        while true
            console.time('Checking board.')
            board.resetChangeFlags()
            description = ''
            for c of checks
                description = checks[c]
                @[c](board)
                break if board.hasChanged()
            if board.hasChanged()
                console.info('%i. Board was changed by "%s".', i, description)
                body = document.getElementsByTagName('body')
                body[0].innerHTML += i + '. ' + description + '<br />'
                board.print()
            i++
            console.timeEnd('Checking board.')
            break unless board.hasChanged() && i<100
        return 0
