let downloader = 'savetweetvid';
const downloaders = {
    'savetweetvid': {
        'url': 'https://www.savetweetvid.com/downloader',
        'posturldata': 'url',
        'downloadbuttoncss': 'btn btn-download'
    },
    'twittervideodownloader': {
        'url': 'https://twittervideodownloader.com/download',
        'posturldata': 'tweet',
        'downloadbuttoncss': 'expanded button small float-right'
    },
};
let downloadLinks = [];
let errorChecks = 25
let errorDelay = 1000 // in ms

function requestDownloads(tweetUrl = window.location.href) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", downloaders[downloader].url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState != 4)
            return
        if (xhr.status == 200)
            getLinks(xhr.responseText);
        else
            console.error("Error: " + xhr.status);
    };
    xhr.send(downloaders[downloader].posturldata + "=" + tweetUrl);
}

function getLinks(response) {
    console.log('Twitter Video Downloader ~ m1lk3n01\nAlternative Download Links');
    downloadLinks = Array.from(new DOMParser().parseFromString(response, "text/html").getElementsByClassName(downloaders[downloader].downloadbuttoncss)).map(button => button.getAttribute('href'));
    browser.runtime.sendMessage({
        type: "updateBadge",
        len: downloadLinks.length.toString()
    });
    for (let i = 0; i < downloadLinks.length; i++) {
        console.log("%c" + downloadLinks[i], "cursor: pointer;");
    }
    const waitForLoad = setInterval(() => { // check if the video is loaded
        errorChecks--;
        if (errorChecks === 0 || typeof document.getElementsByTagName('article') != undefined && document.querySelectorAll('video').length > 0) {
            createDownloadButton();
            clearInterval(waitForLoad);
        }
    }, errorDelay);
}

function createDownloadButton() {
    if (!document.querySelector('#downloadbutton'))
        document.querySelector('article').children[0].children[0].children[0].children[2].children[3].innerHTML += '<a id="downloadbutton" href="' + downloadLinks[0] + '" aria-label="Tweet" role="link" class="css-4rbku5 css-18t94o4 css-1dbjc4n r-4nw3r4 r-42olwf r-sdzlij r-1phboty r-rs99b7 r-1waj6vr r-1loqt21 r-1jayybb r-mtrfb5 r-1ny4l3l r-15bsvpr r-o7ynqc r-6416eg r-lrvibr" data-testid="SideNav_NewTweet_Button"><div dir="ltr" class="css-901oao r-1awozwy r-jwli3a r-6koalj r-18u37iz r-16y2uox r-37j5jr r-1b43r93 r-b88u0q r-1777fci r-hjklzo r-bcqeeo r-q4m81j r-qvutc0"><span class="css-901oao css-16my406 css-1hf3ou5 r-poiln3 r-ubezar r-hjklzo r-bcqeeo r-qvutc0"><div style=""><div class="css-1dbjc4n r-xoduu5"><span class="css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0"><span class="css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0">Download</span></span></div></div></span></div></a>';
}

function init() {
    requestDownloads();
}

browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    switch (request.action) {
        case 'getURL':
            sendResponse({
                url: window.location.href,
                links: JSON.stringify(downloadLinks)
            });
        case 'init':
            init();
    }
});

init();

//document.getElementsByTagName('article')[0].children[0].children[0].children[0].children[2].children[6].children[0].innerHTML += '<button>Download</button>'
//document.getElementsByTagName('article')[0].children[0].children[0].children[0].children[1].children[1].children[1].children[2].innerHTML += '<button onclick="a()" id="customd">Download</button>';