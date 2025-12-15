// Initialize owner field
const ownerField = document.querySelector("#lookupOwner");
if (ownerField) {
  ownerField.value = "Current User";
  ownerField.setAttribute('data-info', getCookie("login"));
}

var defaultTaskStatus = localStorage.getItem('default_task_status')
if (defaultTaskStatus) {
  defaultTaskStatus = defaultTaskStatus.split(',');
  const startDateField = document.getElementById("Start_Date__c");
  if (startDateField) {
    startDateField.valueAsDate = new Date();
  }
  const statusSelect = document.getElementById("Status__c");
  if (statusSelect) {
    defaultTaskStatus.forEach(el => {
      statusSelect.innerHTML += `
      <option value="${el}">${el}</option>
      `;
    });
  }
}

var defaultTaskTypes = localStorage.getItem('default_task_types')
if (defaultTaskTypes) {
  defaultTaskTypes = defaultTaskTypes.split(',');
  const typeSelect = document.getElementById("Task_Type__c");
  if (typeSelect) {
    defaultTaskTypes.forEach(el => {
      typeSelect.innerHTML += `
      <option value="${el}">${el}</option>
      `;
    });
  }
}


const statusField = document.getElementById("Status__c");
if (statusField) {
  statusField.addEventListener('change', function () {
    if (this.value == "Completed") {
      const enddateEl = document.getElementById("enddatestatus");
      if (enddateEl) enddateEl.style.display = "block";
      const endDateField = document.getElementById("End_Date__c");
      if (endDateField) {
        endDateField.valueAsDate = new Date()
      }
    } else {
      const enddateEl = document.getElementById("enddatestatus");
      if (enddateEl) enddateEl.style.display = "none";
    }
  })
}

// Initialize start time
function getTime() {
  return ('0' + new Date().getHours()).substr(-2) + ":" + ('0' + new Date().getMinutes()).substr(-2);
}
const startTimeField = document.getElementById("start_time");
if (startTimeField) {
  startTimeField.value = getTime();
}

// this.Tracker.toggleTask(i, this.getFromid(i).hours, this.getFromid(i).minutes);
//         chrome.runtime.sendMessage({ name: 'startTracking', data: this.getFromid(i) ,auth: this.owner, timestamp: this.Tracker.getTime(i) });

document.forms.createTaskForm.addEventListener('submit', (event) => {
  event.preventDefault();
  var formEl = document.forms.createTaskForm;
  const formData = new FormData(formEl);
  const formProps = Object.fromEntries(formData);
  formProps.project_id = document.querySelector("#lookupProject").getAttribute('data-info')
  formProps.owner = document.querySelector("#lookupOwner").getAttribute('data-info')
  formProps.minutes = parseInt(formProps.minutes);
  formProps.hours = parseInt(formProps.hours);
  formProps.start_date = formProps.start_date + " " + formProps.start_time + ":00";
  formProps.end_date = formProps.end_date + " " + formProps.end_time + ":00";

  if (formProps.status !== "Completed") {
    delete formProps.end_date;
  }

  const requiredFields = formEl.querySelectorAll('[required]');
  let allFieldsValid = true;
  requiredFields.forEach(function (field) {
    if (!field.checkValidity()) {
      allFieldsValid = false;
    }
  });
  if (allFieldsValid) {
    createTask(formProps).then((x) => {
      if (formProps.status == "In Progress") {
        console.log('i ran ', x)
        if (!formProps.task_id) {
          formProps.task_id = x.task_id;
        }
        chrome.runtime.sendMessage({ name: 'startTracking', data: formProps, auth: getCookie("login") });
      }
      window.location = './home.html'
    })
  }
})

const delay = 500;
let otimerId;
document.getElementById("lookupOwner").onkeyup = (e) => {
  clearTimeout(otimerId);
  otimerId = setTimeout(() => {
    const value = e.target.value;
    if (value === '') return document.getElementById("lookupOwnerList").style.display = "none";
    search('user?search_string=' + value).then(x => {
      document.getElementById("lookupOwnerList").style.display = "block";
      document.getElementById("OwnerList").innerHTML = "";
      x.users.forEach(el => {
        document.getElementById("OwnerList").innerHTML += `
                <li role="picker" class="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100" data-info="${el.user_id}">
                  <div class="flex items-center">
                    <span class="font-normal block truncate">
                      <mark class="bg-yellow-200">${el.user_name}</mark>
                    </span>
                  </div>
                </li>
                `;
      });
      document.querySelectorAll('#OwnerList [role="picker"]').forEach((x) => {
        x.addEventListener('click', () => {
          e.target.value = x.innerText;
          document.querySelector("#lookupOwner").setAttribute('data-info', x.getAttribute('data-info'));
          document.getElementById("lookupOwnerList").style.display = "none";
        })
      })
    })
  }, delay)

}

let ptimerId;
const lookupProjectEl = document.getElementById("lookupProject");
console.log('lookupProject element:', lookupProjectEl);
if (lookupProjectEl) {
  lookupProjectEl.onkeyup = (e) => {
    console.log('Project search keyup event fired, value:', e.target.value);
    clearTimeout(ptimerId);
    ptimerId = setTimeout(() => {
      const value = e.target.value;

      if (value === '') return document.getElementById("lookupProjectList").style.display = "none";

      search('project?search_string=' + value).then(x => {
        console.log('Project search result:', x);
        document.getElementById("lookupProjectList").style.display = "block";
        document.getElementById("ProjectList").innerHTML = "";
        // Fallback to x.users if x.projects is undefined, just in case, but prioritize projects
        const results = x.projects || x.users || [];
        results.forEach(el => {
          document.getElementById("ProjectList").innerHTML += `
                  <li role="picker" class="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100" data-info="${el.project_id}">
                    <div class="flex items-center">
                      <span class="font-normal block truncate">
                        <mark class="bg-yellow-200">${el.project_name}</mark>
                      </span>
                    </div>
                  </li>
                  `;
        });
        document.querySelectorAll('#ProjectList [role="picker"]').forEach((x) => {
          x.addEventListener('click', () => {
            e.target.value = x.innerText;
            document.querySelector("#lookupProject").setAttribute('data-info', x.getAttribute('data-info'));
            document.querySelector("#lookupProject").setAttribute('data-name', x.innerText.trim());
            document.getElementById("lookupProjectList").style.display = "none";
          })
        })
      }).catch(err => {
        console.error('Project search error:', err);
      })

    }, delay)

  };
} else {
  console.error('lookupProject element not found!');
}