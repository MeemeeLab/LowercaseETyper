/// etype_main.js
///
/// Code for the etype main page
/// This code will be loaded on the etype main page
/// 
/// AUTHOR: MeeMeeLab@github
/// LICENSE: MIT
///

let activate = false;

chrome.storage.sync.get('state', function (result) {
    console.log('state loaded; state:', result.state);
    activate = result.state;
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === 'popup' && request.event === 'change') {
        activate = request.state;
        console.log('state changed; state:', activate, 'sender:', sender);
    }
});

// Code for waiting for vitual keyboard to be ready
setInterval(() => {
    if (!activate)
        return;

    const typingContent = document.getElementById('typing_content');
    if (!typingContent)
        return;
    const virtualKeyboard = typingContent.contentWindow.document.getElementById('full_keyboard');
    if (!virtualKeyboard)
        return;
    
    // Make all lowercase
    virtualKeyboard.childNodes.forEach(node => {
        node.innerText = node.innerText.toLowerCase();
    });
}, 1000);


console.log('etype main loaded');
