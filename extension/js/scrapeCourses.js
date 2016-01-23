var pageSelector = ".pagebodydiv";
var tableSelector = 'table.datadisplaytable[summary="This layout table is used to present the schedule course detail"]';

var data = $(pageSelector)
.children(tableSelector)
.map(processTables).get();

$(document).ready(function(){
  if($(".pagetitlediv:contains('Student Detail Schedule:')").length){
  //if(true){
    loadHtml();
  }
});

function loadHtml(callback) {
  var imgURL = chrome.extension.getURL("icons/calendar_plus_en.gif");
  $('<img />',{
    id: 'addToCal',
    src: imgURL,
    alt:'Add to Google Calendar'
  }
  ).prependTo(".pageheaderlinks");

  //dialog html
  $.get(chrome.extension.getURL('html/dialog.html'), function(html) {
    $($.parseHTML(html)).appendTo('body');
    loadJs();
  });
}

function loadJs() {
    //button event listners
    $('#addToCal').click(function(){
      semInfo = $(".staticheaders").html().split("<br>")[1].split(" ");
      $("#dialog input[name=semester]").val(semInfo[1]);
      $("#dialog input[name=year]").val(semInfo[0]);
      document.getElementById("dialog").showModal();
    });
    $('#cancel').click(function(){
      document.getElementById("dialog").close();
    });
    //form event listener
    $('#cal_form').submit(function(e) {
        e.preventDefault();
        var form_data = $("#cal_form :input").serializeArray();
        var message = {};
        $.each(form_data, function() {
            message[this.name] = this.value;
        });
        message.course_data = data;
        chrome.extension.sendMessage(message);
        document.getElementById("dialog").close();
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
