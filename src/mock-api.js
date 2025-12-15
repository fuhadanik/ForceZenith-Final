// Mock API for Web Preview

console.log("Mock API script loaded");

const mockLoginResponse = {
    success: true,
    user_id: "mock_user_123",
    default_project_types: "Web, Mobile, Desktop",
    default_task_types: "Development, Testing, Design",
    default_task_status: "Planned, In Progress, Completed, Paused"
};

const mockTaskListResponse = {
    projects: [
        {
            project_name: "Website Redesign",
            project_id: "proj_001",
            users: [
                {
                    user_name: "Test User",
                    user_id: "mock_user_123",
                    tasks: [
                        {
                            task_id: "task_001",
                            name: "Design Homepage",
                            status: "In Progress",
                            hours: 2,
                            minutes: 15,
                            description: "Create new layout for homepage",
                            type: "Design",
                            start_date: "2023-10-27",
                            end_date: "2023-10-30"
                        },
                        {
                            task_id: "task_002",
                            name: "Implement Login",
                            status: "Planned",
                            hours: 0,
                            minutes: 0,
                            description: "Frontend implementation",
                            type: "Development",
                            start_date: "2023-10-28",
                            end_date: "2023-10-31"
                        }
                    ]
                }
            ]
        }
    ]
};

const mockProjectListResponse = {
    success: true,
    users: [
        { project_name: "Website Redesign", project_id: "proj_001" },
        { project_name: "Mobile App", project_id: "proj_002" }
    ]
};

const mockUserListResponse = {
    success: true,
    users: [
        { user_name: "Test User", user_id: "mock_user_123" },
        { user_name: "Another User", user_id: "mock_user_456" }
    ]
};

if (window.axios) {
    console.log("Mocking Axios");
    const originalAxios = window.axios;
    window.axios = async (options) => {
        console.log("Mock Axios Call:", options.method, options.url, options);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        if (options.url.includes("/login")) {
            return { data: mockLoginResponse };
        }
        
        if (options.url.includes("/task/list")) {
            return { data: mockTaskListResponse };
        }

        if (options.url.includes("/task") && options.method === 'POST') {
             return { data: { success: true, task_id: "new_task_" + Date.now() } };
        }

        if (options.url.includes("/task") && options.method === 'PUT') {
             return { data: { success: true } };
        }
        
        if (options.url.includes("/project") && options.method === 'GET') {
            return { data: mockProjectListResponse };
        }
        
        if (options.url.includes("/user") && options.method === 'GET') {
            return { data: mockUserListResponse };
        }

        return { data: { success: true } };
    };
} else {
    console.error("Axios not found, cannot mock API");
}
