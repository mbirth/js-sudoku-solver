class @SudokuCell
    constructor: (initVal, boardObj) ->
        @boardObj = boardObj
        @changed = false
        @value = 0
        @set = (1 << @boardObj.dim2) - 1   # all
        @setValue(initVal)   # init cell

    setMask: (newSet) ->
        if newSet isnt @set
            @set = newSet
            @changed = true
            @boardObj.changed = true

    setValue: (newValue) ->
        return false if newValue is @value
        setidx = @boardObj.set.indexOf(newValue)
        if setidx isnt -1
            @value = newValue
            @setMask(1 << setidx)
            @changed = true
            @boardObj.changed = true
            return true
        else if newValue is -1
            @value = 0
            @setMask((1 << @boardObj.dim2) - 1)   # all
            @changed = true
            @boardObj.changed = true
        return false

    getValue: ->
        return '.' if @value is 0
        return @value

    getMask: ->
        return @set

    getUnknownsCount: ->
        result = 0
        for n in [0...@boardObj.dim2] by 1
            result++ if ((1 << n) & @set)
        return result

    hasChanged: ->
        return @changed

    resetChangeFlag: ->
        @changed = false
