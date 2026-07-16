

function createCoreScene(canvas, options = {}) {
  const opts = Object.assign({
    particleCount: 700,
    autoRotateSpeed: 1,     // relative speed multiplier
    parallax: 0.6,          // how strongly the mouse moves the camera/light
    coreColorA: 0x2be3ff,   // cyan
    coreColorB: 0x8b5cf6,   // violet
    cameraZ: 7,
    scale: 1,
    interactive: true       // whether this instance listens to window mouse events
  }, options);

  if (typeof THREE === 'undefined' || !canvas) return null;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, Math.max(canvas.clientWidth, 1) / Math.max(canvas.clientHeight, 1), 0.1, 100);
  camera.position.set(0, 0, opts.cameraZ);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch (e) {
    return null; // WebGL unavailable — caller should show a CSS fallback
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  // ---- Lights ----
  const ambient = new THREE.AmbientLight(0x50508a, 1.3);
  scene.add(ambient);
  const keyLight = new THREE.PointLight(opts.coreColorA, 5, 24);
  keyLight.position.set(3, 2, 4);
  scene.add(keyLight);
  const rimLight = new THREE.PointLight(opts.coreColorB, 4, 24);
  rimLight.position.set(-3, -1.5, -2);
  scene.add(rimLight);

  // ---- Core group ----
  const core = new THREE.Group();
  core.scale.setScalar(opts.scale);

  const inner = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.05, 1),
    new THREE.MeshStandardMaterial({
      color: opts.coreColorB, emissive: opts.coreColorB, emissiveIntensity: 0.55,
      metalness: 0.65, roughness: 0.25, flatShading: true
    })
  );
  core.add(inner);

  const shell = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.65, 1),
    new THREE.MeshBasicMaterial({ color: opts.coreColorA, wireframe: true, transparent: true, opacity: 0.4 })
  );
  core.add(shell);

  const shellOuter = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2.05, 0),
    new THREE.MeshBasicMaterial({ color: opts.coreColorB, wireframe: true, transparent: true, opacity: 0.14 })
  );
  core.add(shellOuter);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(2.55, 0.015, 8, 120),
    new THREE.MeshBasicMaterial({ color: opts.coreColorA, transparent: true, opacity: 0.55 })
  );
  ring.rotation.x = Math.PI / 2.3;
  core.add(ring);

  const ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(2.9, 0.008, 8, 120),
    new THREE.MeshBasicMaterial({ color: opts.coreColorB, transparent: true, opacity: 0.35 })
  );
  ring2.rotation.x = Math.PI / 1.7;
  ring2.rotation.y = 0.4;
  core.add(ring2);

  scene.add(core);

  // ---- Background particle field ----
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(opts.particleCount * 3);
  for (let i = 0; i < opts.particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 22;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 22;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 18 - 4;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.018, transparent: true, opacity: 0.55 });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // ---- Mouse parallax state ----
  let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
  function onMouseMove(e) {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;
  }
  if (opts.interactive && !reduceMotion) {
    window.addEventListener('mousemove', onMouseMove, { passive: true });
  }

  function resize() {
    const w = Math.max(canvas.clientWidth, 1);
    const h = Math.max(canvas.clientHeight, 1);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  resize();

  let frameId;
  function tick() {
    frameId = requestAnimationFrame(tick);

    if (!reduceMotion) {
      targetX += (mouseX - targetX) * 0.04;
      targetY += (mouseY - targetY) * 0.04;

      core.rotation.y += 0.0016 * opts.autoRotateSpeed + targetX * 0.012 * opts.parallax;
      core.rotation.x += (targetY * 0.012 * opts.parallax) - 0.0002;
      ring.rotation.z += 0.0022;
      ring2.rotation.z -= 0.0016;
      particles.rotation.y += 0.0004;

      camera.position.x += (targetX * opts.parallax - camera.position.x) * 0.05;
      camera.position.y += (-targetY * opts.parallax * 0.6 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      keyLight.position.x = 3 + targetX * 2.4;
      keyLight.position.y = 2 + targetY * 2.4;
    } else {
      core.rotation.y += 0.0009;
    }

    renderer.render(scene, camera);
  }
  tick();

  return {
    scene, camera, renderer, core,
    destroy() {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      if (opts.interactive) window.removeEventListener('mousemove', onMouseMove);
    }
  };
}
