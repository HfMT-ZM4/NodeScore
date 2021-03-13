const Template = require(__symbolist_dirname + '/lib/SymbolTemplate') 

class NS_Clef extends Template.SymbolBase 
{
    constructor() {
        super();
        this.class = "NS_Clef";
    }


    get structs () {
        return {

            data: {
                class: this.class,
                id : `${this.class}-0`,
                clef_anchor : -1,
                clef : "G"
            },
            
            view: {
                class: this.class,
                id: `${this.class}-0`, 
                clef_glyph : "&#xE050",
                x: 100,
                y: 100
            }
        }
    }

    drag(element, pos){}

    display(params) {

        ui_api.hasParam(params, Object.keys(this.structs.view) );
        
        return [
            {
                new: "text",
                class: 'NS_Clef-clef',
                id: `${params.id}-clef`,
                child: params.clef_glyph,
                x: params.x,
                y: params.y
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
            val: {
                new: "text",
                id: `${this.class}-palette-icon`,
                class: "NS_Clef-clef",
                x: 15,
                y: 25,
                child : "&#xE050",
                "style": {
                    "font-size" : "18px"
                }
            }
        }
    }


}

class NS_Clef_IO extends Template.IO_SymbolBase
{
    constructor()
    {
        super();
        this.class = "NS_Clef";
    }
    
}



module.exports = {
    ui_def: NS_Clef,
    io_def: NS_Clef_IO    
}

