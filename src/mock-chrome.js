// Mock Chrome API for Web Preview

if (!window.chrome) {
  window.chrome = {};
}

if (!window.chrome.runtime) {
  window.chrome.runtime = {};
}

if (!window.chrome.action) {
  window.chrome.action = {};
}

if (!window.chrome.tabs) {
  window.chrome.tabs = {};
}

const messageListeners = [];

window.chrome.runtime.onMessage = {
  addListener: (callback) => {
    messageListeners.push(callback);
  },
};

window.chrome.runtime.sendMessage = (message, responseCallback) => {
  // console.log('Mock sendMessage:', message);
  messageListeners.forEach((listener) => {
    // Simulate async response if needed, but for now synchronous call
    // The listener signature is (message, sender, sendResponse)
    // Sender can be a mock object
    const sender = { id: "mock-sender" };
    const sendResponse = (response) => {
      if (responseCallback) {
        responseCallback(response);
      }
    };
    listener(message, sender, sendResponse);
  });
};

window.chrome.action.onClicked = {
  addListener: (callback) => {
    // console.log('Mock action.onClicked listener registered');
    // We could add a button to the UI to trigger this if needed
  },
};

window.chrome.action.setIcon = (details) => {
  // console.log('Mock setIcon:', details);
};

window.chrome.tabs.sendMessage = (tabId, message, responseCallback) => {
  // console.log('Mock tabs.sendMessage:', tabId, message);
  // In a single page environment, we might want to route this back to runtime.onMessage
  // if it's intended for content scripts, but for now just log it.
};

// Mock other APIs as needed
