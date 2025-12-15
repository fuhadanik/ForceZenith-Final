class Tasks {
    constructor() {
        this.reset()
        this.data = this.getAll(false);
    }

    render() {
        if (this.data.length < 1) {
            document.getElementById("TaskList").innerHTML = '';
            document.getElementById("TaskList").innerHTML = `
            <div class="bg-white shadow rounded-lg p-6 text-center">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">No new tasks</h3>
                <p class="mt-1 text-sm text-gray-500">Nothing needs your attention right now. Check back later.</p>
            </div>
            `;
        } else {
            document.getElementById("TaskList").innerHTML = '';
            this.data.forEach((el, i) => {
                let statusColor = el.status === 'In Progress' ? 'bg-green-100 text-green-800' : 
                                  el.status === 'Completed' ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800';
                
                let html = `
                <div class="bg-white shadow rounded-lg mb-4 overflow-hidden">
                    <div class="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center sm:px-6">
                        <div class="text-sm text-gray-500">
                            ${el.start_date} ${el.end_date ? ' - ' + el.end_date : ''}
                        </div>
                        <div class="flex items-center space-x-4">
                            <div id="clock ${el.task_id}" class="text-sm font-mono font-medium text-gray-700">
                                ${el.hours}:${el.minutes}
                            </div>
                            
                            <!-- Actions -->
                            <div class="flex items-center space-x-2">
                                <button id="edit ${el.task_id},${el.start_date},${el.end_date},${el.user_name},${el.user_id},${el.project_id},${el.description},${el.name},${el.type},${el.hours},${el.minutes},${el.status}" 
                                    class="click text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50 transition" title="Edit">
                                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                
                                <div id="timer ${el.task_id}">
                                    <button id="start ${el.task_id}" style="display:${el.status !== 'In Progress' ? 'block' : 'none'}" 
                                        class="click text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-green-50 transition" title="Start">
                                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </button>
                                    <button id="stop ${el.task_id}" style="display:${el.status == 'In Progress' ? 'block' : 'none'}" 
                                        class="click text-yellow-600 hover:text-yellow-800 p-1 rounded-full hover:bg-yellow-50 transition" title="Pause">
                                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </button>
                                </div>

                                <button id="del ${el.task_id}" style="display:${el.can_delete ? 'block' : 'none'}" 
                                    class="click text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50 transition" title="Delete">
                                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="px-4 py-4 sm:px-6">
                        <div class="flex items-center justify-between">
                            <div class="text-lg font-medium text-primary truncate" title="${el.name}">
                                ${el.name.substring(0, 50)}
                            </div>
                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor}">
                                ${el.status}
                            </span>
                        </div>
                        <div class="mt-2 sm:flex sm:justify-between">
                            <div class="sm:flex">
                                <p class="flex items-center text-sm text-gray-500">
                                    <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                    </svg>
                                    ${el.project_name}
                                </p>
                            </div>
                            <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                <p class="truncate max-w-xs" title="${el.description || ''}">
                                    ${el.description ? el.description.substring(0, 70) + (el.description.length > 70 ? '...' : '') : ''}
                                </p>
                            </div>
                        </div>
                        <div class="mt-2 flex items-center text-sm text-gray-500">
                             <div class="flex-shrink-0 h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold text-white mr-2" title="${el.user_name}">
                                ${el.user_init}
                            </div>
                            ${el.user_name}
                        </div>
                    </div>
                </div>
                `;
                document.getElementById("TaskList").innerHTML += html;
            })
            clearInterval(totalTimeTracked)
            var totalTimeTracked = setInterval(() => {
                document.getElementById("totalTimeTracked").innerHTML = this.getTotal(this.data);
            }, 100);
            
            // Update dashboard statistics
            this.updateDashboardStats();
        }
    }

    updateDashboardStats() {
        const total = this.data.length;
        const completed = this.data.filter(task => task.status === 'Completed').length;
        const inProgress = this.data.filter(task => task.status === 'In Progress').length;
        const planned = this.data.filter(task => task.status === 'Planned').length;

        document.getElementById('totalTasksCount').textContent = total;
        document.getElementById('completedTasksCount').textContent = completed;
        document.getElementById('inProgressTasksCount').textContent = inProgress;
        document.getElementById('plannedTasksCount').textContent = planned;
    }

    reset() {
        this.owner = getCookie("login");
        // Log owner for debugging purposes
        // console.log('The Owner Is: ', this.owner);
        this.project = [];
        this.startDate = new Date().toISOString().substr(0, 10);
        this.endDate = new Date().toISOString().substr(0, 10);
    
        const lookupProject = document.getElementById("lookupProject");
        const lookupOwner = document.getElementById("lookupOwner");
        const startDateInput = document.getElementById("start_date");
        const endDateInput = document.getElementById("end_date");
    
        if (lookupProject) lookupProject.value = null;
        if (lookupOwner) lookupOwner.value = null;
        if (startDateInput) startDateInput.value = this.startDate;
        if (endDateInput) endDateInput.value = this.endDate;
    }
    
    // async version of previous getAll()
    async getAll(con) {
        try {
            this.data = await getAllTasks(this.owner, this.project, this.startDate + ' 00:00:00', this.endDate + ' 00:00:00');
            if (!con) this.render();
            this.events();
        } catch (error) {
            console.error('Error getting tasks:', error);
        }
    }

    getTotal(data) {
        let totalHours = 0;
        let totalMinutes = 0;
        data.forEach(item => {
            totalHours += item.hours;
            totalMinutes += item.minutes;
        });

        totalHours += Math.floor(totalMinutes / 60);
        totalMinutes = totalMinutes % 60;
        return `${totalHours} Hours : ${totalMinutes} Minutes`
    }

    remove(id) {
        removeTask("task?task_id=" + id).then((x) => { this.getAll(false) })
        chrome.runtime.sendMessage({ name: 'pauseTracking', data: id });
        this.getAll(false)
    }

    getIndexFromId(id) {
        if (this.data) {
            var index = this.data.findIndex(x => x.task_id == id);
            if (index === -1) {
                return undefined
            } else {
                return index
            }
        }
    }

    edit(i, s, e, o, u, p, d, n, t, h, m, st) {
        let index = this.getIndexFromId(i)
        let params = new URLSearchParams(this.data[index]).toString();
        window.location = './editTask.html?' + params;
        
    }

    stop(i) {
        let index = this.getIndexFromId(i)

        this.data[index].status = "Paused";
        this.data[index].owner = this.data[index].user_id;
        this.data[index].description = this.data[index].description;
        editTask(this.data[index]).then((x) => {
            chrome.runtime.sendMessage({ name: 'pauseTracking', data: i });
            this.getAll(false)
        });
    }

    start(i) {
        let index = this.getIndexFromId(i)

        this.data[index].status = "In Progress";
        this.data[index].owner = this.data[index].user_id;
        this.data[index].description = this.data[index].description;
        editTask(this.data[index]).then((x) => {
            chrome.runtime.sendMessage({ name: 'startTracking', data: this.data[index], auth: this.owner });
            this.getAll(false)
        });
    }

    events() {
        // Attach new event listeners based on keywords in each <HTMLelement> id
        document.querySelectorAll(".click").forEach((el) => {
            if (el.id.includes('start')) {
                let id = el.id.replace('start ', '');
                el.onclick = () => {
                    this.start(id)
                }
            }
            if (el.id.includes('stop')) {
                let id = el.id.replace('stop ', '');
                el.onclick = () => {
                    this.stop(id)
                }
            }
            if (el.id.includes('del')) {
                let id = el.id.replace('del ', '');
                el.onclick = () => {
                    this.remove(id)
                }
            }
            if (el.id.includes('edit')) {
                let v = el.id.replace('edit ', '');
                let parts = v.split(",");
    
                // Map parts to an object with meaningful property names
                // This order is defined above in the <span id='edit' </span>
                let taskData = {
                    taskId: parts[0],
                    startDate: parts[1],
                    endDate: parts[2],
                    userName: parts[3],
                    userId: parts[4],
                    projectId: parts[5],
                    description: parts[6],
                    name: parts[7],
                    type: parts[8],
                    hours: parts[9],
                    minutes: parts[10],
                    status: parts[11]
                };

                // console.log('Task data for editing:', taskData);
                el.onclick = () => {
                    this.edit(...Object.values(taskData));
                }
            }
        });
    }

}
