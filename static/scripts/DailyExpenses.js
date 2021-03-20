var isPostBack = false;

function url_string() {
	return document.querySelector('#WEB_API_URL_PART').value;
}

function setUpCollapsible() {  /*********ANIMATION or Effets ************/

	document.querySelectorAll('.tab-header').forEach(header => {
		let classRemoved = false;

		if (header.parentElement.classList.contains("hidden")) {
			header.parentElement.classList.remove('hidden');
			classRemoved = true;
		}

		if (header.hasAttribute("containerId")) {
			let container = document.querySelector(header.getAttribute("containerId"));
			container.setAttribute('style', `height:${container.clientHeight}px;opacity:1;`);
			header.setAttribute('cachedHeight', container.clientHeight);
		}

		if (classRemoved) {
			header.parentElement.classList.toggle('hidden')
		}

	});

	document.querySelectorAll('.tab-header span').forEach(header => {
		header.addEventListener('click', (e) => {
			let container = document.querySelector(header.parentElement.getAttribute("containerId"));

			if (container.clientHeight === 0) {
				container.setAttribute('style', `height:${header.parentElement.getAttribute("cachedHeight")}px;opacity:1;`);
			} else {
				container.setAttribute('style', `height:0px;opacity:0;`);
			}
		})
	});
}

$(function () {

	(function defaultLoad() { // daily expenses menu
		showProgreesBar();
		bindCategories('#selectDailyExpenesCategory') // bind the drop down
		document.querySelector('#txtCreateDate').value = yyyy_mm_dd();
		getDailyExpenses();
	})();

	document.getElementById('btnDailyExpenses').addEventListener('click', function (event) {
		showProgreesBar();
		saveDailyExpenses();
	});

	document.getElementById('btn_DailyExpensesCategories').addEventListener('click', function (event) {
		showProgreesBar();
		saveDailyExpensesCategory();
	});

	document.getElementById('DEC').addEventListener('click', function (event) {
		toggleMenuBar(document.querySelector('.header-right'));
		activateMenuAndContentArea(this);
		showProgreesBar();
		getDailyExpensesCategory();
	});

	document.getElementById('DE').addEventListener('click', function (event) {
		toggleMenuBar(document.querySelector('.header-right'));
		activateMenuAndContentArea(this);
		document.querySelector('#txtCreateDate').value = yyyy_mm_dd();
		showProgreesBar();
		bindCategories('#selectDailyExpenesCategory')
		getDailyExpenses();
	});

	document.querySelector("#txtBudgetedAmount").addEventListener('keyup', (e) => {
		document.querySelector("#txtSpentAmount").value = e.target.value;
	})

});

function showProgreesBar() {
	//document.querySelector(".modal").setAttribute('style', "display:inline-block;") // old code
	let modal = document.querySelector(".modal");
	modal.classList.toggle('modal-visibility');
	modal.querySelector('.modal-content').classList.toggle('modal-content-visibility');
}

function hideProgreesBar() {
	//document.querySelector(".modal").setAttribute('style', "display:none;")
	let modal = document.querySelector(".modal");
	modal.classList.toggle('modal-visibility');
	modal.querySelector('.modal-content').classList.toggle('modal-content-visibility');

	if (!isPostBack) {
		setUpCollapsible();
		isPostBack = true;
	}
}

function saveDailyExpenses() {
	let id = document.getElementById("txtHiddenIdDailyExpenes");
	let categoryOptions = document.getElementById('selectDailyExpenesCategory').options;
	let c_id = categoryOptions[categoryOptions.selectedIndex].value;
	let ba = document.getElementById("txtBudgetedAmount");
	let sa = document.getElementById("txtSpentAmount");
	let cd = document.getElementById("txtCreateDate");
	let notes = document.getElementById("txtNotesDailyExpenes");
	let uri = `${url_string()}Budget/SaveDailyExpenses?id=${id.value}&c_id=${c_id}&ba=${ba.value}&sa=${sa.value}&cd=${cd.value}&notes=${notes.value}`;
	console.log(uri)
	$.ajax({
		url: uri,
		type: 'POST',
		dataType: 'json',
		success: function (data, textStatus, xhr) {
			id.value = "0";
			categoryOptions[0].selected = true;
			ba.value = "";
			sa.value = "";
			cd.value = "";
			notes.value = "";
			// Immediately update Summary part/...
			getDailyExpenses()
		},
		error: function (xhr, textStatus, errorThrown) {
			console.log('Error in Database');
		}
	});
}

