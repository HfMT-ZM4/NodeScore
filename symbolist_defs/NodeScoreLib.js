function getComputedTextLength(text, cssClass) 
{
    const topSvg = document.getElementById('top-svg');
    const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textElement.textContent = text;
    textElement.setAttribute('class', cssClass + ' test');
    topSvg.appendChild(textElement);
    const textLength = textElement.getComputedTextLength();
    topSvg.removeChild(textElement);
    //console.log('textLength', textLength);
    return textLength;
}

const smufl = {
    noteHead: {
        auto: {
            doubleWhole: '',
            whole: '',
            half: '',
            black: ''
        },
        x: {
            doubleWhole: '',
            whole: '',
            half: '',
            black: ''
        },
        plus: {
            doubleWhole: '',
            whole: '',
            half: '',
            black: ''
        },
        circleX: {
            doubleWhole: '',
            whole: '',
            half: '',
            black: ''
        },
        withX: {
            doubleWhole: '',
            whole: '',
            half: '',
            void: ''
        },
        triangleUp: {
            doubleWhole: '',
            whole: '',
            half: '',
            white: '',
            black: ''
        },
        triangleUDown: {
            doubleWhole: '',
            whole: '',
            half: '',
            white: '',
            black: ''
        },
        slashed: {
            doubleWhole: '',
            whole: '',
            half: '',
            black: ''
        },
        slashed2: {
            doubleWhole: '',
            whole: '',
            half: '',
            black: ''
        },
        diamond: {
            doubleWhole: '',
            whole: '',
            half: '',
            white: '',
            black: ''
        },
        circled: {
            doubleWhole: '',
            whole: '',
            half: '',
            black: ''
        },
        circledLarge: {
            doubleWhole: '',
            whole: '',
            half: '',
            black: ''
        },
        arrowUpLarge: {
            doubleWhole: '',
            whole: '',
            half: '',
            black: ''
        },
        arrowDownLarge: {
            doubleWhole: '',
            whole: '',
            half: '',
            black: ''
        }
    },
    accidental: {
        '0': '',
        '0.5': '',
        '1': '',
        '1.5': '',
        '2': '',
        '3': '',
        '-0.5': '',
        '-1': '',
        '-1.5': '',
        '-2': '',
        '-3': ''
    },
    clef: {
        G: '&#xE050',
        C: '&#xE05C',
        F: '&#xE062',
        'G-8': '&#xE052',
        'G+8': '&#xE053',
        'G-15': '&#xE051',
        'G+15': '&#xE054',
        'C-8': '&#xE05D',
        'F-8': '&#xE064',
        'F+8': '&#xE065',
        'F-15': '&#xE063',
        'F+15': '&#xE066',
        tab: '&#xE06D'
    },
    dot: '',
    flag: {
        '1': {
            up: '&#xE240',
            down: '&#xE241'
        },
        '2': {
            up: '&#xE242',
            down: '&#xE243'
        },
        '3': {
            up: '&#xE244',
            down: '&#xE245'
        },
        '4': {
            up: '&#xE246',
            down: '&#xE247'
        },
        '5': {
            up: '&#xE248',
            down: '&#xE249'
        },
        '6': {
            up: '&#xE24A',
            down: '&#xE24B'
        },
        '7': {
            up: '&#xE24C',
            down: '&#xE24D'
        },
        '8': {
            up: '&#xE24E',
            down: '&#xE24F'
        },
        internal: {
            up: '&#xE250',
            down: '&#xE251'
        }
    },
    timeSignature: {
        '1': '',
        '2': '',
        '3': '',
        '4': '',
        '5': '',
        '6': '',
        '7': '',
        '8': '',
        '9': '',
        plus: '+'
    }
}

module.exports = {
    getComputedTextLength,
    smufl
}