$(document).ready(restore_cals);

function remove_calendar(eventInfo) {
  chrome.storage.sync.get("calendars", function(item) {
    cals = item.calendars;

    remove_calendar_gcal(cals[eventInfo.data].calId);

    cals.splice(eventInfo.data,1);

    chrome.storage.sync.set({
      "calendars": cals
    }, restore_cals);
  });
}

function restore_cals() {
  $('#cals').empty();
  $('#nocals').empty();
  chrome.storage.sync.get("calendars", function(item) {
    if(item.calendars && item.calendars.length !== 0){
      $.each(item.calendars, function(index) {
        button = $("<button>Remove</button>");
        button.click(index,remove_calendar);
        li  = $('<li>' + this.semester + ', ' + this.year + '</li>');
        li.append(button);
        $('#cals').append(li);
      });
    }else{
      $('#nocals').text('No calendars here!');
    }
  });
}

function remove_calendar_gcal(id){
  chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
    var xhr2 = new XMLHttpRequest();
    xhr2.open("DELETE", "https://www.googleapis.com/calendar/v3/calendars/" +  id, true);
    xhr2.setRequestHeader('Authorization', 'Bearer ' + token); // token comes from chrome.identity
    xhr2.setRequestHeader('Content-Type', 'application/json');
    xhr2.send();
  });
}
