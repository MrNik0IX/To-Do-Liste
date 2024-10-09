 //Variable um zu schauen ob bearbeitet wird oder nicht
 let editingTask = null;

 // Modal anzeigen Funktion, um das Modal anzeigen zu lassen
 function showModal() {
   document.getElementById('form').style.display = 'block';
 }

 // Modal schließen Funktion um das Modal zu schließen und Formular zurückzusetzen
 function closeModal() {
   document.getElementById('form').style.display = 'none';
   document.getElementById('form').reset();
   editingTask = null;
   document.querySelector('.modal-title').textContent = 'Create New Task';
   document.getElementById('add').textContent = 'Add';
 }

 function submitTask(event) {
   // Seitenaktualisierung verhindern
   event.preventDefault();
   // Alle Werte aus den Feldern holen via ID
   let title = document.getElementById('titleInput').value;
   let author = document.getElementById('autorInput').value;
   let startDate = document.getElementById('sdateInput').value;
   let endDate = document.getElementById('edateInput').value;
   let description = document.getElementById('descInput').value;
   let category = document.getElementById('categorieInput').value;
   let importance = document.querySelector('input[name="importance"]:checked').value;
   let urgency = document.querySelector('input[name="dringlichkeit"]:checked').value;
   let progress = document.getElementById('erledigtInput').value;

   // Schauen ob alles vorhanden ist
   if (!title || !author || !startDate || !endDate || !description || !category || !importance || !urgency || !progress) {
     alert("All fields must be filled out");
     return;
   }

   // Eingrenzen der Länge der Eingaben
   if (title.length > 50 || author.length > 50 || description.length > 50 || progress > 100) {
     alert("Text fields must be 50 characters or less");
     return;
   }

   // Priorität berechnen
   let priority;
   if (importance === 'true' && urgency === 'true') {
     priority = "Sofort erledigen";
   } else if (importance === 'false' && urgency === 'false') {
     priority = "Weg damit";
   } else if (importance === 'true' && urgency === 'false') {
     priority = "Einplanen und Wohlfühlen";
   } else {
     priority = "Gib es ab";
   }

   // Datum Prüfen mit Datum als Objekt 
   const startDateObj = new Date(startDate);
   const endDateObj = new Date(endDate);
   const today = new Date();
   // Zeit zurücksetzen
   today.setHours(0, 0, 0, 0);

   // Prüfen ob Datum kleiner ist als heute, falls ja dann invalid
   if (startDateObj < today) {
     alert("Start date must be today or later.");
     return;
   }

   // Prüfen ob Enddatum kleiner ist als Startdatum falls ja dann invalid
   if (endDateObj < startDateObj) {
     alert("End date must be after start date.");
     return;
   }

   // Wenn etwas bearbeitet wird und die Variable true gesetzt ist macht es die updateTask-Methode, ansonsten createTask
   if (editingTask) {
     updateTask(editingTask, title, author, startDate, endDate, description, category, priority, progress);
   } else {
     createTask(title, author, startDate, endDate, description, category, priority, progress);
   }
   // Modal wird wieder geschlossen nach Absenden
   closeModal();
 }

 // Funktion um eine Task zu erstellen
 function createTask(title, author, startDate, endDate, description, category, priority, progress) {
   let task = document.createElement('div');
   task.className = 'task';
   // Alle Werte einfügen
   task.innerHTML = `
     <h6>${title}</h6>
     <p>Author: ${author}</p>
     <p>Start Date: ${startDate}</p>
     <p>End Date: ${endDate}</p>
     <p>Description: ${description}</p>
     <p>Category: ${category}</p>
     <p>Priorität: ${priority}</p>
     <p>Progress: ${progress}%</p>
     <input type="image" onclick="deleteTask(this)" src="./Images/deletelogo.png" id="deleteB">
     <input type="image" onclick="editTask(this)" src="./Images/bearbeitenlogo.png" id="editB">
     
   `;
   // Die Taskvariable wird als Kindelement von der tasksdivbox hinzugefügt
   document.getElementById('tasks').appendChild(task);
 }

 // Funktion um eine Aufgabe zu aktualisieren
 function updateTask(taskElement, title, author, startDate, endDate, description, category, priority, progress) {
   taskElement.querySelector('h6').textContent = title;
   taskElement.querySelector('p:nth-of-type(1)').textContent = `Author: ${author}`;
   taskElement.querySelector('p:nth-of-type(2)').textContent = `Start Date: ${startDate}`;
   taskElement.querySelector('p:nth-of-type(3)').textContent = `End Date: ${endDate}`;
   taskElement.querySelector('p:nth-of-type(4)').textContent = `Description: ${description}`;
   taskElement.querySelector('p:nth-of-type(5)').textContent = `Category: ${category}`;
   taskElement.querySelector('p:nth-of-type(6)').textContent = `Priorität: ${priority}`;
   taskElement.querySelector('p:nth-of-type(7)').textContent = `Progress: ${progress}%`;
 }

 // Funktion um eine Task zu löschen
 function deleteTask(button) {
   if (confirm("Are you sure you want to delete this task?")) {
     let taskElement = button.parentElement;
     taskElement.remove();
   }
 }

 // Funktion um eine Task zu bearbeiten
 function editTask(button) {
   let taskElement = button.parentElement;

   document.getElementById('titleInput').value = taskElement.querySelector('h6').textContent;
   document.getElementById('autorInput').value = taskElement.querySelector('p:nth-of-type(1)').textContent.replace('Author: ', '');
   document.getElementById('sdateInput').value = taskElement.querySelector('p:nth-of-type(2)').textContent.replace('Start Date: ', '');
   document.getElementById('edateInput').value = taskElement.querySelector('p:nth-of-type(3)').textContent.replace('End Date: ', '');
   document.getElementById('descInput').value = taskElement.querySelector('p:nth-of-type(4)').textContent.replace('Description: ', '');
   document.getElementById('categorieInput').value = taskElement.querySelector('p:nth-of-type(5)').textContent.replace('Category: ', '');
   
   let priorityText = taskElement.querySelector('p:nth-of-type(6)').textContent.replace('Priorität: ', '');
   if (priorityText === "Sofort erledigen") {
     document.querySelector('input[name="importance"][value="true"]').checked = true;
     document.querySelector('input[name="dringlichkeit"][value="true"]').checked = true;
   } else if (priorityText === "Weg damit") {
     document.querySelector('input[name="importance"][value="false"]').checked = true;
     document.querySelector('input[name="dringlichkeit"][value="false"]').checked = true;
   } else if (priorityText === "Einplanen und Wohlfühlen") {
     document.querySelector('input[name="importance"][value="true"]').checked = true;
     document.querySelector('input[name="dringlichkeit"][value="false"]').checked = true;
   } else {
     document.querySelector('input[name="importance"][value="false"]').checked = true;
     document.querySelector('input[name="dringlichkeit"][value="true"]').checked = true;
   }
   
   document.getElementById('erledigtInput').value = taskElement.querySelector('p:nth-of-type(7)').textContent.replace('Progress: ', '').replace('%', '');

   document.querySelector('.modal-title').textContent = 'Edit Task';
   document.getElementById('add').textContent = 'Update';

   showModal();
   editingTask = taskElement;
 }

 // Funktion um nach Aufgaben zu suchen
 function searchTasks() {
   let input = document.getElementById('searchBar').value.toLowerCase();
   let tasks = document.getElementsByClassName('task');

   for (let i = 0; i < tasks.length; i++) {
     let title = tasks[i].getElementsByTagName('h6')[0].textContent.toLowerCase();
     if (title.includes(input)) {
       tasks[i].style.display = '';
     } else {
       tasks[i].style.display = 'none';
     }
   }
 }