import Datastore from 'nedb-promises'

class Note {
    constructor(title, importance, dueDate, finished, description) {
        this.title = title;
        this.importance = importance;
        this.creationDate = new Date();
        this.dueDate = dueDate;
        this.finished = finished;
        this.description = description;
    }
}

class NoteStore {
    constructor(db) {
        const options = process.env.DB_TYPE === "FILE" ? {filename: './data/notes.db', autoload: true} : {}
        this.db = db || new Datastore(options);
    }

    async get(id) {
        return this.db.findOne({_id: id});
    }

    async getAll() {
        return this.db.find({});
    }

    async add(title, importance, dueDate, finished, description) {
        let note = new Note(title, importance, dueDate, finished, description);
        return this.db.insert(note);
    }

    async update(id, title, importance, dueDate, finished, description) {
        return this.db.update({_id: id},
            {$set: {
                title: title,
                    importance: importance,
                    dueDate: dueDate,
                    finished: finished,
                    description: description
            }},
            { });
    }
}

export const noteStore = new NoteStore();