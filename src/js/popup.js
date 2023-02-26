const storageItems = ['downloader', 'errorChecks', 'errorDelay', 'currentUrl', 'links'];
const storageItemDefaults = ['savetweetvid', 25, 1000, '', JSON.stringify([])];

document.addEventListener('DOMContentLoaded', function () {
    browser.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        browser.tabs.sendMessage(tabs[0].id, {
            action: "getURL"
        }, function (response) {
            fetchUrl(response);
        });
    });
});

function fetchUrl(response) {
    if (!response.url.includes('/status/'))
        return
    setLocalStorage(storageItems[3], response.url);
    setLocalStorage(storageItems[4], response.links);
    let links = JSON.parse(localStorage.getItem(storageItems[4]));
    browser.browserAction.setBadgeText({
        text: links.length.toString()
    });
    document.querySelector('#title').innerHTML = '@' + localStorage.getItem(storageItems[3]).split('.com/')[1].split('/status')[0];
    for (let i = 0; i < links.length; i++) {
        let name = '';
        let filename = links[i].split('/')[links[i].split('/').length - 1];
        if (links[i].includes('vid/')) { // its a video
            name = links[i].split('vid/')[1].split('/')[0] + ' - ' + filename.split('?')[0];
        } else if (links[i].includes('tweet_video')) { // its a gif
            name = filename;
        } else {
            return;
        }
        document.querySelector('#links').innerHTML += '<li><a href="' + links[i] + '">Download ' + name + '</a></li>';
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
    browser.browserAction.setBadgeBackgroundColor({
        color: [0, 183, 255, 255]
    });
    for (let i = 0; i < storageItems.length; i++) {
        if (localStorage.getItem(storageItems[i]) == null)
            setLocalStorage(storageItems[i], storageItemDefaults[i]);
    }
}

init();