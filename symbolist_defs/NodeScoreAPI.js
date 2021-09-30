const lib = require('./NodeScoreLib');
class NodeScoreAPI_UI 
{
    constructor()
    {
        this.class = "NodeScoreAPI";
    }
    /*
    changeNoteColor(params)
    {
        let notes = document.querySelectorAll('.symbol.FiveLineStaveEvent');


        notes.forEach( el => {
            ui_api.sendToServer({
                key: "data",
                val: {
                    id: el.id,
                    midi: Number(el.dataset.midi) + params.interval
                }
            })
        });


    }
    */
    /*
    setSelection() {
        const selectedArray = document.querySelectorAll('.symbolist-selected');
        let selectedID = [];
        selectedArray.forEach( el => {
            selectedID.push(el.id);
        });
        ui_api.sendToServer({
            key: 'data',
            val: {
                id: 'selected',
                name: selectedID
            }
        });
    }
    */


    
}

class NodeScoreAPI_IO
{
    constructor()
    {
        this.class = "NodeScoreAPI";
        this.selected = [];
        this.currentContext = [];
        this.copyBuffer = [];
    }
    
    // selection

    updateSelected(params) {
        let id, state;
        if (typeof params.args != 'undefined') {
            const args = Array.isArray(params.args) ? params.args : [params.args];
            if (args.length > 1) {
                id = args[0];
                state = params.state;
            }
        }
        else if (typeof params.id != 'undefined' && typeof params.state != 'undefined') {
            id = params.id;
            state = params.state;
        }
        if (state && !this.selected.includes(id)) this.selected.push(id);
        else if (!state && this.selected.includes(id)) this.selected.splice(this.selected.indexOf(id), 1);
        io_api.outlet({selected: this.selected});
    }

    getSelected() {
        io_api.outlet({selected: this.selected});
    }

    select(params) {
        let id;
        if (typeof params.args != 'undefined') {
            const args = Array.isArray(params.args) ? params.args : [params.args];
            id = args[0];
        }
        else if (typeof params.id != 'undefined') id = params.id;
        this.updateSelected({
            id,
            state: 1
        });
    }

    deselect(params) {
        let id;
        if (typeof params.args != 'undefined') {
            id = (params.args[0] || params.args);
        }
        else if (typeof params.id != 'undefined') id = params.id;
        this.updateSelected({
            id,
            state: 0
        });
    }

    // current context

    updateContext(params) {
        let id, enable;
        if (typeof params.args != 'undefined') {
            const args = Array.isArray(params.args) ? params.args : [params.args];
            if (args.length > 1) {
                id = args[0];
                enable = params.enable;
            }
        }
        else if (typeof params.id != 'undefined' && typeof params.enable != 'undefined') {
            id = params.id;
            enable = params.enable;
        }
        if (enable && !this.currentContext.includes(id)) {
            this.currentContext.push(id);
            io_api.outlet({ currentContext: this.currentContext});
        }
        else if (!enable && this.currentContext.includes(id)) this.currentContext.splice(this.currentContext.indexOf(id), 1);
    }

    getCurrentContext() {
        io_api.outlet({ currentContext: this.currentContext});
    }

    // get element

    getElement(params) {
        let id;
        if (typeof params.id != 'undefined') {
            id = Array.isArray(params.id) ? params.id : [params.id];
        }
        else if (typeof params.args != 'undefined') {
            id = Array.isArray(params.args) ? params.args : [params.args];
        }
        else if (id == '.') {
            id = this.selected;
        }
        const model = io_api.getModel();
        id.forEach(el => {
            if (model.has(el)) {
                io_api.outlet(model.get(el));
            }
            else {
                console.log(`getElement: element ${el} not found`);
            }
        });
    }

    // get / set attributes

    get(params) {
        let id, att;
        const msg = (params.msg || 'get');
        if (typeof params.id != 'undefined') {
            id = params.id;
            if (id == '.' && this.selected.length > 0) id = this.selected[0]; 
        }
        if (typeof params.attribute != 'undefined') att = isArray(params.attribute)? params.attribute : [params.attribute];
        if (typeof params.args != "undefined") {
            const args = Array.isArray(params.args) ? params.args : [params.args];
            if (args.length >= 1) {
                id = args[0];
                if (id == '.' && this.selected.length > 0) id = this.selected[0];
            }
            if (args.length >= 2) {
                att = args.slice(1);
            }
        }
        if (typeof id != 'undefined') {
            const model = io_api.getModel();
            if (model.has(id)) {
                const el = model.get(id);
                let output = {};
                output[msg] = {id}
                if (typeof att == 'undefined') {
                    output[msg] = el;
                }
                else {
                    att.forEach(a => {
                        if (a in el) {
                            output[msg][a] = el[a];
                        }
                        else {
                            console.log(`get: attribute ${a} not found in element ${id}`);
                        }
                    });
                }
                io_api.outlet(output);
            }
            else {
                console.log(`get: element ${id} not found`);
            }
        }
        else {
            console.log('get: id undefined');
        }
    }

