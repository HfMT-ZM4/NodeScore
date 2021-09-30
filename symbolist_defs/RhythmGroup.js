const Template = require('../SymbolTemplate');
const lib = require('./NodeScoreLib');


class RhythmGroup extends Template.SymbolBase 
{
    constructor() {
        super();
        this.class = 'RhythmGroup';
        this.palette = ['Note'];
        this.fontSize = 24;
    }


    get structs () {
        return {

            data: {
                class: this.class,
                id : `${this.class}-0`,
                tuplet: 'none',
                stem_direction: 'auto'
            },
            
            view: {
                class: this.class,
                id: `${this.class}-0`,
                x: 100,
                y: 100,
                tuplet_number: 'none',
                stem_direction: 'auto'
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
        //console.log('params', params);
        ui_api.hasParam(params, Object.keys(this.structs.view) );
        let returnArray = [];

        // reference
        returnArray.push({
            new: 'circle',
            class: 'RhythmGroup-ref',
            id: `${params.id}-ref`,
            cx: params.x,
            cy: params.y
        });
        /*
        if (params.beam_start_x) {
            // test beam
            returnArray.push({
                new: 'line',
                class: 'RhythmGroup-beam',
                id: `${params.id}-beam-test`,
                x1: params.beam_start_x,
                y1: params.beam_start_y,
                x2: params.beam_end_x,
                y2: params.beam_end_y
            });
        }
        */
        
        return returnArray;
    }
    
    getElementViewParams(element) {
        const ref = element.querySelector(`.RhythmGroup-ref`);
        
        const x = parseFloat(ref.getAttribute('cx'));
        const y = parseFloat(ref.getAttribute('cy'));
        return {
            id: element.id,
            x,
            y
        }
    }

    getPaletteIcon() {
        return {
            key: 'svg',
            val: {
                new: 'text',
                class: `${this.class}-palette_icon`,
                id: `${this.id}-palette_icon`,
                x: 20,
                y: 20,
                child: 'G'
            }
        }
    }

    childDataToViewParams(this_element, child_data) {
        if (child_data.class == 'Note') {

            // initialize x, start from the right of timeSig/clefKey if visible
            let x;
            let measure_element = ui_api.getContainerForElement(this_element);
            //console.log('Measure class', measure_element.classList);
            while (measure_element.classList[0] != 'Measure') {
                measure_element = ui_api.getContainerForElement(measure_element);
            }
            //console.log('Measure element:', measure_element);
            const timeSigGroup = measure_element.querySelector('.Measure-timeSig-group');

            let staff_element = this_element;
            while (staff_element.classList[0] != 'StaffClef') {
                staff_element = ui_api.getContainerForElement(staff_element);
            }
            const clefKeyGroup = staff_element.querySelector('.StaffClef-clef_key-group');
            //console.log('Staff element:', staff_element);

            const children = this_element.querySelector('.contents').children;
            if (children.length > 0 ) {
                try { // check if this child already exists
                    const child_exist = document.getElementById(child_data.id);
                    x = ui_api.getBBoxAdjusted(child_exist).left;
                }
                catch (e) {
                    const lastChild = children[children.length-1];
                    x = ui_api.getBBoxAdjusted(lastChild).right;
                }
            }
            else if (timeSigGroup) {
                x = ui_api.getBBoxAdjusted(timeSigGroup).right;
            }
            else if (clefKeyGroup.childNodes.length > 0) {
                x = ui_api.getBBoxAdjusted(clefKeyGroup).right;
            }
            else {
                x = this.getElementViewParams(this_element).x;
            }
            const keyMap = require(`./key_maps/${staff_element.dataset.key_map}`);
            const fromKeyMap = keyMap.noteDataToViewParams(staff_element, child_data, this.fontSize / 4);

            const x_after_note = x + lib.getComputedTextLength(fromKeyMap.note_head_glyph, 'Note-note_head Global-musicFont');
            console.log('from parent', x_after_note - x);

            let stem_direction = child_data.stem_direction;
            if (stem_direction == 'auto') stem_direction = this_element.dataset.stem_direction;
            return {
                ...fromKeyMap, // y, accidental_glyph, accidental_visible, stem_direction, ledger_line, note_head_glyph
                x,
                beam_flag: false,
                stem_direction,
                x_after_note
            }
        }
    }

    childViewParamsToData(this_element, child_viewParams) {
        let staff_element = this_element;
        while (staff_element.classList[0] != 'StaffClef') {
            staff_element = ui_api.getContainerForElement(staff_element);
        }
        const keyMap = require(`./key_maps/${staff_element.dataset.key_map}`);
        const yCenter = this.getElementViewParams(this_element).y;
        const staffLevelSpacing = this.fontSize / 8;
        const staffLevel = (yCenter - child_viewParams.y) / staffLevelSpacing;

        const pitch = keyMap.staffLevelToPitch(staff_element, staffLevel);
        return { pitch }
    }

    
    updateAfterContents (element) {
        const children = element.querySelector('.contents').children;
        const noteDef = ui_api.getDef('Note');
        let stem_direction = element.dataset.stem_direction;
        let drawArray = [];
        if (children.length > 1) {
            // determine beam stem direction if auto
            if (stem_direction == 'auto') {
                let count_direction = 0;
                    for (let i = 0; i < children.length; i++) {
                        if (children[i].dataset.stem_direction == 'up') count_direction++;
                        else if (children[i].dataset.stem_direction == 'down') count_direction--;
                    }
                    if (count_direction >= 0) stem_direction = 'up';
                    else stem_direction = 'down';
            }

            // collect note info
            for (let i = 0; i < children.length; i++) {
                //console.log(`children ${i}: `, children[i]);
                if (children[i].classList[0] == 'Note') {
                    const flagGroup = children[i].querySelector('.Note-flag-group');
                    beam_array.push(parseFloat(flagGroup.dataset.num_beams));
                }
            }

            const firstNoteStem = children[0].querySelector('.Note-stem');
            beam_start_x = ui_api.getBBoxAdjusted(firstNoteStem).left;
            beam_start_y = parseFloat(firstNoteStem.dataset.stem_end_y);
            const lastNoteStem = children[children.length-1].querySelector('.Note-stem');
            beam_end_x = ui_api.getBBoxAdjusted(lastNoteStem).right;
            beam_end_y = parseFloat(lastNoteStem.dataset.stem_end_y);

            const drawObj = {
                key: 'svg',
                val: drawArray
            }
            ui_api.drawsocketInput(drawObj);
        }

        /*
        let dataObj = {
            id: element.id,
            stem_direction,
            beam_start_x,
            beam_start_y,
            beam_end_x,
            beam_end_y,
            beam_array
        }

        const container = ui_api.getContainerForElement(element);
        this.fromData(dataObj, container);
        */


    }
    

}

class RhythmGroup_IO extends Template.IO_SymbolBase
{
    constructor()
    {
        super();
        this.class = 'RhythmGroup';
    }
    
}



module.exports = {
    ui_def: RhythmGroup,
    io_def: RhythmGroup_IO    
}

