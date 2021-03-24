const Template = require(__symbolist_dirname + '/lib/SymbolTemplate');

class Score extends Template.SymbolBase {
    constructor() {
        super();
        this.class = 'Score';
        this.palette = ['Part'];
    }

    get structs() {
        return {

            data: {
                class: this.class,
                id: `${this.class}-0`,
                x: 0,
                y: 0,
                width: 800,
                height: 600,
                title: 'Score Title',
                margin_left: 40,
                margin_right: 40,
                margin_top: 40,
                margin_bottom: 40,
                margin_part: 20,
                indent: 50
            },

            view: {
                class: this.class,
                id: `${this.class}-0`,
                x: 5,
                y: 5,
                height: 30,
                width: 30,
                title: '',
                margin_left: 0,
                margin_right: 0,
                margin_top: 0,
                margin_bottom: 0,
                margin_part: 20,
                indent: 20
            },
            
            
            children: {
                data: {
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
        return [{
            new: 'rect',
            id: `${params.id}-rect`,
            class: 'Score-rect',
            x: params.x,
            y: params.y,
            height: params.height,
            width: params.width
        }, {
            new: 'text',
            id: `${params.id}-title`,
            class: 'Score-title Global-textFont',
            x: params.x + params.margin_left,
            y: params.y + params.margin_top,
            child: params.title
        }];

        /**
         * note that we are returning the drawsocket def that will be 
         * displayed in the 'view' group
         * the top level element of the symbol has the root id
         * so here we need to make sure that the id is different
         */

    }

    getElementViewParams(element) {
        // For this element, dataset is identical to view params
        return element.dataset;
    }

    /**
     * note: this container is a 'top level' DURATION container, and so for the moment we are not querying
     * the parent for info, because the here the width is determined by the duration, and the parent
     * is purely graphical, and has no knowledge of duration.
     */

    dataToViewParams(data, container) {

        //console.log('dataToViewParams in Score');
        let viewInData = ui_api.filterByKeys(data, Object.keys(this.structs.view));

        return {
            ...this.structs.view, // defaults
            ...viewInData, // view params passed in from data
            id: data.id
        }

    }

    getPaletteIcon() {
        return {
            key: 'svg',
            val: {
                new: 'text',
                child: 'S',
                class: 'Score-title Global-textFont',
                x: 20,
                y: 30,
                'text-anchor': 'center'
            }
        }
    }

    /**
     * 
     * @param {Element} this_element instance of this element
     * @param {Object} child_data child data object, requesting information about where to put itself
     */
    childDataToViewParams(this_element, child_data) {
        const x = parseFloat(this_element.dataset.x) + parseFloat(this_element.dataset.margin_left) + parseFloat(this_element.dataset.indent);

        const children = this_element.querySelector('.contents').children;
        let y = parseFloat(this_element.dataset.margin_part);
        
        if ( children.length > 0 ) {
            const lastChild = children[children.length-1];
            const lastChildBottom = lastChild.querySelector(`#${lastChild.id}-cornerVertical`).getAttribute('y2');
            y += parseFloat(lastChildBottom);

            const thisChild = this_element.querySelector(`#${child_data.id}`);
            // if the child already exists
            if (thisChild) {
                y -= ui_api.getBBoxAdjusted(thisChild).height + parseFloat(this_element.dataset.margin_part);
            }
        }
        else  {
            const titleText = this_element.querySelector('.Score-title');
            y += ui_api.getBBoxAdjusted(titleText).bottom;
        }
        return {
            x, 
            y
        };


        /*
        // The way to get parent defs:
        let container = ui_api.getContainerForElement(this_element);
        let parentDef = ui_api.getDefForElement(container);
        //return parentDef.childDataToViewParams(container, child_data);
        */
    }

    viewParamsToData(viewParams, container) {}

    childViewParamsToData(this_element, child_viewParams) {}


    /**
     * 
     * @param {Element} element 
     * 
     * called after child object has been added in order to adjust 
     * drawing of the container element
     * 
     */
    updateAfterContents(element) {
        const children = element.querySelector('.contents').children;
        const numChildren = children.length;
        const lastChild = children[numChildren-1];
        const partHeight = parseFloat(lastChild.querySelector(`#${lastChild.id}-cornerVertical`).getAttribute('y2'));
        return {
            height: partHeight + element.dataset.margin_bottom - element.dataset.y
        }
    }

    //updateFromDataset(element) {

        /**
         * here is where we might want to change the x_ and y_ params
         * for mapping the children
         */

    //}



}

class Score_IO extends Template.IO_SymbolBase {
    constructor() {
        super();
        this.class = 'Score';
    }

}


module.exports = {
    ui_def: Score,
    io_def: Score_IO
}

