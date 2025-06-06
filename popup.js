const toggle = document.getElementById('ads-toggle');

chrome.storage.sync.get(['hideAds'], (result) => {
    toggle.checked = !!result.hideAds;
});

toggle.addEventListener('change', () => {
    chrome.storage.sync.set({
        hideAds: toggle.checked,
    });
});
