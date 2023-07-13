import {noteStore} from "../services/note-store.js";

export class IndexController {
    index(req, res) {
        //determine days until due date and replace importance by lightning symbol for each element in list
        let list = [];
        noteStore.getAll().forEach((element) => {
            if(req.session?.filterActive && element.finished)
                return;
            let obj = {};
            obj.id = element.id;
            obj.daysUntilDueDate = 'in ' + Math.ceil((new Date(element.dueDate) - new Date()) / (1000 * 60 * 60 * 24)) + ' day(s)';
            obj.importanceSym = "🗲 ".repeat(element.importance);
            obj.title = element.title;
            obj.description = element.description
            obj.finished = element.finished;
            list.push(obj);
        });
        //render index page
        res.render("index", {
            entries: list,
            dark: false
        });
    };

    newNote(req, res) {
        res.render("edit")
    }

    showNote(req, res) {
        let entry = noteStore.get(req.params.id);
        console.log(entry);
        res.render("edit", {
            entry: entry,
            dark: false
        });
    }

    async createNote(req, res) {
        if('create_button' in req.body) {
            let id = await noteStore.add(req.body.title, req.body.importance, req.body.due_date, req.body.finished, req.body.description)
            res.redirect(303, '/edit/'+id);
        }
        else if('create_ov_button' in req.body)
        {
            await noteStore.add(req.body.title, req.body.importance, req.body.due_date, req.body.finished, req.body.description)
            res.redirect(303, '/');
        }
        else if('ov_delete_button' in req.body)
        {
            res.redirect(303, '/');
        }
    }

    updateNote(req, res) {
        if('create_button' in req.body) {
            noteStore.update(req.params.id, req.body.title, req.body.importance, req.body.due_date, req.body.finished, req.body.description)
            res.redirect(303, '/edit/'+req.params.id);
        }
        else if('create_ov_button' in req.body)
        {
            noteStore.update(req.params.id, req.body.title, req.body.importance, req.body.due_date, req.body.finished, req.body.description)
            res.redirect(303, '/');
        }
        else if('ov_delete_button' in req.body)
        {
            noteStore.delete(req.params.id)
            res.redirect(303, '/');
        }
    }

    filter(req, res) {
        req.session.filterActive = !req.session?.filterActive;
        res.redirect(303, '/');
    }

}

export const indexController = new IndexController();
