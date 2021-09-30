const Template = require('../SymbolTemplate');
const lib = require('./NodeScoreLib');


class Graphic extends Template.SymbolBase 
{
    constructor() {
        super();
        this.class = 'Graphic';
        this.palette = [];
    }


    get structs () {
        return {

            data: {
                class: this.class,
                id : `${this.class}-0`,
                svg: '{}',
                expression: '[]'
            },
            
            view: {
                class: this.class,
                id: `${this.class}-0`,
                x: 100,
                y: 100,
                svg: '{}'
            }
        }
    }

    //drag(element, pos){}

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
        console.log('params', params);
        ui_api.hasParam(params, Object.keys(this.structs.view) );
        let returnArray = [ {
            new: 'g',
            class: 'Graphic-group',
            id: `${params.id}-group`,
            child: [],
            transform: `translate(${params.x},${params.y})`
        }, {
            new: 'circle',
            class: 'Graphic-ref',
            id: `${params.id}-ref`,
            cx: params.x,
            cy: params.y
        } ];
        let svg;
        if ( ( Array.isArray(params.svg) && params.svg.length == 0 ) || ( typeof params.svg == 'object' && Object.keys(params.svg).length == 0 ) || params.svg == '{}' ) {
            svg = [ {
                new: 'g',
                class: 'Graphic-empty',
                id: `${params.id}-empty`,
                child: [{
                    new: 'rect',
                    x: 0,
                    y: 0,
                    width: 30,
                    height: 30
                }, {
                    new: 'line',
                    x1: 5,
                    x2: 25,
                    y1: 25,
                    y2: 5
                },
                {
                    new: 'line',
                    x1: 5,
                    x2: 25,
                    y1: 5,
                    y2: 25
                }]
            } ];
        }
        else {
            svg = Array.isArray(params.svg) ? params.svg : [params.svg];
        }
        svg.forEach(g => {
            if (!('class' in g)) g.class = 'Graphic-element';
            returnArray[0].child.push(g);
        });

        return returnArray;
    }
    
    getElementViewParams(element) {
        const ref = element.querySelector(`.Graphic-ref`);
        const x = parseFloat(ref.getAttribute('cx'));
        const y = parseFloat(ref.getAttribute('cy'));
        const svg = JSON.parse(element.dataset.svg);
        return {
            id: element.id,
            x,
            y,
            svg
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
                y: 5
            })
        }
    }

    childDataToViewParams(this_element, child_data) {}

    childViewParamsToData(this_element, child_viewParams) {}

}

class Graphic_IO extends Template.IO_SymbolBase
{
    constructor()
    {
        super();
        this.class = 'Graphic';
    }
    
}



module.exports = {
    ui_def: Graphic,
    io_def: Graphic_IO    
}

