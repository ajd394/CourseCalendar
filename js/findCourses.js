var pageSelector = ".pagebodydiv";
var tableSelector = 'table.datadisplaytable[summary="This layout table is used to present the schedule course detail"]';

var data = $(pageSelector)
.children(tableSelector)
.map(processTables).get();

if($(".pagetitlediv:contains('Student Detail Schedule:')").length){
  var imgURL = chrome.extension.getURL("icons/calendar_plus_en.gif");
  $('<img />',{
    id: 'addToCal',
    src: imgURL,
    alt:'Add to Google Calendar'
  }
  ).prependTo(".pageheaderlinks");

  $('#addToCal').click(function(){
    chrome.extension.sendMessage(data);
  });
}

function processTables() {
  var title = $(this).children("caption").text().split(" - ");
  var professor = $(this).find("th:contains(Assigned Instructor:)").next();
  return {
    name: title[0],
    number: title[1],
    section: title[2],
    meetings: $(this).next().find("tr:has(td)").map(processMeeting).get(),
    semster: $(this).find("th:contains(Associated Term:)").next().text(),
    crn: $(this).find("th:contains(CRN:)").next().text(),
    cred: $(this).find("th:contains(Credits:)").next().text().substring(4),
    prof: professor.text().substring(1,professor.text().length-1),
    prof_email: professor.children("a").attr('href').substring(7)
  };
}

function processMeeting(){
  var $td =  $('td', this);
  var time  =  $td.eq(1).text().split(" - ");
  var date = $td.eq(4).text().split(" - ");
  var loc = $td.eq(3).text();
  return {
    type: $td.eq(0).text(),
    startTime: time[0],
    endTime: time[1],
    days: $td.eq(2).text().split(''),
    location: loc.substring(4),
    startDate: date[0],
    endDate: date[1],
    schedule_type: $td.eq(5).text(),
    instructors: $td.eq(6).text()
  };
}
