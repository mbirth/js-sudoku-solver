class @SudokuChecks
    @unique: (board, r, c) ->
        set = ~board.cellAt(r, c).getMask()

        # row / column / diagonale
        for i in [0...board.dim2] by 1
            if i isnt c   # row
                board.cellAt(r, i).setMask(board.cellAt(r, i).getMask() & set)
            if i isnt r   # column
                board.cellAt(i, c).setMask(board.cellAt(i, c).getMask() & set)
            if board.checkDiags
                if r is c and i isnt r   # diagonale \
                    board.cellAt(i, i).setMask(board.cellAt(i, i).getMask() & set)
                if r is board.dim2-c-1 and i isnt r   # diagonale /
                    board.cellAt(i, board.dim2-i-1).setMask(board.cellAt(i, board.dim2-i-1).getMask() & set)

        # square
        rb = Math.floor(r / board.dim) * board.dim;   # row base for this square
        cb = Math.floor(c / board.dim) * board.dim;   # col base for this square
        for i in [rb...rb+board.dim] by 1
            for j in [cb...cb+board.dim] by 1
                if i isnt r || j isnt c
                    board.cellAt(i, j).setMask(board.cellAt(i, j).getMask() & set )
        return true

    @onePlace: (cells) ->
        return if not cells[0]
        for i in [0...cells[0].boardObj.dim2] by 1   # walk all possible values
            n = 0
            p = (1 << i)
            x = -1
            for k of cells
                if cells[k].getValue() is '.' and (p & cells[k].getMask())
                    n++
                    x = k
            if n is 1
                cells[x].setMask(p)
                cells[x].setValue(cells[0].boardObj.set.charAt(Math.log(p) / Math.log(2)))
        return true

    @oneUnknown: (cells) ->
        for c of cells
            if cells[c].getValue() is '.' and cells[c].getUnknownsCount() is 1
                valid = cells[c].getMask()
                val   = cells[c].boardObj.set.charAt(Math.log(valid) / Math.log(2))
                cells[c].setValue(val)
        return true

    @twoValPlaces: (cells) ->
        return if not cells[0]
        dim2 = cells[0].boardObj.dim2
        console.group('twoValPlaces: (%o) %o', dim2, cells)
        for i in [0...dim2-1] by 1   # walk all possible 2s combinations
            for j in [i+1...dim2] by 1
                n = 0
                p = (1 << i) | (1 << j)
                console.log('Now checking (%o, %o) mask: %o', i+1, j+1, p)
                for k of cells
                    if cells[k].getValue() is '.' and cells[k].getMask() is p
                        n++
                        console.log('%d: %d, %d (%o, %o)', n, p, cells[k].getMask(), (p & cells[k].getMask()), ((p & cells[k].getMask()) is p))
                console.info('Have %d matches.', n) if n > 0
                if n is 2
                    console.warn('Two matches!')
                    for k of cells
                        if cells[k].getValue() is '.' and cells[k].getMask() is p
                            cells[k].setMask(p)
                        else if cells[k].getValue() is '.'
                            curMask = cells[k].getMask()
                            console.log('Current Mask: %o', curMask)
                            newMask = curMask & ~p
                            console.log('New Mask: %o', newMask)
                            cells[k].setMask(newMask)
        console.groupEnd()
        return true
