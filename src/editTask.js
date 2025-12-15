// Parse URL query string to get parameters
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

// Convert URLSearchParams entries into an object
function paramsToObject(entries) {
    const result = {};
    for (const [key, value] of entries) {
        result[key] = value;
    }
    return result;
}

// Handle changes in task status dropdown
// Handle changes in task status dropdown
document.getElementById("Status__c").onchange = () => {
    let ts = document.getElementById("Status__c").value;
    
    console.log("Task status changed to:", ts);
    document.getElementById("enddatestatus").style.display = ts == "Completed" ? 'block' : 'none';
};

// When the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed");

    // Load default task statuses from local storage
    var taskstatus = localStorage.getItem("default_task_status");
    if (taskstatus) {
        taskstatus.split(",").forEach((el) => {
            document.getElementById("Status__c").innerHTML += `<option value="${el}">${el}</option>`;
        });
    }
    // Populate task type dropdown
    var tasktypes = localStorage.getItem('default_task_types');
    if (tasktypes) {
        tasktypes = tasktypes.split(',');
        const taskTypeSelect = document.getElementById("Task_Type__c");
        taskTypeSelect.innerHTML = ''; // Clear existing options
        tasktypes.forEach(type => {
            taskTypeSelect.innerHTML += `<option value="${type}">${type}</option>`;
        });
    }

    // Extract parameters from URL and set form values
    const params = paramsToObject(urlParams.entries());
    var form = document.querySelector("form");
    setFormValues(form, params);

    // Setup the owner lookup functionality
    setupOwnerLookup();
});

// Set form values based on URL parameters
function setFormValues(form, params) {
    console.log("Setting form values based on URL parameters:", params);

    // Set start date and time if available
    if (params.start_date) {
        let sd = new Date(params.start_date);
        if (sd != "Invalid Date") {
            form["start_date"].value = sd.toISOString().substr(0, 10);
            form["start_time"].value = params.start_date.substr(11);
        }
    }

    // Set end date and time if available
    if (params.end_date) {
        let ed = new Date(params.end_date);
        if (ed != "Invalid Date") {
            form["end_date"].value = ed.toISOString().substr(0, 10);
            form["end_time"].value = params.end_date.substr(11);
        } else {
            form["end_date"].value = "";
            form["end_time"].value = "";
            console.log("End date and time cleared");
        }
    }

    // Set task name
    if (params.name) {
        document.getElementById("Name__c").value = params.name;
    }

    // Set description (form field name is 'notes', params has 'description')
    if (params.description) {
        document.getElementById("Description__c").value = params.description;
    }

    // Set hours and minutes
    if (params.hours) {
        document.getElementById("hours").value = params.hours;
    }
    if (params.minutes) {
        document.getElementById("minutes").value = params.minutes;
    }

    // Set status dropdown
    if (params.status) {
        document.getElementById("Status__c").value = params.status;
    }

    // Show end date field if status is Completed
    if (params.status === "Completed") {
        document.getElementById("enddatestatus").style.display = 'block';
    }

    // Set project name
    if (params.project_name) {
        document.getElementById("lookupProject").value = params.project_name;
    }
    if (params.project_id) {
        document.getElementById("lookupProject").setAttribute('data-info', params.project_id);
    }

    // Set owner name and ID
    if (params.user_name) {
        document.getElementById("lookupOwner").value = params.user_name;
    }
    if (params.user_id) {
        document.getElementById("lookupOwner").setAttribute('data-info', params.user_id);
    }

    // Set task type dropdown if the type is available in params
    if (params.type && document.getElementById("Task_Type__c")) {
        document.getElementById("Task_Type__c").value = params.type;
    }
}


// Setup owner lookup functionality
function setupOwnerLookup() {
    let otimerId;
    document.getElementById("lookupOwner").onkeyup = (e) => {
        clearTimeout(otimerId);
        otimerId = setTimeout(() => ownerLookup(e), 500);
    };
}

