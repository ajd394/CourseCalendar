var data = $(".pagebodydiv").children('table.datadisplaytable[summary="This layout table is used to present the schedule course detail"]').map(function() {
   return {
     courseName: $(this).children("caption").text().split(" - ")[0],
     courseNumber: $(this).children("caption").text().split(" - ")[1],
     section: $(this).children("caption").text().split(" - ")[2],
     meetings: $(this).next().find("tr:has(td)").map(function() {
         var $td =  $('td', this);
             return {
                type: $td.eq(0).text(),
                time: $td.eq(1).text(),
                days: $td.eq(2).text(),
                where: $td.eq(3).text(),
                date_range: $td.eq(4).text(),
                schedule_type: $td.eq(5).text(),
                instructors: $td.eq(6).text()
                    }
     }).get()
   };
}).get();

console.log(data);
