const storageItems = ['downloader', 'errorChecks', 'errorDelay', 'currentUrl', 'links'];
const storageItemDefaults = ['savetweetvid', 25, 1000, '', JSON.stringify([])];

document.addEventListener('DOMContentLoaded', function () {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            action: "getURL"
        }, function (response) {
            fetchUrl(response);
        });
    });
});

function fetchUrl(response) {
    setLocalStorage(storageItems[3], response.url);
    setLocalStorage(storageItems[4], response.links);
    let links = JSON.parse(localStorage.getItem(storageItems[4]));
    console.log(links);
    for (let i = 0; i < links.length; i++) {
        document.querySelector('#links').innerHTML += '<li><a href="' + links[i] + '">Download ' + links[i].split('vid/')[1].split('/')[0] + '</a></li>';
    }
}

function setLocalStorageWithId(item, id) {
    localStorage.setItem(item, document.getElementById(id).value);
    console.log(item + ': ' + localStorage.getItem(item))
}

function setLocalStorage(item, value) {
    localStorage.setItem(item, value);
    console.log(item + ': ' + localStorage.getItem(item))
}

function init() {
    for (let i = 0; i < storageItems.length; i++) {
        if (localStorage.getItem(storageItems[i]) == null)
            setLocalStorage(storageItems[i], storageItemDefaults[i]);
    }
}

init();