// Perform owner lookup
function ownerLookup(e) {
    const value = e.target.value;
    if (value === '') {
        document.getElementById("lookupOwnerList").style.display = "none";
        return;
    }
    search("user?search_string=" + value).then(x => updateOwnerList(e, x));
}

// Update owner list based on lookup results
function updateOwnerList(e, data) {
    document.getElementById("lookupOwnerList").style.display = "block";
    document.getElementById("OwnersList").innerHTML = "";
    data.users.forEach((el) => {
        document.getElementById("OwnersList").innerHTML += `
            <li role="picker" class="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100" data-info="${el.user_id}">
                <div class="flex items-center">
                    <span class="font-normal block truncate">
                        <mark class="bg-yellow-200">${el.user_name}</mark>
                    </span>
                </div>
            </li>`;
    });
    document.querySelectorAll('[role="picker"]').forEach((x) => {
        x.addEventListener('click', () => {
            e.target.value = x.innerText;
            document.querySelector("#lookupOwner").setAttribute('data-info', x.getAttribute('data-info'));
            document.getElementById("lookupOwnerList").style.display = "none";
        });
    });
}

document.forms.editTaskForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const form = document.querySelector('form');
    const formData = new FormData(form);
    const formProps = Object.fromEntries(formData);

    const editdata = {
        name: formProps.name,
        owner: document.querySelector("#lookupOwner").getAttribute('data-info'),
        start_date: formProps.start_date + " " + formProps.start_time + ":00",
        end_date: formProps.end_date ? formProps.end_date + " " + formProps.end_time + ":00" : "",
        description: formProps.description,
        status: formProps.status,
        project_id: urlParams.get("project_id"),
        type: formProps.type,
        task_id: urlParams.get("task_id"),
        hours: formProps.hours,
        minutes: formProps.minutes
    };

    // Log the structured clone of the object
    console.dir(editdata);

    // Perform form validation
    if (validateForm(form)) {
        performTaskEdit(editdata);
    } else {
        console.log("Form validation failed");
    }
});


// Submit edit task form
function submitEditTaskForm() {
    var form = document.querySelector("form");
    const formData = new FormData(form);
    const formProps = Object.fromEntries(formData);
    var editdata = buildEditData(formProps);
    if (validateForm(form)) {
        performTaskEdit(editdata);
    }
}


function buildEditData(formProps) {
    var editdata = {
        name: formProps.name,
        owner: document.querySelector("#lookupOwner").getAttribute("data-info"),
        start_date: formProps.start_date + " " + formProps.start_time,
        end_date: formProps.end_date + " " + formProps.end_time,
        description: formProps.description,
        status: formProps.status,
        project_id: urlParams.get("project_id"),
        type: formProps.type,
        task_id: urlParams.get("task_id"),
        hours: formProps.hours,
        minutes: formProps.minutes,
    };

    if (new Date(editdata.end_date) == "Invalid Date") {
        delete editdata.end_date;
    }

    console.log("Edit data built from form properties:", editdata);

    return editdata;
}


// Validate form fields
function validateForm(form) {
    console.log("Validating form");
    const requiredFields = form.querySelectorAll("[required]");
    let isValid = Array.from(requiredFields).every(field => {
        let isFieldValid = field.checkValidity();

        return isFieldValid;
    });
    return isValid;
}
// Perform task edit operation
function performTaskEdit(editdata) {
    console.log("Performing task edit operation");
    editTask(editdata).then((x) => {
        console.log("Task edit successful, redirecting");
        if (editdata.status == "In Progress") {
            chrome.runtime.sendMessage({
                name: "startTracking",
                data: editdata,
                auth: getCookie("login"),
            });
        } else {
            chrome.runtime.sendMessage({
                name: "pauseTracking",
                data: editdata.task_id,
            });
        }
        window.location = "./home.html";
    });
}

