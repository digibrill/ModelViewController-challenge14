let devnoteTitle;
let devnoteText;
let saveDevnoteBtn;
let newDevnoteBtn;
let devnoteList;

if (window.location.pathname === '/devnotes') {
  devnoteTitle = document.querySelector('.note-title');
  devnoteText = document.querySelector('.note-textarea');
  saveDevnoteBtn = document.querySelector('.save-note');
  newDevnoteBtn = document.querySelector('.new-note');
  devnoteList = document.querySelectorAll('.list-group');
  //devnoteList = document.querySelectorAll('.list-container .list-group');
}

// Show an element
const show = (elem) => {
  elem.style.display = 'inline';
};

// Hide an element
const hide = (elem) => {
  elem.style.display = 'none';
};

// activeNote is used to keep track of the note in the textarea
let activeDevnote = {};

const getDevnotes = () =>
  fetch('/devnotes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

const saveDevnote = (devnote) =>
  fetch('/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(devnote),
  });

const deleteDevnote = (id) =>
  fetch(`/devnotes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

const renderActiveDevnote = () => {
  hide(saveDevnoteBtn);

  if (activeDevnote.id) {
    console.log('test');
    devnoteTitle.setAttribute('readonly', true);
    devnoteText.setAttribute('readonly', true);
    devnoteTitle.value = activeDevnote.title;
    devnoteText.value = activeDevnote.text;
  } else {
    devnoteTitle.removeAttribute('readonly');
    devnoteText.removeAttribute('readonly');
    devnoteTitle.value = '';
    devnoteText.value = '';
  }
};

const handleDevnoteSave = () => {
  const newDevnote = {
    title: devnoteTitle.value,
    text: devnoteText.value,
  };
  saveNote(newDevnote).then(() => {
    getAndRenderDevnotes();
    renderActiveDevnote();
  });
};

// Delete the clicked note
const handleDevnoteDelete = (e) => {
  // Prevents the click listener for the list from being called when the button inside of it is clicked
  e.stopPropagation();

  const devnote = e.target;
  const devnoteId = JSON.parse(devnote.parentElement.getAttribute('data-note')).id;

  if (activeDevnote.id === devnoteId) {
    activeDevnote = {};
  }

  deleteDevnote(devnoteId).then(() => {
    getAndRenderDevnotes();
    renderActiveDevnote();
  });
};

// Sets the activeNote and displays it
const handleDevnoteView = (e) => {
  e.preventDefault();
  activeDevnote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  renderActiveNote();
};

// Sets the activeNote to and empty object and allows the user to enter a new note
const handleNewDevnoteView = (e) => {
  activeDevnote = {};
  renderActiveNote();
};

const handleRenderSaveBtn = () => {
  if (!devnoteTitle.value.trim() || !devnoteText.value.trim()) {
    hide(saveDevnoteBtn);
  } else {
    show(saveDevnoteBtn);
  }
};

// Render the list of note titles
const renderDevnoteList = async (devnotes) => {
  let jsonDevnotes = await devnotes.json();
  if (window.location.pathname === '/notes') {
    devnoteList.forEach((el) => (el.innerHTML = ''));
  }

  let noteListItems = [];

  // Returns HTML element with or without a delete button
  const createLi = (text, delDevnoteBtn = true) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');

    const spanEl = document.createElement('span');
    spanEl.classList.add('list-item-title');
    spanEl.innerText = text;
    spanEl.addEventListener('click', handleDevnoteView);

    liEl.append(spanEl);

    if (delDevnoteBtn) {
      const delDevnoteBtnEl = document.createElement('i');
      delDevnoteBtnEl.classList.add(
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-note'
      );
      delDevnoteBtnEl.addEventListener('click', handleDevnoteDelete);

      liEl.append(delDevnoteBtnEl);
    }

    return liEl;
  };

  if (jsonDevnoteNotes.length === 0) {
    devnoteListItems.push(createLi('No saved Notes', false));
  }

  jsonDevnotes.forEach((devnote) => {
    const li = createLi(devnote.title);
    li.dataset.note = JSON.stringify(devnote);

    devnoteListItems.push(li);
  });

  if (window.location.pathname === '/devnotes') {
    devnoteListItems.forEach((devnote) => noteList[0].append(devnote));
  }
};

// Gets devnotes from the db and renders them to the sidebar
const getAndRenderDevnotes = () => getDevnotes().then(renderDevnoteList);

if (window.location.pathname === '/devnotes') {
  saveDevnoteBtn.addEventListener('click', handleDevnoteSave);
  newDevnoteBtn.addEventListener('click', handleNewDevnoteView);
  devnoteTitle.addEventListener('keyup', handleDevnoteRenderSaveBtn);
  devnoteText.addEventListener('keyup', handleDevnoteRenderSaveBtn);
}

getAndRenderDevnotes();
