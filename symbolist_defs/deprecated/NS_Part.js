const Template = require(__symbolist_dirname + '/lib/SymbolTemplate') 

class NS_Part extends Template.SymbolBase 
{
    constructor() {
        super();
        this.class = "NS_Part";
        this.palette = ["NS_Staff"];
    }


    get structs () {
        return {

            data: {
                class: this.class,
                id : `${this.class}-0`,
                index : 0,
                partname : ""
            },
            
            view: {
                class: this.class,
                id: `${this.class}-0`, 
                x: 0,
                y: 0,
                partname: ""
            },
            
            children: {
                stafflines: [-2, -1, 0, 1, 2]
            }
        }
    }

    drag(element, pos){}

    display(params) {

        ui_api.hasParam(params, Object.keys(this.structs.view) );
        
        let path = `M ${params.x + 20} ${params.y} H ${params.x} M ${params.x} ${params.y-5} V ${params.y+5}`;
        return [
            {
                new: "text",
                class: 'NS_Part-name',
                id: `${params.id}-name`,
                x: params.x-5,
                y: params.y+3,
                text: params.partname
            },
            {
                new: "path",
                class: 'NS_Part-corner',
                id: `${params.id}-corner`,
                d: path
            }
        ]

        /**
         * note that we are returning the drawsocket def that will be
         * displayed in the "view" group
         * the top level element of the symbol has the root id
         * so here we need to make sure that the id is different
         */

    }
    
    getElementViewParams(element) {

        const text = element.querySelector('.display .NS_Part-name');
        const x = parseFloat(text.getAttribute('x'))-5;
        const y = parseFloat(text.getAttribute('y'))+3;

        return {
            id: element.id,
            x,
            y
        }

    }


    getPaletteIcon() {
        return {
            key: "svg",
            val: this.display({
                id: `${this.class}-palette-icon`,
                class: this.class,
                x: 20,
                y: 20,
                partname: "p",
                index: 0
            })
        }
    }

    /**
     * 
     * @param {Element} this_element instance of this element
     * @param {Object} child_data child data object, requesting information about where to put itself
     */
    childDataToViewParams(this_element, child_data) {
        return {
            x: child_data.x,
            y: child_data.y
        }
    }

    /**
     * 
     * @param {Element} this_element instance of this element
     * @param {Object} child_viewParams child data object, requesting information about where to put itself
     */
    
    childViewParamsToData(this_element, child_viewParams) {

        if (ui_api.hasParam(child_viewParams, ["x", "y"])) {
            const x_offset = 200;
            const y_offset = 200;

            //const x = parseFloat(this_element.getAttribute('data-x'));
            //const y = parseFloat(this_element.getAttribute('data-y'));
            const index = parseInt(this_element.getAttribute('data-index'));

            return {
                x: x_offset,
                y: y_offset + 100 * index
            }
        }

    }
    

}

class NS_Part_IO extends Template.IO_SymbolBase
{
    constructor()
    {
        super();
        this.class = "NS_Part";
    }
    
}



module.exports = {
    ui_def: NS_Part,
    io_def: NS_Part_IO    
}

