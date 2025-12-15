document.querySelector("#lookupManager").value = "Current User";
document.querySelector("#lookupManager").setAttribute('data-info', getCookie("login"));
document.getElementById("start_date").value = new Date().toISOString().substring(0, 10)
var projecttypes = localStorage.getItem('default_project_types')
projecttypes = projecttypes.split(',');
  projecttypes.forEach(el => {
    document.getElementById("Project_Type__c").innerHTML += `
    <option value="${el}">${el}</option>
    `
  });
  document.forms.createProjectForm.addEventListener('submit', (event) => {
    event.preventDefault();
    var formEl = document.forms.createProjectForm;
    const formData = new FormData(formEl);
    const formProps = Object.fromEntries(formData);
    formProps.manager = document.querySelector("#lookupManager").getAttribute('data-info');
    formProps.client_account = document.querySelector("#lookupClient").getAttribute('data-info');
    const requiredFields = formEl.querySelectorAll('[required]');
    let allFieldsValid = true;
    requiredFields.forEach(function (field) {
      if (!field.checkValidity()) {
        allFieldsValid = false;
      }
    });
    if (allFieldsValid) {
      createProject(formProps);
    }
  })
  
  
  const delay = 500;
  let mtimerId;
  document.getElementById("lookupManager").onkeyup = (e) => {
    clearTimeout(mtimerId);
    mtimerId = setTimeout(() => {
      const value = e.target.value;
      if (value === '') return document.getElementById("lookupManagerList").style.display = "none";
  
      search('user?search_string=' + value).then(x => {
        document.getElementById("lookupManagerList").style.display = "block";
        document.getElementById("ManagerList").innerHTML = "";
        x.users.forEach(el => {
          document.getElementById("ManagerList").innerHTML += `
                  <li role="picker" class="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100" data-info="${el.user_id}">
                  <div class="flex items-center">
                    <span class="font-normal block truncate">
                      <mark class="bg-yellow-200">${el.user_name}</mark>
                    </span>
                  </div>
                </li>
                  `;
        });
        document.querySelectorAll('#ManagerList [role="picker"]').forEach((x) => {
          x.addEventListener('click', () => {
            e.target.value = x.innerText;
            document.querySelector("#lookupManager").setAttribute('data-info', x.getAttribute('data-info'));
            document.getElementById("lookupManagerList").style.display = "none";
          })
        })
      })
  
  
    }, delay)
  
  }
  let ctimerId;
  document.getElementById("lookupClient").onkeyup = (e) => {
    clearTimeout(ctimerId);
    ctimerId = setTimeout(() => {
  
      const value = e.target.value;
      if (value === '') return document.getElementById("lookupClientList").style.display = "none";
  
      search('client?search_string=' + value).then(x => {
        document.getElementById("lookupClientList").style.display = "block";
        document.getElementById("ClientList").innerHTML = "";
        x.users.forEach(el => {
          document.getElementById("ClientList").innerHTML += `
                  <li role="picker" class="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100" data-info="${el.client_id}">
                  <div class="flex items-center">
                    <span class="font-normal block truncate">
                      <mark class="bg-yellow-200">${el.client_name}</mark>
                    </span>
                  </div>
                </li>
                  `;
        });
        document.querySelectorAll('#ClientList [role="picker"]').forEach((x) => {
          x.addEventListener('click', () => {
            e.target.value = x.innerText;
            document.querySelector("#lookupClient").setAttribute('data-info', x.getAttribute('data-info'));
            document.getElementById("lookupClientList").style.display = "none";
          })
        })
      })
  
    }, delay)
  
  }