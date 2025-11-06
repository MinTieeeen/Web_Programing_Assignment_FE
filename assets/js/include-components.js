(function(){
  function include(selector, url){
    var el = document.querySelector(selector);
    if(!el){ return; }
    fetch(url).then(function(r){return r.text();}).then(function(html){
      el.innerHTML = html;
      wireToggle(el);
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

