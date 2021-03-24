const Template = require(__symbolist_dirname + '/lib/SymbolTemplate') 

class Part extends Template.SymbolBase 
{
    constructor() {
        super();
        this.class = 'Part';
        this.palette = ['Measure'];
        this.cornerSize = 5;
    }


    get structs () {
        return {

            data: {
                class: this.class,
                id : `${this.class}-0`,
                part_name : 'Part'
            },
            
            view: {
                class: this.class,
                id: `${this.class}-0`, 
                x: 0, // left
                y: 0, // top
                height: 100,
                part_name: ''
            }
        }
    }

    drag(element, pos){}

    display(params) {

        ui_api.hasParam(params, Object.keys(this.structs.view) );
        return [
            {
                new: 'text',
                class: 'Part-name Global-textFont',
                id: `${params.id}-name`,
                x: params.x-5,
                y: params.y + params.height / 2,
                text: params.part_name
            },
            {
                new: 'line',
                class: 'Part-corner',
                id: `${params.id}-cornerHorizontalTop`,
                x1: params.x,
                x2: params.x + this.cornerSize,
                y1: params.y,
                y2: params.y
            },
            {
                new: 'line',
                class: 'Part-corner',
                id: `${params.id}-cornerHorizontalBottom`,
                x1: params.x,
                x2: params.x + this.cornerSize,
                y1: params.y + params.height,
                y2: params.y + params.height
            },
            {
                new: 'line',
                class: 'Part-corner',
                id: `${params.id}-cornerVertical`,
                x1: params.x,
                x2: params.x,
                y1: params.y,
                y2: params.y + params.height
            }
        ]

        /**
         * note that we are returning the drawsocket def that will be
         * displayed in the 'view' group
         * the top level element of the symbol has the root id
         * so here we need to make sure that the id is different
         */

    }

    fromData(dataObj, container, preview = false)
    {
        //console.log('container', container, dataObj);
        // merging with defaults in case the user forgot to include something
        const data_union = {
            ...this.structs.data,
            ...dataObj
        };
        const viewParams = this.dataToViewParams(data_union, container);
        const viewObj = this.display(viewParams);  
        const drawObj = (preview ? 
            ui_api.svgPreviewFromViewAndData(viewObj, data_union) : 
            ui_api.svgFromViewAndData(viewObj, data_union) );
        ui_api.drawsocketInput( drawObj );
        
        /*
        //automatically create a new measure
        const thisElement = document.getElementById(dataObj.id);
        const measureInit = {
            class: 'Measure',
            id : `${dataObj.id}-defaultMeasure`,
            timeSignature : [4, 4],
            barLineType: 'single',
            repeatStart: false,
            repeatEnd: false
        };
        const measureDef = ui_api.getDef('Measure');
        measureDef.fromData(measureInit, thisElement);
        ui_api.sendToServer({
            key: "data",
            val: measureInit
        });
        */
    }
    
    getElementViewParams(element) {

        const vLine = element.querySelector(`#${element.id}-cornerVertical`);
        const nameText = element.querySelector('.display .Part-name');
        const x = parseFloat(vLine.getAttribute('x1'));
        const y = parseFloat(vLine.getAttribute('y1'));
        const height = parseFloat(vLine.getAttribute('y2')) - y;
        const part_name = nameText.innerHTML;
        //console.log('NameText', nameText);
        //console.log('innerhtml', part_name);

        return {
            id: element.id,
            x,
            y,
            height,
            part_name
        }

    }


    getPaletteIcon() {
        return {
            key: 'svg',
            val: this.display({
                id: `${this.class}-palette-icon`,
                class: this.class,
                x: 30,
                y: 0,
                height : 40,
                part_name: 'p'
            })
        }
    }

    /**
     * 
     * @param {Element} this_element instance of this element
     * @param {Object} child_data child data object, requesting information about where to put itself
     */
    childDataToViewParams(this_element, child_data) {
        const viewParams = this.getElementViewParams(this_element);

        return {
            x: viewParams.x,
            y: viewParams.y + viewParams.height / 2
        }
    }
    
    childViewParamsToData(this_element, child_viewParams) {
        
    }
    

}

class Part_IO extends Template.IO_SymbolBase
{
    constructor()
    {
        super();
        this.class = 'Part';
    }
    
}



module.exports = {
    ui_def: Part,
    io_def: Part_IO    
}

