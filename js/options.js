// Saves options to chrome.storage
calendarItems=null;

function remove_calendar(eventInfo) {
  chrome.storage.sync.get("calendars", function(item) {
    cals = item.calendars;
    cals.splice(eventInfo.data,1);

    chrome.storage.sync.set({
      "calendars": cals
    }, function() {
      restore_cals();
    });
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_cals() {
  $('#cals').empty();
  $('#nocals').empty();
  chrome.storage.sync.get("calendars", function(item) {
    if(item.calendars.length !=0){
      $.each(item.calendars, function(index) {
        button = $("<button>Remove</button>");
        button.click(index,remove_calendar);
        li  = $('<li>' + this.semester + ', ' + this.year + '</li>');
        li.append(button);
        $('#cals').append(li);
      })
    }else{

      $('#nocals').text('No calendars here!');
    }
  });
}
$(document).ready(restore_cals);
