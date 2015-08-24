var data = $(".pagebodydiv").children('table.datadisplaytable[summary="This layout table is used to present the schedule course detail"]').map(function() {
   return {
     name: $(this).children("caption").text().split(" - ")[0],
     number: $(this).children("caption").text().split(" - ")[1],
     section: $(this).children("caption").text().split(" - ")[2],
     meetings: $(this).next().find("tr:has(td)").map(function() {
         var $td =  $('td', this);
             return {
                type: $td.eq(0).text(),
                startTime: $td.eq(1).text().split(" - ")[0],
                endTime: $td.eq(1).text().split(" - ")[1],
                days: $td.eq(2).text().split(''),
                location: $td.eq(3).text(),
                startDate: $td.eq(4).text().split(" - ")[0],
                endDate: $td.eq(4).text().split(" - ")[1],
                schedule_type: $td.eq(5).text(),
                instructors: $td.eq(6).text()
                    }
     }).get(),
     semster: $(this).find("th:contains(Associated Term:)").next().text(),
     crn: $(this).find("th:contains(CRN:)").next().text(),
     cred: $(this).find("th:contains(Credits:)").next().text()
   };
}).get();

chrome.extension.sendMessage(data);
