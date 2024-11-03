document.addEventListener('DOMContentLoaded', () => {
    const notesContainer = document.getElementById('notesContainer');
    const addNoteButton = document.querySelector('.add-note-btn');
    const apiUrl = 'http://localhost:5000'; // Update to the correct endpoint

    // Fetch and display all notes
    async function fetchNotes() {
        const token = localStorage.getItem('token'); // Get token from local storage
        if (!token) {
            window.location.href = 'login.html'; // Redirect to login if not authenticated
            return;
        }

        try {
            const response = await fetch(apiUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`, // Attach token
                },
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const notes = await response.json();
            displayNotes(notes);
        } catch (error) {
            console.error('Error fetching notes:', error);
            alert('Failed to fetch notes. Please try again later.');
        }
    }

    // Display notes in the UI
    function displayNotes(notes) {
        notesContainer.innerHTML = '';
        notes.forEach((note) => {
            const noteCard = document.createElement('div');
            noteCard.classList.add('note-card');

            noteCard.innerHTML = `
                <h3>${note.title}</h3>
                <p>${note.description}</p>
                <div class="note-footer">
                    <span class="date">${new Date(note.date).toLocaleDateString()}</span>
                    <div class="actions">
                        <button onclick="editNote('${note._id}')">✏️</button>
                        <button onclick="deleteNote('${note._id}')">🗑️</button>
                    </div>
                </div>
            `;
            notesContainer.appendChild(noteCard);
        });
    }

    // Add a new note     
    addNoteButton.addEventListener('click', async () => {
        const title = prompt("Enter note title:");
        const description = prompt("Enter note description:");
        const token = localStorage.getItem('token');

        if (title && description && token) {
            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`, // Attach token
                    },
                    body: JSON.stringify({ title, description }),
                });
                if (response.ok) {
                    alert('Note added successfully!');
                    fetchNotes();
                } else {
                    throw new Error('Failed to add note');
                }
            } catch (error) {
                console.error('Error adding note:', error);
                alert('Error adding note. Please try again.');
            }
        }
    });

    // Edit an existing note
    window.editNote = async (id) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch(`${apiUrl}/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const note = await response.json();
            const newTitle = prompt("Edit note title:", note.title);
            const newDescription = prompt("Edit note description:", note.description);

            if (newTitle !== null && newDescription !== null) {
                const updateResponse = await fetch(`${apiUrl}/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`, // Attach token
                    },
                    body: JSON.stringify({ title: newTitle, description: newDescription }),
                });
                if (updateResponse.ok) {
                    alert('Note updated successfully!');
                    fetchNotes();
                } else {
                    throw new Error('Failed to update note');
                }
            }
        } catch (error) {
            console.error('Error updating note:', error);
            alert('Error updating note. Please try again.');
        }
    };

    // Delete a note
    window.deleteNote = async (id) => {
        const token = localStorage.getItem('token');
        if (confirm("Are you sure you want to delete this note?") && token) {
            try {
                const deleteResponse = await fetch(`${apiUrl}/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Attach token
                    },
                });
                if (deleteResponse.ok) {
                    alert('Note deleted successfully!');
                    fetchNotes();
                } else {
                    throw new Error('Failed to delete note');
                }
            } catch (error) {
                console.error('Error deleting note:', error);
                alert('Error deleting note. Please try again.');
            }
        }
    };

    // Initial fetch of notes on page load
    fetchNotes();
});
