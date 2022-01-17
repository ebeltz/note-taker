// Dependecncies
const util = require('util');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');


const readNote = util.promisify(fs.readFile);
const writeNote = util.promisify(fs.writeFile);

class Save {
    write(note) {
        return writeNote('./db/db.json', JSON.stringify(note));
    }

    read() {
        return readNote('./db/db.json', 'utf8');
    }

    retrieveNotes() {
        return this.read().then(notes => {
            let parsedNotes;
            try {
                parsedNotes = [].concat(JSON.parse(notes));
            } catch (err) {
                parsedNotes = [];
            }
            return parsedNotes;
        });
    }

    addNote(note) {
        const { title, text } = note;
        if (!title || !text) {
            throw new Error('Both title and text can not be blank');
        }
        // Use a npm package to add unique IDs
        const newNote = { title, text, id: uuidv4() };

        // Retrieve notes, add the new note, update notes
        return this.retrieveNotes()
            .then(notes => [...notes, newNote])
            .then(updatedNotes => this.write(updatedNotes))
            .then(() => newNote);
    }
}

module.exports = new Save();