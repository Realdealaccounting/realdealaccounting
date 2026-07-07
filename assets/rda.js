/* ============================================================
   REAL DEAL ACCOUNTING — shared interactions
   ============================================================ */
(function(){
  /* ---------- Calendly ---------- */
  /* Paste your real scheduling link here — it's used site-wide. */
  var CALENDLY_URL = 'https://calendly.com/realdealaccounting/discovery-call';
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
        var phone = (document.getElementById('f-phone').value||'').trim();
        var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        var phoneOk = phone.replace(/\D/g,'').length >= 7;
        setInvalid('f-name', !name); setInvalid('f-email', !emailOk); setInvalid('f-phone', !phoneOk);
        if (!name || !emailOk || !phoneOk){ var fb=form.querySelector('.field.invalid input'); if(fb) fb.focus(); return; }
        document.getElementById('successName').textContent = name.split(' ')[0] || 'there';
        document.getElementById('successEmail').textContent = email;
        form.style.display = 'none'; success.classList.add('show');
        openCalendly(name, email);
      });
      form.querySelectorAll('input').forEach(function(inp){
        inp.addEventListener('input', function(){ inp.closest('.field').classList.remove('invalid'); });
      });
    }
    var sc = document.getElementById('successCalendly');
    if (sc) sc.addEventListener('click', function(){
      openCalendly((document.getElementById('f-name').value||'').trim(), (document.getElementById('f-email').value||'').trim());
    });
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
      cform.style.display='none';
      var ok = document.getElementById('contactSuccess'); if(ok) ok.classList.add('show');
      openCalendly(name, email);
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
})();
