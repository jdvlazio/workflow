/* app.js — BEHAVIOR layer: mobile nav, accordion, expand/collapse, search.
   Reads the format map from window.FORMAT_MAP (formats.js). Runs on every page; guards by feature. */
(function(){
  // Mobile sidebar toggle (every page)
  var menuBtn = document.querySelector('.menu-btn');
  var sidebar = document.querySelector('.sidebar');
  if(menuBtn && sidebar){
    menuBtn.addEventListener('click', function(){ sidebar.classList.toggle('open'); });
  }

  // Dismissible banners (every page)
  document.querySelectorAll('.banner .bx').forEach(function(b){
    b.addEventListener('click', function(){ var bn = b.closest('.banner'); if(bn) bn.style.display = 'none'; });
  });

  // Focus-mode flow: one action card at a time (no persistence — resets each visit)
  var flow = document.querySelector('.flow');
  if(flow){
    var fcards = [].slice.call(flow.querySelectorAll('.fcard'));
    var total = fcards.length;
    var cur = 0;
    var counter = flow.querySelector('.flow-counter');
    var bar = flow.querySelector('.flow-bar-fill');
    var trail = flow.querySelector('.flow-trail');
    var deck = flow.querySelector('.flow-deck');
    var doneEl = flow.querySelector('.flow-done');
    function trailLine(title){
      var d = document.createElement('div'); d.className = 'done';
      d.innerHTML = '<span class="tk" aria-hidden="true">✓</span><span class="tt"></span>';
      d.querySelector('.tt').textContent = title;
      return d;
    }
    function renderFlow(){
      fcards.forEach(function(c, i){ c.classList.toggle('active', i === cur); });
      if(counter) counter.textContent = 'Step ' + (cur + 1) + ' of ' + total;
      if(bar) bar.style.width = Math.round((cur + 1) / total * 100) + '%';
      if(trail){
        trail.innerHTML = '';
        for(var i = 0; i < cur; i++){ trail.appendChild(trailLine(fcards[i].getAttribute('data-title') || '')); }
      }
    }
    flow.querySelectorAll('.next-btn').forEach(function(btn){
      btn.addEventListener('click', function(){
        if(cur < total - 1){ cur++; renderFlow(); }
        else {
          if(trail) trail.appendChild(trailLine(fcards[cur].getAttribute('data-title') || ''));
          if(deck) deck.style.display = 'none';
          if(doneEl) doneEl.classList.add('show');
          if(counter) counter.textContent = 'Done';
          if(bar) bar.style.width = '100%';
        }
      });
    });
    var backBtn = flow.querySelector('.flow-back');
    if(backBtn) backBtn.addEventListener('click', function(){
      if(deck && deck.style.display === 'none'){ deck.style.display = ''; if(doneEl) doneEl.classList.remove('show'); }
      if(cur > 0){ cur--; renderFlow(); }
    });
    flow.querySelectorAll('.why').forEach(function(b){
      b.addEventListener('click', function(){ var w = b.nextElementSibling; if(w) w.classList.toggle('open'); });
    });
    renderFlow();
  }

  // File router (Stage 01): pick what the file is -> its folder. One question at a time.
  var router = document.getElementById('router');
  if(router){
    var TREE = {
      root: { q: 'What is this file?', opts: [
        { label: 'We shot or recorded it', to: 'shot' },
        { label: 'We got it (bought, given, stock, AI)', to: 'acquired' },
        { label: 'We rendered or exported it', to: 'rendered' },
        { label: 'A graphic asset (logo, title, photo)', to: 'graphic' },
        { label: 'Paperwork or a Frame.io EDL', dest: ['06_Documents'] }
      ]},
      shot: { q: 'Shot or recorded — which?', opts: [
        { label: 'Video', dest: ['02_Footage/01_Originals'], note: 'Never rename it — Resolve links by path.' },
        { label: 'Audio', dest: ['03_Audio/01_Production'], note: 'Raw on-set sound.' }
      ]},
      acquired: { q: 'What kind of media?', opts: [
        { label: 'Video', dest: ['02_Footage/02_Stock','02_Footage/03_AI','02_Footage/04_Provided'], note: 'Pick by source.' },
        { label: 'Audio', dest: ['03_Audio/04_Music','03_Audio/03_SFX','03_Audio/02_VO'], note: 'Pick by role.' },
        { label: 'Photo', dest: ['04_Graphics/03_Stills'], note: 'Including client or photographer photos.' }
      ]},
      rendered: { q: 'Who sees it?', opts: [
        { label: 'The client sees it', dest: ['00_Deliver'], note: 'Master vs Versions inside.' },
        { label: 'Internal only', dest: ['05_Intermediates'], note: "If the edit relinks to it and you can't re-create it, it's a kept source instead → e.g. 03_Audio/05_Processed." }
      ]},
      graphic: { q: 'Raw, or made by you?', opts: [
        { label: 'Raw ingredient (logo, font, reference)', dest: ['04_Graphics/01_Resources'] },
        { label: 'Your export (title, lower-third)', dest: ['04_Graphics/02_Built'] }
      ]}
    };
    var rNode = 'root', rDest = null, rHist = [];
    function pathChip(p){
      var parts = p.split('/'), h = '<div class="path">';
      parts.forEach(function(seg, i){ h += (i ? ' <span class="sep">&#9656;</span> ' : '') + seg; });
      return h + '</div>';
    }
    function rRender(){
      var trail = router.querySelector('.router-trail');
      trail.innerHTML = rHist.map(function(h, i){
        return (i ? '<span class="rcrumb-sep">&#8250;</span>' : '') + '<button class="rcrumb" data-i="' + i + '">' + h.label + '</button>';
      }).join('');
      var body = router.querySelector('.router-body'), html;
      if(rDest){
        html = '<p class="router-q">Put it here</p><div class="router-dest-paths">' + rDest.dest.map(pathChip).join('') + '</div>';
        if(rDest.note) html += '<p class="router-why">' + rDest.note + '</p>';
        html += '<button class="router-reset">Start over</button>';
      } else {
        var node = TREE[rNode];
        html = '<p class="router-q">' + node.q + '</p><div class="router-opts">' +
          node.opts.map(function(o, i){ return '<button class="router-opt" data-i="' + i + '">' + o.label + '</button>'; }).join('') + '</div>';
      }
      body.innerHTML = html;
    }
    router.addEventListener('click', function(e){
      var opt = e.target.closest('.router-opt');
      if(opt){
        var o = TREE[rNode].opts[+opt.getAttribute('data-i')];
        rHist.push({ label: o.label, node: rNode });
        if(o.to){ rNode = o.to; rDest = null; } else { rDest = o; }
        rRender(); return;
      }
      var crumb = e.target.closest('.rcrumb');
      if(crumb){
        var idx = +crumb.getAttribute('data-i');
        rNode = rHist[idx].node; rDest = null; rHist = rHist.slice(0, idx);
        rRender(); return;
      }
      if(e.target.closest('.router-reset')){ rNode = 'root'; rDest = null; rHist = []; rRender(); }
    });
    rRender();
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
