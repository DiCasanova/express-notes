//import Datastore from '@seald-io/nedb';

class Note {
    constructor(id, title, importance, dueDate, finished, description) {
        this.id = id;
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
            new Note(0,"Geburtstag", 2, "2023-07-20", false,  "blabla1"),
            new Note(1, "Telefon", 3, "2023-07-18", false,  "blabla2"),
            new Note(2, "DiesDas", 4, "2023-07-13", true,  "blabla3"),
        ];
    }

    get(id) {
        return this.dummyNotes[id];
    }

    getAll() {
        return this.dummyNotes;
    }

    async add(title, importance, dueDate, finished, description) {
        this.dummyNotes.push(new Note(this.dummyNotes.length - 1, title, importance, dueDate, finished, description))
        return this.dummyNotes.length - 1;
    }
}

export const noteStore = new NoteStore();