const Template = require(__symbolist_dirname + '/lib/SymbolTemplate') 


class Note extends Template.SymbolBase 
{
    constructor() {
        super();
        this.class = 'Note';
        this.palette = [];
        this.fontSize = 24;
    }


    get structs () {
        return {

            data: {
                class: this.class,
                id : `${this.class}-0`,
                grace: false,
                pitch: 60,
                duration: 1,
                hold: 1,
                note_head_family: 'auto',
                stem_direction: 'auto',
                accidental_visible: 'auto'
            },
            
            view: {
                class: this.class,
                id: `${this.class}-0`, 
                x: 100,
                y: 100,
                grace: false,
                note_head_glyph: 'auto',
                accidental_glyph: [],
                accidental_visible: 'auto',
                stem_height: 4,
                stem_direction: 'auto',
                ledger_line: []
            },
            
            children: {
                data: {},
                view: {}
            }
        }
    }

    drag(element, pos){}

    display(params) {
        const staffLineSpacing = this.fontSize / 4;

        //console.log('params', params);
        ui_api.hasParam(params, Object.keys(this.structs.view) );
        let returnArray = [];
        let currentX = params.x;
        
        // accidentals
        let accidentalGroup = {
            new: 'g',
            class: 'Note-accidental-group Global-musicFont',
            id: `${params.id}-accidental-group`,
            child: []
        };
        params.accidental_glyph.forEach((val, i) => {
            accidentalGroup.child.push({
                new: 'text',
                class: 'Note-accidental',
                id: `${params.id}-accidental-${i}`,
                x: currentX,
                y: params.y,
                child: val
            });
            currentX += ui_api.getComputedTextLength(val, 'Note-accidental Global-musicFont');
        });
        returnArray.push(accidentalGroup);
        
        // note head
        let noteHeadGroup = {
            new: 'g',
            class: 'Note-note_head-group Global-musicFont',
            id: `${params.id}-note_head-group`,
            child: []
        };
        noteHeadGroup.child.push({
            new: 'text',
            class: 'Note-note_head',
            id: `${params.id}-note_head-0`,
            x: currentX,
            y: params.y,
            child: params.note_head_glyph
        });
        const xBeforeNoteHead = currentX;
        currentX += ui_api.getComputedTextLength(params.note_head_glyph, 'Note-note_head Global-musicFont');
        returnArray.push(noteHeadGroup);

        // ledger lines
        let ledgerLineGroup = {
            new: 'g',
            class: 'Note-ledger_line-group',
            id: `${params.id}-ledger_line-group`,
            child: []
        };
        params.ledger_line.forEach((val, i) => {
            ledgerLineGroup.child.push({
                new: 'line',
                class: 'Note-ledger_line',
                id: `${params.id}-ledger_line-${i}`,
                x1: xBeforeNoteHead - staffLineSpacing * 0.5,
                y1: params.y - val * staffLineSpacing / 2,
                x2: currentX + staffLineSpacing * 0.5,
                y2: params.y - val * staffLineSpacing / 2
            });
        });
        returnArray.push(ledgerLineGroup);
        
        // stem
        if (params.stem_height != 0) {
            let stemDirectionFactor, stemX;
            if (params.stem_direction == 'down') {
                stemDirectionFactor = -1;
                stemX = xBeforeNoteHead;
            }
            else {
                stemDirectionFactor = 1;
                stemX = currentX;
            }
            returnArray.push({
                new: 'line',
                class: 'Note-stem',
                id: `${params.id}-stem`,
                x1: stemX,
                y1: params.y - staffLineSpacing * stemDirectionFactor * params.stem_height,
                x2: stemX,
                y2: params.y
            });
        }
        
        return returnArray;
    }
    
    getElementViewParams(element) {
        const noteHead = element.querySelector(`.Note-note_head`);
        
        const x = parseFloat(noteHead.getAttribute('x'));
        const y = parseFloat(noteHead.getAttribute('y'));
        const note_head = noteHead.innerText;

        return {
            id: element.id,
            x,
            y,
            grace: element.dataset.grace,
            note_head,
            accidental: 0, // to be defined
            accidental_map: '', // to be defined
            stem_height: 1, // to be defined
            stem_direction: 'auto' // to be defined
        }
    }

    getPaletteIcon() {
        return {
            key: 'svg',
            val: {
                new: 'text',
                id: `Note-palette-icon`,
                class: 'Note-note_head Global-musicFont',
                x: 20,
                y: 20,
                child: ''
            }
        }
    }

    childDataToViewParams(this_element, child_data) {
    }

    childViewParamsToData(this_element, child_viewParams) {

    }

}

class Note_IO extends Template.IO_SymbolBase
{
    constructor()
    {
        super();
        this.class = 'Note';
    }
    
}



module.exports = {
    ui_def: Note,
    io_def: Note_IO    
}

