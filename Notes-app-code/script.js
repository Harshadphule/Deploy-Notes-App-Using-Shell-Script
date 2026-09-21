// Simple Notes — fully client-side, no backend required.
// Notes are persisted in the browser's localStorage.

const STORAGE_KEY = "simple-notes-app";

const notesGrid = document.getElementById("notesGrid");
const emptyState = document.getElementById("emptyState");
const modalOverlay = document.getElementById("modalOverlay");
const noteTitleInput = document.getElementById("noteTitle");
const noteBodyInput = document.getElementById("noteBody");
const addBtn = document.getElementById("addBtn");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");
const deleteBtn = document.getElementById("deleteBtn");

let notes = [];
let activeNoteId = null;

function loadNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    notes = raw ? JSON.parse(raw) : [];
  } catch (e) {
    notes = [];
  }
}

function saveNotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) +
    " " + d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

function render() {
  notesGrid.innerHTML = "";

  if (notes.length === 0) {
    emptyState.classList.remove("hidden");
    notesGrid.classList.add("hidden");
    return;
  }

  emptyState.classList.add("hidden");
  notesGrid.classList.remove("hidden");

  // newest first
  const sorted = [...notes].sort((a, b) => new Date(b.updated) - new Date(a.updated));

  for (const note of sorted) {
    const card = document.createElement("div");
    card.className = "note-card";
    card.addEventListener("click", () => openModal(note.id));

    const title = document.createElement("h3");
    title.textContent = note.title || "(Untitled)";

    const body = document.createElement("p");
    body.textContent = note.body || "";

    const date = document.createElement("div");
    date.className = "note-date";
    date.textContent = formatDate(note.updated);

    card.appendChild(title);
    card.appendChild(body);
    card.appendChild(date);
    notesGrid.appendChild(card);
  }
}

function openModal(id) {
  activeNoteId = id;
  if (id) {
    const note = notes.find((n) => n.id === id);
    noteTitleInput.value = note.title || "";
    noteBodyInput.value = note.body || "";
    deleteBtn.classList.remove("hidden");
  } else {
    noteTitleInput.value = "";
    noteBodyInput.value = "";
    deleteBtn.classList.add("hidden");
  }
  modalOverlay.classList.remove("hidden");
  noteTitleInput.focus();
}

function closeModal() {
  modalOverlay.classList.add("hidden");
  activeNoteId = null;
}

function saveNote() {
  const title = noteTitleInput.value.trim();
  const body = noteBodyInput.value.trim();

  if (!title && !body) {
    closeModal();
    return;
  }

  if (activeNoteId) {
    const note = notes.find((n) => n.id === activeNoteId);
    note.title = title;
    note.body = body;
    note.updated = new Date().toISOString();
  } else {
    notes.push({
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      title,
      body,
      updated: new Date().toISOString(),
    });
  }

  saveNotes();
  render();
  closeModal();
}

function deleteNote() {
  if (!activeNoteId) return;
  notes = notes.filter((n) => n.id !== activeNoteId);
  saveNotes();
  render();
  closeModal();
}

addBtn.addEventListener("click", () => openModal(null));
saveBtn.addEventListener("click", saveNote);
cancelBtn.addEventListener("click", closeModal);
deleteBtn.addEventListener("click", deleteNote);
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modalOverlay.classList.contains("hidden")) closeModal();
});

loadNotes();
render();