function saveDailyExpensesCategory() {
	let id = document.getElementById("txtHiddenId");
	let sName = document.getElementById("txtShortName");
	let fName = document.getElementById("txtFullName");
	let notes = document.getElementById("txtNotes");

	$.ajax({
		url: url_string() + 'Category/SaveDailyExpensesCategories?id=' + id.value + "&sn=" + sName.value + "&fn=" + fName.value + "&notes=" + notes.value,
		type: 'POST',
		dataType: 'json',
		data: [],
		success: function (data, textStatus, xhr) {
			id.value = "0";
			sName.value = "";
			fName.value = "";
			notes.value = "";
			// Immediately update Summary part/...
			getDailyExpensesCategory()
		},
		error: function (xhr, textStatus, errorThrown) {
			console.log('Error in Database');
		}
	});
}

function getDailyExpensesCategory() {
	$.ajax({
		url: url_string() + 'category/GetDailyExpensesCategories',
		type: 'GET',
		dataType: 'json',
		success: function (data, textStatus, xhr) {

			if (applyCustomAttributesOnTable("DailyExpensesCategories") > 0) {
				document.querySelector("#DailyExpensesCategoriesTable").innerHTML = '';
			}

			createDailyExpensesCategoriesTable(data);
			hideProgreesBar();

		},
		error: function (xhr, textStatus, errorThrown) {
			console.log('Error in Database');
		}
	});
}

function getDailyExpenses() {
	$.ajax({
		url: url_string() + 'Budget/GetDailyExpenses',
		type: 'GET',
		dataType: 'json',
		success: function (data, textStatus, xhr) {
			if (applyCustomAttributesOnTable("DailyExpenses") > 0) {
				document.querySelector("#DailyExpensesTable").innerHTML = '';
			}
			//console.log(data);
			createDailyExpensesTable(data);
			hideProgreesBar();

		},
		error: function (xhr, textStatus, errorThrown) {
			console.log('Error in Database');
		}
	});
}

function populateToEntry(id, shortName, notes, fullName) {
	document.getElementById('txtHiddenId').value = id;
	document.getElementById('txtShortName').value = shortName;
	document.getElementById('txtFullName').value = fullName;
	document.getElementById('txtNotes').value = notes;
}


function populateToEntryDailyExpenses(id, catId, ba, sa, cd, notes) {
	let categoryOptions = document.getElementById('selectDailyExpenesCategory').options;

	for (var i = 0; i < categoryOptions.length; i++) {

		if (categoryOptions[i].value === catId) {
			categoryOptions[i].selected = true;
		}
	}

	document.getElementById('txtHiddenIdDailyExpenes').value = id;
	document.getElementById('txtCreateDate').value = cd;
	document.getElementById('txtBudgetedAmount').value = ba;
	document.getElementById('txtNotesDailyExpenes').value = notes;
	document.getElementById('txtSpentAmount').value = sa;
}

function createDailyExpensesCategoriesTable(data) {
	let newTable = new table({
		sortable: false,
		data: data,
		id: document.querySelector('#DailyExpensesCategoriesTable'),
		name: 'categories',
		colNames: ['ID', 'Short Name', 'Full Name', 'Notes', 'Created Date'],
		colModel: [
			{
				index: 'ID', width: 50, align: 'right', sortable: true, type: 'number', show: true, show_footer_aggregation: false,
				body_callback: (td, value, dataRow) => {
					return '<a href="javascript:void(0)" onclick="populateToEntry(' + value + ', \'' + dataRow.SHORT_NAME + '\', \'' + dataRow.NOTES + '\', \'' + dataRow.FULL_NAME + '\');">' + value + '</a > ';
				}
			},
			{ index: 'SHORT_NAME', width: 70, align: 'left', sortable: true, show: true, show_footer_aggregation: false },
			{ index: 'FULL_NAME', width: 100, align: 'left', sortable: true, show: true, show_footer_aggregation: false },
			{
				index: 'NOTES', width: 150, align: 'left', sortable: true, show: true,
				edit: false, edit_uri: (row, current_val) => {
					return `http://192.168.1.24/MoneyFlow/api/category/${row['Index']}?text=${current_val}`;
				},
				show_footer_aggregation: false
			},
			{ index: 'ROW_CREATE_DATE_STRING', type: 'date', width: 110, align: 'center', sortable: true, show: true, show_footer_aggregation: false },
		]
	})

	newTable.create();
	applyCustomAttributesOnTable("DailyExpensesCategories")
}