    set(params) {
        let id, att, val;
        if (typeof params.args != "undefined") {
            let args = Array.isArray(params.args) ? params.args : [params.args];
            id = [args[0]];
            if (id[0] == '.' && this.selected.length > 0) id = this.selected; 
            args.shift();
            const model = io_api.getModel();
            id.forEach(i => {
                if (model.has(i)) {
                    let el = model.get(i);
                    att = args[0];
                    val = args.slice(1);
                    el[att] = val;
                    io_api.addToModel(el);
                    io_api.sendDataToUI(el);
                    /*
                    io_api.input({
                        key: 'data',
                        val: el
                    });
                    */
                }
                else {
                    console.log(`set: element ${i} not found`);
                }

            })

        }
        /*
        else if (typeof params.args != "undefined") {

        }
        if (typeof params.attribute != 'undefined') att = isArray(params.attribute)? params.attribute : [params.attribute];
        if (typeof params.args != "undefined") {
            const args = Array.isArray(params.args) ? params.args : [params.args];
            if (args.length >= 2) {
                id = args[0];
                att = args.slice(1);
            }
            else {
                console.log('getAttribute: not enough arguments');
            }
        }
        if (typeof id != 'undefined' && typeof att != 'undefined') {
            
            if (model.has(id)) {
                const el = model.get(id);
                let output = {getAttribute: {id: id}};
                att.forEach(a => {
                    if (a in el) {
                        output.getAttribute[a] = el[a];
                    }
                    else {
                        console.log(`getAttribute: attribute ${a} not found in element ${id}`);
                    }
                });
                io_api.outlet(output);
            }
            else {
                console.log(`getAttribute: element ${id} not found`);
            }
        }
        else {
            console.log('getAttribute: id or attribute undefined');
        }
        */
    }
    
    /*
    transpose(params)
    {

        if( typeof params.args != "undefined" )
        {
            let args = Array.isArray(params.args) ? params.args : [ params.args ];

            let interval = Number(args[0]);

            let model = io_api.getModel();

            let updates = [];
            model.forEach( el => {
                if( el.class == "Note" )
                {
                    let data = {
                        ...el,
                        pitch: el.pitch + interval
                    };
                    updates.push(data);
                }
            });
     
            io_api.addToModel(updates);
            io_api.sendDataToUI(updates);
        }

        
    }
    */
    
    // JMSL MaxScore messages

    // get info

    getSelectedNoteInfo() {
        const model = io_api.getModel();
        this.selected.forEach(el => {
            if (model.has(el) && model.get(el).class == 'Note') {
                io_api.outlet({
                    getSelectedNoteInfo: model.get(el)
                });
            }
        });
    }

    /**
     * 
     * @param {Object} params args: index
     */
    getInstrumentName(params) {
        if (typeof params.args != 'undefined') {
            const args = Array.isArray(params.args) ? params.args : [params.args];
            const index = args[0];
            const model = io_api.getModel();
            if (model.has('Score')) {
                const contents = model.get('Score').contents;
                if (contents.length > index) {
                    const id = contents[index].id;
                    this.get({
                        id,
                        attribute: 'part_name',
                        msg: 'getInstrumentName'
                    });
                }
                else {
                    console.log(`getInstrumentName: part number out of range`);
                }
            }
        }
        else {
            console.log('getInstrumentName: please enter part number as argument');
        }
    }

    getTitle() {
        this.get({
            id: 'Score',
            attribute: 'title',
            msg: 'getTitle'
        });
    }

    getSubtitle() {
        this.get({
            id: 'Score',
            attribute: 'subtitle',
            msg: 'getSubtitle'
        });
    }

    getComposer() {
        this.get({
            id: 'Score',
            attribute: 'composer',
            msg: 'getComposer'
        })
    }

    getCopyright() {
        this.get({
            id: 'Score',
            attribute: 'copyright',
            msg: 'getCopyright'
        })
    }

    // set attributes

    setComposer(params) {
        if (typeof params.args != 'undefined') {
            const args = Array.isArray(params.args) ? params.args : [params.args];
            const composer = args[0];
            const model = io_api.getModel();
            if (model.has('Score')) {
                const score = model.get('Score').contents;
                if (contents.length > index) {
                    const id = contents[index].id;
                    this.get({
                        id,
                        attribute: 'part_name',
                        msg: 'getInstrumentName'
                    });
                }
                else {
                    console.log(`getInstrumentName: part number out of range`);
                }
            }
        }
        else {
            console.log('getInstrumentName: please enter part number as argument');
        }
    }

    // select all notes
    selectAll() {
        this.selected = [];
        const model = io_api.getModel();
        model.forEach(el => {
            if (el.class == 'Note') this.selected.push(el.id);
        });
        io_api.outlet({selectAll: this.selected});
    }

    clearSelection() {
        this.selected = [];
        io_api.outlet({clearSelection: []});
    }

    // add data

    addNote(params) {
        const args = Array.isArray(params.args) ? params.args : [params.args];
        let note = {
            class: 'Note'
        };
        if (args.length < 2) {
            console.log('addNote: Not enough arguments');
        }
        else {
            const model = io_api.getModel();
            note.id = 'newNote';
            note.container = 'StaffClef_1_0';
            note.value = Number(args[0]);
            note.pitch = args[1];
            if (args.length > 2) note.amplitude = Number(args[2]);
            if (args.length > 3) note.hold = Number(args[3]);
            console.log(note);
            io_api.addToModel(note);
            io_api.sendDataToUI(note);
        }
    }
    
}


module.exports = {
    ui_def: NodeScoreAPI_UI,
    io_def: NodeScoreAPI_IO
}

