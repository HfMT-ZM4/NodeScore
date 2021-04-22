const context = {
    about: '12 Tone Equal Temperament',
    steps: 12,
    step_size: 1,
    repeat_interval: 12,
    dominant_interval: 7,
    mode_scale: [0, null, 0, null, 0, 0, null, 0, null, 0, null, 0], // accidental deviation if not in scale
    mode_steps: 7,
    tonic: 0
}
const clefDef = {
    G: {
        pitch: 67,
        glyph: '&#xE050',
        key_signature_centroid: {
            '1': 4,
            '-1': 2
        }
    },
    C: {
        pitch: 60,
        glyph: '&#xE05C',
        key_signature_centroid: {
            '1': 1,
            '-1': -1
        }
    },
    F: {
        pitch: 53,
        glyph: '&#xE062',
        key_signature_centroid: {
            '1': -2,
            '-1': -4
        }
    },
    G8vb: {
        pitch: 55,
        glyph: '&#xE052',
        key_signature_centroid: {
            '1': 4,
            '-1': 2
        }
    }
}

/**
 * Internal, returns formatted array of accidentals to be drawn 
 * Format:
 * [ {pitch_class, accidental}, ... ]
 * 
 * Also accepts format: ['C#', 'Ab']
 * 
 * Pitch class to be represented in midi, from 0 to 11
 * Accidental in string
 * 
 * @param {String} key
 */
function keySignatureDef(key) {
    if (Array.isArray(key)) {
        if (key.length == 0) return key;
        else if (key.length > 0) {
            if (typeof(key[0]) == 'string') {
                let returnArray = [];
                key.forEach((val, i) => {
                    returnArray[i] = {
                        pitch_class: pitchClassDef[val].pitch_class,
                        accidental: pitchClassDef[val].deviation
                    };
                });
                return returnArray;
            }
            else return key;
        }
    }

    if (key == 'none' || key == 'C' || key == 'Am') return [];

    // internal, for the following 4 cases
    function standardKeys(keyDefs, k, sharp) {
        let numSharp = keyDefs.indexOf(k) + 1;
        let keySigArray = [];
        let pitchClass = (sharp ? 6 : 10);
        for (let i = 0; i < numSharp; i++) {
            keySigArray.push({
                pitch_class: pitchClass,
                accidental: (sharp ? 1 : -1)
            });
            pitchClass = (pitchClass + (sharp ? context.dominant_interval : context.repeat_interval-context.dominant_interval)) % context.repeat_interval;
        }
        return keySigArray;
    }

    const sharpMajor = ['G', 'D', 'A', 'E', 'B', 'F#', 'C#'];
    if (sharpMajor.includes(key)) {
        return standardKeys(sharpMajor, key, true);
    }

    const sharpMinor = ['Em', 'Bm', 'F#m', 'C#m', 'G#m', 'D#m', 'A#m'];
    if (sharpMinor.includes(key)) {
        return standardKeys(sharpMinor, key, true);
    }

    const flatMajor = ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb'];
    if (flatMajor.includes(key)) {
        return standardKeys(flatMajor, key, false);
    }

    const flatMinor = ['Dm', 'Gm', 'Cm', 'Fm', 'Bbm', 'Ebm', 'Abm'];
    if (flatMinor.includes(key)) {
        return standardKeys(flatMinor, key, false);
    }

    /*
    // finally test if key is defined in JSON format
    try {
        const jsonKeySig = JSON.parse(key);
        if (!Array.isArray(jsonKeySig)) throw 'not an array';
        return jsonKeySig;
    }
    catch(e) {
        console.error('Please enter a valid key signature: defined string or array [{pitch_class, accidental}, ...]');
    }
    */

    // any other case: no key signature
    return [];
}

function accidentalDef(acc) {
    if (typeof(acc) == 'number') acc = acc.toString();
    switch (acc) {
        // flat
        case '-1':
        case 'b':
        case 'flat':
            return { glyph: '', deviation: -1 };
        // natural
        case '0':
        case 'n':
        case 'natural':
            return { glyph: '', deviation: 0 };
        //sharp
        case '1':
        case '#':
        case 'sharp':
            return { glyph : '', deviation: 1 };
        //double sharp
        case '2':
        case 'x':
        case '##':
        case '2#':
        case 'doublesharp':
            return { glyph: '', deviation: 2 };
        //double flat
        case '-2':
        case 'bb':
        case '2b':
        case 'doubleflat':
            return { glyph: '', deviation: -2 };
        //triple sharp
        case '3':
        case '#x':
        case '###':
        case '3#':
        case 'triplesharp':
            return { glyph: '', deviation: 3 };
        //triple flat
        case '-3':
        case 'bbb':
        case '3b':
        case 'tripleflat': 
            return { glyph: '', deviation: -3 };
        //natural flat
        case 'nb':
        case 'naturalflat':
            return { glyph: '', deviation: -1 };
        //natural sharp
        case 'n#':
        case 'naturalsharp':
            return { glyph: '', deviation: 1 };
        //parentheses
        case '(b)':
        case '(flat)':
            return { glyph: '', deviation: -1 };
        case '(natural)':
            return { glyph: '', deviation: 0 };
        case '(#)':
        case '(sharp)':
            return { glyph: '', deviation: 1 };
        case '(x)':
        case '(doublesharp)':
            return { glyph: '', deviation: 2 };
        case '(bb)':
        case '(doubleflat)':
            return { glyph: '', deviation: -2 };
        default:
            return { glyph: '', deviation: 0 };
    }
}

