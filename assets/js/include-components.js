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
          } else {
            newScript.textContent = script.textContent;
          }
          document.head.appendChild(newScript);
        });
        
        // Wait a bit for scripts to execute and then update header status
        setTimeout(function() {
          if(window.updateHeaderLoginStatus) {
            console.log('Calling updateHeaderLoginStatus from include-components.js');
            window.updateHeaderLoginStatus();
          } else {
            console.log('updateHeaderLoginStatus not available yet');
          }
        }, 100);
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

