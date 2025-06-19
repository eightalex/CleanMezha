chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === 'fetchReactions') {
        fetch(msg.url)
            .then(res => res.text())
            .then(html => sendResponse({html}))
            .catch(() => sendResponse({html: null}));
        return true;
    }
});
