// =============== Responsive Nav Controller ===============
const MOBILE_BREAKPOINT_PX = 680;
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
const yearEl = document.getElementById('year');
const toTop = document.querySelector('.to-top');



// Year
if (yearEl) yearEl.textContent = new Date().getFullYear();

function isMobile() {
  return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX}px)`).matches;
}

function setNavForViewport() {
  if (!toggle || !links) return;

  if (isMobile()) {
    // Mobile: menu is hidden until hamburger is tapped
    if (!links.style.display) links.style.display = 'none';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.style.display = 'block';
  } else {
    // Desktop: always show menu, ignore inline mobile styles
    links.style.display = ''; // let CSS handle layout (flex)
    toggle.setAttribute('aria-expanded', 'false');
    toggle.style.display = 'none';
  }
}

// Initial state
setNavForViewport();

// Toggle only on mobile
toggle?.addEventListener('click', () => {
  if (!isMobile() || !links) return;
  const open = links.style.display === 'flex';
  links.style.display = open ? 'none' : 'flex';
  toggle.setAttribute('aria-expanded', (!open).toString());
});

// Close with Escape on mobile
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isMobile() && links?.style.display === 'flex') {
    links.style.display = 'none';
    toggle?.setAttribute('aria-expanded', 'false');
  }
});

// Recalculate on resize (debounced)
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(setNavForViewport, 150);
});

// =============== Reveal on Scroll ===============
const observer = new IntersectionObserver(
  (entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  }),
  { threshold: 0.12 }
);
document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

// =============== Back-to-top ===============
window.addEventListener('scroll', () => {
  if (!toTop) return;
  if (window.scrollY > 600) toTop.classList.add('show');
  else toTop.classList.remove('show');
});
toTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// =============== Fake Contact Submit (demo) ===============
const form = document.querySelector('.contact__form');
const note = document.getElementById('formNote');
form?.addEventListener('submit', () => {
  const btn = document.getElementById('sendBtn');
  if (!btn || !note) return;
  btn.disabled = true;
  btn.textContent = 'Sending...';
  setTimeout(() => {
    btn.disabled = false;
    btn.textContent = 'Send';
    note.textContent = 'Thanks! I’ll get back to you shortly.';
    form.reset();
    setTimeout(() => (note.textContent = ''), 4000);
  }, 900);
});

// =================================================== Skills Mind Map (vis-network) ========================================================


/* ============= Skills Mind Map (complete rewrite) ============= */
(function SkillsMindMap() {
  // Wait for vis-network to be ready
  const boot = () => {
    const canvas = document.getElementById('skillsGraph');
    if (!canvas) return;

    // ---- Pull palette from CSS (with safe fallbacks) ----
    const css     = getComputedStyle(document.documentElement);
    const INK     = (css.getPropertyValue('--ink')       || '#2E3A36').trim();
    const BRAND   = (css.getPropertyValue('--brand')     || '#D9A89C').trim();   // non-tech hub fill
    const BRAND2  = (css.getPropertyValue('--brand-2')   || '#8C6A5D').trim();   // hub/core border
    const ACCENT  = (css.getPropertyValue('--accent')    || '#E7C3A6').trim();   // tech hub fill
    const LEAF_BG = (css.getPropertyValue('--leaf-bg')   || '#EAF4EE').trim();   // soft green
    const LEAF_BR = (css.getPropertyValue('--leaf-border') || '#CFE1D7').trim();
    const LEAF_HI = (css.getPropertyValue('--leaf-hi')   || '#4A7C59').trim();

    // ---- Node styles ----
    const baseFont = { face: 'Inter', color: INK, size: 18, vadjust: 2 };

    const core = {
      shape: 'circle', size: 36, borderWidth: 2,
      color: { background: '#fff', border: BRAND2, highlight: { background: '#fff', border: BRAND2 } },
      font:  { ...baseFont, size: 20, bold: true }
    };

    const hub = (bg) => ({
      shape: 'ellipse', size: 30, borderWidth: 1.5,
      color: { background: bg, border: '#e8d6c7', highlight: { background: bg, border: BRAND2 } },
      font:  { ...baseFont, size: 18, bold: true }
    });

    // Default leaf = soft green for readability on white canvas
    const leaf = () => ({
      shape: 'box', margin: 5, borderWidth: 1.2, borderWidthSelected: 2, shadow: true,
      color: { background: LEAF_BG, border: LEAF_BR, highlight: { background: LEAF_BG, border: LEAF_HI } },
      font:  { ...baseFont, size: 16 }
    });

    // ---- Nodes (resume-based) ----
    const nodes = new vis.DataSet([
      // core
      { id: 'skills', label: 'Skills', group: 'core', ...core },

      // hubs
      { id: 'technical', label: 'Technical', group: 'tech', ...hub(ACCENT) },
      { id: 'nontech',   label: 'Non-Technical', group: 'non', ...hub(BRAND) },

      // technical groups
      { id: 'tg_bi',    label: 'BI & Visualization',   group: 'tech', ...hub(ACCENT) },
      { id: 'tg_prog',  label: 'Programming & Data',   group: 'tech', ...hub(ACCENT) },
      { id: 'tg_ml',    label: 'ML & Modeling',        group: 'tech', ...hub(ACCENT) },
      { id: 'tg_graph', label: 'Network & Graph',      group: 'tech', ...hub(ACCENT) },
      { id: 'tg_geo',   label: 'Geo & Mapping',        group: 'tech', ...hub(ACCENT) },
      { id: 'tg_ops',   label: 'DataOps & Notebooks',  group: 'tech', ...hub(ACCENT) },

      // non-technical groups (methods / domain)
      { id: 'ntg_course', label: 'Coursework & Methods', group: 'non', ...hub(BRAND) },
      { id: 'ntg_health', label: 'Healthcare Domain',    group: 'non', ...hub(BRAND) },
      { id: 'ntg_exp',    label: 'Experimentation',      group: 'non', ...hub(BRAND) },
      { id: 'ntg_comm',   label: 'Communication',        group: 'non', ...hub(BRAND) },
      { id: 'ntg_fore',   label: 'Forecasting',          group: 'non', ...hub(BRAND) },

      // technical leaves (tools / languages)
      { id: 't_powerbi',   label: 'Power BI',                  group: 'tech', ...leaf() },
      { id: 't_tableau',   label: 'Tableau',                   group: 'tech', ...leaf() },
      { id: 't_excel',     label: 'Excel (Power Query, DAX)',  group: 'tech', ...leaf() },

      { id: 't_sql',       label: 'SQL (Postgres, MySQL)',     group: 'tech', ...leaf() },
      { id: 't_python',    label: 'Python',                    group: 'tech', ...leaf() },
      { id: 't_r',         label: 'R',                         group: 'tech', ...leaf() },
      { id: 't_pyspark',   label: 'PySpark',                   group: 'tech', ...leaf() },
      { id: 't_pandas',    label: 'pandas',                    group: 'tech', ...leaf() },

      { id: 't_sklearn',   label: 'scikit-learn',              group: 'tech', ...leaf() },
      { id: 't_tensorflow',label: 'TensorFlow',                group: 'tech', ...leaf() },

      { id: 't_pyvis',     label: 'PyVis',                     group: 'tech', ...leaf() },
      { id: 't_networkx',  label: 'NetworkX',                  group: 'tech', ...leaf() },

      { id: 't_arcgis',    label: 'ArcGIS',                    group: 'tech', ...leaf() },

      { id: 't_dbt',       label: 'dbt',                       group: 'tech', ...leaf() },
      { id: 't_git',       label: 'Git/GitHub',                group: 'tech', ...leaf() },
      { id: 't_jupyter',   label: 'Jupyter',                   group: 'tech', ...leaf() },

      // non-technical leaves (methods / domain)
      { id: 'c_predict',    label: 'Predictive Analytics',          group: 'non', ...leaf() },
      { id: 'c_datamining', label: 'Data Mining',                   group: 'non', ...leaf() },
      { id: 'c_erm',        label: 'Enterprise Risk Mgmt',          group: 'non', ...leaf() },

      { id: 'h_health',     label: 'Healthcare/Pharma Analytics',   group: 'non', ...leaf() },
      { id: 'h_geo',        label: 'Geospatial analysis',           group: 'non', ...leaf() },

      { id: 'e_ab',         label: 'A/B testing',                   group: 'non', ...leaf() },
      { id: 'e_kpi',        label: 'KPI design',                    group: 'non', ...leaf() },

      { id: 'f_sarima',     label: 'Demand forecasting (SARIMA)',   group: 'non', ...leaf() },

      { id: 'c_story',      label: 'Data storytelling',             group: 'non', ...leaf() }
    ]);

    // ---- Edges ----
    const E = (a, b, id) => ({ id, from: a, to: b });
    const edges = new vis.DataSet([
      // hubs
      E('skills','technical','e1'), E('skills','nontech','e2'),

      // technical groups
      E('technical','tg_bi','e3'), E('technical','tg_prog','e4'),
      E('technical','tg_ml','e5'), E('technical','tg_graph','e6'),
      E('technical','tg_geo','e7'), E('technical','tg_ops','e8'),

      // non-technical groups
      E('nontech','ntg_course','e9'), E('nontech','ntg_health','e10'),
      E('nontech','ntg_exp','e11'), E('nontech','ntg_comm','e12'),
      E('nontech','ntg_fore','e13'),

      // technical leaves
      E('tg_bi','t_powerbi','e14'), E('tg_bi','t_tableau','e15'), E('tg_bi','t_excel','e16'),
      E('tg_prog','t_sql','e17'), E('tg_prog','t_python','e18'), E('tg_prog','t_r','e19'),
      E('tg_prog','t_pyspark','e20'), E('tg_prog','t_pandas','e21'),
      E('tg_ml','t_sklearn','e22'), E('tg_ml','t_tensorflow','e23'),
      E('tg_graph','t_pyvis','e24'), E('tg_graph','t_networkx','e25'),
      E('tg_geo','t_arcgis','e26'),
      E('tg_ops','t_dbt','e27'), E('tg_ops','t_git','e28'), E('tg_ops','t_jupyter','e29'),

      // non-technical leaves
      E('ntg_course','c_predict','e30'), E('ntg_course','c_datamining','e31'), E('ntg_course','c_erm','e32'),
      E('ntg_health','h_health','e33'),  E('ntg_health','h_geo','e34'),
      E('ntg_exp','e_ab','e35'),        E('ntg_exp','e_kpi','e36'),
      E('ntg_fore','f_sarima','e37'),
      E('ntg_comm','c_story','e38')
    ]);

    // ---- Network ----
    const net = new vis.Network(canvas, { nodes, edges }, {
      interaction: { hover: true, tooltipDelay: 120 },
      physics: {
        solver: 'forceAtlas2Based',
        forceAtlas2Based: { gravitationalConstant: -40, springConstant: 0.06, avoidOverlap: 1.0 },
        stabilization: { iterations: 20 }
      },
      edges: { color: { color: '#e0c9bd', highlight: BRAND2 }, width: 1.4, smooth: { type: 'continuous' } },
      layout: { improvedLayout: true }
    });

    // ---- Color management (restore on "All") ----
    const BASE_COLORS = new Map();
    nodes.forEach(n => BASE_COLORS.set(n.id, JSON.parse(JSON.stringify(n.color || {}))));

    const TINT_TECH = { background: '#FFF59D', border: '#FBC02D',
      highlight: { background: '#FFF59D', border: '#F57F17' } };
    const TINT_NON  = { background: '#FFCDD2', border: '#E57373',
      highlight: { background: '#FFCDD2', border: '#D32F2F' } };

    function setMode(mode) {
      const hideTech = (mode === 'nontech');
      const hideNon  = (mode === 'technical');

      // visibility
      nodes.forEach(n => {
        const isCore = n.group === 'core';
        const isTech = n.group === 'tech';
        const isNon  = n.group === 'non';
        const hidden = (hideTech && isTech) || (hideNon && isNon);
        nodes.update({ id: n.id, hidden: isCore ? false : hidden });
      });
      edges.forEach(e => {
        const a = nodes.get(e.from), b = nodes.get(e.to);
        edges.update({ id: e.id, hidden: (a.hidden || b.hidden) });
      });

      // palette
      if (mode === 'technical') {
        nodes.forEach(n => nodes.update({ id: n.id, color: (n.group === 'tech') ? TINT_TECH : BASE_COLORS.get(n.id) }));
      } else if (mode === 'nontech') {
        nodes.forEach(n => nodes.update({ id: n.id, color: (n.group === 'non') ? TINT_NON : BASE_COLORS.get(n.id) }));
      } else { // 'all' or 'fit'
        nodes.forEach(n => nodes.update({ id: n.id, hidden: false, color: BASE_COLORS.get(n.id) }));
        edges.forEach(e => edges.update({ id: e.id, hidden: false }));
      }

      // UI + camera
      const tb = document.querySelector('.graph-actions');
      const active = (mode === 'fit') ? 'all' : mode;
      tb?.querySelectorAll('button').forEach(b => b.classList.toggle('is-active', b.dataset.filter === active));

      net.fit({ animation: true, padding: (mode === 'all' || mode === 'fit') ? 90 : 110 });
    }

    // Toolbar
    document.querySelector('.graph-actions')?.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-filter]');
      if (btn) setMode(btn.dataset.filter);
    });

    // Initial view: original palette + fit
    setTimeout(() => setMode('all'), 0);
    window.addEventListener('resize', () => net.fit({ animation: false, padding: 80 }));
  };

  if (window.vis) boot();
  else {
    const t = setInterval(() => { if (window.vis) { clearInterval(t); boot(); } }, 60);
  }

// ==== Load More Projects ====
(function () {
  const btn = document.querySelector('#loadMoreBtn');
  const cards = Array.from(document.querySelectorAll('#projects .proj-card'));
  const INITIAL_VISIBLE = 4; // first 4 visible
  let expanded = false;

  if (!btn) return;

  btn.addEventListener('click', function (e) {
    e.preventDefault();

    if (!expanded) {
      // reveal all hidden cards
      cards.slice(INITIAL_VISIBLE).forEach(card => {
        card.classList.remove('is-hidden');
        card.classList.add('revealed');
        setTimeout(() => card.classList.remove('revealed'), 320);
      });
      btn.textContent = 'Show Less';
      expanded = true;
    } else {
      // collapse back to first 4
      cards.slice(INITIAL_VISIBLE).forEach(card => card.classList.add('is-hidden'));
      btn.textContent = 'View All Projects';
      expanded = false;

      // scroll back up so user sees the grid start
      document.querySelector('#projects').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
})();

})();


// =================================================== Projects Hidden Section ==================================================================================================


