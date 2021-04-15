const context = {
    about: '12 Tone Equal Temperament',
    steps: 12,
    step_size: 1,
    repeat_interval: 12,
    dominant_interval: 7,
    mode: [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1],
    mode_steps: 7,
    tonic: 0
}

const clefDef = {
    G: {
        pitch: 67,
        glyph: '&#xE050',
        key_signature_centroid: {
            sharp: 4,
            flat: 2
        }
    },
    C: {
        pitch: 60,
        glyph: '&#xE05C',
        key_signature_centroid: {
            sharp: 1,
            flat: -1
        }
    },
    F: {
        pitch: 53,
        glyph: '&#xE062',
        key_signature_centroid: {
            sharp: -2,
            flat: -4
        }
    },
    G8vb: {
        pitch: 55,
        glyph: '&#xE052',
        key_signature_centroid: {
            sharp: 4,
            flat: 2
        }
    }
}

/**
 * Internal, returns formatted array of accidentals to be drawn 
 * Format:
 * [ {pitch_class, accidental}, ... ]
 * 
 * Pitch class to be represented in midi, from 0 to 11
 * Accidental in string
 * 
 * @param {String} key
 */
function keySignatureDef(key) {
    if (key == 'none' || key == 'C' || key == 'Am') return [];

    // internal, for the following 4 cases
    function standardKeys(keyDefs, k, sharp) {
        let numSharp = keyDefs.indexOf(k) + 1;
        let keySigArray = [];
        let pitchClass = (sharp ? 6 : 10);
        for (let i = 0; i < numSharp; i++) {
            keySigArray.push({
                pitch_class: pitchClass,
                accidental: (sharp ? 'sharp' : 'flat')
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

    // finally test if key is defined in JSON format
    try {
        const jsonKeySig = JSON.parse(key);
        if (!Array.isArray(jsonKeySig)) throw 'not an array';
        return jsonKeySig;
    }
    catch(e) {
        console.error('Please enter a valid key signature: defined string or array [{pitch_class, accidental}, ...]');
    }

    // any other case: no key signature
    return [];
}

function accidentalDef(acc) {
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
            return { glyph: '', deviation: 0 };
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

function findStaffLevelForPitchClass(pitch_class, staff_level_pitch_list, accidental, centroid) {
    let match;
    const matchClass = pitch_class - accidental.deviation;
    for (sl in staff_level_pitch_list) {
        if ((staff_level_pitch_list[sl] - matchClass) % context.repeat_interval == 0) {
            console.log('found', sl);
            // if not previously matched
            if (match === undefined) {
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
        console.error(`Key signature: No match found for pitch class ${pitch_class}`)
        return null;
    }
    else return match;
}

/**
 * 
 * @param {Number} clef_pitch 
 * @param {Number} clef_staff_level 
 * @param {Number} max_staff_level 
 * @param {Number} min_staff_level 
 * @returns pitch for every staff level in range, in format { staff_level: pitch, ... }
 */
function clefToPitch(clef_pitch, clef_staff_level, max_staff_level, min_staff_level) {
    let returnObj = {};
    returnObj[clef_staff_level] = clef_pitch;
    min_staff_level = Math.min(clef_staff_level, min_staff_level);
    max_staff_level = Math.max(clef_staff_level, max_staff_level);
    let currentPitch = clef_pitch;
    for (let i = clef_staff_level + 1; i <= max_staff_level; i++) {
        currentPitch += context.step_size;
        while (context.mode[currentPitch % context.repeat_interval] == 0) {
            currentPitch += context.step_size;
        }
        returnObj[i] = currentPitch;
    }
    currentPitch = clef_pitch;
    for (let i = clef_staff_level - 1; i >= min_staff_level; i--) {
        currentPitch -= context.step_size;
        while (context.mode[currentPitch % context.repeat_interval] == 0) {
            currentPitch -= context.step_size;
        }
        returnObj[i] = currentPitch;
    }
    return returnObj;
}

/**
 * Called by childDataToViewParams in StaffClef.js, returns note staff_level, accidental
 * 
 * @param {Element} staff_element 
 * @param {Object} note_data 
 */
function noteDisplay(staff_element, note_data) {
    return;
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
    const accidentalSpacing = staff_line_spacing;
    let clefPitch, clefStaffLevel;
    if (Array.isArray(staff_view.clef) && Array.isArray(staff_view.clef_anchor)) {
        clefPitch = clefDef[staff_view.clef[0]].pitch;
        clefStaffLevel = staff_view.clef_anchor[0] * 2;
    }
    else {
        clefPitch = clefDef[staff_view.clef].pitch;
        clefStaffLevel = staff_view.clef_anchor * 2;
    }
    let clefCentroid = clefStaffLevel + clefDef[staff_view.clef].key_signature_centroid[keySigArray[0].accidental];
    let maxStaffLevel;
    if (staff_view.clef = 'C') { //special case
        maxStaffLevel = Math.max.apply(null, staff_view.staff_line) * 2;
    }
    else {
        maxStaffLevel = Math.max.apply(null, staff_view.staff_line) * 2 + 1;
    }
    const minStaffLevel = Math.min.apply(null, staff_view.staff_line) * 2 - 1;
    const staffLevelPitchList = clefToPitch(clefPitch, clefStaffLevel, maxStaffLevel, minStaffLevel);
    console.log('staffLevelPitchList', staffLevelPitchList);
    keySigArray.forEach((obj, ind) => {
        svgGroup.child.push({
            new: 'text',
            class: 'StaffClef-key_signature Global-musicFont',
            id: `${staff_view.id}-key_signature-${ind}`,
            x: x_offset + ind * accidentalSpacing,
            y: staff_view.y - staff_line_spacing / 2 * findStaffLevelForPitchClass(obj.pitch_class, staffLevelPitchList, accidentalDef(obj.accidental), clefCentroid),
            child: accidentalDef(obj.accidental).glyph
        });
    });

    return svgGroup;
}

module.exports = {
    clefDef,
    keySignatureDef,
    accidentalDef,
    noteDisplay,
    keySignatureDisplay
}