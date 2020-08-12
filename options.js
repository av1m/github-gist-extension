// Saves options to chrome.storage
function save_options() {
  var username = document.getElementById('username').value;
  var token = document.getElementById('token').value;
  chrome.storage.sync.set({
    username: username,
    token: token
  }, function () {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = chrome.i18n.getMessage("credentials_registered");
    setTimeout(function () {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value for username and token
  chrome.storage.sync.get({
    username: 'av1m',
    token: ''
  }, function (items) {
    document.getElementById('username').value = items.username;
    document.getElementById('token').value = items.token;
  });
}

// Main
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);