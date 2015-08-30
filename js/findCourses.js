var pageSelector = ".pagebodydiv";
var tableSelector = 'table.datadisplaytable[summary="This layout table is used to present the schedule course detail"]';

var data = $(pageSelector)
.children(tableSelector)
.map(processTables).get();

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


function processTables() {
  var title = $(this).children("caption").text().split(" - ");
  return {
    name: title[0],
    number: title[1],
    section: title[2],
    meetings: $(this).next().find("tr:has(td)").map(processMeeting).get(),
    semster: $(this).find("th:contains(Associated Term:)").next().text(),
    crn: $(this).find("th:contains(CRN:)").next().text(),
    cred: $(this).find("th:contains(Credits:)").next().text()
  };
}

function processMeeting(){
  var $td =  $('td', this);
  var time  =  $td.eq(1).text().split(" - ");
  var date = $td.eq(4).text().split(" - ");
  return {
    type: $td.eq(0).text(),
    startTime: time[0],
    endTime: time[1],
    days: $td.eq(2).text().split(''),
    location: $td.eq(3).text(),
    startDate: date[0],
    endDate: date[1],
    schedule_type: $td.eq(5).text(),
    instructors: $td.eq(6).text()
  };
}
