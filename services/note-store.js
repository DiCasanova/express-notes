//import Datastore from '@seald-io/nedb';

class Note {
    constructor(title, importance, dueDate, finished, description) {
        this.title = title;
        this.importance = importance;
        this.dueDate = dueDate;
        this.finished = finished;
        this.description = description;
    }
}

class NoteStore {
    constructor() {
        this.dummyNotes = [
            new Note("Geburtstag", 2, new Date("07/20/2023"), false,  "blabla1"),
            new Note("Telefon", 3, new Date("07/25/2023"), false,  "blabla2"),
            new Note("DiesDas", 4, new Date("07/10/2023"), false,  "blabla3"),
        ];
    }

    get(id) {
        return this.dummyNotes[id];
    }

    getAll() {
        return this.dummyNotes;
    }
}

export const noteStore = new NoteStore();