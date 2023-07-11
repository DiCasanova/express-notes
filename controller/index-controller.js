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
            dark: true
        });
    };

    edit(req, res) {
        res.render("edit")
    }

    edit_submit(req, res) {
        console.log(req.body);
        noteStore.add(req.body.title, req.body.importance, req.body.due_date, req.body.finished, req.body.description)
        res.status(200);
        res.send("Success!");
    }
}

export const indexController = new IndexController();
