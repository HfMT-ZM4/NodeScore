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
                note_head_family: 'auto'
            },
            
            view: {
                class: this.class,
                id: `${this.class}-0`, 
                x: 100,
                y: 100,
                grace: false,
                note_head: 'auto',
                accidental: 0,
                accidental_map: '',
                stem_height: 1,
                stem_direction: 'auto'

            },
            
            children: {
                data: {},
                view: {}
            }
        }
    }

    drag(element, pos){}

    display(params) {
        //console.log('params', params);
        ui_api.hasParam(params, Object.keys(this.structs.view) );
        let returnArray = [];

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
            x: params.x,
            y: params.y,
            child: params.note_head
        });
        returnArray.push(noteHeadGroup);
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

