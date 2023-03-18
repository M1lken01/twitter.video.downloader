let downloader = 'savetweetvid';
const downloadBtnLocation = "document.querySelectorAll('article')[1].children[0].children[0].children[2].children[5].children[0]";
const downloadBtnSvg = '<svg viewBox="0 0 24 24" aria-hidden="true" class="r-4qtqp9 r-yyyyoo r-50lct3 r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1srniue"><g><path d="m 12.00285,22.486647 8.948672,-8.948672 -2.213619,-2.229318 -5.165111,5.18081 V 1.4337185 H 10.432907 V 16.489467 l -5.18081,-5.18081 -2.2136189,2.229318 z"></path></g></svg>';
const downloaders = {
    'savetweetvid': {
        'url': 'https://www.savetweetvid.com/downloader',
        'postUrlData': 'url',
        'downloadBtnCss': 'btn btn-download',
        'parseDownloadLink': false,
    },
    'twittervideodownloader': { // dont use returns 403
        'url': 'https://twittervideodownloader.com/download',
        'postUrlData': 'tweet',
        'downloadBtnCss': 'expanded button small float-right',
        'parseDownloadLink': false,
    },
    'twsaver': {
        'url': 'https://twsaver.com/twitter-video-downloader.php',
        'postUrlData': 'url',
        'downloadBtnCss': 'btn btn-download center',
        'parseDownloadLink': true,
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
    xhr.send(downloaders[downloader].postUrlData + "=" + tweetUrl);
}

function getLinks(response) {
    console.log('Twitter Video Downloader ~ m1lk3n01\nAlternative Download Links'); // fix logging on every popup open
    downloadLinks = Array.from(new DOMParser().parseFromString(response, "text/html").getElementsByClassName(downloaders[downloader].downloadBtnCss)).map(button => button.getAttribute('href'));
    browser.runtime.sendMessage({
        type: "updateBadge",
        len: downloadLinks.length.toString()
    });
    for (let i = 0; i < downloadLinks.length; i++) {
        if (downloaders[downloader].parseDownloadLink) { // fix no parsing after switching from a parsed downloader
            downloadLinks[i] = downloadLinks[i].split(downloadLinks[i].split('http')[0])[1].replace('.mp4', '');
        }
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
    if (!document.querySelector('#downloadbutton') && document.querySelectorAll('article')[1].children[0].children[0].children[2].children[5].children[0])
        document.querySelectorAll('article')[1].children[0].children[0].children[2].children[5].children[0].innerHTML += '<a id="downloadbutton" href="' + downloadLinks[0] + '"><div class="css-1dbjc4n" style="display: inline-grid; justify-content: inherit; transform: rotate(0deg) scale(1) translate3d(0px, 0px, 0px); -moz-box-pack: inherit;"><div class="css-1dbjc4n r-18u37iz r-1h0z5md"><div aria-expanded="false" aria-haspopup="menu" aria-label="Download Tweet" role="button" tabindex="0" class="css-18t94o4 css-1dbjc4n r-1777fci r-hudz2g r-1ny4l3l r-bztko3 r-lrvibr"><div dir="ltr" class="css-901oao r-1awozwy r-14j79pv r-6koalj r-37j5jr r-1b43r93 r-16dba41 r-1h0z5md r-14yzgew r-bcqeeo r-o7ynqc r-clp7b1 r-3s2u2q r-qvutc0"><div class="css-1dbjc4n r-xoduu5"><div class="css-1dbjc4n r-1niwhzg r-sdzlij r-1p0dtai r-xoduu5 r-1d2f490 r-xf4iuw r-1ny4l3l r-u8s1d r-zchlnj r-ipm5af r-o7ynqc r-6416eg"></div>' + downloadBtnSvg + '</div></div></div></div></div></a>';
}

function init() {
    browser.runtime.sendMessage({
            action: "getDlr"
        },
        function (res) {
            downloader = res.downloader;
        });
    requestDownloads();
}

browser.runtime.onMessage.addListener(function (req, sender, sendResponse) {
    switch (req.action) {
        case 'getURL':
            sendResponse({
                url: window.location.href,
                links: JSON.stringify(downloadLinks)
            });
        case 'init':
            init();
        case 'setDlr':
            downloader = req.downloader;
    }
});

init();

//document.getElementsByTagName('article')[0].children[0].children[0].children[0].children[2].children[6].children[0].innerHTML += '<button>Download</button>'
//document.getElementsByTagName('article')[0].children[0].children[0].children[0].children[1].children[1].children[1].children[2].innerHTML += '<button onclick="a()" id="customd">Download</button>';