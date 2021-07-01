todoMain();

function todoMain() {
	const DEFAULT_OPTION = "Choose Category";
	let inputElem,
		ulElem,
		inputElem2,
		selectItem,
		dateInput,
		timeInput,
		button,
		sortButton,
		calendar,
		todoList = [],
		shortener;

	getElements();
	addListeners();
	initCalendar();
	load();
	renderRows();
	updateOptions();

	function getElements() {
		inputElem = document.getElementsByTagName("input")[0];
		inputElem2 = document.getElementsByTagName("input")[1];

		selectItem = document.getElementById("filterList");
		dateInput = document.getElementById("dateInput");
		timeInput = document.getElementById("timeInput");
		button = document.getElementById("addbtn");
		sortButton = document.getElementById("sortBtn");
		shortener = document.getElementById("shortenList");
	}

	function addListeners() {
		button.addEventListener("click", onChange, false);
		selectItem.addEventListener("change", multipleFilter, false);
		sortButton.addEventListener("click", sortEntry, false);
		shortener.addEventListener("change", multipleFilter, false);
		document
			.getElementById("todoTable")
			.addEventListener("click", onTableClicked, false);
	}

	function onChange(event) {
		let flag = true;

		let inputValue = inputElem.value;
		let inputValue2 = inputElem2.value;

		inputElem.value = "";
		inputElem2.value = "";

		let dateValue = dateInput.value;
		let timeValue = timeInput.value;

		dateInput.value = "";
		timeInput.value = "";

		let obj = {
			id: _uuid(),
			todo: inputValue,
			category: inputValue2,
			done: false,
			date: dateValue,
			time: timeValue,
		};

		renderRow(obj);
		todoList.push(obj);
		save();

		updateOptions();
	}

	function filterEntries() {
		let selection = selectItem.value;

		//Empty the table,keeping the 1st row

		clearTable();

		if (selection == DEFAULT_OPTION) {
			todoList.forEach((obj) => renderRow(obj));
		} else {
			todoList.forEach((obj) => {
				if (obj.category == selection) {
					renderRow(obj);
				}
			});
		}
	}

	function updateOptions() {
		let options = [];

		todoList.forEach((obj) => {
			options.push(obj.category);
		});

		let optionSet = new Set(options);

		selectItem.innerHTML = "";

		let newoptionElem = document.createElement("option");
		newoptionElem.value = DEFAULT_OPTION;
		newoptionElem.innerText = DEFAULT_OPTION;
		selectItem.appendChild(newoptionElem);

		//options.forEach((option)=>{
		for (let option of optionSet) {
			let newoptionElem = document.createElement("option");
			newoptionElem.value = option;
			newoptionElem.innerText = option;
			selectItem.appendChild(newoptionElem);
		}

		//});
	}

	function save() {
		let stringified = JSON.stringify(todoList);
		localStorage.setItem("todoList", stringified);
	}

	function load() {
		let retrieved = localStorage.getItem("todoList");
		todoList = JSON.parse(retrieved);

		if (todoList == null) todoList = [];
	}

	function renderRows() {
		todoList.forEach((todoObj) => {
			renderRow(todoObj);
		});
	}

	function renderRow({
		todo: inputValue,
		category: inputValue2,
		id,
		date,
		time,
		done,
	}) {
		//let {todo: inputValue,category: inputValue2} =obj;

		//add new row
		let table = document.getElementById("todoTable");
		let trElem = document.createElement("tr");
		table.appendChild(trElem);

		//add checkcell

		let checkboxElem = document.createElement("input");
		checkboxElem.type = "checkbox";
		checkboxElem.addEventListener("click", checkboxcallBack, false);
		checkboxElem.dataset.id = id;
		let tdElem = document.createElement("td");
		tdElem.appendChild(checkboxElem);
		trElem.appendChild(tdElem);

		//date cell

		let dateElem = document.createElement("td");

		//date format
		let dateObj = new Date(date);
		let formattedDate = dateObj.toLocaleString("en-GB", {
			month: "long",
			day: "numeric",
			year: "numeric",
		});
		dateElem.innerText = formattedDate;
		trElem.appendChild(dateElem);

		//time cell

		let timeElem = document.createElement("td");
		timeElem.innerText = time;
		trElem.appendChild(timeElem);

		//to-do cell

		let tdElem2 = document.createElement("td");
		tdElem2.innerText = inputValue;
		trElem.appendChild(tdElem2);

		//category cell

		let tdElem3 = document.createElement("td");
		tdElem3.innerText = inputValue2;
		trElem.appendChild(tdElem3);

		//delete cell

		let spantr = document.createElement("span");
		spantr.innerText = "delete";
		spantr.className = "material-icons";
		spantr.addEventListener("click", deleteItem, false);
		spantr.dataset.id = id;
		let tdElem4 = document.createElement("td");
		tdElem4.appendChild(spantr);
		trElem.appendChild(tdElem4);

		checkboxElem.type = "checkbox";
		checkboxElem.checked = done;
		if (done) {
			trElem.classList.add("strike");
		} else {
			trElem.classList.remove("strike");
		}

		addEvent({
			id: id,
			title: inputValue,
			start: date,
		});

		//For edit on cell
		dateElem.dataset.editable = true;
		timeElem.dataset.editable = true;
		tdElem2.dataset.editable = true;
		tdElem3.dataset.editable = true;

		dateElem.dataset.type = "date";
		dateElem.dataset.value = date;
		timeElem.dataset.type = "time";
		tdElem2.dataset.type = "todo";
		tdElem3.dataset.type = "category";

		dateElem.dataset.id = id;
		timeElem.dataset.id = id;
		tdElem2.dataset.id = id;
		tdElem3.dataset.id = id;

		function deleteItem() {
			trElem.remove();
			updateOptions();
			for (let i = 0; i < todoList.length; i++) {
				if (todoList[i].id == this.dataset.id) todoList.splice(i, 1);
			}

			save();

			//remove from calendar
			calendar.getEventById(this.dataset.id).remove();
		}

		function checkboxcallBack() {
			trElem.classList.toggle("strike");
			for (let i = 0; i < todoList.length; i++) {
				if (todoList[i].id == this.dataset.id)
					todoList[i]["done"] = this.checked;
			}
			//array element["done"] =this.checked
			//console.log(this.checked);

			save();
		}
	}

	function _uuid() {
		var d = Date.now();
		if (
			typeof performance !== "undefined" &&
			typeof performance.now === "function"
		) {
			d += performance.now(); //use high-precision timer if available
		}
		return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
			/[xy]/g,
			function (c) {
				var r = (d + Math.random() * 16) % 16 | 0;
				d = Math.floor(d / 16);
				return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
			}
		);
	}

	function sortEntry() {
		console.log(todoList);
		todoList.sort((a, b) => {
			let aDate = Date.parse(a.date);
			let bDate = Date.parse(b.date);
			return aDate - bDate;
		});

		clearTable();

		save();

		let table = document.getElementById("todoTable");
		// table.innerHTML = `  <tr>
		//     <td></td>
		//     <td>Date</td>
		//     <td>Time</td>
		//     <td>To-do list</td>
		//     <td>
		//         <select id="filterList">
		//             <option value=""></option>

		//         </select>
		//     </td>
		//     <td></td>
		// </tr>`;

		renderRows();
	}

	function clearTable() {
		let trElems = document.getElementsByTagName("tr");
		for (let i = trElems.length - 1; i > 0; i--) {
			trElems[i].remove();
		}

		calendar.getEvents().forEach((event) => event.remove());
	}

	function initCalendar() {
		var calendarEl = document.getElementById("calendar");
		calendar = new FullCalendar.Calendar(calendarEl, {
			initialView: "dayGridMonth",
			initialDate: "2021-06-07",
			headerToolbar: {
				left: "prev,next today",
				center: "title",
				right: "dayGridMonth,timeGridWeek,timeGridDay",
			},
			events: [],
		});

		calendar.render();
	}

	function addEvent(event) {
		calendar.addEvent(event);
	}

	function shortenList() {
		clearTable();
		if (shortener.checked) {
			let filteredArray = todoList.filter((obj) => obj.done == false);
			filteredArray.forEach(renderRow);

			filteredArray = todoList.filter((obj) => obj.done == true);
			filteredArray.forEach(renderRow);
		} else {
			todoList.forEach(renderRow);
		}
	}

	function multipleFilter() {
		let selection = selectItem.value;

		//Empty the table,keeping the 1st row

		clearTable();

		if (selection == DEFAULT_OPTION) {
			if (shortener.checked) {
				let filteredArray = todoList.filter((obj) => obj.done == false);
				filteredArray.forEach(renderRow);

				filteredArray = todoList.filter((obj) => obj.done == true);
				filteredArray.forEach(renderRow);
			} else {
				todoList.forEach(renderRow);
			}
		}

		//For Work changing color
		else if (selection == "Work") {
			let filterCategory = todoList.filter(
				(obj) => obj.category == selection
			);
			if (shortener.checked) {
				let filteredArray = filterCategory.filter(
					(obj) => obj.done == false
				);
				filteredArray.forEach(renderRow);

				filteredArray = filterCategory.filter(
					(obj) => obj.done == true
				);
				filteredArray.forEach(renderRow);
			} else {
				filterCategory.forEach(renderRow);
			}
		} else {
			let filterCategory = todoList.filter(
				(obj) => obj.category == selection
			);
			if (shortener.checked) {
				let filteredArray = filterCategory.filter(
					(obj) => obj.done == false
				);
				filteredArray.forEach(renderRow);

				filteredArray = filterCategory.filter(
					(obj) => obj.done == true
				);
				filteredArray.forEach(renderRow);
			} else {
				filterCategory.forEach(renderRow);
			}
		}
	}

	function onTableClicked(event) {
		if (
			event.target.matches("td") &&
			event.target.dataset.editable == "true"
		) {
			let tempInputElem;
			switch (event.target.dataset.type) {
				case "date":
					tempInputElem = document.createElement("input");
					tempInputElem.type = "date";
					tempInputElem.value = event.target.dataset.value;
					break;
				case "time":
					tempInputElem = document.createElement("input");
					tempInputElem.type = "time";
					tempInputElem.value = event.target.innerText;
					break;
				case "todo":
				case "category":
					tempInputElem = document.createElement("input");
					tempInputElem.value = event.target.innerText;
					break;
			}
			event.target.innerText = "";
			event.target.appendChild(tempInputElem);
		}
		function changeInTable() {
			let changedValue = event.target.value;
			let id = event.target.parentNode.dataset.id;

			calendar.getEventById(id).remove();

			todoList.forEach((todoObj) => {
				if (todoObj.id == id) {
					//  todoObj.todo = changedValue;
					todoObj[event.target.parentNode.dataset.type] =
						changedValue;

					addEvent({
						id: id,
						title: todoObj.todo,
						start: todoObj.date,
					});
				}
			});
			save();
			event.target.parentNode.innerText = changedValue;
		}
	}
}
