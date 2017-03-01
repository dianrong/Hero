
setTimeout(function(){
    if (window.testEntry) {
        for (var i = 0; i < testEntry.length; i++) {
            var entry = testEntry[i];
            var jobDay = entry.day;
            var close = entry.close;
            var currentDay = (new Date()).getUTCMonth()+1+'.'+(new Date()).getUTCDate();
            if (currentDay == jobDay || (!close)) {
                if (entry.tests) {
                    autoRunTests(entry,0);
                };
            };
        };
        window.testEntry = '';
    }
},500);
function autoRunTests(entry,i){
    setTimeout(function(){
        if (i < entry.tests.length) {
          var test = entry.tests[i];
          API.out(test);
        };
        i++;
        if (i < entry.tests.length) {
          autoRunTests(entry,i)
        };
    },1500);
}