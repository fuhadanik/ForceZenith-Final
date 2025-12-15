var taskList = new Tasks();
if (getCookie("login") == null) window.location = "./index.html";

document.getElementById("refreshList").onclick = () => {
    taskList.reset();
    taskList.getAll();
};

document.getElementById("logout").onclick = () => {
    localStorage.removeItem("login");
    localStorage.removeItem("tasks");
    chrome.runtime.sendMessage({ name: 'logout' });
    window.location = "./index.html";
};

try {
    chrome.runtime.onMessage.addListener(function (message) {
        
        // Check if message.message and message.message.data exist
        if (message.message && message.message.data) {
            let index = taskList.getIndexFromId(message.message.data.task_id);
            
            if (taskList.data[index]) {
                taskList.data[index].hours = message.hoursElapsed;
                taskList.data[index].minutes = message.minutesElapsed;
                
                const clockElement = document.getElementById("clock " + message.message.data.task_id);
                
                if (clockElement) {
                    clockElement.innerHTML = `${message.hoursElapsed}h ${message.minutesElapsed}m ${message.secondsElapsed}s`;
                    // console.log('Updated clock innerHTML:', clockElement.innerHTML);
                } else {
                    console.error('Clock element not found for task_id:', message.message.data.task_id);
                }
            } else {
                console.error('Task not found in taskList.data for index:', index);
            }
        } else {
            console.log('Message does not contain expected structure:', message);
        }
    });
} catch (error) {
    console.error('Error handling message:', error);
}

document.getElementById("startdate").onchange = () => {
    taskList.startDate = new Date(document.getElementById("startdate").value).toISOString().substr(0, 10);
    taskList.getAll(false);
};

document.getElementById("enddate").onchange = () => {
    taskList.endDate = new Date(document.getElementById("enddate").value).toISOString().substr(0, 10);
    taskList.getAll(false);
};

document.getElementById("projectfilter").onkeyup = (e) => {
    let ptimerId;
    clearTimeout(ptimerId);
    ptimerId = setTimeout(() => {
        const value = e.target.value;
        if (value === '') {
            document.getElementById("projectfilterList").style.display = "none";
            taskList.project = [];
            const startDateValue = document.getElementById("startdate").value;
            const endDateValue = document.getElementById("enddate").value;
            if (startDateValue) {
                taskList.startDate = new Date(startDateValue).toISOString().substr(0, 10);
            }
            if (endDateValue) {
                taskList.endDate = new Date(endDateValue).toISOString().substr(0, 10);
            }
            taskList.getAll(false);
            return;
        }
        var myHeaders = new Headers();
        myHeaders.append("task_manager_id", getCookie("login"));

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("/services/apexrest/project?search_string=" + value, requestOptions)
            .then(response => response.text())
            .then(result => {
                result = JSON.parse(result);
                if (result.success) {
                    const projects = result.projects || result.users || [];
                    if (projects.length > 0) {
                        document.getElementById("projectfilterList").style.display = "block";
                        document.getElementById("projectList").innerHTML = "";
                        projects.forEach(el => {
                            document.getElementById("projectList").innerHTML += `
                            <li role="picker" class="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100" data-info="${el.project_id}">
                                <div class="flex items-center">
                                    <span class="font-normal block truncate">
                                        <mark class="bg-yellow-200">${el.project_name}</mark>
                                    </span>
                                </div>
                            </li>`;
                        });
                        document.querySelectorAll('#projectList [role="picker"]').forEach((x) => {
                            x.addEventListener('click', () => {
                                e.target.value = x.innerText;
                                taskList.project = [x.getAttribute('data-info')];
                                const startDateValue = document.getElementById("startdate").value;
                                const endDateValue = document.getElementById("enddate").value;
                                if (startDateValue) {
                                    taskList.startDate = new Date(startDateValue).toISOString().substr(0, 10);
                                }
                                if (endDateValue) {
                                    taskList.endDate = new Date(endDateValue).toISOString().substr(0, 10);
                                }
                                taskList.getAll(false);
                                document.querySelector("#projectfilter").setAttribute('data-info', x.getAttribute('data-info'));
                                document.getElementById("projectfilterList").style.display = "none";
                            });
                        });
                    }
                } else {
                    alert(JSON.stringify(result));
                }
            })
            .catch(error => { alert(error); });
    }, 500);
};

document.getElementById("ownerfilter").onkeyup = (e) => {
    let otimerId;
    clearTimeout(otimerId);
    otimerId = setTimeout(() => {
        const value = e.target.value;
        if (value === '') {
            document.getElementById("lookupOwnerList").style.display = "none";
            taskList.owner = getCookie("login");
            taskList.startDate = new Date(document.getElementById("start_date").value).toISOString().substr(0, 10);
            taskList.endDate = new Date(document.getElementById("end_date").value).toISOString().substr(0, 10);
            taskList.getAll(false);
            return;
        }
        var myHeaders = new Headers();
        myHeaders.append("task_manager_id", getCookie("login"));

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("/services/apexrest/user?search_string=" + value, requestOptions)
            .then(response => response.text())
            .then(result => {
                result = JSON.parse(result);
                if (result.success) {
                    if (result.users.length > 0) {
                        document.getElementById("ownerfilterList").style.display = "block";
                        document.getElementById("ownerList").innerHTML = "";
                        result.users.forEach(el => {
                            document.getElementById("ownerList").innerHTML += `
                            <li role="picker" class="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100" data-info="${el.user_id}">
                                <div class="flex items-center">
                                    <span class="font-normal block truncate">
                                        <mark class="bg-yellow-200">${el.user_name}</mark>
                                    </span>
                                </div>
                            </li>`;
                        });
                        document.querySelectorAll('#ownerList [role="picker"]').forEach((x) => {
                            x.addEventListener('click', () => {
                                taskList.owner = x.getAttribute('data-info');
                                const startDateValue = document.getElementById("startdate").value;
                                const endDateValue = document.getElementById("enddate").value;
                                if (startDateValue) {
                                    taskList.startDate = new Date(startDateValue).toISOString().substr(0, 10);
                                }
                                if (endDateValue) {
                                    taskList.endDate = new Date(endDateValue).toISOString().substr(0, 10);
                                }
                                taskList.getAll(false);
                                document.querySelector("#ownerfilter").value = x.innerText;
                                document.querySelector("#ownerfilter").setAttribute('data-info', x.getAttribute('data-info'));
                                document.getElementById("ownerfilterList").style.display = "none";
                            });
                        });
                    }
                } else {
                    alert(JSON.stringify(result));
                }
            })
            .catch(error => { alert(error); });
    }, 500);
};