const pitchClassDef = {
    'C': {
        pitch_class: 0,
        deviation: 0
    },
    'Cb': {
        pitch_class: 0,
        deviation: -1
    },
    'C#': {
        pitch_class: 1,
        deviation: 1
    },
    'Db': {
        pitch_class: 1,
        deviation: -1
    },
    'D': {
        pitch_class: 2,
        deviation: 0
    },
    'D#': {
        pitch_class: 3,
        deviation: 1
    },
    'Eb': {
        pitch_class: 3,
        deviation: -1
    },
    'E': {
        pitch_class: 4,
        deviation: 0
    },
    'Fb': {
        pitch_class: 4,
        deviation: -1
    },
    'F': {
        pitch_class: 5,
        deviation: 0
    },
    'E#': {
        pitch_class: 5,
        deviation: 1
    },
    'F#': {
        pitch_class: 6,
        deviation: 1
    },
    'Gb': {
        pitch_class: 6,
        deviation: -1
    },
    'G': {
        pitch_class: 7,
        deviation: 0
    },
    'G#': {
        pitch_class: 8,
        deviation: 1
    },
    'Ab': {
        pitch_class: 8,
        deviation: -1
    },
    'A': {
        pitch_class: 9,
        deviation: 0
    },
    'A#': {
        pitch_class: 10,
        deviation: 1
    },
    'Bb': {
        pitch_class: 10,
        deviation: -1
    },
    'B': {
        pitch_class: 11,
        deviation: 0
    },
    'Cb': {
        pitch_class: 11,
        deviation: -1
    }
}

function pitchStringDef(pitch, keySigArray = []) {
    if (typeof(pitch) == 'string') {
        const octave = Number(pitch.replace(/[^0-9]/g, ''));
        const pitchClass = pitch.replace(/[0-9]/g, '');
        if (pitchClass in pitchClassDef && !isNaN(octave)) {
            return {
                pitch: (octave + 1) * context.repeat_interval + pitchClassDef[pitchClass].pitch_class,
                deviation: pitchClassDef[pitchClass].deviation
            }
        }
    }

    // search for best match for accidental in case it's not defined
    if (!isNaN(pitch)) {
        const midiPitch = Number(pitch);
        const pitchClass = (midiPitch + context.repeat_interval) % context.repeat_interval;
        let key = [...context.mode_scale];
        let keySharpness = 0; // sum of all accidentals in keysig
        // check if pitch class is included in keysig, if exists, return
        // at the same time build key array
        for (const val of keySigArray) {
            if (val.pitch_class == pitchClass) {
                return {
                    pitch: midiPitch,
                    deviation: val.accidental
                }
            }
            const whiteKeyPitchClass = (val.pitch_class - val.deviation + context.repeat_interval) % context.repeat_interval;
            key[whiteKeyPitchClass] = null;
            key[val.pitch_class] = val.deviation;
            keySharpness += val.deviation;
        }
        // otherwise check if pitch class is in the key
        if (key[pitchClass] !== null) {
            return {
                pitch: midiPitch,
                deviation: key[pitchClass]
            }
        }
        // check if it's a white key (natural)
        if (context.mode_scale[pitchClass] == 0) {
            return {
                pitch: midiPitch,
                deviation: 0
            }
        }
        // otherwise if it's a black key, follow key sig sharpness
        console.log('hello')
        const nextPitchClass = (pitchClass - Math.sign(keySharpness) + context.repeat_interval) % context.repeat_interval;
        if (key[nextPitchClass] !== null) {
            return {
                pitch: midiPitch,
                deviation: key[nextPitchClass] + Math.sign(keySharpness)
            }
        }
    }

    // can be defined in JSON format
    else if (typeof(pitch) == 'object') {
        if ('pitch' in pitch && 'deviation' in pitch) {
            return {
                pitch: pitch.pitch,
                deviation: pitch.deviation
            }
        }
    }

    else {
        console.error(`Note pitch '${pitch}' not identified.`);
        return null;
    }
}

