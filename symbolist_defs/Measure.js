const Template = require(__symbolist_dirname + '/lib/SymbolTemplate') 

class Measure extends Template.SymbolBase 
{
    constructor() {
        super();
        this.class = 'Measure';
        this.palette = ['StaffClef'];
        this.fontSize = 24;
        this.timeSigGlyphs = {
            '0': '',
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
        };
    }


    get structs () {
        return {

            data: {
                class: this.class,
                id : `${this.class}-0`,
                time_signature : [4, 4],
                time_signature_visible : false,
                barline_type: 'single',
                repeat_start: false,
                repeat_end: false,
                measure_number_visible : false
            },
            
            view: {
                class: this.class,
                id: `${this.class}-0`, 
                x: 0, // left
                y: 0, // middle
                x_offset: 0, // space for clef + keysig
                width: 200,
                barline_height: 10,
                barline_type: 'single',
                time_signature : [4, 4],
                time_signature_visible : true,
                repeat_start: false,
                repeat_end: false,
                measure_number_visible : false
            },
            
            children: {
                data: {},
                view: {
                    x: 0,
                    y: 0
                }
            }
        }
    }

    drag(element, pos){}

    display(params) {

        ui_api.hasParam(params, Object.keys(this.structs.view) );
        let currentX = params.x;
        let outputArray = [];


        outputArray.push({
            new: 'rect',
            class: 'Measure-ref',
            id: `${params.id}-ref`,
            x: params.x,
            y: params.y,
            width: params.width,
            height: params.barline_height
        })

        currentX += params.x_offset;

        if (params.time_signature_visible) {
            //if (typeof(params.time_signature) == 'string') params.time_signature = JSON.parse(params.time_signature);
        
            outputArray.push({
                new: 'text',
                id: `${params.id}-timeSigTop`,
                class: 'Measure-timeSigTop Global-musicFont',
                child: this.timeSigGlyphs[params.time_signature[0]],
                x: currentX,
                y: params.y-this.fontSize/4
            });
            outputArray.push({
                new: 'text',
                id: `${params.id}-timeSigBottom`,
                class: 'Measure-timeSigBottom Global-musicFont',
                child: this.timeSigGlyphs[params.time_signature[1]],
                x: currentX,
                y: params.y+this.fontSize/4
            });
        }
        
        switch(params.barline_type) {
            // Add codes for other barline types
            default:
                outputArray.push({
                    new: 'line',
                    class: 'Measure-barLine',
                    id: `${params.id}-barLine`,
                    x1: params.x + params.width,
                    x2: params.x + params.width,
                    y1: params.y - params.barline_height / 2,
                    y2: params.y + params.barline_height / 2
                });
            break;
        }
        return outputArray;

        /**
         * note that we are returning the drawsocket def that will be
         * displayed in the 'view' group
         * the top level element of the symbol has the root id
         * so here we need to make sure that the id is different
         */

    }
    
    getElementViewParams(element) {


        const ref = element.querySelector(`.display .Measure-ref`);
        const x = parseFloat(ref.getAttribute('x'));
        const y = parseFloat(ref.getAttribute('y'));
        const width = parseFloat(ref.getAttribute('width'));
        const barline_height = parseFloat(ref.getAttribute('height'));

        return {
            id: element.id,
            x,
            y,
            width,
            barline_height,
            barline_type: element.dataset.barline_type,
            time_signature: JSON.parse(element.dataset.time_signature),
            time_signature_visible: element.dataset.time_signature_visible,
            repeat_start: element.dataset.repeat_start,
            repeat_end: element.dataset.repeat_end,
            measure_number_visible: element.dataset.measure_number_visible
        }

    }


    getPaletteIcon() {
        return {
            key: 'svg',
            val: [{
                new: 'rect',
                id: `${this.class}-paletteIcon-rect`,
                class: `Measure-barLine`,
                x: 0,
                y: 5,
                width: 40,
                height: 30
            }, {
                new: 'text',
                id: `${this.class}-paletteIcon-text`,
                class: 'Measure-number Global-textFont',
                child: 'M',
                x: 20,
                y: 20,
                'text-anchor': 'middle',
                'dominant-baseline': 'middle'
            }]
        }
    }

    childDataToViewParams(this_element, child_data) {
        let x = this.getElementViewParams(this_element).x;
        let y = this.getElementViewParams(this_element).y;
        let staff_line_width = this.getElementViewParams(this_element).width;
        return {
            x,
            y,
            staff_line_width
        }
    }
    
    childViewParamsToData(this_element, child_viewParams) {}
    
    
    
    updateAfterContents( element ) {
        const staffLines = element.querySelector('.display .StaffClef-staff_line-group');
        const barline_height = ui_api.getBBoxAdjusted(staffLines).bottom - ui_api.getBBoxAdjusted(staffLines).top;
        
        const clefKeyGroup = element.querySelector('.display .StaffClef-clef_key-group');
        const x_offset = ui_api.getBBoxAdjusted(clefKeyGroup).right - ui_api.getBBoxAdjusted(clefKeyGroup).left;

        let dataObj = {
            id: element.id,
            x_offset,
            time_signature : JSON.parse(element.dataset.time_signature),
            time_signature_visible : element.dataset.time_signature_visible,
            barline_type: element.dataset.barline_type,
            barline_height,
            repeat_start: element.dataset.repeat_start,
            repeat_end: element.dataset.repeat_end,
            measure_number_visible : element.dataset.measure_number_visible
            
        }

        const container = ui_api.getContainerForElement(element);

        this.fromData(dataObj, container);
    }
    

}

class Measure_IO extends Template.IO_SymbolBase
{
    constructor()
    {
        super();
        this.class = 'Measure';
    }
    
}



module.exports = {
    ui_def: Measure,
    io_def: Measure_IO    
}

