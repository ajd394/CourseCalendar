var apiToken;

chrome.runtime.onInstalled.addListener(function() {
  // Replace all rules ...
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    // With a new rule ...
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: 'CrseSchdDetl' },
          })
        ],
        // And shows the extension's page action.
        actions: [ new chrome.declarativeContent.ShowPageAction(), ]
      }
    ]);
  });

  chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
    apiToken = token;
  });
});

chrome.runtime.onMessage.addListener(function(data,sender,sendResponse){
  console.log(data);//DEBUG
  sendResponse();
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var calRes = JSON.parse(xhr.responseText);
      chrome.storage.sync.get("calId", function(value){
        if(value){
          var xhr2 = new XMLHttpRequest();
          xhr2.open("DELETE", "https://www.googleapis.com/calendar/v3/calendars/" +  value.calId, true);
          xhr2.setRequestHeader('Authorization', 'Bearer ' + apiToken); // token comes from chrome.identity
          xhr2.setRequestHeader('Content-Type', 'application/json');
          xhr2.send();
        }
      });
      chrome.storage.sync.set({'calId': calRes.id});
      for (var i = 0; i < data.length; i++) {//classes
        var course = data[i];
        for (var j = 0; j < course.meetings.length; j++) {//meetins of classes
          var xhr1 = new XMLHttpRequest();
          var meeting = course.meetings[j];

          var start = new Date(Date.parse(meeting.startDate + " " + meeting.startTime));
          var end = new Date(Date.parse(meeting.startDate +  " " + meeting.endTime));
          var semesterEnd = new Date(Date.parse(meeting.endDate));

          start.setDate(start.getDate() + dateIncrement(meeting.days[0]));
          end.setDate(end.getDate() + dateIncrement(meeting.days[0]));


          var event = {
            'summary': course.number.concat(" ", course.name, (meeting.schedule_type !== "Lecture" ? " (" + meeting.schedule_type  + ")":"")),
            'location': meeting.location,
            'description': 'test',
            'start': {
              'dateTime': start.toISOString(),
              'timeZone': 'America/New_York'
            },
            'end': {
              'dateTime': end.toISOString(),
              'timeZone': 'America/New_York'
            },
            'recurrence': [
              'RRULE:FREQ=WEEKLY;UNTIL=' + semesterEnd.toISOString().replace(/[\.:-]|000/g,"") + ';BYDAY=' + convertWeekDays(meeting.days)
            ]
          };

          xhr1.open("POST", "https://www.googleapis.com/calendar/v3/calendars/" + calRes.id  + "/events", true);
          xhr1.setRequestHeader('Authorization', 'Bearer ' + apiToken); // token comes from chrome.identity
          xhr1.setRequestHeader('Content-Type', 'application/json');
          xhr1.send(JSON.stringify(event));
        }
      }
    }
  };

  xhr.open("POST", "https://www.googleapis.com/calendar/v3/calendars/", true);
  xhr.setRequestHeader('Authorization', 'Bearer ' + apiToken); // token comes from chrome.identity
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({
    "kind": "calendar#calendar",
    "summary": "Courses",
    "description": "Courses imported by CourseCalendar"
  }));


});

function convertWeekDays(days){
  //TODO support weekends
  var weekdaynums = "";
  for (var y = 0; y < days.length; y++) {
    switch (days[y]) {
      case 'M':
        weekdaynums = weekdaynums + "MO,";
        break;
      case 'T':
          weekdaynums = weekdaynums + "TU,";
        break;
      case 'W':
          weekdaynums = weekdaynums + "WE,";
        break;
      case 'R':
          weekdaynums = weekdaynums + "TH,";
        break;
      case 'F':
          weekdaynums = weekdaynums + "FR,";
        break;
    }
  }
  return weekdaynums.substring(0, weekdaynums.length - 1);
}

function dateIncrement(char){
  var int = 0;
  switch (char) {
    case 'M':
      int = 0;
      break;
    case 'T':
        int = 1;
      break;
    case 'W':
        int = 2;
      break;
    case 'R':
        int = 3;
      break;
    case 'F':
        int = 4;
      break;
  }
  return int;
}
