import {noteStore} from "../services/note-store.js";
import session from "express-session";

export class IndexController {
    async index(req, res) {
        let allNotes = await noteStore.getAll();

        //sort allNotes and determine sortingStr (used by handlebars)
        sortList(allNotes, req.userSettings.orderBy, req.userSettings.orderDirection)
        let sortingMethodStr = req.userSettings.orderBy + "_";
        sortingMethodStr += req.userSettings.orderDirection === 1 ? "asc":"dsc";

        //data transformation needed by handlebars template
        let list = [];
        allNotes.forEach((element) => {
            if(req.session?.filterActive && element.finished)
                return;
            let obj = {};
            obj.id = element._id;
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
            sort: sortingMethodStr,
            dark: req.session?.darkMode
        });
    };

    newNote(req, res) {
        res.render("edit", {
            dark: req.session?.darkMode
        })
    }

    async showNote(req, res) {
        let entry = await noteStore.get(req.params.id);
        res.render("edit", {
            entry: entry,
            dark: req.session?.darkMode
        });
    }

    async createNote(req, res) {
        if('create_button' in req.body) {
            let note = await noteStore.add(req.body.title, req.body.importance, req.body.due_date, req.body.finished, req.body.description)
            res.redirect(303, '/edit/'+note._id);
        }
        else if('create_ov_button' in req.body)
        {
            await noteStore.add(req.body.title, req.body.importance, req.body.due_date, req.body.finished, req.body.description)
            res.redirect(303, '/');
        }
        else if('ov_button' in req.body)
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
        else if('ov_button' in req.body)
        {
            res.redirect(303, '/');
        }
    }

    filter(req, res) {
        req.session.filterActive = !req.session?.filterActive;
        res.redirect(303, '/');
    }

    sort(req, res) {
        if('title' in req.body)
        {
            req.userSettings.orderBy === 'title' ? req.userSettings.orderDirection = -1 * req.userSettings.orderDirection :  req.userSettings.orderDirection = -1;
            req.userSettings.orderBy = 'title';
        }
        if('due_date' in req.body)
        {
            req.userSettings.orderBy === 'due_date' ? req.userSettings.orderDirection = -1 * req.userSettings.orderDirection :  req.userSettings.orderDirection = -1;
            req.userSettings.orderBy = 'due_date';
        }
        if('creation_date' in req.body)
        {
            req.userSettings.orderBy === 'creation_date' ? req.userSettings.orderDirection = -1 * req.userSettings.orderDirection :  req.userSettings.orderDirection = -1;
            req.userSettings.orderBy = 'creation_date';
        }
        if('importance' in req.body)
        {
            req.userSettings.orderBy === 'importance' ? req.userSettings.orderDirection = -1 * req.userSettings.orderDirection :  req.userSettings.orderDirection = -1;
            req.userSettings.orderBy = 'importance';
        }
        res.redirect(303, '/');
    }

    toggle(req, res) {
        req.session.darkMode = !req.session?.darkMode;
        res.redirect(303, '/');
    }
}

// helper function for sorting
function sortList(list, orderBy, orderDirection) {
    list.sort((a,b) => {
        switch (orderBy) {
            case "title":
                let ta = a.title.toLowerCase(),
                    tb = b.title.toLowerCase();
                if(ta < tb)
                    return orderDirection;
                if(ta > tb)
                    return -1 * orderDirection;
                return 0;
            case "due_date":
                let da = new Date(a.dueDate),
                    db = new Date(b.dueDate);
                return orderDirection * (db - da);
            case "creation_date":
                return orderDirection * (b.creationDate - a.creationDate);
            case "importance":
                return orderDirection * (b.importance - a.importance);
        }
    });
}

export const indexController = new IndexController();
