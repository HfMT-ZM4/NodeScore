const Template = require(__symbolist_dirname + '/lib/SymbolTemplate') 


class StaffClef extends Template.SymbolBase 
{
    constructor() {
        super();
        this.class = 'StaffClef';
        this.palette = ['Note'];
        this.fontSize = 24;
    }


    get structs () {
        return {

            data: {
                class: this.class,
                id : `${this.class}-0`,
                staff_line : [-2, -1, 0, 1, 2],
                clef: 'G',
                clef_anchor: -1,
                clef_visible: 'auto',
                key_map: '12ED2',
                key_signature: 'none',
                key_signature_visible: 'auto'
            },
            
            view: {
                class: this.class,
                id: `${this.class}-0`, 
                staff_line : [-2, -1, 0, 1, 2],
                staff_line_width: 100,
                x: 100,
                y: 100,
                clef: 'G',
                clef_anchor: -1,
                clef_visible: 'auto',
                key_map: '12ED2',
                key_signature: 'none',
                key_signature_visible: 'auto'
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

        // reference
        returnArray.push({
            new: 'rect',
            class: 'StaffClef-ref',
            id: `${params.id}-ref`,
            x: params.x,
            y: params.y,
            width: params.staff_line_width,
            height: this.fontSize
        });

        // staff lines
        let staffLineGroup = {
            new: 'g',
            class: 'StaffClef-staff_line-group',
            id: `${params.id}-staff_line-group`,
            child: []
        }
        let staffLineSpacing = this.fontSize / 4;
        //if (typeof(params.staff_line) == 'string') params.staff_line = JSON.parse(params.staff_line);
        params.staff_line.forEach(i => {
            staffLineGroup.child.push({
                new: 'line',
                class: 'StaffClef-staff_line',
                id: `${params.id}-staff_line-${i}`,
                x1: params.x,
                x2: params.x + params.staff_line_width,
                y1: params.y - staffLineSpacing * i,
                y2: params.y - staffLineSpacing * i
            });
        });
        returnArray.push(staffLineGroup);

        // clef + keysig
        let clefKeyGroup = {
            new: 'g',
            class: 'StaffClef-clef_key-group',
            id: `${params.id}-clef_key-group`,
            child: []
        }
        let clefVisible = params.clef_visible;
        let keySigVisible = params.key_signature_visible;
        let keyMap;
        if (clefVisible == 'auto') {
            console.error('Error: clef_visible is still auto inside StaffClef display');
            clefVisible = true;
        }
        if (keySigVisible == 'auto') {
            console.error('Error: key_signature_visible is still auto inside StaffClef display');
            keySigVisible = true;
        }
        if (clefVisible == 'true' || clefVisible == true || keySigVisible == 'true' || keySigVisible == true) {
            keyMap = require(`./key_maps/${params.key_map}`);
        }
        //console.log('clefVisible', clefVisible);
        if (clefVisible == 'true' || clefVisible == true) {
            let clefGroup = {
                new: 'g',
                class: 'StaffClef-clef-group',
                id: `${params.id}-clef-group`,
                child: []
            }
            if (Array.isArray(params.clef)) {
                params.clef.forEach((c, ind) => {
                    clefGroup.child.push({
                        new: 'text',
                        class: 'StaffClef-clef Global-musicFont',
                        id: `${params.id}-clef`,
                        x: params.x,
                        y: params.y - staffLineSpacing * params.clef_anchor[ind],
                        child: keyMap.clefDef[c].glyph
                    });
                })
            }
            else {
                clefGroup.child.push({
                    new: 'text',
                    class: 'StaffClef-clef Global-musicFont',
                    id: `${params.id}-clef`,
                    x: params.x,
                    y: params.y - staffLineSpacing * params.clef_anchor,
                    child: keyMap.clefDef[params.clef].glyph
                });
            }

            clefKeyGroup.child.push(clefGroup);
        }
        console.log('Start key sig', params.key_signature)
        if (keySigVisible == 'true' || keySigVisible == true) {
            const keySigGroup = keyMap.keySignatureDisplay(params, params.x + staffLineSpacing * 3, staffLineSpacing);
            clefKeyGroup.child.push(keySigGroup);
        }
        
        
        returnArray.push(clefKeyGroup);
        
        return returnArray;
    }
    
    getElementViewParams(element) {
        let ref = element.querySelector(`.StaffClef-ref`);
        
        let x = parseFloat(ref.getAttribute('x'));
        let y = parseFloat(ref.getAttribute('y'));
        let staff_line_width = parseFloat(ref.getAttribute('width'));
        return {
            id: element.id,
            staff_line : JSON.parse(element.dataset.staff_line),
            staff_line_width,
            x,
            y,
            clef: element.dataset.clef,
            clef_anchor: parseInt(element.dataset.clef),
            clef_visible: element.dataset.clef_visible
        }
    }

    getPaletteIcon() {
        return {
            key: 'svg',
            val: this.display({
                ...this.structs.view,
                id: `${this.class}-palette-icon`,
                class: this.class,
                x: 5,
                y: 20,
                staff_line_width: 30,
                staff_line : [-2, -1, 0, 1, 2],
                clef_visible: false
            })
        }
    }

    childDataToViewParams(this_element, child_data) {
        const keyMap = require(`./key_maps/${this_element.dataset.key_map}`);
        if (child_data.class == 'Note') {
            const clefKeyGroup = this_element.querySelector('.StaffClef-clef_key-group');
            let y = this.getElementViewParams(this_element).y;

            // initialize x, start from the right of timeSig/clefKey if visible
            let x;
            const container = ui_api.getContainerForElement(this_element);
            const timeSigGroup = container.querySelector('.Measure-timeSig-group');
            if (timeSigGroup) {
                x = ui_api.getBBoxAdjusted(timeSigGroup).right;
            }
            else if (clefKeyGroup.childNodes.length > 0) {
                x = ui_api.getBBoxAdjusted(clefKeyGroup).right;
            }
            else {
                x = this.getElementViewParams(this_element).x;
            }

            const note_head = '';
            return {
                x,
                y,
                note_head
            }
        }
    }

    childViewParamsToData(this_element, child_viewParams) {

    }

}

class StaffClef_IO extends Template.IO_SymbolBase
{
    constructor()
    {
        super();
        this.class = 'StaffClef';
    }
    
}



module.exports = {
    ui_def: StaffClef,
    io_def: StaffClef_IO    
}

