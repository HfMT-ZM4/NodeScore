const Template = require('../SymbolTemplate');
const lib = require('./NodeScoreLib');

class Measure extends Template.SymbolBase 
{
    constructor() {
        super();
        this.class = 'Measure';
        this.palette = ['StaffClef'];
        this.fontSize = 24;
        this.minBarlineHeight = this.fontSize / 2;
    }


    get structs () {
        return {

            data: {
                class: this.class,
                id : `${this.class}-0`,
                index : 0,
                time_signature : [4, 4],
                time_signature_visible : 'auto',
                barline_type: 'single',
                repeat_start: false,
                repeat_end: false,
                measure_number_offset: 1,
                measure_number_visible : 'auto'
            },
            
            view: {
                class: this.class,
                id: `${this.class}-0`,
                x: 0, // left
                y: 0, // middle
                clef_offset: 0, // space for clef + keysig in child
                width: 200,
                barline_height: 10,
                barline_type: 'single',
                time_signature : [4, 4],
                time_signature_visible : 'auto',
                repeat_start: false,
                repeat_end: false,
                measure_number_offset: 1,
                measure_number_visible : 'auto'
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

    drag(element, pos){}

    display(params) {

        ui_api.hasParam(params, Object.keys(this.structs.view) );
        let currentX = params.x;
        //console.log('currentX', currentX);
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

        currentX += params.clef_offset;
        let timeSigVisible = params.time_signature_visible;
        if (timeSigVisible == 'auto') {
            console.error('Error: time_signature_visible is still auto in Measure display()');
            timeSigVisible = true;
        }
        if (timeSigVisible) {
            //if (typeof(params.time_signature) == 'string') params.time_signature = JSON.parse(params.time_signature);
            outputArray.push({
                new: 'g',
                id: `${params.id}-timeSig-group`,
                class: 'Measure-timeSig-group',
                child: [{
                    new: 'text',
                    id: `${params.id}-timeSig-top`,
                    class: 'Measure-timeSig-top Global-musicFont',
                    child: lib.smufl.timeSignature[params.time_signature[0]],
                    x: currentX,
                    y: params.y-this.fontSize/4
                },
                {
                    new: 'text',
                    id: `${params.id}-timeSig-bottom`,
                    class: 'Measure-timeSig-bottom Global-musicFont',
                    child: lib.smufl.timeSignature[params.time_signature[1]],
                    x: currentX,
                    y: params.y+this.fontSize/4
                }]
            });
        }
        
        switch(params.barline_type) {
            // Add codes for other barline types
            case 'hide' : 
                outputArray.push({
                    new: 'line',
                    class: 'Measure-barLine',
                    id: `${params.id}-barLine`,
                    x1: params.x + params.width,
                    x2: params.x + params.width,
                    y1: params.y - params.barline_height / 2,
                    y2: params.y + params.barline_height / 2,
                    style: {
                        'stroke-opacity': 0
                    }
                });
            break;
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

        const ref = element.querySelector(`.Measure-ref`);
        //window.max.outlet("post", 'ref', ref);
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

    getPreviousMeasure(this_element) {
        const container = ui_api.getContainerForElement(this_element);
        const parentDef = ui_api.getDefForElement(container);
        if (parentDef.class == 'Part') {
            const this_data = ui_api.getElementData(this_element, container);
            return parentDef.childGetPreviousMeasure(container, this_data);
        }
    }

    childDataToViewParams(this_element, child_data) {
        const x = this.getElementViewParams(this_element).x;
        const y = this.getElementViewParams(this_element).y;
        //window.max.outlet("post", child_data.id, 'x, y', x, y);
        const staff_line_width = this.getElementViewParams(this_element).width;

        let clef_visible = child_data.clef_visible;
        let key_signature_visible = child_data.key_signature_visible;
        if (this_element.dataset.index != 0) {
            const prevMeasure = this.getPreviousMeasure(this_element);
            const prevStaff = prevMeasure.querySelector('.StaffClef');
            if (clef_visible == 'auto') {
                clef_visible = !(prevStaff.dataset.clef == child_data.clef && prevStaff.dataset.clef_anchor == child_data.clef_anchor);
            }
            if (key_signature_visible == 'auto') {
                key_signature_visible = !(prevStaff.dataset.key_signature == child_data.key_signature && prevStaff.dataset.key_map == child_data.key_map);
            }
        }
        else {
            if (clef_visible == 'auto') clef_visible = true;
            if (key_signature_visible == 'auto') key_signature_visible = true;
        }

        return {
            x,
            y,
            staff_line_width,
            clef_visible,
            key_signature_visible
        }
    }
    
    childViewParamsToData(this_element, child_viewParams) {}
    
    
    
    updateAfterContents( element ) {
        //console.log('Update measure', element.dataset.index);
        const staffLines = element.querySelector('.StaffClef-staff_line-group');
        const barline_height = Math.max(this.minBarlineHeight, ui_api.getBBoxAdjusted(staffLines).bottom - ui_api.getBBoxAdjusted(staffLines).top);
        
        const clefKeyGroup = element.querySelector('.StaffClef-clef_key-group');
        let clef_offset;
        if (clefKeyGroup.childNodes.length == 0) {
            //console.log('No clef keysig');
            clef_offset = 0;
        }
        else {
            clef_offset = ui_api.getBBoxAdjusted(clefKeyGroup).width;
        }

        let dataObj = {
            id: element.id,
            index: element.dataset.index,
            clef_offset,
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

