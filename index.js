const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Proxy API requests to Salesforce
app.use('/services/apexrest', createProxyMiddleware({
    target: 'https://micronetbd.my.salesforce-sites.com/services/apexrest',
    changeOrigin: true,
    secure: false,
    logLevel: 'debug',
    pathRewrite: {
        '^/services/apexrest': '' // Remove the path prefix when forwarding
    }
}));

// Serve static files from the 'src' directory
app.use('/src', express.static(path.join(__dirname, 'src')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/', express.static(path.join(__dirname, 'src'))); // Serve src at root for .html files

// Serve root index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

// Serve other HTML files directly
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'home.html'));
});
app.get('/createTask', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'createTask.html'));
});
app.get('/createProject', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'createProject.html'));
});
app.get('/editTask', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'editTask.html'));
});

// Start server if running directly
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

// Export for Vercel
module.exports = app;
