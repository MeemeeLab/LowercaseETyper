/// etype_main.js
///
/// Code for the etype main page
/// This code will be loaded on the etype main page
/// 
/// AUTHOR: MeeMeeLab@github
/// LICENSE: MIT
///

let activate = false;

function ifTrue(data, cb) {
    if (data) {
        return cb(data);
    } else {
        return undefined;
    }
}

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


    // Virtual keyboard keys
    const virtualKeyboard = typingContent.contentWindow.document.getElementById('full_keyboard');
    if (virtualKeyboard) {
        // Make all lowercase
        virtualKeyboard.childNodes.forEach(node => {
            node.innerText = node.innerText.toLowerCase();
        });
    }

    // Sentence keys
    const sentenceElems = ifTrue(typingContent.contentWindow.document.getElementById('sentenceText'), data => data.childNodes[0]);
    if (sentenceElems) {
        const sentenceDone = sentenceElems.childNodes[0];
        const sentence = sentenceElems.childNodes[1];

        if (sentenceDone && sentence) {
            sentenceDone.innerText = sentenceDone.innerText.toLowerCase();
            sentence.innerText = sentence.innerText.toLowerCase();
        }
    }
}, 100);


console.log('etype main loaded');
