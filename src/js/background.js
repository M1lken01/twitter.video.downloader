browser.tabs.onActivated.addListener(tabUpdate);
browser.tabs.onUpdated.addListener(tabUpdate);
let cachedLen = '0';

function tabUpdate() {
  browser.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    if (tabs[0] && tabs[0].url.includes('twitter.com/') && tabs[0].url.includes('/status/')) {
      browser.browserAction.setBadgeText({
        text: cachedLen
      });
      browser.tabs.sendMessage(tabs[0].id, {
        action: "init"
      }, function (response) {});
    } else {
      browser.browserAction.setBadgeText({
        text: ''
      });
    }
  });
}

browser.runtime.onMessage.addListener((req) => {
  if (req.type === "updateBadge") {
    cachedLen = req.len;
    browser.browserAction.setBadgeText({
      text: cachedLen
    });
    browser.browserAction.setBadgeBackgroundColor({
      color: [0, 183, 255, 255]
    });
  }
});