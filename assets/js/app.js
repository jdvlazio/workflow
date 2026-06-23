/* app.js — BEHAVIOR layer: mobile nav, accordion, expand/collapse, search.
   Reads the format map from window.FORMAT_MAP (formats.js). Runs on every page; guards by feature. */
(function(){
  // Mobile sidebar toggle (every page)
  var menuBtn = document.querySelector('.menu-btn');
  var sidebar = document.querySelector('.sidebar');
  if(menuBtn && sidebar){
    menuBtn.addEventListener('click', function(){ sidebar.classList.toggle('open'); });
  }

  // Accordion pages only
  if(!document.querySelector('.head')) return;

  function setExpanded(item, open){
    var b = item.querySelector(':scope > .head');
    if(b) b.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  document.querySelectorAll('.item').forEach(function(item, i){
    var head = item.querySelector(':scope > .head');
    var body = item.querySelector(':scope > .body');
    if(head && body){ body.id = 'sec-' + i; head.setAttribute('aria-controls', 'sec-' + i); }
  });

  var topItems = document.querySelectorAll('#acc > .item, #acc2 > .item, #acc3 > .item');
  var tg = document.getElementById('toggleAll');

  function allOpen(){
    return Array.prototype.every.call(topItems, function(i){ return i.hidden || i.classList.contains('open'); });
  }
  function updateToggle(){
    if(!tg) return;
    var all = allOpen();
    tg.classList.toggle('open', all);
    var l = tg.querySelector('.tg-label');
    if(l) l.textContent = all ? 'Collapse all' : 'Expand all';
  }
  document.querySelectorAll('.head').forEach(function(btn){
    btn.addEventListener('click', function(){
      var item = btn.parentElement;
      var open = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      updateToggle();
    });
  });
  function setAll(open){
    document.querySelectorAll('.item').forEach(function(item){
      if(item.hidden) return;
      item.classList.toggle('open', open);
      setExpanded(item, open);
    });
  }
  if(tg){ tg.addEventListener('click', function(){ setAll(!allOpen()); updateToggle(); }); }

  // Search pages only
  var q = document.getElementById('q');
  var hint = document.getElementById('hint');
  var nores = document.getElementById('noresults');
  if(!q) return;

  var EXT = window.FORMAT_MAP || {};

  function resetAll(hidden){
    document.querySelectorAll('.item').forEach(function(i){
      i.hidden = !!hidden; i.classList.remove('match','open'); setExpanded(i, false);
    });
  }
  function showNote(ext, note){
    resetAll(true);
    if(hint){ hint.hidden = false; hint.innerHTML = '<code>.' + ext + '</code> — ' + note; }
    if(nores) nores.hidden = true;
    updateToggle();
  }
  function resolveExt(ext){
    var v = EXT[ext];
    if(v && v.note){ showNote(ext, v.note); return; }
    var opts = v.opts;                          // [[dest, when?], ...]
    var single = opts.length === 1;
    var topName = {};                           // carpetas raíz involucradas
    var subByTop = {};                          // sub a resaltar por carpeta raíz (solo destino único)
    opts.forEach(function(o){
      var parts = o[0].split('/');
      topName[parts[0]] = true;
      if(single && parts[1]) subByTop[parts[0]] = parts[1];
    });
    Array.prototype.forEach.call(topItems, function(top){
      var fnEl = top.querySelector(':scope > .head .fn');
      var nameTop = fnEl ? fnEl.textContent.trim() : '';
      var isTarget = !!topName[nameTop];
      top.hidden = !isTarget;
      top.classList.toggle('open', isTarget);
      setExpanded(top, isTarget);
      if(!isTarget) return;
      var subs = [].slice.call(top.querySelectorAll(':scope .tree > .item'));
      var sub = subByTop[nameTop];
      if(sub){                                   // destino único con subcarpeta → resáltala
        top.classList.remove('match');
        subs.forEach(function(s){
          var sn = s.querySelector(':scope > .head .sn');
          var m = sn && sn.textContent.trim() === sub;
          s.hidden = !m; s.classList.toggle('open', m); s.classList.toggle('match', m); setExpanded(s, m);
        });
      } else {                                   // ambiguo / carpeta raíz → resalta la carpeta, muestra subs
        top.classList.add('match');
        subs.forEach(function(s){ s.hidden = false; s.classList.remove('open','match'); setExpanded(s, false); });
      }
    });
    if(hint){
      hint.hidden = false;
      if(single){
        hint.innerHTML = '<code>.' + ext + '</code> &rarr; <code>' + opts[0][0] + '</code>'
                       + (opts[0][1] ? ' · ' + opts[0][1] : '');
      } else {
        var h = '<code>.' + ext + '</code> — depends on what it is:<ul class="opts">';
        opts.forEach(function(o){ h += '<li><code>' + o[0] + '</code> — ' + o[1] + '</li>'; });
        hint.innerHTML = h + '</ul>';
      }
    }
    if(nores) nores.hidden = true;
    updateToggle();
  }
  function noMatch(){
    resetAll(true);
    if(hint) hint.hidden = true;
    if(nores) nores.hidden = false;
    updateToggle();
  }
  function clearFilter(){
    resetAll(false);
    if(hint) hint.hidden = true;
    if(nores) nores.hidden = true;
    updateToggle();
  }
  function textSearch(query){
    var anyShown = false;
    Array.prototype.forEach.call(topItems, function(top){
      var show = top.textContent.toLowerCase().indexOf(query) >= 0;
      top.hidden = !show;
      top.classList.toggle('open', show);
      setExpanded(top, show);
      var subs = [].slice.call(top.querySelectorAll(':scope .tree > .item'));
      var matchedSubs = subs.filter(function(s){ return s.textContent.toLowerCase().indexOf(query) >= 0; });
      top.classList.toggle('match', show && matchedSubs.length === 0);
      if(show && subs.length){
        if(matchedSubs.length){
          subs.forEach(function(s){
            var m = matchedSubs.indexOf(s) >= 0;
            s.hidden = !m; s.classList.toggle('open', m); s.classList.toggle('match', m); setExpanded(s, m);
          });
        } else {
          subs.forEach(function(s){ s.hidden = false; s.classList.remove('open','match'); setExpanded(s, false); });
        }
      }
      if(show) anyShown = true;
    });
    return anyShown;
  }
  function applyFilter(){
    var raw = q.value.trim().toLowerCase();
    if(hint) hint.hidden = true;
    if(!raw){ clearFilter(); return; }
    if(raw.charAt(0) === '.'){
      var e = raw.slice(1);
      if(EXT[e]) return resolveExt(e);
      return noMatch();
    }
    var anyShown = textSearch(raw);
    if(!anyShown && EXT[raw]) return resolveExt(raw);
    if(nores) nores.hidden = anyShown;
    updateToggle();
  }
  q.addEventListener('input', applyFilter);
  q.addEventListener('keydown', function(e){ if(e.key === 'Escape'){ q.value = ''; applyFilter(); q.blur(); } });

  // Example chips seed the search
  document.querySelectorAll('.chip[data-q]').forEach(function(c){
    c.addEventListener('click', function(){ q.value = c.getAttribute('data-q'); applyFilter(); q.focus(); });
  });
})();
