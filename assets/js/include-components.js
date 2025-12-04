(function () {
  // Determine the base path based on the script location
  // We assume this script is at /assets/js/include-components.js
  // So we need to go up 2 levels to get to the root (public/)
  var scripts = document.getElementsByTagName('script');
  var scriptPath = scripts[scripts.length - 1].src;
  // If loaded asynchronously, this might be wrong, but usually it's fine for this setup.
  // Better way: look for the script by name
  for (var i = 0; i < scripts.length; i++) {
    if (scripts[i].src && scripts[i].src.indexOf('include-components.js') !== -1) {
      scriptPath = scripts[i].src;
      break;
    }
  }

  // scriptPath is like http://localhost/.../assets/js/include-components.js
  // We want http://localhost/.../
  var rootPath = scriptPath.replace(/\/assets\/js\/include-components\.js.*/, '/');
  window.APP_ROOT = rootPath;

  function include(selector, url) {
    var el = document.querySelector(selector);
    if (!el) { return; }

    // Remove leading slash if present to append to rootPath
    var relativeUrl = url.startsWith('/') ? url.substring(1) : url;
    var fullUrl = rootPath + relativeUrl;

    fetch(fullUrl).then(function (r) {
      if (!r.ok) throw new Error('Network response was not ok: ' + r.statusText);
      return r.text();
    }).then(function (html) {
      console.log('Included component:', selector);
      // Fix relative links in the loaded HTML
      // This is a simple regex fix for common attributes
      // It replaces href="/" with href="rootPath"
      // But we need to be careful not to break external links
      // For now, let's just load the HTML. 
      // The links in header.html are like /index.html, which are absolute to domain root.
      // We need to fix them to be relative to rootPath.

      var fixedHtml = html.replace(/{{ROOT}}/g, rootPath)
        .replace(/href="\//g, 'href="' + rootPath)
        .replace(/src="\//g, 'src="' + rootPath);

      el.innerHTML = fixedHtml;
      wireToggle(el);

      // If this is header, trigger status update
      if (selector === '[data-include="header"]' && window.updateHeaderLoginStatus) {
        window.updateHeaderLoginStatus();
      }
    }).catch(function (e) { console.error('Include error for ' + selector + ':', e); });
  }

  function wireToggle(scope) {
    var toggle = scope.querySelector('[data-toggle-target]');
    if (!toggle) { return; }
    var targetSel = toggle.getAttribute('data-toggle-target');
    var target = scope.querySelector(targetSel);
    toggle.addEventListener('click', function () {
      if (target) { target.classList.toggle('is-open'); }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    include('[data-include="header"]', 'components/header.html');
    include('[data-include="footer"]', 'components/footer.html');
  });
})();

