document.addEventListener('DOMContentLoaded', () => {
    const notesContainer = document.getElementById('notesContainer');
    const addNoteButton = document.querySelector('.add-note-btn');
    let notes = [
        { title: "Fit in a quick workout", date: "1st Jul 2024", content: "Data suggests that active people are more relaxed.", tag: "#workout" },
        { title: "Avoid the snooze button", date: "1st Jul 2024", content: "Hitting the snooze button can be detrimental to your morning.", tag: "#avoidSnooze" },
    ]; // Sample notes

    function displayNotes() {
        notesContainer.innerHTML = '';
        notes.forEach((note, index) => {
            const noteCard = document.createElement('div');
            noteCard.classList.add('note-card');

            noteCard.innerHTML = `
                <h3>${note.title}</h3>
                <p>${note.content}</p>
                <div class="note-footer">
                    <span class="date">${note.date}</span>
                    <div class="actions">
                        <button onclick="editNote(${index})">✏️</button>
                        <button onclick="deleteNote(${index})">🗑️</button>
                    </div>
                </div>
            `;

            notesContainer.appendChild(noteCard);
        });
    }

    // Add new note
    addNoteButton.addEventListener('click', () => {
        const title = prompt("Enter note title:");
        const content = prompt("Enter note content:");
        const date = new Date().toLocaleDateString();

        if (title && content) {
            notes.push({ title, date, content, tag: "" });
            displayNotes();
        }
    });

    // Edit note
    window.editNote = (index) => {
        const note = notes[index];
        const newTitle = prompt("Edit note title:", note.title);
        const newContent = prompt("Edit note content:", note.content);

        if (newTitle !== null && newContent !== null) {
            notes[index] = { ...note, title: newTitle, content: newContent };
            displayNotes();
        }
    };

    // Delete note
    window.deleteNote = (index) => {
        if (confirm("Are you sure you want to delete this note?")) {
            notes.splice(index, 1);
            displayNotes();
        }
    };

    // Initialize notes display
    displayNotes();
});
