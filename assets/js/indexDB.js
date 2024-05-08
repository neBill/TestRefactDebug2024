let db;
const request = window.indexedDB.open("NotesDB", 1);

request.onerror = function(event) {
  console.log("Проблема с открытием базы данных:", event);
};

request.onupgradeneeded = function(event) {
  db = event.target.result;
  const objectStore = db.createObjectStore("notes", { keyPath: "id", autoIncrement: true });
  objectStore.createIndex("title", "title", { unique: false });
  console.log("База данных и хранилище объектов созданы.");
};

request.onsuccess = function(event) {
  db = event.target.result;
  console.log("База данных успешно открыта.");
};

function addNote() {

  let title = document.getElementById("newmessage").value;

  let content = 'dron'
  const transaction = db.transaction(["notes"], "readwrite");
  const objectStore = transaction.objectStore("notes");
  const request = objectStore.add({ title: title, content: content });

  request.onsuccess = function(event) {
    console.log("Заметка добавлена в базу данных.");
  };

  request.onerror = function(event) {
    console.log("Ошибка при добавлении заметки:", event);
  };
}

function readNotes() {
  const transaction = db.transaction(["notes"]);
  const objectStore = transaction.objectStore("notes");
  const request = objectStore.openCursor();

  request.onsuccess = function(event) {
    const cursor = event.target.result;
    if (cursor) {
      console.log(`ID: ${cursor.key}, Заголовок: ${cursor.value.title}, Содержимое: ${cursor.value.content}`);
      cursor.continue();
    } else {
      console.log("Все заметки прочитаны.");
    }
  };
}


function deleteNote(id) {
  const transaction = db.transaction(["notes"], "readwrite");
  const objectStore = transaction.objectStore("notes");
  const request = objectStore.delete(id);

  request.onsuccess = function(event) {
    console.log("Заметка удалена.");
  };
}