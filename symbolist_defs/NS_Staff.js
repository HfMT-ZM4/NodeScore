const Template = require(__symbolist_dirname + '/lib/SymbolTemplate') 


class NS_Staff extends Template.SymbolBase 
{
    constructor() {
        super();
        this.class = "NS_Staff";
        this.palette = ["NS_Clef", "TextSymbol"];
        this.staffLineSpacing = 24 / 4;
    }


    get structs () {
        return {

            data: {
                class: this.class,
                id : `${this.class}-0`,
                stafflines : [-2, -1, 0, 1, 2],
                length : 500,
                x: 100,
                y: 100
            },
            
            view: {
                class: this.class,
                id: `${this.class}-0`, 
                stafflines : [0],
                x: 100,
                length: 500,
                y: 100
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

        ui_api.hasParam(params, Object.keys(this.structs.view) );
        let stafflines_d = "";
        params.stafflines.forEach(i => {
            stafflines_d += `M ${params.x} ${params.y + i * this.staffLineSpacing} H ${params.x + params.length} `;
        });
        return [
            {
                new: "path",
                class: 'NS_Staff-stafflines',
                id: `${params.id}-stafflines`,
                d: stafflines_d
            }
        ]

        /**
         * note that we are returning the drawsocket def that will be
         * displayed in the "view" group
         * the top level element of the symbol has the root id
         * so here we need to make sure that the id is different
         */

    }
    

    getPaletteIcon() {
        return {
            key: "svg",
            val: this.display({
                id: `${this.class}-palette-icon`,
                class: this.class,
                x: 5,
                y: 20,
                length: 30,
                stafflines : [-2, -1, 0, 1, 2]
            })
        }
    }

    childDataToViewParams(this_element, child_data) {

        const x = parseFloat(this_element.getAttribute('data-x'));
        const y = parseFloat(this_element.getAttribute('data-y')) - child_data.clef_anchor * this.staffLineSpacing;

        const glyphs = {
            G: "&#xE050",
            C: "&#xE05C",
            F: "&#xE062",
            G8vb: "&#xE052",
            perc: "&#xE069"
        }
        
        return {
            x,
            y,
            clef_glyph: glyphs[child_data.clef]
        }
    }

    childViewParamsToData(this_element, child_viewParams) {

        if (ui_api.hasParam(child_viewParams, ["x", "y"])) {
            
            const y = parseFloat(this_element.getAttribute('data-y'));

            return {
                clef_anchor: Math.round((y-child_viewParams.y)/6)
            }
        }

    }

}

class NS_Staff_IO extends Template.IO_SymbolBase
{
    constructor()
    {
        super();
        this.class = "NS_Staff";
    }
    
}



module.exports = {
    ui_def: NS_Staff,
    io_def: NS_Staff_IO    
}

