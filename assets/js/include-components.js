(function(){
  function include(selector, url){
    var el = document.querySelector(selector);
    if(!el){ return; }
    fetch(url).then(function(r){return r.text();}).then(function(html){
      el.innerHTML = html;
      wireToggle(el);
      
      // If this is the header, execute any scripts and then trigger the header initialization
      if(selector === '[data-include="header"]') {
        // Execute any script tags in the inserted HTML
        var scripts = el.querySelectorAll('script');
        scripts.forEach(function(script) {
          var newScript = document.createElement('script');
          if (script.src) {
            newScript.src = script.src;
            newScript.onload = function() {
              // After header script loads, initialize the header
              setTimeout(function() {
                if(window.initializeHeader) {
                  console.log('Calling initializeHeader from include-components.js after script load');
                  window.initializeHeader();
                }
              }, 50);
            };
          } else {
            newScript.textContent = script.textContent;
          }
          document.head.appendChild(newScript);
        });
        
        // Also try after a delay in case script is already loaded
        setTimeout(function() {
          if(window.initializeHeader) {
            console.log('Calling initializeHeader from include-components.js with delay');
            window.initializeHeader();
          }
          if(window.updateHeaderLoginStatus) {
            console.log('Calling updateHeaderLoginStatus from include-components.js');
            window.updateHeaderLoginStatus();
          }
        }, 200);
      }
    }).catch(function(){ /* ignore */ });
  }

  function wireToggle(scope){
    var toggle = scope.querySelector('[data-toggle-target]');
    if(!toggle){ return; }
    var targetSel = toggle.getAttribute('data-toggle-target');
    var target = scope.querySelector(targetSel);
    toggle.addEventListener('click', function(){
      if(target){ target.classList.toggle('is-open'); }
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    include('[data-include="header"]', '/components/header.html');
    include('[data-include="footer"]', '/components/footer.html');
  });
})();

