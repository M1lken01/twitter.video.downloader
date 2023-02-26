const storageItems = ['downloader', 'errorChecks', 'errorDelay', ];
const storageItemDefaults = ['savetweetvid', 25, 1000, ];

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