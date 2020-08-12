chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason == "install") {
        chrome.tabs.create({ url: "options.html" });
    } else if (details.reason == "update") {
        chrome.tabs.create({ url: "options.html" });
    }
});
