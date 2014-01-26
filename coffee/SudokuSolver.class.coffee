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

    @getSquareColCells: (board, squareid, squarecol) ->
        result = []
        rb = Math.floor(squareid / board.dim) * board.dim   # base row for square
        c = squareid % board.dim * board.dim + squarecol   # column
        for i in [0...board.dim] by 1
            result.push(board.cellAt(rb + i, c))
        return result

    @getSquareNonColCells: (board, squareid, squarecol) ->
        result = []
        rb = Math.floor(squareid / board.dim) * board.dim   # base row for square
        c = squareid % board.dim * board.dim   # base column
        for i in [0...board.dim] by 1
            continue if i is squarecol
            for j in [0...board.dim] by 1
                result.push(board.cellAt(rb + j, c + i))
        return result

    @getNonSquareColCells: (board, squareid, squarecol) ->
        result = []
        rb = Math.floor(squareid / board.dim) * board.dim   # base row for square
        c = squareid % board.dim * board.dim + squarecol   # column
        for i in [0...board.dim2] by 1
            continue if i in [rb...rb+board.dim]
            result.push(board.cellAt(i, c))
        return result

    @getSquareRowCells: (board, squareid, squarerow) ->
        result = []
        r = Math.floor(squareid / board.dim) * board.dim + squarerow   # row
        cb = squareid % board.dim * board.dim   # base col for square
        for i in [0...board.dim] by 1
            result.push(board.cellAt(r, cb + i))
        return result

    @getSquareNonRowCells: (board, squareid, squarerow) ->
        result = []
        r = Math.floor(squareid / board.dim) * board.dim   # base row
        cb = squareid % board.dim * board.dim   # base column for square
        for i in [0...board.dim] by 1
            continue if i is squarerow
            for j in [0...board.dim] by 1
                result.push(board.cellAt(r + i, cb + j))
        return result

    @getNonSquareRowCells: (board, squareid, squarerow) ->
        result = []
        r = Math.floor(squareid / board.dim) * board.dim + squarerow   # row
        cb = squareid % board.dim * board.dim   # base col for square
        for i in [0...board.dim2] by 1
            continue if i in [cb...cb+board.dim]
            result.push(board.cellAt(r, i))
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

    @runSpecialColumns: (board, func) ->
        blockCol = []
        blockRest = []
        colRest = []
        for s in [0...board.dim2] by 1   # walk all squares
            for c in [0...board.dim] by 1   # walk all square columns
                blockCol = @getSquareColCells(board, s, c)
                blockRest = @getSquareNonColCells(board, s, c)
                colRest = @getNonSquareColCells(board, s, c)
                SudokuChecks[func](blockCol, blockRest, colRest)

    @runSpecialRows: (board, func) ->
        blockRow = []
        blockRest = []
        rowRest = []
        for s in [0...board.dim2] by 1   # walk all squares
            for r in [0...board.dim] by 1   # walk all square rows
                blockRow = @getSquareRowCells(board, s, r)
                blockRest = @getSquareNonRowCells(board, s, r)
                rowRest = @getNonSquareRowCells(board, s, r)
                SudokuChecks[func](blockRow, blockRest, rowRest)

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
    @oneColumnForValue: (board) -> @runSpecialColumns(board, 'rowMatch')
    @oneRowForValue: (board) -> @runSpecialRows(board, 'rowMatch')

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
            'oneColumnForValue': 'Only one possible column in block for value.'
            'oneRowForValue': 'Only one possible row in block for value.'

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
