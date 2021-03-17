const Template = require(__symbolist_dirname + '/lib/SymbolTemplate') 

class Part extends Template.SymbolBase 
{
    constructor() {
        super();
        this.class = 'Part';
        this.palette = ['Staff'];
        this.cornerSize = 5;
    }


    get structs () {
        return {

            data: {
                class: this.class,
                id : `${this.class}-0`,
                partName : 'Part'
            },
            
            view: {
                class: this.class,
                id: `${this.class}-0`, 
                x: 0, // left
                y: 0, // top
                height: 100,
                partName: ''
            }
            /*,
            
            children: {
                stafflines: [-2, -1, 0, 1, 2]
            }
            */
        }
    }

    drag(element, pos){}

    display(params) {

        ui_api.hasParam(params, Object.keys(this.structs.view) );
        return [
            {
                new: 'text',
                class: 'Part-name Global-textfont',
                id: `${params.id}-name`,
                x: params.x-5,
                y: params.y + params.height / 2,
                text: params.partName
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
    
    getElementViewParams(element) {

        const vLine = element.querySelector(`#${element.id}-cornerVertical`);
        const nameText = element.querySelector('.display .Part-name');
        const x = parseFloat(vLine.getAttribute('x1'));
        const y = parseFloat(vLine.getAttribute('y1'));
        const height = parseFloat(vLine.getAttribute('y2')) - y;
        const partName = nameText.getAttribute('child');

        return {
            id: element.id,
            x,
            y,
            height,
            partName
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
                partName: 'p'
            })
        }
    }

    /**
     * 
     * @param {Element} this_element instance of this element
     * @param {Object} child_data child data object, requesting information about where to put itself
     */
    childDataToViewParams(this_element, child_data) {
        return child_data;
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