function findStaffLevelForPitchClass(pitch_class, staff_level_pitch_list, accidental, findBestMatch, centroid) {
    let match;
    const matchClass = pitch_class - accidental.deviation;
    for (sl in staff_level_pitch_list) {
        if ((staff_level_pitch_list[sl] - matchClass) % context.repeat_interval == 0) {
            // for note calculation, no best match needed
            if (!findBestMatch) return Number(sl);
            // if not previously matched
            else if (match === undefined) {
                match = Number(sl);
            }
            else {
                // prioritize staff levels closest to centroid
                if (Math.abs(Number(sl)-centroid) < Math.abs(match-centroid)) {
                    match = Number(sl);
                }
            }
        }
    }
    // if no staff level found
    if (match === undefined) {
        console.error(`Pitch to Staff Level: No match found for pitch class ${pitch_class}`)
        return null;
    }
    else return match;
}

/**
 * 
 * @param {Object} staff_view
 * @returns pitch for every staff level in range, in format { staff_level: pitch, ... }
 */
function clefToPitchContext(staff_view) {
    let returnObj = {};
    let clefPitch, clefStaffLevel;
    if (Array.isArray(staff_view.clef) && Array.isArray(staff_view.clef_anchor)) {
        clefPitch = clefDef[staff_view.clef[0]].pitch;
        clefStaffLevel = staff_view.clef_anchor[0] * 2;
    }
    else {
        clefPitch = clefDef[staff_view.clef].pitch;
        clefStaffLevel = staff_view.clef_anchor * 2;
    }
    let maxStaffLevel, staffLine;
    try {
        staffLine = JSON.parse(staff_view.staff_line);
    }
    catch(e) {
        staffLine = staff_view.staff_line;
    }
    if (staff_view.clef == 'C') { //special case
        maxStaffLevel = Math.max.apply(null, staffLine) * 2;
    }
    else {
        maxStaffLevel = Math.max.apply(null, staffLine) * 2 + 1;
    }
    let minStaffLevel = Math.min.apply(null, staffLine) * 2 - 1;

    returnObj[clefStaffLevel] = clefPitch;
    minStaffLevel = Math.min(clefStaffLevel, minStaffLevel);
    maxStaffLevel = Math.max(clefStaffLevel, maxStaffLevel);
    let currentPitch = clefPitch;
    for (let i = clefStaffLevel + 1; i <= maxStaffLevel; i++) {
        currentPitch += context.step_size;
        while (context.mode_scale[currentPitch % context.repeat_interval] === null) {
            currentPitch += context.step_size;
        }
        returnObj[i] = currentPitch;
    }
    currentPitch = clefPitch;
    for (let i = clefStaffLevel - 1; i >= minStaffLevel; i--) {
        currentPitch -= context.step_size;
        while (context.mode_scale[currentPitch % context.repeat_interval] === null) {
            currentPitch -= context.step_size;
        }
        returnObj[i] = currentPitch;
    }
    return returnObj;
}

function accidentalAutoVisible(staff_element, note_data) {
    
}

/**
 * Called by childDataToViewParams in StaffClef.js, returns note view params y, accidental
 * 
 * @param {Element} staff_element 
 * @param {Object} note_data 
 */
