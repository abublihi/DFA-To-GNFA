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
    var convertedGNFA = _.cloneDeep(dfa)
    var printingGFA = ""

    var startState = convertedGNFA.start

    checkMutipleLables(convertedGNFA)
    checkNoArrowBetweenTwoStates(convertedGNFA)
    addNewStartState(convertedGNFA)
    addNewAcceptStates(convertedGNFA)
    visualize(originalDFA, 'svg1')
    visualize(convertedGNFA, 'svg2')
    console.log(convertedGNFA, dfa)
}

/**
 * This function for condition 1
 * "Add a new start state, with ε arrow to the original start state"
 * 
 * @param {object} convertedGNFA 
 */
function addNewStartState(convertedGNFA)
{
    var oldStart = convertedGNFA.start
    convertedGNFA.start = "qStart"
    convertedGNFA.states.push('qStart')
    convertedGNFA.transitions.push({
        "from": convertedGNFA.start,
        "to": oldStart,
        "label": emptyStringSymbol
    })
}
/**
 * For condition 2
 * "Add a new accept state, with arrow from each of the original accept state"
 * 
 * @param {object} convertedGNFA 
 */
function addNewAcceptStates(convertedGNFA)
{
    // add accept state
    stateName = "qAccept"
    convertedGNFA.states.push(stateName)

    _.forEach(convertedGNFA.accept, function(item){
        convertedGNFA.transitions.push({
            "from": item,
            "to": stateName,
            "label": emptyStringSymbol
        })
    })

    convertedGNFA.accept = [stateName]
}

/**
 * This function to check the 3 condition 
 * "If original arrow has multiple labels, we replace this with a new arrow whose label is a regular expression formed by the union of the labels"
 * 
 * @param {object} convertedGNFA
 */
function checkMutipleLables(convertedGNFA)
{
    index = convertedGNFA.transitions.length - 1
    while(index >= 0){
        var mulitipleLableKeys = []
        item = convertedGNFA.transitions[index] 
        key = index
        _.forEach(convertedGNFA.transitions, function(i, k){
            if (i.from == item.from && i.to == item.to && k != key){
                mulitipleLableKeys.push(k)

            }
        })
        if (mulitipleLableKeys.length > 0){
            // update the label of the state
            label = ''
            mulitipleLableKeys.forEach(function(itemKey){
                // set the new label
                label = convertedGNFA.transitions[itemKey].label + ' U '

                // remove the multiple arrows of the form the array
                convertedGNFA.transitions = _.remove(convertedGNFA.transitions, function(item, key){
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
 * @param {object} convertedGNFA 
 */
function checkNoArrowBetweenTwoStates(convertedGNFA)
{
    index = convertedGNFA.transitions.length - 1
    while(index >= 0){
        var hasArrowToStates = []
        item = convertedGNFA.transitions[index] 
        key = index
        _.forEach(convertedGNFA.transitions, function(i, k){
            if (i.from == item.from){
                hasArrowToStates.push(i.to)
            }
        })
        
        _.forEach(convertedGNFA.states, function(s){
            if ( ! hasArrowToStates.includes(s) )
                convertedGNFA.transitions.push({"from": item.from, "to": s, "label": "" + emptySetSymbol})
        })
        index -= 1
    }
}

function visualize(dfaOrGNFA, svgId)
{
    /**
     * digraph {
                node [rx=5 ry=5 labelStyle="font: 300 14px 'Helvetica Neue', Helvetica"]
                edge [labelStyle="font: 300 14px 'Helvetica Neue', Helvetica"]
                A [labelType="html"
                   label="A <span style='font-size:32px'>Big</span> <span style='color:red;'>HTML</span> Source!"];
                C;
                E [label="Bold Red Sink" style="fill: #f77; font-weight: bold"];
                A ->; B -&gt; C;
                B -&gt; D [label="A blue label" labelStyle="fill: #55f; font-weight: bold;"];
                D -&gt; E [label="A thick red edge" style="stroke: #f77; stroke-width: 2px;" arrowheadStyle="fill: #f77"];
                C -&gt; E;
                A -&gt; D [labelType="html" label="A multi-rank <span style='color:blue;'>HTML</span> edge!"];
            }
            digraph { 
                " " -> s1;
                s1 -> s2 [label=a] ;
                s2 -> s1 [label=b] ;
                s2 -> s1 [label=a] ;
                s2 -> s2 [label=r] ;
                s2 -> s3 [label=c] ;
                s3 -> s4 [label=d labelStyle="fill: #55f; font-weight: bold;"] ;
                s4 -> s4 [label=w labelStyle="fill: #55f; font-weight: bold;"] ; 
            }
     */

    var graph = ' digraph { " " -> ' + dfaOrGNFA.start + ';'
     _.forEach(dfaOrGNFA.transitions, function(item){
         var accept = ''
         if (dfaOrGNFA.accept.includes(item.from))
            accept = ' labelStyle="fill: #55f; font-weight: bold;"'

        graph += ' ' + item.from + ' -> ' + item.to + ' [label="' + item.label + '"' + accept + '];'
     })
     graph += ' }'

     console.log(graph)
     tryDraw(svgId, graph)
}

// dfaToGFA(testDFA)