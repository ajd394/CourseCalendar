

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga'); // Note: https protocol here

ga('create', 'UA-26151492-2', 'auto');
ga('set', 'checkProtocolTask', null); // Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200

chrome.runtime.onInstalled.addListener(function() {
  ga('send', 'event', 'admin', 'install');
});
