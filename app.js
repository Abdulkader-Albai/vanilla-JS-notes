const NotesObj = new Notes();
window.onload = getAllNotes;

document.addEventListener('submit', (e) => {
    e.preventDefault();
    let target = e.target;

    if(target && target.classList.contains('add-note')){
        addNote(target);
    }else if(target && target.classList.contains('edit')){
        let note = {
            id: parseInt(target.dataset.id),
            text: target.querySelector('textarea').value
        };

        updateNote(note);
    }

})


document.addEventListener('click', (e) => {
    let target = e.target;
    if (target && target.classList.contains('delete')) {
        let noteId = parseInt(target.dataset.id);
        deleteNote(noteId);
    }
    else if (target && target.classList.contains('edit')) {
        let noteId = parseInt(target.dataset.id); 
        editNote(target);
    }
})


async function addNote(target) {
    let textarea = target.querySelector('textarea');
    let newNote = textarea.value;
    let add = await NotesObj.add({ text: newNote });
    add.onsuccess = () => textarea.value = '';
    getAllNotes();
}

async function deleteNote(noteId) {
    if (confirm('Are you sure you want to delete the selected note')){

    let deleteRequest = await NotesObj.delete(noteId);
    deleteRequest.onsuccess = () =>{
        document.getElementById('note-' +noteId).remove();
    }
    }else{
    deleteRequest.onerror = () =>{
        alert('Error While delete')
    }
}
}

async function updateNote(note) {
    let updateRequest = await NotesObj.update(note);
}

async function getAllNotes() {
    let request = await NotesObj.all();
    let notesArrayVals = [];
    let notesKeys = [];


    request.onsuccess = () => {
        let cursor = request.result;
       

        if (cursor) {
            notesArrayVals.push(cursor.value);
            console.log(cursor.key)
            notesKeys.push(cursor.key);
            // console.log(cursor.value);
            cursor.continue();
        }
        else {
            console.log(notesArrayVals);
        
           displayNotes(notesArrayVals , notesKeys );
           

    }
}
}


    function displayNotes(notes , notesKeys){
        let ULElement = document.createElement('ul');
        for ( let i= 0 ; i<notes.length ; i++){
            let LIElement = document.createElement('li');
            let note = notes[i];
            let noteId = notesKeys[i];
            console.log(noteId);
            LIElement.className = 'note';
            LIElement.id = 'note-'+ noteId;
            LIElement.innerHTML = ` 
            <div class = "">
            <img src = " imgs/edit-icon.png" class="edit" data-id = "${noteId}" alt =''>
            <img src = " imgs/delete-icon.png" class="delete" data-id="${noteId}" alt =''>
            </div>
            <div class= "text"> ${note.text} </div>
            `;
            ULElement.append(LIElement);
        }
        document.getElementById('notes').innerHTML = '';
        document.getElementById('notes').append(ULElement);
    }

async function clearAll(note) {
    let request = await NotesObj.clear();

}

    function editNote(note){
        let noteContainer = document.getElementById('note-'+note.dataset.id);
        let oldText = noteContainer.querySelector('.text').innerText;
        let form = `<form class="update-note" data-id="${note.dataset.id}">
                    <textarea>${oldText}</textarea>
                    <button class="btn" type="submit">Update</button>
                    </form>`;
        noteContainer.innerHTML = form;
    }

    async function updateNote(note){
        let updateRequest = await NotesObj.update(note);
        updateRequest.onsuccess = getAllNotes;
    }




