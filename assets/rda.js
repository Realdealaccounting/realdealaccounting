/* ============================================================
   REAL DEAL ACCOUNTING — shared interactions
   ============================================================ */
(function(){
  /* ---------- Calendly ---------- */
  /* Paste your real scheduling link here — it's used site-wide. */
  var CALENDLY_URL = 'https://calendly.com/swasserman-o0l3/meet-with-shaul-clone';

  /* ---------- Formspree (email lead notifications) ---------- */
  var FORMSPREE_URL = 'https://formspree.io/f/xrewvwov';
  function sendLead(formEl, subject){
    try{
      var fd = new FormData(formEl);
      if (subject) fd.append('_subject', subject);
      fetch(FORMSPREE_URL, { method:'POST', body:fd, headers:{ 'Accept':'application/json' } }).catch(function(){});
    }catch(e){}
  }
  function openCalendly(name, email){
    var url = CALENDLY_URL;
    if (name || email){
      url += (url.indexOf('?') > -1 ? '&' : '?')
           + 'name=' + encodeURIComponent(name || '')
           + '&email=' + encodeURIComponent(email || '');
    }
    window.open(url, '_blank', 'noopener');
  }

  /* ---------- Mobile menu ---------- */
  var ham = document.getElementById('hamburger');
  var mm = document.getElementById('mobileMenu');
  function closeMenu(){ if(mm){ mm.classList.remove('open'); } if(ham){ ham.setAttribute('aria-expanded','false'); } }
  if (ham && mm){
    ham.addEventListener('click', function(){
      var open = mm.classList.toggle('open');
      ham.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mm.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', closeMenu); });
  }

  /* ---------- Direct Calendly booking buttons ---------- */
  document.querySelectorAll('[data-calendly]').forEach(function(b){
    b.addEventListener('click', function(e){ e.preventDefault(); window.open(CALENDLY_URL, '_blank', 'noopener'); closeMenu(); });
  });

  /* ---------- Booking modal ---------- */
  var back = document.getElementById('modalBack');
  if (back){
    var form = document.getElementById('bookForm');
    var success = document.getElementById('modalSuccess');
    var lastFocus = null;
    function openModal(){
      lastFocus = document.activeElement;
      back.classList.add('open');
      document.body.style.overflow = 'hidden';
      form.style.display = ''; success.classList.remove('show');
      setTimeout(function(){ var n=document.getElementById('f-name'); if(n) n.focus(); }, 80);
      closeMenu();
    }
    function closeModal(){
      back.classList.remove('open');
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }
    document.querySelectorAll('[data-book]').forEach(function(b){ b.addEventListener('click', function(e){ e.preventDefault(); openModal(); }); });
    var x = document.getElementById('modalClose'); if(x) x.addEventListener('click', closeModal);
    var done = document.getElementById('successDone'); if(done) done.addEventListener('click', closeModal);
    back.addEventListener('click', function(e){ if (e.target === back) closeModal(); });
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && back.classList.contains('open')) closeModal(); });

    function setInvalid(id, bad){ var el=document.getElementById(id); if(el) el.closest('.field').classList.toggle('invalid', bad); }
    if (form){
      form.addEventListener('submit', function(e){
        e.preventDefault();
        var name = (document.getElementById('f-name').value||'').trim();
        var email = (document.getElementById('f-email').value||'').trim();
        var msgEl = document.getElementById('f-message');
        var message = msgEl ? (msgEl.value||'').trim() : 'x';
        var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        setInvalid('f-name', !name); setInvalid('f-email', !emailOk);
        if (!name || !emailOk){ var fb=form.querySelector('.field.invalid input, .field.invalid textarea'); if(fb) fb.focus(); return; }
        sendLead(form, 'New inquiry — ' + name);
        document.getElementById('successName').textContent = name.split(' ')[0] || 'there';
        document.getElementById('successEmail').textContent = email;
        form.style.display = 'none'; success.classList.add('show');
      });
      form.querySelectorAll('input, textarea').forEach(function(inp){
        inp.addEventListener('input', function(){ inp.closest('.field').classList.remove('invalid'); });
      });
    }
  }

  /* ---------- Standalone contact form (contact page) ---------- */
  var cform = document.getElementById('contactForm');
  if (cform){
    function setInv(el, bad){ if(el) el.closest('.field').classList.toggle('invalid', bad); }
    cform.addEventListener('submit', function(e){
      e.preventDefault();
      var name = (cform.querySelector('[name=name]').value||'').trim();
      var email = (cform.querySelector('[name=email]').value||'').trim();
      var phone = (cform.querySelector('[name=phone]').value||'').trim();
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      var phoneOk = phone.replace(/\D/g,'').length >= 7;
      setInv(cform.querySelector('[name=name]'), !name);
      setInv(cform.querySelector('[name=email]'), !emailOk);
      setInv(cform.querySelector('[name=phone]'), !phoneOk);
      if (!name || !emailOk || !phoneOk){ var fb=cform.querySelector('.field.invalid input'); if(fb) fb.focus(); return; }
      sendLead(cform, 'New contact request — ' + name);
      cform.style.display='none';
      var ok = document.getElementById('contactSuccess'); if(ok) ok.classList.add('show');
    });
    cform.querySelectorAll('input').forEach(function(inp){
      inp.addEventListener('input', function(){ inp.closest('.field').classList.remove('invalid'); });
    });
  }

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll('.reveal');
  function forceShow(el){ el.style.transition='none'; el.style.opacity='1'; el.style.transform='none'; }
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if (en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold:0.12, rootMargin:'0px 0px -8% 0px' });
    reveals.forEach(function(el, i){ el.style.transitionDelay = ((i % 3) * 70) + 'ms'; io.observe(el); });
    requestAnimationFrame(function(){
      var vh = window.innerHeight || 800;
      reveals.forEach(function(el){ if (el.getBoundingClientRect().top < vh * 0.92) forceShow(el); });
    });
    setTimeout(function(){ reveals.forEach(forceShow); }, 3000);
  } else {
    reveals.forEach(forceShow);
  }

  /* ---------- Hero chart: replay climb animation each time it enters view ---------- */
  var chart = document.querySelector('.hero-art');
  if (chart){
    if ('IntersectionObserver' in window){
      var cio = new IntersectionObserver(function(entries){
        entries.forEach(function(en){
          if (en.isIntersecting){
            chart.classList.remove('play');
            /* force reflow so the animation restarts */
            void chart.offsetWidth;
            chart.classList.add('play');
          } else {
            chart.classList.remove('play');
          }
        });
      }, { threshold:0.35 });
      cio.observe(chart);
    } else {
      chart.classList.add('play');
    }
  }

  /* ---------- Approach: translucent cards, entrance replays on view ---------- */
  var acards = document.querySelector('.approach-cards');
  var atrack = document.getElementById('approachTrack');
  if (acards && !matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window){
    acards.classList.add('seq');
    var aio = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (en.isIntersecting){
          acards.classList.remove('run'); void acards.offsetWidth; acards.classList.add('run');
          if (atrack){ atrack.classList.remove('run'); void atrack.offsetWidth; atrack.classList.add('run'); }
        } else { acards.classList.remove('run'); if (atrack) atrack.classList.remove('run'); }
      });
    }, { threshold:0.3 });
    aio.observe(acards);
  }
  /* hover a card -> progress line grows to that step */
  if (acards && atrack){
    var _cards = acards.querySelectorAll('.acard');
    var _nodes = atrack.querySelectorAll('.at-node');
    var _fill = atrack.querySelector('.at-fill');
    _cards.forEach(function(card, i){
      card.addEventListener('mouseenter', function(){
        atrack.classList.remove('run');
        atrack.classList.add('hovering');
        if (_fill) _fill.style.width = (i * 25) + '%';
        _nodes.forEach(function(n, j){ n.classList.toggle('active', j <= i); });
      });
    });
    acards.addEventListener('mouseleave', function(){
      atrack.classList.remove('hovering');
      if (_fill) _fill.style.width = '';
      _nodes.forEach(function(n){ n.classList.remove('active'); });
    });
  }
  /* ---------- Scroll progress bar + slim nav + back-to-top ---------- */
  (function(){
    var nav = document.querySelector('.nav');
    var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    var bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);

    var top = document.createElement('button');
    top.className = 'to-top';
    top.type = 'button';
    top.setAttribute('aria-label', 'Back to top');
    top.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M6 11l6-6 6 6"/></svg>';
    document.body.appendChild(top);
    top.addEventListener('click', function(){ window.scrollTo({ top:0, behavior: reduce ? 'auto' : 'smooth' }); });

    /* Sticky "Book a Call" side tab — always-visible CTA */
    var tab = document.createElement('button');
    tab.className = 'book-tab';
    tab.type = 'button';
    tab.setAttribute('aria-label', 'Book a free consultation');
    tab.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>Book a Call';
    document.body.appendChild(tab);
    tab.addEventListener('click', function(){
      window.open(CALENDLY_URL, '_blank', 'noopener');
    });

    var ticking = false;
    function update(){
      ticking = false;
      var doc = document.documentElement;
      var scrolled = window.scrollY || doc.scrollTop;
      var height = doc.scrollHeight - doc.clientHeight;
      var pct = height > 0 ? scrolled / height : 0;
      bar.style.transform = 'scaleX(' + pct + ')';
      if (nav) nav.classList.toggle('slim', scrolled > 40);
      top.classList.toggle('show', scrolled > 620);
      tab.classList.toggle('show', scrolled > 620);
    }
    function onScroll(){ if (!ticking){ ticking = true; requestAnimationFrame(update); } }
    window.addEventListener('scroll', onScroll, { passive:true });
    window.addEventListener('resize', onScroll, { passive:true });
    update();
  })();
})();