function noteDataToViewParams(staff_element, note_data, staffLineSpacing) {
    // retrieve y from parent
    const ref = staff_element.querySelector(`.StaffClef-ref`);
    const y0 = parseFloat(ref.getAttribute('y'));

    // get pitch, determine accidental
    const keySigArray = keySignatureDef(staff_element.dataset.key_signature);
    const pitchObj = pitchStringDef(note_data.pitch, keySigArray);
    const accidental_glyph = [accidentalDef(pitchObj.deviation).glyph]; // to return

    // determine staff level (and y)
    const whitePitch = pitchObj.pitch - pitchObj.deviation; // the pitch as if with a natural, for searching staff level
    const staffLevelPitchList = clefToPitchContext(staff_element.dataset); // staff level pitches without accidentals
    const tempSL = findStaffLevelForPitchClass(pitchObj.pitch, staffLevelPitchList, pitchObj, false);
    const octaveDiff = staffLevelPitchList[tempSL] - whitePitch;
    let staffLevel;
    if (octaveDiff % context.repeat_interval == 0) {
        staffLevel = tempSL - octaveDiff / context.repeat_interval * context.mode_steps;
    }
    const y = y0 - staffLineSpacing / 2 * staffLevel; // to return

    const staffLines = JSON.parse(staff_element.dataset.staff_line);
    const maxStaffLine = Math.max.apply(null, staffLines);
    const minStaffLine = Math.min.apply(null, staffLines);
    const midStaffLevel = maxStaffLine + minStaffLine; // avg *2
    /*
    let clef;
    try {
        clef = JSON.parse(staff_element.dataset.clef);
    }
    catch(e) {
        clef = staff_element.dataset.clef;
    }
    */

    // determine stem direction
    let stem_direction;
    if (note_data.stem_direction == 'auto') {
        if (staffLevel > midStaffLevel) stem_direction = 'down';
        else stem_direction = 'up';
    }
    else stem_direction = note_data.stem_direction;

    // build ledger lines
    let ledger_line = [];
    for (let l = maxStaffLine + 1; l * 2 <= staffLevel; l++) {
        ledger_line.push(l * 2 - staffLevel); // offset from staff level
    }
    for (let l = minStaffLine - 1; l * 2 >= staffLevel; l--) {
        ledger_line.push(l * 2 - staffLevel);
    }

    // accidental visibility
    let accidental_visible
    if (note_data.accidental_visible != 'auto') accidental_visible = note_data.accidental_visible;
    // process when 'auto'
    else {
        let currentStaffLevelPitch = whitePitch;
        for (keyObj of keySigArray) {
            // match white pitch to key signature pitch class
            if ((whitePitch - keyObj.pitch_class + keyObj.accidental) % context.repeat_interval == 0) {
                currentStaffLevelPitch += keyObj.accidental;
                break;
            }
        }
        // iterate notes before current
        const children = staff_element.querySelector('.contents').children;
        for (let i = 0; i < children.length; i++) {
            if (children[i].id == note_data.id) break; // if note already exists
            const noteHead = children[i].querySelector('.Note-note_head');
            if (noteHead.getAttribute('y') == y) {
                currentStaffLevelPitch = pitchStringDef(children[i].dataset.pitch, keySigArray).pitch;
            }
        }
        // finally, check if current accidental is same
        if (currentStaffLevelPitch == pitchObj.pitch) accidental_visible = false;
        else accidental_visible = true;
        
    }

    return {
        y,
        accidental_glyph,
        accidental_visible,
        stem_direction,
        ledger_line,
        note_head_glyph: ''
    }
}

/**
 * Called by childViewParamsToData in StaffClef.js
 * 
 * @param {Element} staff_element 
 * @param {Number} staff_level can be a float, retrieved from mouse position
 */
function staffLevelToPitch(staff_element, staff_level) {
    const clefPitch = clefDef[staff_element.dataset.clef].pitch;
    const clefStaffLevel = Number(staff_element.dataset.clef_anchor) * 2;
    const staffLevelOffset = staff_level - clefStaffLevel;
    let pitch = clefPitch + staffLevelOffset * context.repeat_interval / context.mode_steps;
    pitch = Math.round(pitch / context.step_size) * context.step_size;

    return pitch;
}

/**
 * Called by display in StaffClef.js
 * @param {Object} staff_view 
 * @returns {Array} drawsocket group for key signature display
 */
function keySignatureDisplay(staff_view, x_offset, staff_line_spacing) {
    let svgGroup = {
        new: 'g',
        class: 'StaffClef-key_signature-group',
        id: `${staff_view.id}-key_signature-group`,
        child: []
    };

    if (staff_view.key_signature == 'none' || staff_view.key_signature == 'C' || staff_view.key_signature == 'Am') return svgGroup;

    const keySigArray = keySignatureDef(staff_view.key_signature);
    const clefStaffLevel = (staff_view.clef_anchor[0] || staff_view.clef_anchor) * 2;
    const clefCentroid = clefStaffLevel + clefDef[staff_view.clef].key_signature_centroid[keySigArray[0].accidental];
    const accidentalSpacing = staff_line_spacing;
    const staffLevelPitchList = clefToPitchContext(staff_view);
    keySigArray.forEach((obj, ind) => {
        svgGroup.child.push({
            new: 'text',
            class: 'StaffClef-key_signature Global-musicFont',
            id: `${staff_view.id}-key_signature-${ind}`,
            x: x_offset + ind * accidentalSpacing,
            y: staff_view.y - staff_line_spacing / 2 * findStaffLevelForPitchClass(obj.pitch_class, staffLevelPitchList, accidentalDef(obj.accidental), true, clefCentroid),
            child: accidentalDef(obj.accidental).glyph
        });
    });

    return svgGroup;
}

module.exports = {
    pitchClassDef,
    clefDef,
    keySignatureDef,
    accidentalDef,
    accidentalAutoVisible,
    noteDataToViewParams,
    staffLevelToPitch,
    keySignatureDisplay
}