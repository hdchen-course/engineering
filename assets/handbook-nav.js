/* ============================================================================
   The Interview Prep Handbook — GitBook-style navigation (shared component)
   - Left sidebar: full book tree (Parts -> Chapters), active chapter highlighted
   - Nested under the active chapter (medium/drawer widths): this page's sections
   - Right rail (>=1560px): "On this page" section list
   - Mobile (<1200px): off-canvas drawer opened by a floating button
   Replaces the legacy per-page #pagetoc-js block (byte-identical everywhere).
   ============================================================================ */
(function(){
  var DESKTOP = 1200;

  /* ---- THEME (reading-comfort light / dark) ------------------------------- */
  /* Run as early as the script does so the correct theme is set before the
     sidebar (and ideally the page paint) — avoids a flash of the wrong theme.
     Stored in localStorage['hb-theme']; default 'light' (does NOT follow OS). */
  var THEME_KEY = 'hb-theme';
  function storedTheme(){
    try{ return localStorage.getItem(THEME_KEY); }catch(e){ return null; }
  }
  function applyTheme(t){
    document.documentElement.dataset.theme = (t === 'dark') ? 'dark' : 'light';
  }
  function currentTheme(){
    return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
  }
  function setTheme(t){
    applyTheme(t);
    try{ localStorage.setItem(THEME_KEY, currentTheme()); }catch(e){}
  }
  applyTheme(storedTheme() || 'light');   /* init immediately */

  function makeThemeToggle(){
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'hb-theme-toggle';
    function sync(){
      var dark = currentTheme() === 'dark';
      b.textContent = dark ? '☀' : '☾';   /* show the target: ☀ in dark, ☾ in light */
      b.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
      b.setAttribute('title', dark ? 'Switch to light theme' : 'Switch to dark theme');
    }
    sync();
    b.addEventListener('click', function(e){
      e.preventDefault(); e.stopPropagation();   /* don't trigger the brand link */
      setTheme(currentTheme() === 'dark' ? 'light' : 'dark');
      sync();
    });
    return b;
  }

  /* ---- Book structure (single source of truth) --------------------------- */
  var BOOK = [
    { roman:'I', name:'Foundations & Toolkit', chapters:[
      ['Complexity Analysis','complexity_analysis.html'],
      ['Algorithm Toolbox','algo_toolbox_cheatsheet.html'],
      ['Pattern Finding & Induction','pattern_finding_training.html'],
      ['Recursive ↔ Iterative','recursive_iterative_conversion.html'],
      ['Math for Coding','math_training.html'],
    ]},
    { roman:'II', name:'Data Structures & Algorithms', chapters:[
      ['Arrays & Strings','array_string_training.html'],
      ['Linked Lists','linked_list_training.html'],
      ['Stacks & Queues','stack_queue_training.html'],
      ['Binary Trees','binary_tree_training.html'],
      ['Tree Data Structures','tree_ds_training.html'],
      ['Graphs & Topological Sort','graph_topo_training.html'],
      ['Sorting-Based Solving','sorting_training.html'],
      ['Backtracking & Recursion','backtracking_training.html'],
      ['Greedy Algorithms','greedy_training.html'],
      ['Dynamic Programming','dp_training.html'],
      ['Advanced Algorithms','advanced_algorithms_training.html'],
    ]},
    { roman:'III', name:'Coding Ramp-Up Plans', chapters:[
      ['1-Week Ramp-Up (39)','rampup_42.html'],
      ['2-Week Ramp-Up (78)','rampup_84.html'],
      ['4-Week Ramp-Up (192)','rampup_192.html'],
    ]},
    { roman:'IV', name:'System Design Fundamentals', chapters:[
      ['System Design Playbook','system_design_tips.html'],
      ['Observability & Dashboards','observability_dashboard.html'],
      ['Operational Excellence & SRE','operational_excellence.html'],
      ['Map & Geospatial Design','map_system_design.html'],
      ['Engineering Productivity','engprod_system_design.html'],
      ['Test Automation at Scale','test_automation_design.html'],
      ['The Google Papers: GFS · MapReduce · Bigtable','google_three_papers.html'],
    ]},
    { roman:'V', name:'Databases & Data Infra', chapters:[
      ['Choosing a Database','database_selection_guide.html'],
      ['MySQL / InnoDB','mysql_deep_dive.html'],
      ['Redis','redis_deep_dive.html'],
      ['MongoDB','mongodb_deep_dive.html'],
      ['Cassandra','cassandra_deep_dive.html'],
      ['DynamoDB','dynamodb_deep_dive.html'],
      ['BigQuery','bigquery_deep_dive.html'],
    ]},
    { roman:'VI', name:'AI / ML Systems Design', chapters:[
      ['Cloud AI/ML Infrastructure','cloud_ai_ml_infra.html'],
      ['Knowledge Retrieval (RAG)','knowledge_retrieval_rag_design.html'],
      ['Real-time Agent Assist','realtime_agent_assist_design.html'],
      ['AI-to-Human Handoff','ai_human_handoff_design.html'],
      ['Conversation Analytics','conversation_analytics_design.html'],
      ['Automated QA Scoring','automated_qa_scoring_design.html'],
      ['AI Contact Center Platform','ai_contact_center_platform.html'],
      ['Contact Center Primer','ai_contact_center_knowledge.html'],
      ['GPU Cloud Automation (DGX)','nv_dgx_cloud_prep.html'],
      ['TPU & AI Supercomputers','google_tpu_infra.html'],
      ['ML Systems & Cluster SWE','ml_systems_swe.html'],
    ]},
    { roman:'VII', name:'Security Systems Design', chapters:[
      ['Google Security — Overview','google_security_index.html'],
      ['Zanzibar — Authorization','google_security_zanzibar.html'],
      ['Titan — Root of Trust','google_security_titan.html'],
      ['Key Management & Encryption','google_security_kms.html'],
      ['BeyondProd — Zero Trust','google_security_beyondprod.html'],
      ['ALTS — Transport Security','google_security_alts.html'],
      ['Content Protection & DRM','content_protection_broadcast_encryption.html'],
      ['Memory-Safe Languages','security_memory_safety.html'],
      ['Device Provisioning & Identity','secdesign_device_provisioning.html'],
      ['Secure OTA Updates','secdesign_secure_ota.html'],
    ]},
    { roman:'VIII', name:'Engineering Craft & Tooling', chapters:[
      ['Code Review Practice','code_review_training.html'],
      ['C Refresher','c_refresher.html'],
      ['C++ Refresher','cpp_refresher.html'],
      ['Go Refresher','go_refresher.html'],
      ['Java Refresher','java_refresher.html'],
      ['Python Refresher','python_refresher.html'],
      ['AI-Assisted Engineering','ai_assisted_engineering_prep.html'],
      ['Shell / Bash Scripting Refresher','shell_refresher.html'],
      ['Rust Refresher','rust_refresher.html'],
      ['Kotlin Refresher','kotlin_refresher.html'],
      ['Objective-C Refresher','objc_refresher.html'],
      ['Swift Refresher','swift_refresher.html'],
    ]},
    { roman:'IX', name:'Mobile Engineering', chapters:[
      ['Android Engineering','android_engineering.html'],
      ['iOS Engineering','ios_engineering.html'],
      ['Mobile System Design','mobile_system_design.html'],
    ]},
    { roman:'X', name:'Curated Interview Problems (Google-style)', chapters:[
      ['Arrays & Strings — Google-style Problems','google_problems_arrays_strings.html'],
      ['String Simulation & Scanning — Google-style Problems','google_problems_string_simulation.html'],
      ['Heaps, Top-K & Greedy — Google-style Problems','google_problems_heaps_topk.html'],
      ['Graphs — BFS / DFS / Union-Find / Topological Sort — Google-style Problems','google_problems_graphs.html'],
      ['Trees — Recursion, DFS & Tree DP — Google-style Problems','google_problems_trees.html'],
      ['Dynamic Programming','google_problems_dp.html'],
      ['Sorting & Searching — Google-style Problems','google_problems_sorting.html'],
      ['Recursion & Backtracking — Google-style Problems','google_problems_recursion.html'],
      ['Linked Lists — Google-style Problems','google_problems_linkedlists.html'],
      ['Design & Object-Oriented (Data-Structure Design) — Google-style Problems','google_problems_design.html'],
      ['Assorted Problems I — Strings & Math — Google-style Problems','google_problems_others1.html'],
      ['Assorted Problems II — Arrays, Intervals & Greedy — Google-style Problems','google_problems_others2.html'],
    ]},
    { roman:'XI', name:'Classic System Design Problems', chapters:[
      ['Design a Rate Limiter','sd_rate_limiter.html'],
      ['Design a Social Feed (News Feed)','sd_social_feed.html'],
      ['Design a Notification Service','sd_notification_service.html'],
      ['Design a Payment System','sd_payment_system.html'],
      ['Design a Code Judge (Online Judge)','sd_code_judge.html'],
      ['Design a URL Shortener','sd_url_shortener.html'],
      ['Design a Unique ID Generator','sd_unique_id.html'],
      ['Design a Video Platform','sd_video_platform.html'],
    ]},
    { roman:'XII', name:'Real-World Engineering Case Studies', chapters:[
      ['Case Study: How Discord Stores Billions (then Trillions) of Messages','cs_discord_messages.html'],
      ['Case Study: Why Uber Migrated from Postgres to MySQL','cs_uber_mysql.html'],
      ['Case Study: Twitter\'s Manhattan — a Real-Time Multi-Tenant Distributed Database','cs_twitter_manhattan.html'],
      ['Case Study: Netflix\'s Key-Value Data Abstraction Layer','cs_netflix_kv.html'],
    ]},
    { roman:'XIII', name:'Systems, Networking & Performance Deep-Dives', chapters:[
      ['Kubernetes — a Practical Deep-Dive','td_kubernetes.html'],
      ['TCP/IP & Packet Analysis — a Practical Deep-Dive','td_tcpip.html'],
      ['Low-Latency C++ (for Trading & Real-Time Systems)','td_lowlatency_cpp.html'],
      ['WiFi & Connectivity — the Software/Networking View','td_wifi.html'],
      ['Cloud & Data-Center Networking: Multi-Tenant Overlays, BGP & Network Automation','td_cloud_networking.html'],
    ]},
    { roman:'XIV', name:'Applied System Design & Emerging Topics', chapters:[
      ['Design a Device Lab / Test-Farm Platform','ds_device_lab.html'],
      ['Designing Agentic AI & Multi-Agent Workflows','ds_agent_workflow.html'],
      ['Mobile Telemetry & the Data Flywheel (Privacy-First)','ds_mobile_telemetry.html'],
    ]},
    { roman:'XV', name:'Server Systems Software & Firmware', chapters:[
      ['Server Firmware & Boot: BIOS/UEFI, BMC & Root of Trust','td_server_firmware.html'],
      ['The Linux Kernel & the Hardware Boundary','td_kernel_hardware.html'],
      ['Low-Level Observability & Hardware Diagnostics','td_system_observability.html'],
      ['Node-Level Orchestration & Fleet Bring-up','td_node_orchestration.html'],
    ]},
  ];

  function currentFile(){
    var p = (location.pathname || '').split('/').pop();
    if(!p) p = 'index.html';
    return p;
  }

  function el(tag, cls, txt){ var e=document.createElement(tag); if(cls) e.className=cls; if(txt!=null) e.textContent=txt; return e; }

  /* ---- wide diagram SVG horizontal-scroll wrapping ------------------------- */
  var SVG_WIDE_MIN = 560;   /* viewBox/intrinsic width (px) at/above which we wrap */
  function svgIntrinsicWidth(svg){
    var w = 0;
    var vb = svg.getAttribute('viewBox');
    if(vb){
      var p = vb.trim().split(/[\s,]+/);
      if(p.length===4){ var v = parseFloat(p[2]); if(v>0) w = v; }
    }
    if(!w){
      var wa = svg.getAttribute('width');
      if(wa && /^[0-9.]+(px)?$/.test(wa.trim())) w = parseFloat(wa);
    }
    return w || 0;
  }
  /* Skip an svg only if it is ALREADY handled: either inside our own wrapper
     (idempotency — never double-wrap on re-run), or inside a horizontally-
     scrollable ancestor that is ALREADY letting the svg overflow at (near)
     native size (so its labels are already legible). A page's own scroll box
     that merely shrinks the svg to fit — e.g. `.svg-container svg{max-width:100%}`,
     which is exactly the broken case on mobile — is NOT considered handled, so
     we still fix it. */
  function alreadyHandled(svg, vbW){
    if(svg.closest && svg.closest('.hb-svg-scroll')) return true;   // our wrapper -> idempotent
    var rendered = 0;
    try{ rendered = svg.getBoundingClientRect().width; }catch(e){}
    if(rendered < vbW * 0.85) return false;   // svg is being shrunk -> not handled, needs fixing
    var p = svg.parentNode;
    while(p && p.nodeType===1 && p !== document.body){
      var ox = '';
      try{ ox = getComputedStyle(p).overflowX; }catch(e){}
      if((ox==='auto' || ox==='scroll') && p.scrollWidth > p.clientWidth + 1) return true;   // genuinely scrolling at native size
      p = p.parentNode;
    }
    return false;
  }
  function wrapWideSvgs(){
    var svgs = document.querySelectorAll('svg');
    Array.prototype.forEach.call(svgs, function(svg){
      /* only top-level inline SVGs — never nested <svg> inside another svg */
      if(svg.parentElement && svg.parentElement.closest && svg.parentElement.closest('svg')) return;
      var w = svgIntrinsicWidth(svg);
      if(w < SVG_WIDE_MIN) return;                 // small icon / narrow diagram — leave it
      if(alreadyHandled(svg, w)) return;
      var wrap = document.createElement('div');
      wrap.className = 'hb-svg-scroll';
      svg.parentNode.insertBefore(wrap, svg);
      wrap.appendChild(svg);
      svg.style.minWidth = w + 'px';               // render at native size (neutralized on desktop via CSS)
    });
  }

  /* ---- dark-mode DIAGRAM SVGs: light-figure backing --------------------------
     Approved design decision (user 2026-08-16): in dark mode, SVG DIAGRAMS are
     rendered AS AUTHORED (their light-mode appearance) on a fixed LIGHT figure
     background — like GitHub/Notion — instead of repainting their internals dark
     (which left light-on-light labels wherever a fill came from a class/inline/
     un-listed hex). Tag every DIAGRAM svg — one that contains at least one <text>
     (or <tspan>) descendant — with `hb-figure`; the light backing is defined in
     the `svg.hb-figure` dark-mode CSS rule. Pure-icon SVGs (no text) are skipped
     so they are NOT given a light box. Idempotent — never re-tags. Top-level
     inline SVGs only (never a nested <svg>, whose backing the outer already gives). */
  function tagFigureSvgs(){
    var svgs = document.querySelectorAll('svg');
    Array.prototype.forEach.call(svgs, function(svg){
      if(svg.classList.contains('hb-figure')) return;   // idempotent — already tagged
      if(svg.parentElement && svg.parentElement.closest && svg.parentElement.closest('svg')) return;
      if(svg.querySelector('text, tspan')){
        svg.classList.add('hb-figure');   // has a label -> it's a diagram
        /* a11y: an unlabeled diagram SVG makes a screen reader read its raw <text>
           nodes in DOM order (gibberish). Mark it a single labeled image (role=img)
           and name it from its visible caption (.svg-cap / .diagram-caption), so it
           announces as one image instead. */
        if(!svg.getAttribute('role')) svg.setAttribute('role','img');
        if(!svg.getAttribute('aria-label') && !svg.querySelector('title')){
          /* Find the visible caption. It may be a sibling of the svg OR of the svg's
             scroll-wrapper (wrapWideSvgs() wraps wide diagrams), so walk up a few levels
             checking each node's next sibling and its parent's caption. */
          var cap = null, node = svg;
          for(var hop=0; hop<3 && !cap; hop++){
            if(!node) break;
            var sib = node.nextElementSibling;
            if(sib){
              if(/svg-cap|diagram-caption|caption/i.test(sib.className || '')) cap = sib;
              else if(sib.querySelector) cap = sib.querySelector('.svg-cap, .diagram-caption, figcaption');
            }
            if(!cap && node.parentElement) cap = node.parentElement.querySelector(':scope > .svg-cap, :scope > .diagram-caption, :scope > figcaption');
            node = node.parentElement;
          }
          var txt = cap ? (cap.textContent || '').trim().replace(/\s+/g, ' ') : '';
          svg.setAttribute('aria-label', txt || 'Diagram (described in the surrounding text)');
        }
      }
    });
  }

  /* ---- Favicon: none of the 65 pages ship a <link rel="icon">, so every page
     404s on /favicon.ico. Inject a shared inline data-URI SVG book glyph (no
     network request) if the page has no icon link yet. */
  function ensureFavicon(){
    if(document.querySelector('link[rel~="icon"]')) return;
    var svg = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'>"+
      "<rect width='32' height='32' rx='7' fill='#1e40af'/>"+
      "<path d='M16 9c-2.2-1.3-4.8-1.6-7-1v13c2.2-.6 4.8-.3 7 1 2.2-1.3 4.8-1.6 7-1V8c-2.2-.6-4.8-.3-7 1z' fill='#ffffff'/>"+
      "<line x1='16' y1='9' x2='16' y2='22' stroke='#1e40af' stroke-width='1.2'/></svg>";
    var link = document.createElement('link');
    link.rel = 'icon'; link.type = 'image/svg+xml';
    link.href = 'data:image/svg+xml,' + encodeURIComponent(svg);
    (document.head || document.documentElement).appendChild(link);
  }

  function init(){
    ensureFavicon();                                               // runs on every page (before build guards)
    if(document.getElementById('hb-sidebar')) return;              // already built
    if(document.querySelector('.sidebar')) return;                 // page ships its own sidebar — leave it

    var cur = currentFile();

    /* ---------- left book sidebar ---------- */
    var side = el('nav','hb-sidebar'); side.id='hb-sidebar'; side.setAttribute('aria-label','Book navigation');

    var brandRow = el('div','hb-brand');    /* flex row: the link + the theme toggle as SIBLINGS (no button inside <a>) */
    var brand = document.createElement('a');
    brand.className='hb-brandlink'; brand.href='index.html';
    brand.innerHTML = '<span class="hb-logo">📖</span><span class="hb-btext"><span class="hb-t1">Interview Prep</span><span class="hb-t2">Handbook</span></span>';
    brandRow.appendChild(brand);
    brandRow.appendChild(makeThemeToggle());   /* sun/moon theme toggle, sibling of the link */
    side.appendChild(brandRow);

    var sw = el('div','hb-search-wrap');
    var search = el('input','hb-search'); search.type='search'; search.placeholder='Filter chapters…'; search.setAttribute('aria-label','Filter chapters');
    sw.appendChild(search); side.appendChild(sw);

    var tree = el('div','hb-tree'); side.appendChild(tree);

    var activePartEl = null, activeChapEl = null, activeCrumb = '', activeBookTitle = '';
    BOOK.forEach(function(part){
      var pWrap = el('div','hb-part');
      var btn = el('button','hb-part-btn'); btn.type='button';
      btn.innerHTML = '<span class="hb-caret">▾</span><span class="hb-roman">'+part.roman+'</span><span class="hb-pname">'+part.name+'</span>';
      var chaps = el('div','hb-chaps');
      var hasActive = false;
      part.chapters.forEach(function(c, i){
        var a = document.createElement('a');
        a.className='hb-chap'; a.href=c[1];
        a.innerHTML = '<span class="hb-cnum">'+(i+1)+'.</span>'+c[0];
        a.setAttribute('data-title', c[0].toLowerCase());
        if(c[1]===cur){ a.classList.add('active'); hasActive=true; activeChapEl=a; activeCrumb='Part '+part.roman+' · Chapter '+(i+1); activeBookTitle=c[0]; }
        chaps.appendChild(a);
      });
      btn.addEventListener('click', function(){ var c=pWrap.classList.toggle('collapsed'); btn.setAttribute('aria-expanded', String(!c)); });
      pWrap.appendChild(btn); pWrap.appendChild(chaps);
      if(hasActive){ activePartEl = pWrap; } else { pWrap.classList.add('collapsed'); }
      btn.setAttribute('aria-expanded', String(hasActive));   /* expose collapsed/expanded to AT (WCAG 4.1.2) */
      tree.appendChild(pWrap);
    });

    /* search / filter */
    search.addEventListener('input', function(){
      var q = search.value.trim().toLowerCase();
      var parts = tree.querySelectorAll('.hb-part');
      parts.forEach(function(pw){
        var any=false;
        pw.querySelectorAll('.hb-chap').forEach(function(a){
          var hit = !q || a.getAttribute('data-title').indexOf(q)>=0;
          a.style.display = hit ? '' : 'none';
          if(hit) any=true;
        });
        pw.style.display = any ? '' : 'none';
        if(q){ pw.classList.remove('collapsed'); }
        else if(pw!==activePartEl){ pw.classList.add('collapsed'); }
      });
    });

    document.body.appendChild(side);

    /* ---------- mobile hamburger + overlay ---------- */
    var btn = el('button','hb-btn'); btn.type='button';
    btn.setAttribute('aria-label','Open navigation'); btn.setAttribute('aria-expanded','false');
    btn.innerHTML='☰';
    var overlay = el('div','hb-overlay');
    /* ── a11y polish batch 4 (MAJOR): keep the off-canvas drawer OUT of the tab
       order + accessibility tree while it is CLOSED on the <1200px drawer band.
       Closed, the drawer is only slid off-screen (transform:translateX(-100%)),
       so its search input, theme toggle, and all its Part-toggle buttons and chapter
       links stayed keyboard-focusable and SR-announced off-screen. This helper
       sets `inert` + aria-hidden="true" when the drawer is CLOSED on the drawer
       band, and clears BOTH when it is OPEN, or whenever the viewport is docked
       (>=1200px, sidebar always visible — must NEVER be inert). Called from
       open()/close(), on resize (so crossing the 1200px breakpoint is handled),
       and once at init. aria-hidden is the fallback for browsers lacking `inert`. */
    function syncDrawerA11y(){
      var docked = window.innerWidth >= DESKTOP;
      var hide = !docked && !side.classList.contains('open');
      try{ side.inert = hide; }catch(e){}
      if(hide){ side.setAttribute('aria-hidden','true'); }
      else{ side.removeAttribute('aria-hidden'); }
    }
    function open(){ side.classList.add('open'); overlay.classList.add('open'); btn.setAttribute('aria-expanded','true'); btn.innerHTML='✕'; syncDrawerA11y(); }
    function close(){ side.classList.remove('open'); overlay.classList.remove('open'); btn.setAttribute('aria-expanded','false'); btn.innerHTML='☰'; syncDrawerA11y(); }
    btn.addEventListener('click', function(){ side.classList.contains('open')?close():open(); });
    overlay.addEventListener('click', close);
    document.addEventListener('keydown', function(e){ if((e.key==='Escape'||e.key==='Esc') && side.classList.contains('open')) close(); });
    document.body.appendChild(overlay); document.body.appendChild(btn);
    syncDrawerA11y();                              // set initial closed/inert state
    window.addEventListener('resize', syncDrawerA11y);   // handle 1200px breakpoint crossings

    document.body.classList.add('hb-on');

    /* ---------- wide diagram SVGs: horizontal scroll on mobile ----------
       Wide inline architecture/sequence SVGs (viewBox width >= ~560) shrink to
       unreadable ~4-5px labels at 390px because the shared svg{max-width:100%}
       is scoped to >=769px and there is no zoom/scroll below that. Give them the
       same treatment tables/<pre> get: wrap in a horizontally-scrollable box and
       let the SVG render at its native width on mobile. Idempotent (skips SVGs
       already inside a scrollable wrapper), and does NOT touch small icon SVGs.
       The animation JS on interactive diagrams queries the <svg> by id/selector,
       which keeps working inside the wrapper. */
    wrapWideSvgs();
    tagFigureSvgs();   // dark-mode light-figure backing for diagram SVGs (see fn/CSS)

    /* ---------- unified chapter masthead (one-publisher look) ----------
       Replace each chapter's bespoke <header>/.ph hero with a single consistent
       masthead built by the shared component. Title comes from the page's own H1
       (richer wording), subtitle from its existing sub/desc; crumb from the book
       position. Skips index.html (no active chapter — keep its cover). */
    if(activeChapEl){
      /* Find the page's real title block robustly: the header-ish ancestor of the
         FIRST heading — works whether it's <header>, .page-header, .ph, or .hero
         (chapters use several different structures). Then replace it in place. */
      var firstH1 = document.querySelector('h1, .ht');
      var oldHdr = firstH1
        ? (firstH1.closest('header, .ph, .page-header, .hero, .header') || firstH1)
        : document.querySelector('header, .ph, .page-header, .hero');
      var titleText = activeBookTitle, subText = '';
      if(firstH1 && firstH1.textContent.trim()) titleText = firstH1.textContent.trim();
      if(oldHdr){
        /* a11y polish batch 2026-08-17 (Fix 4): BROADENED (additive) subtitle
           extraction so chapters whose header uses .header-desc/.header-sub/.desc
           (e.g. the DB deep-dives' .page-header > .header-desc) keep their subtitle. */
        var sub = oldHdr.querySelector('.sub, .hd, .subtitle, .page-sub, .header-desc, .header-sub, .desc');
        if(!sub){ var p = oldHdr.querySelector('p'); if(p) sub = p; }
        /* Bare heading with no header wrapper (oldHdr fell back to the heading
           itself): the subtitle is a SIBLING, not a descendant — inspect the
           heading's next element for a known subtitle class or a <p>
           (e.g. ai_contact_center_knowledge: bare <h1> + <p class="subtitle">). */
        if(!sub && firstH1 && oldHdr === firstH1){
          var sib = firstH1.nextElementSibling;
          if(sib && (sib.tagName === 'P' || sib.matches('.subtitle, .sub, .hd, .header-desc'))) sub = sib;
        }
        if(sub && sub.textContent.trim()) subText = sub.textContent.trim();
      }
      var mh = document.createElement('header');
      mh.className = 'hb-masthead';
      mh.appendChild(el('div','hb-mh-crumb', activeCrumb));
      mh.appendChild(el('h1','hb-mh-title', titleText));
      if(subText) mh.appendChild(el('div','hb-mh-sub', subText));
      /* Prefer inserting the masthead as the FIRST CHILD of the page's content
         container, so it inherits the same padding/width as the body content
         (some pages keep their <header>/.page-header OUTSIDE .container, which
         otherwise makes the masthead wider than the content below it). */
      var cont = document.querySelector('.container, .content');
      if(cont){ cont.insertBefore(mh, cont.firstChild); }
      else if(oldHdr && oldHdr.parentNode){ oldHdr.parentNode.insertBefore(mh, oldHdr); }
      else {
        var bnTop = document.getElementById('booknav-top');
        if(bnTop && bnTop.parentNode){ bnTop.parentNode.insertBefore(mh, bnTop.nextSibling); }
        else { document.body.insertBefore(mh, document.body.firstChild); }
      }
      if(oldHdr){ oldHdr.style.display = 'none'; }   /* hide the original header wherever it is — no duplicate */
    }

    /* No-container pages (redis .sec layout; .sbh pages with their own #sb nav):
       wrap the masthead + main content into a real .container so they inherit the
       ONE enforced content-column geometry like every other chapter. */
    if(activeChapEl && !document.querySelector('.container, .content, #main')){
      var mhEl = document.querySelector('.hb-masthead');
      if(mhEl && mhEl.parentNode){
        var wrap = document.createElement('div'); wrap.className = 'container hb-autowrap';
        mhEl.parentNode.insertBefore(wrap, mhEl);
        var node = mhEl;
        while(node){
          var next = node.nextSibling;
          if(node.nodeType === 1){
            if(node.id === 'booknav-bottom') break;              // stop before the bottom nav
            var t = node.tagName, cl = node.classList;
            var skip = (t==='SCRIPT' || t==='STYLE') ||
              (cl && (cl.contains('hb-sidebar')||cl.contains('hb-overlay')||cl.contains('hb-btn')||cl.contains('hb-toc')||cl.contains('bknav')));
            if(!skip) wrap.appendChild(node);
          } else {
            wrap.appendChild(node);   // carry text nodes along
          }
          node = next;
        }
      }
    }

    /* ---------- on-page sections (nested + right rail) ---------- */
    buildOnPage(activeChapEl, close);

    /* keep active chapter in view within the sidebar */
    if(activeChapEl && activeChapEl.scrollIntoView){
      try{ activeChapEl.scrollIntoView({block:'center'}); }catch(e){ activeChapEl.scrollIntoView(); }
    }

    /* track booknav-top height for the sticky offset */
    function setTop(){
      var bn = document.getElementById('booknav-top');
      var h = (bn && bn.offsetHeight) ? bn.offsetHeight : 44;
      document.documentElement.style.setProperty('--hb-top', h+'px');
    }
    /* a11y polish batch 2026-08-17 · BATCH 2 (MAJOR 2): mirror the top-bar
       measurement for the STICKY bottom book-nav. Its rendered height grows to
       ~2 lines when the prev/next titles wrap on narrow viewports, so a static
       guess can't clear it. Write the real height to --hb-botnav on :root; the
       mobile CSS uses it to seat the FAB ABOVE the bar and to pad the body by the
       true bar height. If #booknav-bottom is absent (e.g. index.html), clear the
       property so the CSS 56px fallback applies. */
    function setBot(){
      var bn = document.getElementById('booknav-bottom');
      if(bn && bn.offsetHeight){
        document.documentElement.style.setProperty('--hb-botnav', bn.offsetHeight+'px');
      } else {
        document.documentElement.style.removeProperty('--hb-botnav');
      }
    }
    function setBars(){ setTop(); setBot(); }
    setBars();
    window.addEventListener('resize', setBars);
    /* re-measure after web fonts/layout settle, in case wrapping changed the
       bottom bar's height past the initial DOMContentLoaded measurement. */
    window.addEventListener('load', setBars);
  }

  function buildOnPage(activeChapEl, closeDrawer){
    var DESK = 1200;
    var skip = function(el){ return el.closest && (el.closest('.bknav')||el.closest('.hb-sidebar')||el.closest('.hb-toc')); };
    var pick = function(sel){
      return Array.prototype.slice.call(document.querySelectorAll(sel)).filter(function(el){
        return !skip(el) && el.textContent.trim().length>0;
      });
    };
    var heads = pick('h2');
    if(heads.length<2){ var a=pick('.stitle, .section-title, .sec-title, .cat-header'); if(a.length>=2) heads=a; }
    if(heads.length<2){ var b=pick('h3'); if(b.length>=2) heads=b; }
    if(heads.length<2) return;

    var used={};
    function slug(t){
      var s=t.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,50)||'section';
      var base=s,i=2; while(document.getElementById(s)||used[s]){ s=base+'-'+(i++); } used[s]=1; return s;
    }

    /* right rail */
    var toc = el('nav','hb-toc'); toc.id='hb-toc'; toc.setAttribute('aria-label','On this page');
    toc.appendChild(el('div','hb-toc-title','On this page'));

    /* nested under active chapter */
    var nested = null;
    if(activeChapEl){ nested = el('div','hb-sections'); }

    var map={};  /* id -> [links...] */
    heads.forEach(function(h){
      if(!h.id) h.id = slug(h.textContent.trim());
      h.classList.add('hb-target');
      var label = h.textContent.trim();
      var isH3 = /^H3$/i.test(h.tagName);

      var t = document.createElement('a'); t.href='#'+h.id; t.textContent=label; if(isH3) t.className='lvl-3';
      toc.appendChild(t);

      var links=[t];
      if(nested){
        var n = document.createElement('a'); n.href='#'+h.id; n.textContent=label; n.className='hb-sec'+(isH3?' lvl-3':'');
        nested.appendChild(n); links.push(n);
      }
      links.forEach(function(link){
        link.addEventListener('click', function(e){
          e.preventDefault();
          var target=document.getElementById(h.id);
          if(target){
            var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            target.scrollIntoView({behavior: reduce ? 'auto' : 'smooth', block:'start'});
          }
          if(history.replaceState) history.replaceState(null,'','#'+h.id);
          if(window.innerWidth<DESK && closeDrawer) closeDrawer();
        });
      });
      map[h.id]=links;
    });

    if(nested && activeChapEl){ activeChapEl.parentNode.insertBefore(nested, activeChapEl.nextSibling); }
    document.body.appendChild(toc);
    document.body.classList.add('hb-has-toc');   /* only now do we reserve the right rail */

    if('IntersectionObserver' in window){
      var io=new IntersectionObserver(function(entries){
        entries.forEach(function(en){
          if(!en.isIntersecting) return;
          var links=map[en.target.id]; if(!links) return;
          Object.keys(map).forEach(function(k){ map[k].forEach(function(l){ l.classList.remove('active'); }); });
          links.forEach(function(l){ l.classList.add('active'); });
        });
      },{rootMargin:'-8% 0px -78% 0px', threshold:0});
      heads.forEach(function(h){ io.observe(h); });
    }
  }

  /* ---- a11y polish batch 5: keyboard-operable in-content widgets ------------
     The book's interactive collapsibles / quiz options / progress checkboxes are
     onclick <div>s with no tabindex/role/keyboard handler, so they were mouse-only
     (the ONLY keydown in the whole book was Escape-closes-drawer). UPGRADE them in
     place to keyboard-operable WITHOUT touching their existing mouse onclick: add
     role + tabindex + the matching ARIA state attribute, and an Enter/Space handler
     that fires the SAME toggle exactly once via this.click() (so the existing
     onclick runs once — no double toggle) then re-reads the resulting state into the
     ARIA attribute. A mouse click also keeps the ARIA in sync via a click listener.
     Idempotent (marked with data-hb-a11y). Does NOT alter visual layout. */
  function hbIsOpen(body){
    if(!body) return false;
    if(body.classList && body.classList.contains('open')) return true;   // .cb.open / .guide-collapse-body.open
    var d=''; try{ d=getComputedStyle(body).display; }catch(e){}
    return d!=='none';                                                    // robust display fallback
  }
  function hbCollapseBody(header){
    /* controlled body is the collapsible .cb / .guide-collapse-body — normally the
       nextElementSibling; scan following siblings to locate it robustly. */
    var n = header.nextElementSibling;
    while(n){
      if(n.nodeType===1 && n.classList &&
         (n.classList.contains('cb') || n.classList.contains('guide-collapse-body'))) return n;
      n = n.nextElementSibling;
    }
    var s = header.nextElementSibling;
    return (s && s.nodeType===1) ? s : null;
  }
  var hbA11yId = 0;
  function hbBindKey(node, sync){
    node.addEventListener('keydown', function(e){
      if(e.key==='Enter' || e.key===' ' || e.key==='Spacebar'){
        e.preventDefault();     // Space must not scroll the page; activate once
        node.click();           // fire the element's existing onclick exactly once
        sync();
      }
    });
    node.addEventListener('click', sync);   // keep ARIA in sync on genuine mouse clicks too
  }
  function enhanceInteractiveA11y(){
    /* collapsible section headers (onclick toggles the .open state of the body) */
    Array.prototype.forEach.call(document.querySelectorAll('.ch[onclick], .guide-collapse-header[onclick]'), function(h){
      if(h.dataset.hbA11y) return; h.dataset.hbA11y='1';
      var body = hbCollapseBody(h);
      if(!h.getAttribute('role')) h.setAttribute('role','button');
      h.setAttribute('tabindex','0');
      if(body){
        if(!body.id) body.id = 'hb-collapse-' + (++hbA11yId);
        h.setAttribute('aria-controls', body.id);
      }
      var sync = function(){ h.setAttribute('aria-expanded', String(hbIsOpen(body))); };
      sync();
      hbBindKey(h, sync);
    });
    /* deep-dive accordions (.collapsible-header in the 6 DB deep-dives): plain <div>s
       toggled by a click listener that adds .open to the parent .collapsible — matched
       by CLASS (they carry no onclick attribute). Make them keyboard-operable + stateful. */
    Array.prototype.forEach.call(document.querySelectorAll('.collapsible-header'), function(h){
      if(h.dataset.hbA11y) return; h.dataset.hbA11y='1';
      var wrap = h.closest ? h.closest('.collapsible') : h.parentNode;
      var body = wrap ? wrap.querySelector('.collapsible-body') : null;
      if(!h.getAttribute('role')) h.setAttribute('role','button');
      h.setAttribute('tabindex','0');
      if(body){ if(!body.id) body.id = 'hb-collapse-' + (++hbA11yId); h.setAttribute('aria-controls', body.id); }
      var sync = function(){
        var open = !!(wrap && wrap.classList && wrap.classList.contains('open'));
        h.setAttribute('aria-expanded', String(open));
        /* a closed .collapsible-body is hidden only by max-height:0/overflow:hidden, so
           its clipped links stay in tab order + the a11y tree (contradicting aria-expanded).
           inert + aria-hidden remove the collapsed content from focus/AT while the
           max-height transition still animates — matching the drawer's inert pattern. */
        if(body){
          if(open){ body.removeAttribute('inert'); body.removeAttribute('aria-hidden'); }
          else { body.setAttribute('inert',''); body.setAttribute('aria-hidden','true'); }
        }
      };
      sync();
      hbBindKey(h, sync);
    });
    /* quiz option selectors (code_review_training .check-item, toggles .selected) */
    Array.prototype.forEach.call(document.querySelectorAll('.check-item[onclick]'), function(c){
      if(c.dataset.hbA11y) return; c.dataset.hbA11y='1';
      if(!c.getAttribute('role')) c.setAttribute('role','button');
      c.setAttribute('tabindex','0');
      var sync = function(){ c.setAttribute('aria-pressed', String(c.classList.contains('selected'))); };
      sync();
      hbBindKey(c, sync);
    });
    /* ramp-up progress checkboxes (rampup_*.html .check, toggles .done). Match ONLY
       .check controls that carry an onclick — a 20px box control — never the
       collapsible .cb body (a different class token). */
    Array.prototype.forEach.call(document.querySelectorAll('.check[onclick]'), function(c){
      if(c.dataset.hbA11y) return; c.dataset.hbA11y='1';
      if(!c.getAttribute('role')) c.setAttribute('role','checkbox');
      c.setAttribute('tabindex','0');
      /* accessible NAME (WCAG 4.1.2): the box itself is empty, so a screen reader
         would announce a nameless "checkbox, not checked". Derive a name from the
         adjacent problem title so the checkbox is announced with its problem. Only
         set it if the control doesn't already carry an accessible name. */
      if(!c.getAttribute('aria-label') && !c.getAttribute('aria-labelledby')){
        var titleEl = c.parentNode && c.parentNode.querySelector('.info .title, .title');
        var titleTxt = titleEl && titleEl.textContent;
        if(titleTxt && titleTxt.trim()){
          c.setAttribute('aria-label', 'Mark complete: ' + titleTxt.trim().replace(/\s+/g,' '));
        }
      }
      var sync = function(){ c.setAttribute('aria-checked', String(c.classList.contains('done'))); };
      sync();
      hbBindKey(c, sync);
    });
  }

  /* ---------- section containers: unify the whole book to the carded look ----------
     Most chapters wrap each h2-section in a .card; older bare-flow / mixed chapters
     leave sections as loose flow directly under .container. Wrap every un-carded
     top-level h2-section (h2 + following siblings up to the next h2) into a .card so
     the entire book reads as one publisher. Idempotent and content-preserving (it only
     REPARENTS existing nodes — no text added/removed), and h2 ids are kept so the shared
     on-page TOC still resolves. Already-carded chapters are a natural no-op (their h2s
     live inside .card, not as direct children of the root); sections inside tab panels
     (.sec) ARE wrapped too (the shared CSS flattens tab panels to normal flow, so every
     chapter ends up with the same carded look). Bespoke-layout pages are exempt by
     filename: the cover/index, the ramp-up checklists, and the algo cheat sheet. */
  function hbWrapBareSections(){
    var fn = (location.pathname.split('/').pop() || 'index.html');
    if(fn==='' || fn==='index.html' || /^rampup_\d+\.html$/.test(fn) || fn==='algo_toolbox_cheatsheet.html') return;
    /* Every content h2-section that is NOT already inside a .card becomes one. This
       cards loose bare-flow sections (h2 as a direct child of the content root) AND the
       sections inside tab panels (h2 inside a .sec/.section under any wrapper), while
       already-carded sections are skipped. Scoped to the whole document because chapters
       use several content wrappers (.container/.content/.sec/none); this runs in boot()
       BEFORE the sidebar/masthead are injected, so the only h2s present are content
       headings (the booknav has none). The chrome guards are belt-and-suspenders. Collect
       targets first, then wrap — each h2's group is its following siblings within the SAME
       parent up to the next h2, so wrapping one never disturbs another. */
    var targets = Array.prototype.slice.call(document.querySelectorAll('h2')).filter(function(h){
      return !h.closest('.card') && !h.closest('#hb-sidebar') && !h.closest('.hb-sidebar') && !h.closest('.bknav') && !h.closest('.hb-masthead');
    });
    targets.forEach(function(h2){
      if(h2.closest('.card')) return;                 // guard (shouldn't happen — groups don't overlap)
      var parent = h2.parentNode; if(!parent) return;
      var group = [h2], sib = h2.nextSibling;
      while(sib){
        if(sib.nodeType === 1 && sib.tagName === 'H2') break;   // stop at the next section heading
        var next = sib.nextSibling; group.push(sib); sib = next;
      }
      var card = document.createElement('div'); card.className = 'card hb-autocard';
      parent.insertBefore(card, h2);
      for(var k=0;k<group.length;k++) card.appendChild(group[k]);
    });
  }

  /* Wrap every data table in a horizontally-scrollable div so wide tables scroll
     WITHOUT setting display:block on the <table> (which would strip its screen-reader
     table semantics in Chromium/WebKit — WCAG 1.3.1). Idempotent. */
  function wrapTables(){
    var tables = document.querySelectorAll('table');
    Array.prototype.forEach.call(tables, function(t){
      if(t.closest('.hb-twrap')) return;                 // already wrapped
      var w = document.createElement('div'); w.className = 'hb-twrap';
      t.parentNode.insertBefore(w, t); w.appendChild(t);
    });
  }

  function boot(){ hbWrapBareSections(); wrapTables(); init(); enhanceInteractiveA11y(); }   /* wrap first so init builds the TOC on the final structure; enhance runs even if init early-returns */
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
