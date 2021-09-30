const Template = require('../SymbolTemplate');
const lib = require('./NodeScoreLib');


class Note extends Template.SymbolBase 
{
    constructor() {
        super();
        this.class = 'Note';
        this.palette = ['Graphic'];
        this.fontSize = 24;
    }


    get structs () {
        return {
 
            data: {
                class: this.class,
                id : `${this.class}-0`,
                pitch: 60,
                value: 1,
                amplitude: 1,
                hold: 1,
                note_head_family: 'auto',
                stem_direction: 'auto',
                stem_visible: 'auto',
                accidental_visible: 'auto'
            },
            
            view: {
                class: this.class,
                id: `${this.class}-0`, 
                x: 100,
                y: 100,
                accidental_glyph: [],
                accidental_visible: 'auto',
                ledger_line: [],
                note_head_glyph: 'auto',
                stem_visible: 'auto',
                stem_height: 4,
                stem_direction: 'auto',
                beams: 0,
                beam_flag: 'auto',
                dots: 0,
                dots_displace: false
            },
            
            children: {
                data: {},
                view: {}
            }
        }
    }

    drag(element, pos){}

    selected(element, state) {
        ui_api.sendToServer({ 
            key:"call", 
            val: {
                class: "NodeScoreAPI", 
                method: "updateSelected",
                id: element.id,
                state: state
            }
        });
    }

    currentContext( element, enable = false ) 
    {
        console.log(this.class, " is context ", enable);
        if( enable )
        {
            this.m_mode = 'context';
        }
        else
        {
            this.m_mode = "exited context";
        }
        ui_api.sendToServer({ 
            key:"call", 
            val: {
                class: "NodeScoreAPI", 
                method: "updateContext",
                id: element.id,
                enable
            }
        });
    }
    
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
        if (params.accidental_visible == true) {
            params.accidental_glyph.forEach((val, i) => {
                accidentalGroup.child.push({
                    new: 'text',
                    class: 'Note-accidental',
                    id: `${params.id}-accidental-${i}`,
                    x: currentX,
                    y: params.y,
                    child: val
                });
                currentX += lib.getComputedTextLength(val, 'Note-accidental Global-musicFont');
            });
        }
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
        console.log('computed text length', lib.getComputedTextLength(params.note_head_glyph, 'Global-musicFont'));
        currentX += lib.getComputedTextLength(params.note_head_glyph, 'Note-note_head Global-musicFont');
        
        returnArray.push(noteHeadGroup);

        // ledger lines -> drawn in parent
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

        // stem -> drawn in parent
        let stemDirectionFactor = -1;
        let stemX = currentX;
        let stemEndY = params.y;
        const stemWidth = 1.5;
        if (params.stem_height != 0 && params.stem_visible != false) {
            if (params.stem_direction == 'down') {
                stemDirectionFactor = 1;
                stemX = xBeforeNoteHead;
            }
            stemEndY = params.y + staffLineSpacing * stemDirectionFactor * params.stem_height;
            returnArray.push({
                new: 'rect',
                class: 'Note-stem',
                id: `${params.id}-stem`,
                x: Math.min(stemX, stemX + stemDirectionFactor * stemWidth),
                y: Math.min(params.y, stemEndY),
                width: stemWidth,
                height: Math.abs(params.y - stemEndY),
                'data-stem_end_y': stemEndY
            });
        }
        else {
            returnArray.push({
                new: 'g',
                class: 'Note-stem',
                id: `${params.id}-stem`
            });
        }

        // flags -> drawn in parent
        let flagGroup = {
            new: 'g',
            class: 'Note-flag-group',
            id: `${params.id}-flag-group`,
            'data-num_beams': params.beams,
            child: []
        };
        if (params.beam_flag) {
            if (params.beams > 0 && params.beams <= 8) {
                flagGroup.child.push({
                    new: 'text',
                    class: 'Note-flag Global-musicFont',
                    id: `${params.id}-flag`,
                    x: stemX - (params.stem_direction == 'down' ? 0 : stemWidth),
                    y: stemEndY,
                    child: lib.smufl.flag[params.beams][(params.stem_direction == 'down' ? 'down' : 'up')]
                });
            }
            else {
                console.error(`${params.id}: ${params.beams} beams not supported`);
            }
        }
        returnArray.push(flagGroup);

        // dots
        let dotGroup = {
            new: 'g',
            class: 'Note-dot-group',
            id: `${params.id}-dot-group`,
            'data-num-dots': params.dots,
            child: []
        };
        for (let i = 0; i < params.dots; i++) {
            dotGroup.child.push({
                new: 'text',
                class: 'Note-dot Global-musicFont',
                id: `${params.id}-dot-${i}`,
                x: currentX,
                y: params.y - (params.dots_displace ? staffLineSpacing / 2 : 0),
                child: lib.smufl.dot
            });
            currentX += lib.getComputedTextLength('', 'Note-dot Global-musicFont');
        }
        returnArray.push(dotGroup);
        
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
        if (child_data.class == 'Graphic') {
            const x = this.getElementViewParams(this_element).x;
            const y = this.getElementViewParams(this_element).y - 50;
            return {x, y}
        }
    }

    childViewParamsToData(this_element, child_viewParams) {

    }

    creatNewFromMouseEvent(event)
    {
        // remove preview sprite
        ui_api.drawsocketInput({
            key: "remove", 
            val: `${this.class}-sprite`
        })

        // generate objectData from Mouse Event
        const container = ui_api.getCurrentContext();
        let data =  this.mouseToData(event, container);
        
        this.fromData(data, container);

        // send new object to server
        ui_api.sendToServer({
            key: "data",
            val: data
        })

        // call parent updateAfterContents function
        const parentDef = ui_api.getDefForElement(container);
        parentDef.updateAfterContents(container);

        return data;
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

