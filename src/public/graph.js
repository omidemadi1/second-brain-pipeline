(() => {
  const data = window.__GRAPH__;
  const canvas = document.getElementById("graph");
  const stage = canvas.parentElement;
  const tip = document.getElementById("tip");
  const legend = document.getElementById("legend");
  const ctx = canvas.getContext("2d");
  if (!data || !canvas || !ctx) return;

  const COLORS = {
    "AI & Machine Learning": "#d4b06a",
    Development: "#7ea6c9",
    Cybersecurity: "#d97b7b",
    General: "#9d8cff",
    "Design & Creative": "#c58fb5",
    "DevOps & Infrastructure": "#7fb08a",
    "Marketing & Growth": "#d9a441",
    "Productivity & Tools": "#8f9bb3",
    "Business & Finance": "#b5a37a",
    Networking: "#6fb3a8",
    "Maps of Content": "#e3c485",
  };

  function colorFor(category) {
    if (COLORS[category]) return COLORS[category];
    let hash = 0;
    for (const char of category) hash = (hash * 31 + char.charCodeAt(0)) | 0;
    return `hsl(${Math.abs(hash) % 360} 42% 64%)`;
  }

  const nodes = data.nodes.map((node, index) => ({
    ...node,
    index,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    radius: node.moc ? 8 : 3.5 + Math.sqrt(Math.max(0, node.degree)) * 1.35,
    color: colorFor(node.category),
  }));
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const links = data.links
    .map((link) => ({ source: byId.get(link.source), target: byId.get(link.target) }))
    .filter((link) => link.source && link.target);

  let width = 800;
  let height = 600;
  let dpr = 1;
  let zoom = 1;
  let panX = 0;
  let panY = 0;
  let cx = 0;
  let cy = 0;
  let hovered = null;
  let showLabels = false;
  let dragging = false;
  let moved = 0;
  let last = { x: 0, y: 0 };

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  function resize() {
    const rect = stage.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    draw();
  }

  function initPositions() {
    const radius = Math.min(width, height) * 0.34;
    for (const node of nodes) {
      if (node.moc) {
        node.x = (Math.random() - 0.5) * 70;
        node.y = (Math.random() - 0.5) * 70;
      } else {
        const angle = (node.index / nodes.length) * Math.PI * 2;
        const spread = radius * (0.65 + Math.random() * 0.35);
        node.x = Math.cos(angle) * spread + (Math.random() - 0.5) * 30;
        node.y = Math.sin(angle) * spread + (Math.random() - 0.5) * 30;
      }
    }
  }

  function simulate(ticks = 320) {
    let alpha = 1;
    for (let tick = 0; tick < ticks; tick++) {
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          let dx = b.x - a.x;
          let dy = b.y - a.y;
          const distance2 = dx * dx + dy * dy;
          if (distance2 < 0.01) {
            dx = (Math.random() - 0.5) * 0.2;
            dy = (Math.random() - 0.5) * 0.2;
          }
          const distance = Math.sqrt(dx * dx + dy * dy) || 0.1;
          const force = Math.min(1.9, (1200 / Math.max(distance2, 1)) * alpha);
          const fx = (dx / distance) * force;
          const fy = (dy / distance) * force;
          a.vx -= fx;
          a.vy -= fy;
          b.vx += fx;
          b.vy += fy;
        }
      }

      for (const link of links) {
        const a = link.source;
        const b = link.target;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 0.1;
        const force = clamp((distance - 86) * 0.018 * alpha, -2.2, 2.2);
        const fx = (dx / distance) * force;
        const fy = (dy / distance) * force;
        a.vx += fx;
        a.vy += fy;
        b.vx -= fx;
        b.vy -= fy;
      }

      for (const node of nodes) {
        node.vx -= node.x * 0.0025 * alpha;
        node.vy -= node.y * 0.0025 * alpha;
        node.vx = clamp(node.vx * 0.86, -10, 10);
        node.vy = clamp(node.vy * 0.86, -10, 10);
        node.x += node.vx;
        node.y += node.vy;
      }
      alpha *= 0.995;
    }
  }

  function bounds() {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const node of nodes) {
      minX = Math.min(minX, node.x);
      minY = Math.min(minY, node.y);
      maxX = Math.max(maxX, node.x);
      maxY = Math.max(maxY, node.y);
    }
    return { minX, minY, maxX, maxY };
  }

  function fit() {
    if (!nodes.length) return;
    const box = bounds();
    const spanX = Math.max(1, box.maxX - box.minX);
    const spanY = Math.max(1, box.maxY - box.minY);
    const next = Math.min((width - 120) / spanX, (height - 120) / spanY);
    zoom = clamp(next, 0.2, 2.4);
    cx = (box.minX + box.maxX) / 2;
    cy = (box.minY + box.maxY) / 2;
    panX = 0;
    panY = 0;
  }

  function toScreen(node) {
    return {
      x: (node.x - cx) * zoom + width / 2 + panX,
      y: (node.y - cy) * zoom + height / 2 + panY,
    };
  }

  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    ctx.save();
    ctx.translate(width / 2 + panX, height / 2 + panY);
    ctx.scale(zoom, zoom);
    ctx.translate(-cx, -cy);

    ctx.lineWidth = 0.75 / zoom;
    ctx.strokeStyle = "rgba(162,168,180,0.13)";
    ctx.beginPath();
    for (const link of links) {
      ctx.moveTo(link.source.x, link.source.y);
      ctx.lineTo(link.target.x, link.target.y);
    }
    ctx.stroke();

    for (const node of nodes) {
      const active = hovered === node;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius + (active ? 2.5 : 0), 0, Math.PI * 2);
      ctx.fillStyle = node.color;
      ctx.globalAlpha = active ? 1 : 0.88;
      ctx.fill();
      ctx.globalAlpha = 1;
      if (node.moc) {
        ctx.lineWidth = 2 / zoom;
        ctx.strokeStyle = "#d4b06a";
        ctx.stroke();
      } else if (active) {
        ctx.lineWidth = 1.6 / zoom;
        ctx.strokeStyle = "#e8e5de";
        ctx.stroke();
      }
    }
    ctx.restore();

    for (const node of nodes) {
      if (hovered !== node && (!showLabels || (node.degree < 6 && !node.moc))) continue;
      const screen = toScreen(node);
      if (screen.x < -80 || screen.y < -20 || screen.x > width + 80 || screen.y > height + 20) continue;
      const title = node.title.length > 42 ? `${node.title.slice(0, 40)}…` : node.title;
      ctx.font = `${hovered === node ? "500" : "400"} 10.5px Inter, ui-sans-serif, system-ui, sans-serif`;
      ctx.fillStyle = hovered === node ? "#e8e5de" : "rgba(200,204,214,0.72)";
      const x = screen.x + node.radius * zoom + 5;
      ctx.fillText(title, x, screen.y + 3.5, 170);
    }
  }

  function nodeAt(screenX, screenY) {
    let found = null;
    let best = Infinity;
    for (const node of nodes) {
      const screen = toScreen(node);
      const dx = screen.x - screenX;
      const dy = screen.y - screenY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const reach = Math.max(6, node.radius * zoom + 5);
      if (distance <= reach && distance < best) {
        best = distance;
        found = node;
      }
    }
    return found;
  }

  function escapeHtml(value) {
    return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function showTip(node, screen) {
    if (!node) {
      tip.hidden = true;
      return;
    }
    tip.hidden = false;
    tip.innerHTML = `<div class="t">${escapeHtml(node.title)}</div><div class="m">${escapeHtml(node.category)} · ${node.degree} link${
      node.degree === 1 ? "" : "s"
    }</div>`;
    const box = tip.getBoundingClientRect();
    let left = screen.x + 12;
    let top = screen.y + 12;
    if (left + box.width > width - 8) left = screen.x - box.width - 12;
    if (top + box.height > height - 8) top = screen.y - box.height - 12;
    tip.style.left = `${Math.max(8, left)}px`;
    tip.style.top = `${Math.max(8, top)}px`;
  }

  function point(event) {
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  canvas.addEventListener("pointerdown", (event) => {
    const p = point(event);
    dragging = true;
    moved = 0;
    last = p;
    canvas.classList.add("dragging");
    canvas.setPointerCapture(event.pointerId);
  });

  canvas.addEventListener("pointermove", (event) => {
    const p = point(event);
    if (dragging) {
      const dx = p.x - last.x;
      const dy = p.y - last.y;
      panX += dx;
      panY += dy;
      moved += Math.abs(dx) + Math.abs(dy);
      last = p;
      draw();
      return;
    }
    const node = nodeAt(p.x, p.y);
    if (node !== hovered) {
      hovered = node;
      canvas.style.cursor = node ? "pointer" : "grab";
      draw();
    }
    showTip(node, p);
  });

  canvas.addEventListener("pointerup", (event) => {
    const p = point(event);
    const node = nodeAt(p.x, p.y);
    dragging = false;
    canvas.classList.remove("dragging");
    if (moved < 5 && node) window.location.href = node.url;
    else if (moved < 5) showTip(node, p);
  });

  canvas.addEventListener("pointerleave", () => {
    if (dragging) return;
    hovered = null;
    tip.hidden = true;
    draw();
  });

  canvas.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();
      const p = point(event);
      const before = {
        x: (p.x - width / 2 - panX) / zoom + cx,
        y: (p.y - height / 2 - panY) / zoom + cy,
      };
      const factor = event.deltaY < 0 ? 1.12 : 1 / 1.12;
      zoom = clamp(zoom * factor, 0.22, 4.5);
      panX = p.x - (before.x - cx) * zoom - width / 2;
      panY = p.y - (before.y - cy) * zoom - height / 2;
      draw();
    },
    { passive: false },
  );

  document.getElementById("zoom-in")?.addEventListener("click", () => {
    zoom = clamp(zoom * 1.25, 0.22, 4.5);
    draw();
  });
  document.getElementById("zoom-out")?.addEventListener("click", () => {
    zoom = clamp(zoom / 1.25, 0.22, 4.5);
    draw();
  });
  document.getElementById("reset")?.addEventListener("click", () => {
    fit();
    draw();
  });
  const labelsButton = document.getElementById("labels");
  labelsButton?.addEventListener("click", () => {
    showLabels = !showLabels;
    labelsButton.classList.toggle("on", showLabels);
    draw();
  });

  const present = new Map();
  for (const node of nodes) present.set(node.category, (present.get(node.category) || 0) + 1);
  legend.innerHTML = [...present]
    .sort((a, b) => b[1] - a[1])
    .map(
      ([category, count]) =>
        `<span class="legend-item"><span class="legend-dot" style="background:${colorFor(category)}"></span>${escapeHtml(
          category,
        )} <span style="opacity:.55">${count}</span></span>`,
    )
    .join("");

  initPositions();
  resize();
  simulate();
  fit();
  draw();
  window.addEventListener("resize", resize);
})();
