/// popup.js
///
/// Code for popup.html
///
/// AUTHOR: MeeMeeLab@github
/// LICENSE: MIT
///

const sendMessageEventHandler = function (_) {
    const lastError = chrome.runtime.lastError;
    if (lastError) {
        if (lastError.message === 'Could not establish connection. Receiving end does not exist.') {
            console.log('Failed to send message; Looks like e-type is not open or running.');
        } else {
            console.error(lastError.message);
        }
    }
};

const sendMessage = function (message) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message, sendMessageEventHandler);
    });
};

sendMessage({
    type: 'popup',
    event: 'load'
});

document.addEventListener('DOMContentLoaded', function () {
    const status = document.getElementById('status');
    const checkbox = document.getElementById('checkbox');

    chrome.storage.sync.get('state', function (result) {
        console.log('state loaded; state:', result.state);
        checkbox.checked = result.state;
        checkbox.disabled = false;

        // Register event listener for checkbox
        checkbox.addEventListener('change', function () {
            // Notify all e-type website to disable or enable
            sendMessage({
                type: 'popup',
                event: 'change',
                state: checkbox.checked
            });

            // Push current state flag to storage
            chrome.storage.sync.set({
                state: checkbox.checked
            }, function () {
                console.log('state saved');
                status.innerText = 'Configuration saved / 設定は保存されました';
                setTimeout(function () {
                    status.innerText = '';
                }, 3000);
            });
        });
    });
});