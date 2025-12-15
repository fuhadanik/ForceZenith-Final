# ForceZenith - Task Management Web Application

A modern task management web application integrated with Salesforce, featuring a beautiful dashboard with real-time statistics and comprehensive filtering capabilities.

## Features

- 📊 **Dashboard with Statistics** - View total, completed, in-progress, and planned tasks at a glance
- ✅ **Task Management** - Create, edit, and manage tasks with rich details
- 📁 **Project Management** - Organize tasks by projects
- 🔍 **Advanced Filtering** - Filter tasks by owner, project, and date ranges
- 🎨 **Modern UI** - Built with Tailwind CSS for a premium user experience
- 🔄 **Live Data** - Real-time synchronization with Salesforce

## Tech Stack

- **Frontend**: HTML, JavaScript, Tailwind CSS
- **Backend**: Node.js, Express
- **API Integration**: Salesforce REST API
- **Styling**: Tailwind CSS with custom branding colors (#1ba0da, #8cc63f)

## Local Development

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd forcezinath
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev  # Starts Tailwind CSS compiler
npm start    # Starts Node.js proxy server
```

4. Open your browser:

```
http://localhost:3000/src/index.html
```

## Deployment

### Deploy to Vercel

1. **Push to GitHub**:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. **Deploy to Vercel**:

   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect the configuration from `vercel.json`
   - Click "Deploy"

3. **Environment Variables** (if needed):
   - Add any required environment variables in Vercel project settings

## Project Structure

```
forcezinath/
├── src/
│   ├── index.html          # Login page
│   ├── home.html           # Dashboard with task list
│   ├── createTask.html     # Create new task
│   ├── createProject.html  # Create new project
│   ├── editTask.html       # Edit existing task
│   ├── home.js             # Dashboard logic
│   ├── tasks.js            # Task rendering & management
│   ├── api.js              # Salesforce API integration
│   └── ...
├── assets/
│   ├── Logo.png
│   └── output.css          # Compiled Tailwind CSS
├── server.js               # Node.js proxy server
├── tailwind.config.js      # Tailwind configuration
├── vercel.json             # Vercel deployment config
└── package.json            # Dependencies

```

## Key Features

### Dashboard Statistics

- Total tasks count
- Completed tasks (green)
- In-progress tasks (yellow)
- Planned tasks (purple)

### Task Filtering

- Filter by owner (with search dropdown)
- Filter by project (with search dropdown)
- Filter by date range (start/end dates)

### Search Functionality

- Live search for projects
- Live search for users/owners
- Live search for managers and clients (project creation)

## Branding

- **Primary Color**: #1ba0da (Blue)
- **Secondary Color**: #8cc63f (Green)

## API Integration

The application uses a Node.js proxy server to handle Salesforce API calls:

- Endpoint: `/services/apexrest/`
- Authentication: Uses task_manager_id in headers

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Proprietary - MicronetBD

## Support

For support, please contact your administrator.
