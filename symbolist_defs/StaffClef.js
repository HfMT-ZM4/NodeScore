const Template = require(__symbolist_dirname + '/lib/SymbolTemplate') 


class StaffClef extends Template.SymbolBase 
{
    constructor() {
        super();
        this.class = 'StaffClef';
        this.palette = [];
        this.fontSize = 24;
        this.clefDictionary = {
            G: '&#xE050',
            C: '&#xE05C',
            F: '&#xE062',
            G8vb: '&#xE052',
            perc: '&#xE069'
        }
    }


    get structs () {
        return {

            data: {
                class: this.class,
                id : `${this.class}-0`,
                staff_line : [-2, -1, 0, 1, 2],
                clef: 'G',
                clef_anchor: -1,
                clef_visible: false,
                key_signature: [],
                key_signature_visible: false
            },
            
            view: {
                class: this.class,
                id: `${this.class}-0`, 
                staff_line : [0],
                staff_line_width: 100,
                x: 100,
                y: 100,
                clef: 'G',
                clef_anchor: -1,
                clef_visible: false
            },
            
            children: {
                data: {

                },
                view: {

                }
            }
        }
    }

    drag(element, pos){}

    display(params) {
        console.log('params', params);
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
        if (params.clef_visible) {
            clefKeyGroup.child.push({
                new: 'text',
                class: 'StaffClef-clef Global-musicFont',
                id: `${params.id}-clef`,
                x: params.x,
                y: params.y - staffLineSpacing * params.clef_anchor,
                child: this.clefDictionary[params.clef]
            });
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

