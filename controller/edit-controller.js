import {noteStore} from "../services/note-store.js";

export class EditController {

    newNote(req, res) {
        res.render("edit", {
            dark: req.session?.darkMode
        })
    }

    async showNote(req, res) {
        let entry = await noteStore.get(req.params.id);
        if(entry !== null)
        {
            res.render("edit", {
                entry: entry,
                dark: req.session?.darkMode
            });
        }
        else
        {
            res.sendStatus(404);
        }

    }

    async createNote(req, res) {
        if('ov_button' in req.body)
        {
            res.redirect(303, '/');
            return;
        }

        if(validate(0, req.body.title, req.body.importance, req.body.due_date))
        {
            let note = await noteStore.add(req.body.title, req.body.importance, req.body.due_date, req.body.finished, req.body.description)
            if('create_button' in req.body) {
                res.redirect(303, '/edit/'+note._id);
            }
            else if('create_button_ov' in req.body)
            {
                res.redirect(303, '/');
            }
        }
        else
            res.sendStatus(403);

    }

    updateNote(req, res) {
        if('ov_button' in req.body)
        {
            res.redirect(303, '/');
            return;
        }

        if(validate(req.params.id, req.body.title, req.body.importance, req.body.due_date))
        {
            noteStore.update(req.params.id, req.body.title, req.body.importance, req.body.due_date, req.body.finished, req.body.description)
            if('create_button' in req.body)
            {
                res.redirect(303, '/edit/'+req.params.id);
            }
            if('create_button_ov' in req.body)
            {
                res.redirect(303, '/');
            }
        }
        else
            res.sendStatus(403);

    }
}

function validate(id, title, importance, due_date) {
    if (id === undefined || title === undefined || importance === undefined || due_date === undefined)
        return false;
    if (importance > 5 || importance < 1)
        return false;

    return true;
}


export const editController = new EditController();
