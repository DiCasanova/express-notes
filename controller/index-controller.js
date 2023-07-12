import {noteStore} from "../services/note-store.js";

export class IndexController {
    index(req, res) {
        //determine days until due date and replace importance by lightning symbol for each element in list
        let list = noteStore.getAll();
        list.forEach((element) => {
            element.daysUntilDueDate = Math.ceil((element.dueDate - new Date()) / (1000 * 60 * 60 * 24));
            element.importanceSym = "🗲 ".repeat(element.importance);
        });
        //render index page
        res.render("index", {
            entries: list,
            dark: false
        });
    };

    edit(req, res) {
        if(req.query.id)
        {
            let entry = noteStore.get(req.query.id);
            console.log(entry);
            res.render("edit", {
                entry: entry,
                dark: false
            });
        }
        else
            res.render("edit")

    }

    async edit_submit(req, res) {
        if('create_button' in req.body) {
            let id = await noteStore.add(req.body.title, req.body.importance, req.body.due_date, req.body.finished, req.body.description)
            res.redirect(303, '/edit?id='+id);
        }
        else
        {
            console.log('NOT IMPLEMENTED!')
            res.status(404);
            res.send();
        }
    }
}

export const indexController = new IndexController();
