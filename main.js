var testDFA = {
    "states": ["s1", "s2", "s3", "s4"],
    "start": "s1",
    "accept": ["s3", "s4"],
    "transitions": [
        {
            "from": "s1",
            "to": "s2",
            "label": "a"
        },
        {
            "from": "s2",
            "to": "s1",
            "label": "b"
        },
        {
            "from": "s2",
            "to": "s1",
            "label": "a"
        },
        {
            "from": "s2",
            "to": "s2",
            "label": "r"
        },
        {
            "from": "s2",
            "to": "s3",
            "label": "c"
        },
        {
            "from": "s3",
            "to": "s4",
            "label": "d"
        },
        {
            "from": "s4",
            "to": "s4",
            "label": "w"
        },
    ]
}

var emptyStringSymbol =  'ε'
var emptySetSymbol =  'Ø'

function dfaToGFA(dfa)
{
    var originalDFA = _.cloneDeep(dfa)
    console.log(dfa)
    var printingDFA = ""
    var convertedGFA = _.cloneDeep(dfa)
    var printingGFA = ""

    var startState = convertedGFA.start

    checkMutipleLables(convertedGFA)
    checkNoArrowBetweenTwoStates(convertedGFA)
    addNewStartState(convertedGFA)
    addNewAcceptStates(convertedGFA)

    console.log(convertedGFA, dfa)
}

/**
 * This function for condition 1
 * "Add a new start state, with ε arrow to the original start state"
 * 
 * @param {object} convertedGFA 
 */
function addNewStartState(convertedGFA)
{
    var oldStart = convertedGFA.start
    convertedGFA.start = "qStart"
    convertedGFA.states.push('qStart')
    convertedGFA.transitions.push({
        "from": convertedGFA.start,
        "to": oldStart,
        "label": emptyStringSymbol
    })
}
/**
 * For condition 2
 * "Add a new accept state, with arrow from each of the original accept state"
 * 
 * @param {object} convertedGFA 
 */
function addNewAcceptStates(convertedGFA)
{
    // add accept state
    stateName = "qAccept"
    convertedGFA.states.push(stateName)

    _.forEach(convertedGFA.accept, function(item){
        convertedGFA.transitions.push({
            "from": item,
            "to": stateName,
            "label": emptyStringSymbol
        })
    })

    convertedGFA.accept = [stateName]
}

/**
 * This function to check the 3 condition 
 * "If original arrow has multiple labels, we replace this with a new arrow whose label is a regular expression formed by the union of the labels"
 * 
 * @param {object} convertedGFA
 */
function checkMutipleLables(convertedGFA)
{
    index = convertedGFA.transitions.length - 1
    while(index >= 0){
        var mulitipleLableKeys = []
        item = convertedGFA.transitions[index] 
        key = index
        _.forEach(convertedGFA.transitions, function(i, k){
            if (i.from == item.from && i.to == item.to && k != key){
                mulitipleLableKeys.push(k)

            }
        })
        if (mulitipleLableKeys.length > 0){
            // update the label of the state
            label = ''
            mulitipleLableKeys.forEach(function(itemKey){
                // set the new label
                label = convertedGFA.transitions[itemKey].label + ' U '

                // remove the multiple arrows of the form the array
                convertedGFA.transitions = _.remove(convertedGFA.transitions, function(item, key){
                    return key != itemKey
                })
            })
            
            item.label = label + item.label
        }
        index -= 1
    }
}

/**
 * This function to check the 4th condition
 * "If originally no arrow between two states, we add a new arrow whose label is Ø"
 * 
 * @param {object} convertedGFA 
 */
function checkNoArrowBetweenTwoStates(convertedGFA)
{
    index = convertedGFA.transitions.length - 1
    while(index >= 0){
        var hasArrowToStates = []
        item = convertedGFA.transitions[index] 
        key = index
        _.forEach(convertedGFA.transitions, function(i, k){
            if (i.from == item.from){
                hasArrowToStates.push(i.to)
            }
        })
        
        _.forEach(convertedGFA.states, function(s){
            if ( ! hasArrowToStates.includes(s) )
                convertedGFA.transitions.push({"from": item.from, "to": s, "label": "" + emptySetSymbol})
        })
        index -= 1
    }
}

dfaToGFA(testDFA)