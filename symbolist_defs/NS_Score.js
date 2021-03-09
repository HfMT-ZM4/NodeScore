const Template = require(__symbolist_dirname + '/lib/SymbolTemplate');

class NS_Score extends Template.SymbolBase {
    constructor() {
        super();
        this.class = "NS_Score";
        this.palette = ["NS_Part"];

        this.margin = 20;
        this.half_margin = this.margin / 2.;

    }

    get structs() {
        return {

            data: {
                class: this.class,
                id: `${this.class}-0`,
                x: 100,
                y: 100,
                width: 800,
                height: 600
            },

            view: {
                class: this.class,
                id: `${this.class}-0`,
                x: 100,
                y: 100,
                height: 20,
                width: 20
            },

            children: {
                data: {
                    index: 0,
                    partname: ""
                },
                view: {
                    x: 0,
                    y: 0
                }
            }
        }
    }

    drag(element, pos) { }

    display(params) {

        ui_api.hasParam(params, Object.keys(this.structs.view));

        return {
            new: "rect",
            id: `${params.id}-rect`,
            class: 'NS_Score-rect',
            x: params.x,
            y: params.y,
            height: params.height,
            width: params.width
        };

        /**
         * note that we are returning the drawsocket def that will be 
         * displayed in the "view" group
         * the top level element of the symbol has the root id
         * so here we need to make sure that the id is different
         */

    }

    getElementViewParams(element) {

        const rect = element.querySelector('.display .NS_Score-rect');

        return {
            id: element.id,
            x: parseFloat(rect.getAttribute('x')),
            y: parseFloat(rect.getAttribute('y')),
            width: parseFloat(rect.getAttribute('width')),
            height: parseFloat(rect.getAttribute('height'))
        }

    }

    /**
     * note: this container is a "top level" DURATION container, and so for the moment we are not querying
     * the parent for info, because the here the width is determined by the duration, and the parent
     * is purely graphical, and has no knowledge of duration.
     */

    dataToViewParams(data, container) {

        let viewInData = ui_api.filterByKeys(data, Object.keys(this.structs.view));

        return {
            ...this.structs.view, // defaults
            ...viewInData, // view params passed in from data
            id: data.id
        }

    }

    getPaletteIcon() {
        return {
            key: "svg",
            val: this.display({
                ...this.structs.view,
                id: `NS_Score-palette-icon`,
                class: this.class
            })
        }
    }

    /**
     * 
     * @param {Element} this_element instance of this element
     * @param {Object} child_data child data object, requesting information about where to put itself
     */
    childDataToViewParams(this_element, child_data) {
        const x_offset = 100;
        const y_offset = 100;
        
        //const x_offset = parseFloat(this_element.getAttribute('data-x'));
        //const y_offset = parseFloat(this_element.getAttribute('data-y'));
        if (ui_api.hasParam(child_data, ["index", "partname"])) {
            child_data.partname = `Part ${child_data.index+1}`;
            return {
                x: 100 + x_offset,
                y: 100 + y_offset + 100 * child_data.index,
                partname: child_data.partname
            }
        }
    }

    /**
     * 
     * @param {Element} this_element instance of this element
     * @param {Object} child_viewParams child data object, requesting information about where to put itself
     */

    childViewParamsToData(this_element, child_viewParams) {
        const y_offset = 100;
        const index = Math.round((child_viewParams.y-200)/100);
        const y = 100 + y_offset + 100 * index;
        if (ui_api.hasParam(child_viewParams, ["x", "y"])) {
            return {
                index, 
                x: child_viewParams.x,
                y,
            };
        }

    }


    /**
     * 
     * @param {Element} element 
     * 
     * called after child object has been added in order to adjust 
     * drawing of the container element
     * 
     */
    updateAfterContents(element) { }

    updateFromDataset(element) {

        /**
         * here is where we might want to change the x_ and y_ params
         * for mapping the children
         */

    }



}

class NS_Score_IO extends Template.IO_SymbolBase {
    constructor() {
        super();
        this.class = "NS_Score";
    }

}


module.exports = {
    ui_def: NS_Score,
    io_def: NS_Score_IO
}

