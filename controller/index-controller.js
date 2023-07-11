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
}

export const indexController = new IndexController();
