/* ===========================================================
   Hero FX — boot sequence + Three.js particle/wireframe hero.
   Degrades gracefully: reduced-motion / mobile / no-WebGL ->
   the CSS glow fallback in the hero remains.
   =========================================================== */
(function () {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var smallScreen = window.matchMedia && window.matchMedia('(max-width: 820px)').matches;

  /* -------------------- Boot sequence -------------------- */
  function boot() {
    if (reduce) return;                                   // accessibility
    try { if (sessionStorage.getItem('kd_booted')) return; } catch (e) {}

    var lines = [
      "root@kdshetty:~# ./init_portfolio.sh",
      "[<span class='ok'> OK </span>] loading profile .............. Kurudunje Deekshith Shetty",
      "[<span class='ok'> OK </span>] role ........................ Lead Cybersecurity / Cloud Specialist",
      "[<span class='ok'> OK </span>] domains ..................... cloud · appsec · ai/llm · devsecops · compliance · secops",
      "[<span class='ok'> OK </span>] clearance ................... HIPAA-attested platform · 0-crit / 0-high pentest",
      "[<span class='ok'> OK </span>] launching secure interface ..."
    ];

    var overlay = document.createElement('div');
    overlay.id = 'boot';
    overlay.innerHTML = "<div class='boot-inner'><div id='boot-out'></div>" +
      "<div class='boot-skip'>press any key or click to <b>skip</b></div></div>";
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    var out = overlay.querySelector('#boot-out');
    var li = 0, done = false;

    function finish() {
      if (done) return; done = true;
      try { sessionStorage.setItem('kd_booted', '1'); } catch (e) {}
      overlay.classList.add('done');
      document.body.style.overflow = '';
      setTimeout(function () { if (overlay.parentNode) overlay.parentNode.removeChild(overlay); }, 650);
    }

    function typeLine() {
      if (done) return;
      if (li >= lines.length) { setTimeout(finish, 450); return; }
      var div = document.createElement('div');
      div.className = 'boot-line';
      div.innerHTML = lines[li] + "&nbsp;";
      out.appendChild(div);
      li++;
      setTimeout(typeLine, 230);
    }
    typeLine();

    overlay.addEventListener('click', finish);
    document.addEventListener('keydown', finish, { once: true });
    setTimeout(finish, 4000); // hard safety: never trap the user
  }

  /* -------------------- Three.js hero -------------------- */
  function hero3d() {
    var mount = document.getElementById('three-hero');
    if (!mount) return;
    if (reduce || smallScreen) return;          // keep CSS fallback
    if (typeof window.THREE === 'undefined') return;

    var THREE = window.THREE, W = mount.clientWidth, H = mount.clientHeight || 600;
    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch (e) { return; }                     // no WebGL -> fallback
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(W, H);
    mount.appendChild(renderer.domElement);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
    camera.position.z = 18;

    var GREEN = 0x9fef00, CYAN = 0x4ad8ff;
    var group = new THREE.Group();
    scene.add(group);

    // wireframe icosahedron core
    var ico = new THREE.Mesh(
      new THREE.IcosahedronGeometry(6.2, 1),
      new THREE.MeshBasicMaterial({ color: GREEN, wireframe: true, transparent: true, opacity: 0.18 })
    );
    group.add(ico);
    var ico2 = new THREE.Mesh(
      new THREE.IcosahedronGeometry(4.0, 1),
      new THREE.MeshBasicMaterial({ color: CYAN, wireframe: true, transparent: true, opacity: 0.12 })
    );
    group.add(ico2);

    // particle field
    var COUNT = 520, pos = new Float32Array(COUNT * 3);
    for (var i = 0; i < COUNT; i++) {
      var r = 9 + Math.random() * 9;
      var th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
      pos[i * 3]     = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      pos[i * 3 + 2] = r * Math.cos(ph);
    }
    var pg = new THREE.BufferGeometry();
    pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    var points = new THREE.Points(pg, new THREE.PointsMaterial({ color: GREEN, size: 0.09, transparent: true, opacity: 0.85 }));
    scene.add(points);

    var mx = 0, my = 0, tx = 0, ty = 0, raf = null, running = true;
    function onMove(e) {
      var x = (e.touches ? e.touches[0].clientX : e.clientX);
      var y = (e.touches ? e.touches[0].clientY : e.clientY);
      tx = (x / window.innerWidth - 0.5);
      ty = (y / window.innerHeight - 0.5);
    }
    window.addEventListener('mousemove', onMove, { passive: true });

    function resize() {
      W = mount.clientWidth; H = mount.clientHeight || 600;
      camera.aspect = W / H; camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    }
    window.addEventListener('resize', resize);

    var t = 0;
    function animate() {
      if (!running) return;
      raf = requestAnimationFrame(animate);
      t += 0.0025;
      group.rotation.y += 0.0016; group.rotation.x += 0.0008;
      ico2.rotation.y -= 0.003; ico2.rotation.z += 0.002;
      points.rotation.y += 0.0006;
      mx += (tx - mx) * 0.04; my += (ty - my) * 0.04;
      camera.position.x = mx * 6;
      camera.position.y = -my * 4;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    }
    animate();

    document.addEventListener('visibilitychange', function () {
      running = !document.hidden;
      if (running && !raf) animate();
      if (!running && raf) { cancelAnimationFrame(raf); raf = null; }
    });
  }

  function init() { boot(); hero3d(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
