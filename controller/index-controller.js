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
            obj.dueDate = element.dueDate;
            obj.daysUntilDueDate = 'in ' + Math.ceil((new Date(element.dueDate) - new Date()) / (1000 * 60 * 60 * 24)) + ' day(s)';
            obj.creationDate = element.creationDate;
            obj.importance = element.importance;
            obj.importanceSym = "🗲 ".repeat(element.importance);
            obj.title = element.title;
            obj.description = element.description
            obj.finished = element.finished;
            list.push(obj);
        });

        list.sort((a,b) => {
            switch (req.userSettings.orderBy) {
                case "title":
                    let ta = a.title.toLowerCase(),
                        tb = b.title.toLowerCase();
                    if(ta < tb)
                        return req.userSettings.orderDirection;
                    if(ta > tb)
                        return -1 * req.userSettings.orderDirection;
                    return 0;
                case "due_date":
                    let da = new Date(a.dueDate),
                        db = new Date(b.dueDate);
                    return req.userSettings.orderDirection * (db - da);
                case "creation_date":
                    return req.userSettings.orderDirection * (b.creationDate - a.creationDate);
                case "importance":
                    return req.userSettings.orderDirection * (b.importance - a.importance);
            }
        })

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

}

export const indexController = new IndexController();
