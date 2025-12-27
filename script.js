const noteTitle = document.getElementById('note-title');
const noteText = document.getElementById('note-text');
const addBtn = document.getElementById('add-note-btn');
const notesGrid = document.getElementById('notes-grid');

const modal = document.getElementById('note-modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const closeModal = document.querySelector('.close-modal');

// Load notes on startup
document.addEventListener('DOMContentLoaded', getNotes);

// Save Note Function
function handleSave() {
    const title = noteTitle.value.trim();
    const text = noteText.value.trim();

    if (!title || !text) {
        alert("Please enter both a title and some text!");
        return;
    }

    const noteObj = {
        id: Date.now(),
        title: title,
        text: text
    };

    createNoteElement(noteObj);
    saveNoteToLocal(noteObj);
    
    noteTitle.value = "";
    noteText.value = "";
}

addBtn.addEventListener('click', handleSave);

// Create Note UI
function createNoteElement({ id, title, text }) {
    const noteDiv = document.createElement('div');
    noteDiv.classList.add('note-card');
    noteDiv.setAttribute('data-id', id);

    // Short preview for the card
    const preview = text.length > 150 ? text.substring(0, 150) + "..." : text;

    noteDiv.innerHTML = `
        <button class="delete-note">&times;</button>
        <h3>${title}</h3>
        <p>${preview}</p>
    `;

    // Open full note in modal
    noteDiv.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-note')) return;
        modalTitle.innerText = title;
        modalBody.innerText = text;
        modal.style.display = "block";
        document.body.style.overflow = "hidden"; // Stop background scrolling
    });

    // Delete Logic
    noteDiv.querySelector('.delete-note').addEventListener('click', (e) => {
        e.stopPropagation();
        noteDiv.remove();
        deleteNoteFromLocal(id);
    });

    notesGrid.appendChild(noteDiv);
}

// Memory Functions
function saveNoteToLocal(note) {
    let notes = localStorage.getItem('keyNotes') ? JSON.parse(localStorage.getItem('keyNotes')) : [];
    notes.push(note);
    localStorage.setItem('keyNotes', JSON.stringify(notes));
}

function getNotes() {
    let notes = localStorage.getItem('keyNotes') ? JSON.parse(localStorage.getItem('keyNotes')) : [];
    notes.forEach(note => createNoteElement(note));
}

function deleteNoteFromLocal(id) {
    let notes = JSON.parse(localStorage.getItem('keyNotes'));
    const filtered = notes.filter(n => n.id !== id);
    localStorage.setItem('keyNotes', JSON.stringify(filtered));
}

// Modal Close Logic
closeModal.onclick = () => {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
}

window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }
}