function createDailyExpensesTable(data) {
	let newTable = new table({
		data: data,
		id: document.querySelector('#DailyExpensesTable'),
		name: 'budget',
		colNames: ['ID', 'Spent In', 'Budget', 'Spent', 'Remng.', 'Notes', 'Date'],
		colModel: [
			{
				index: 'ID', width: 40, align: 'right', sortable: true, show: true, show_footer_aggregation: false, type: 'number',
				body_callback: (td, value, dataRow) => {
					//td.style.background = "lightblue"
					return '<a href="javascript:void(0)" onclick="populateToEntryDailyExpenses(' + value + ', \'' + dataRow.TBL_DE_CATEGORY_ID + '\', \'' + dataRow.BudgetedAmount + '\', \'' + dataRow.SpentAmount + '\', \'' + dataRow.yyyy_MM_dd + '\', \'' + dataRow.NOTES + '\');">' + value + '</a > ';
				}
			},
			{ index: 'TBL_DE_CATEGORY_SHORT_NAME', width: 80, align: 'left', sortable: true, show: true, show_footer_aggregation: false },
			{
				index: 'BudgetedAmount', width: 50,
				align: 'right', sortable: true, show: true, show_footer_aggregation: true,
				footer_callback: footer_formatter, type: 'number'
			},
			{
				index: 'SpentAmount', width: 50, align: 'right', sortable: true, show: true,
				show_footer_aggregation: true, footer_callback: footer_formatter, type: 'number'
			},
			{
				index: 'RemainingAmount', width: 50, align: 'right', sortable: true, show: true, show_footer_aggregation: true,
				footer_callback: footer_formatter, type: 'number'
			},
			{
				index: 'NOTES', width: 100, align: 'left', sortable: true, show: true,
				edit: false, edit_uri: (row, current_val) => {
					return `http://192.168.1.24/MoneyFlow/api/category/${row['Index']}?text=${current_val}`;
				},
				show_footer_aggregation: false
			},
			{ index: 'STRING_CREATE_DATE', width: 110, align: 'center', sortable: true, show: true, show_footer_aggregation: false, type: 'date', },
		]
	})

	newTable.create();
	applyCustomAttributesOnTable("DailyExpenses")
	function footer_formatter(td, col_name, data) {

		td.style.color = "darkred";
		td.style.background = "lightblue"

		let mapped_data = data.map((x) => x[col_name])

		const sum = mapped_data.some((x) => isNaN(x)) ? '' : mapped_data.reduce((x, y) => { return x + y }, 0);

		return `&#8377;${sum}`;
	}

}

function applyCustomAttributesOnTable(tableContainer) {
	let applyAttributes = false;
	let tablesContainer = document.querySelector(`#${tableContainer}`).querySelectorAll("table")

	for (var i = 0; i < tablesContainer.length; i++) {
		if (applyAttributes) {
			tablesContainer[i].setAttribute('border', "0")
			tablesContainer[i].setAttribute('cellspacing', "0")
			tablesContainer[i].setAttribute('cellpadding', "0")
			tablesContainer[i].setAttribute('width', "100%")
		}
	}

	return tablesContainer.length;
}

function bindCategories(selectID) {
	let tablesDropBox = document.querySelector(selectID);

	if (tablesDropBox.options.length > 0) {
		tablesDropBox.innerHTML = "";
	}
	var httpRequest = new XMLHttpRequest();
	httpRequest.onreadystatechange = function () {
		if (this.readyState === 4 && this.status === 200) {
			var myObj = JSON.parse(this.responseText);

			var option = document.createElement('option');
			option.value = '0';
			option.text = '--Select Category--';
			option.selected = true;
			tablesDropBox.appendChild(option);

			for (var select = 0; select < myObj.length; select++) {
				var optionInner = document.createElement('option');
				optionInner.value = myObj[select]["ID"];
				optionInner.text = myObj[select]["SHORT_NAME"];
				//if (myObj[select]["ID"] === selected_index) {
				//  optionInner.selected = true
				//}
				tablesDropBox.appendChild(optionInner);
			}

		}
	}
	httpRequest.open("GET", `${url_string()}category/GetDailyExpensesCategories`, false);
	httpRequest.send();
}


function activateMenuAndContentArea(self) {
	// Remove old Menu Selection
	let lis = document.querySelectorAll('.menu li');
	for (var i = 0; i < lis.length; i++) {

		if (lis[i].classList[0] !== 'hidden') {

			if (lis[i].classList[0] === 'active-menu') {
				lis[i].setAttribute('class', '');
			}
		}
	}

	// Remove old Tab Selection
	let tabs = document.querySelectorAll('.content .Tab');
	for (var j = 0; j < tabs.length; j++) {

		if (!tabs[j].classList.contains("hidden")) {
			tabs[j].classList.add('hidden');
		}
	}

	// Activate new tab
	for (var k = 0; k < tabs.length; k++) {

		if (tabs[k].hasAttribute('data') && self.id === tabs[k].getAttribute('data')) {
			tabs[k].classList.remove('hidden');
		}
	}

	// Activate new menu
	self.setAttribute('class', 'active-menu');
}


function toggleMenuBar(self) {
	document.querySelector(".menu").classList.toggle("menu-visible");
	self.classList.toggle('change')
}


function yyyy_mm_dd() {
	let today = new Date();
	let dd = today.getDate();
	let mm = today.getMonth() + 1;

	let yyyy = today.getFullYear();
	if (dd < 10) {
		dd = '0' + dd;
	}
	if (mm < 10) {
		mm = '0' + mm;
	}
	return today = yyyy + '-' + mm + '-' + dd;
}
