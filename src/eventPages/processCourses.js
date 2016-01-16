(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga'); // Note: https protocol here

ga('create', 'UA-26151492-2', 'auto');
ga('set', 'checkProtocolTask', null);


chrome.runtime.onMessage.addListener(function(data,sender){

  chrome.identity.getAuthToken({ 'interactive': true }, function(token) {

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var calRes = JSON.parse(xhr.responseText);
        chrome.storage.sync.get("calId", function(value){
          if(value){
            var xhr2 = new XMLHttpRequest();
            xhr2.open("DELETE", "https://www.googleapis.com/calendar/v3/calendars/" +  value.calId, true);
            xhr2.setRequestHeader('Authorization', 'Bearer ' + token); // token comes from chrome.identity
            xhr2.setRequestHeader('Content-Type', 'application/json');
            xhr2.send();
          }
        });
        chrome.storage.sync.set({'year':2015,'semster':'Fall','calId': calRes.id});
        for (var i = 0; i < data.length; i++) {//classes
          processCourse(data[i], calRes.id,token);
        }

        var opt = {
          type: "basic",
          title: "CourseCalendar",
          message: "CourseCalendar successfully added your scheule to your Google Calendar",
          iconUrl: "icons/icon-48.png"
        }
        chrome.notifications.create(opt);
        ga('send', 'event', 'process', 'courses');
      }
    };

    xhr.open("POST", "https://www.googleapis.com/calendar/v3/calendars/", true);
    xhr.setRequestHeader('Authorization', 'Bearer ' + token); // token comes from chrome.identity
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
      "kind": "calendar#calendar",
      "summary": "Courses",
      "description": "Courses imported by CourseCalendar"
    }));
  });



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


function processCourse(course, calId, apiToken) {
  for (var j = 0; j < course.meetings.length; j++) {//meetins of classes
    var meeting = course.meetings[j];

    var start = new Date(Date.parse(meeting.startDate + " " + meeting.startTime));
    var end = new Date(Date.parse(meeting.startDate +  " " + meeting.endTime));
    var semesterEnd = new Date(Date.parse(meeting.endDate));

    start.setDate(start.getDate() + dateIncrement(meeting.days[0]));
    end.setDate(end.getDate() + dateIncrement(meeting.days[0]));

    var desc = ''.concat("Professor: ", course.prof, " - " , course.prof_email, '\nSection: ', course.section, '\nCRN: ', course.crn, '\nCredits: ', course.cred);

    var event = {
      'summary': course.number.concat(" ", course.name, (meeting.schedule_type !== "Lecture" ? " (" + meeting.schedule_type  + ")":"")),
      'location': meeting.location,
      'description': desc,
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

    submitEvent(event,calId,apiToken);
  }
}



function submitEvent(event, calId, apiToken) {
  var xhr1 = new XMLHttpRequest();
  /*
  xhr1.onreadystatechange = function() {  //DEBUG
  console.log(JSON.parse(xhr1.responseText));
  };*/
  xhr1.open("POST", "https://www.googleapis.com/calendar/v3/calendars/" + calId  + "/events", true);
  xhr1.setRequestHeader('Authorization', 'Bearer ' + apiToken); // token comes from chrome.identity
  xhr1.setRequestHeader('Content-Type', 'application/json');
  xhr1.send(JSON.stringify(event));
}
