
$(document).ready(function () {
    $('body').on('click', 'a', function () {
        chrome.tabs.create({ url: $(this).attr('href') });
        return false;
    });
    run();
});

function run() {
    chrome.extension.getBackgroundPage().console.log('RUN');
    document.getElementById("refresh").innerHTML = chrome.i18n.getMessage("refresh", ['refresh']);
    document.getElementById("option").innerHTML = chrome.i18n.getMessage("option", ['option']);
    chrome.storage.sync.get(['token', 'username'], function (credentials) {
        if (credentials && 'username' in credentials && 'token' in credentials) {
            document.getElementById('username').innerHTML = `<a class="text-dark" href="https://gist.github.com/${credentials.username}">${credentials.username}</a> gists`;
            sync(credentials.username, credentials.token);
        } else {
            chrome.extension.getBackgroundPage().console.log('Ask for username / passwords');
            chrome.tabs.create({ url: "options.html" });
        }
    });
}

function sync(username, token) {
    $("result").html("Retrieving...");
    var result = '';
    if (token) {
        $.ajaxSetup({
            headers: {
                'Authorization': `token ${token}`
            }
        });
    }
    $.get(`https://api.github.com/users/${username}/gists`, function (data) {
        new Promise(r => setTimeout(r, 2000));
        data.sort(function (a, b) {
            if (a.public && b.public) return 0;
            if (!a.public && b.public) return -1;
            if (a.public && !b.public) return 1;
        });

        data.forEach(gist => {
            var html = `<a style="text-decoration: none;" class="text-${gist.public ? 'primary' : 'danger'}" id="${gist.id}" href="${gist.html_url}">${gist.description ? gist.description : "<em>No description</em>"}</a>
            (<a href="${gist.html_url.replace('.com/', `.com/${username}/`)}/edit">
                <svg class="text-${gist.public ? 'primary' : 'danger'}" width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-pen" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M5.707 13.707a1 1 0 0 1-.39.242l-3 1a1 1 0 0 1-1.266-1.265l1-3a1 1 0 0 1 .242-.391L10.086 2.5a2 2 0 0 1 2.828 0l.586.586a2 2 0 0 1 0 2.828l-7.793 7.793zM3 11l7.793-7.793a1 1 0 0 1 1.414 0l.586.586a1 1 0 0 1 0 1.414L5 13l-3 1 1-3z"/>
                    <path fill-rule="evenodd" d="M9.854 2.56a.5.5 0 0 0-.708 0L5.854 5.855a.5.5 0 0 1-.708-.708L8.44 1.854a1.5 1.5 0 0 1 2.122 0l.293.292a.5.5 0 0 1-.707.708l-.293-.293z"/>
                    <path d="M13.293 1.207a1 1 0 0 1 1.414 0l.03.03a1 1 0 0 1 .03 1.383L13.5 4 12 2.5l1.293-1.293z"/>
                </svg>
            </a>)<ul>`;
            for (var filename in gist.files) {
                if (gist.files.hasOwnProperty(filename)) {
                    html += `<li><a style="text-decoration: none;" class="text-dark" href="${gist.html_url}#file-${filename.replace('.', '-').toLowerCase()}">${filename}</a></li>`;
                }
            }
            result += html + "</ul>";
        });
        document.getElementById("result").innerHTML = result;

    });
}

document.getElementById("refresh").addEventListener("click", run);
document.getElementById("option").addEventListener("click", function () { chrome.tabs.create({ url: "options.html" }); });