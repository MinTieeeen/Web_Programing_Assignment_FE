(function(){
  // // Determine the base path based on the script location
  // // We assume this script is at /assets/js/include-components.js
  // // So we need to go up 2 levels to get to the root (public/)
  var scripts = document.getElementsByTagName('script');
  var scriptPath = scripts[scripts.length - 1].src;
  
  // If loaded asynchronously, look for the script by name
  for(var i=0; i<scripts.length; i++) {
    if(scripts[i].src && scripts[i].src.indexOf('include-components.js') !== -1) {
      scriptPath = scripts[i].src;
      break;
    }
  }
  
  // // scriptPath is like http://localhost/.../assets/js/include-components.js
  // // We want http://localhost/.../
  var rootPath = scriptPath.replace(/\/assets\/js\/include-components\.js.*/, '/');
  
  // Fallback if regex fails (e.g. strange hosting setup)
  if (rootPath === scriptPath || rootPath.indexOf('/assets/') > -1) {
     var assetIdx = scriptPath.indexOf('/assets/');
     if (assetIdx !== -1) {
         rootPath = scriptPath.substring(0, assetIdx + 1);
     } else {
         rootPath = '/';
     }
  }

  // window.APP_ROOT = rootPath;
  console.log('[DEBUG] Root Path identified as:', rootPath);

  function include(selector, url){
    var el = document.querySelector(selector);
    if(!el){ return; }
    
    // Remove leading slash if present to append to rootPath
    var relativeUrl = url.startsWith('/') ? url.substring(1) : url;
    var fullUrl = rootPath + relativeUrl;
    
    // console.log('[DEBUG] Fetching component:', fullUrl);

    fetch(fullUrl).then(function(r){
      if(!r.ok) throw new Error('Network response was not ok: ' + r.statusText);
      return r.text();
    }).then(function(html){
      // console.log('Included component:', selector);
      
      // Fix relative links in the loaded HTML
      // It replaces href="/" with href="rootPath" and src="/" with src="rootPath"
      // This allows writing components with absolute paths like href="/products/" 
      // which then get remapped to http://localhost/project/products/
      
      var fixedHtml = html.replace(/href="\//g, 'href="' + rootPath)
                          .replace(/src="\//g, 'src="' + rootPath);

      el.innerHTML = fixedHtml;
      
      // Execute scripts in the included HTML
      var scripts = el.getElementsByTagName('script');
      for (var i = 0; i < scripts.length; i++) {
          var script = document.createElement('script');
          if (scripts[i].src) {
              script.src = scripts[i].src;
          } else {
              script.textContent = scripts[i].textContent;
          }
          document.body.appendChild(script);
      }

      wireToggle(el);
      
      // If this is header, trigger status update
      if(selector === '[data-include="header"]' && window.updateHeaderLoginStatus) {
        window.updateHeaderLoginStatus();
      }
      
      // Initialize/Refresh AOS animations if available
      if (window.AOS) {
          // If already initialized, refresh to find new elements
          // If not, init() will work.
          // AOS.refresh() might be safer if already running, but init() is usually idempotent-ish or safe to re-call for new content if configured right.
          // Using setTimeout to ensure DOM render
          setTimeout(function() { 
              AOS.init({
                  once: true,
                  offset: 0,
                  duration: 1000,
              });
              // Force refresh for dynamic content
              AOS.refresh(); 
          }, 100);
      }
    }).catch(function(e){ console.error('Include error for ' + selector + ':', e); });
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

  function wireSidebar() {
      // Global delegation for Sidebar
      document.body.addEventListener('click', function(e) {
          const menuIcon = e.target.closest('.menu-icon');
          const closeIcon = e.target.closest('.tq-close-icon');
          const overlay = e.target.closest('.tq-sidebar-overlay'); // If we have one
          const sidebar = document.querySelector('.tq-sidebar');

          if (menuIcon && sidebar) {
              sidebar.classList.add('open-sidebar');
          }

          if ((closeIcon || overlay) && sidebar) {
              sidebar.classList.remove('open-sidebar');
          }
      });
  }

  function init() {
    include('[data-include="header"]', 'components/header.html');
    include('[data-include="footer"]', 'components/footer.html');
    wireSidebar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
