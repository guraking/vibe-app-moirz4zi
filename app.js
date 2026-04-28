const loader = document.getElementById("loader");
const cursorDot = document.getElementById("cursorDot");
const cursorRing = document.getElementById("cursorRing");
const header = document.getElementById("siteHeader");
const progressBar = document.getElementById("progressBar");
const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");
const themeToggle = document.getElementById("themeToggle");
const projectModal = document.getElementById("projectModal");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const commandPalette = document.getElementById("commandPalette");
const commandInput = document.getElementById("commandInput");
const openCommand = document.getElementById("openCommand");
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

window.addEventListener("load", () => {
  setTimeout(() => {
    loader.classList.add("hidden");
    document.querySelectorAll(".reveal").forEach((el, index) => {
      if (el.getBoundingClientRect().top < window.innerHeight) {
        setTimeout(() => el.classList.add("visible"), index * 90);
      }
    });
  }, 650);
});

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let ringX = mouseX;
let ringY = mouseY;

window.addEventListener("mousemove", (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;

  if (cursorDot) {
    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  }
});

function animateCursor() {
  ringX += (mouseX - ringX) * 0.16;
  ringY += (mouseY - ringY) * 0.16;

  if (cursorRing) {
    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
  }

  requestAnimationFrame(animateCursor);
}

if (!prefersReducedMotion) {
  animateCursor();
}

document.querySelectorAll("a, button, input, textarea, .tilt-card").forEach((target) => {
  target.addEventListener("mouseenter", () => cursorRing?.classList.add("hover"));
  target.addEventListener("mouseleave", () => cursorRing?.classList.remove("hover"));
});

function updateScrollUi() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  progressBar.style.width = `${progress}%`;
  header.classList.toggle("scrolled", scrollTop > 30);

  document.querySelectorAll("section[id]").forEach((section) => {
    const top = section.offsetTop - 140;
    const bottom = top + section.offsetHeight;
    const id = section.getAttribute("id");

    if (scrollTop >= top && scrollTop < bottom) {
      document.querySelectorAll(".desktop-nav a").forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
      });
    }
  });
}

window.addEventListener("scroll", updateScrollUi);
updateScrollUi();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const counter = entry.target;
      const target = Number(counter.dataset.count);
      let current = 0;
      const duration = 1200;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        current = Math.floor(eased * target);
        counter.textContent = target === 96 ? `${current}%` : current;

        if (progress < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
      countObserver.unobserve(counter);
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll("[data-count]").forEach((counter) => countObserver.observe(counter));

menuToggle.addEventListener("click", () => {
  menuToggle.classList.toggle("open");
  mobileMenu.classList.toggle("open");
});

mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.classList.remove("open");
    mobileMenu.classList.remove("open");
  });
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  themeToggle.querySelector(".theme-icon").textContent = document.body.classList.contains("light") ? "☾" : "✦";
});

document.querySelectorAll(".magnetic").forEach((element) => {
  element.addEventListener("mousemove", (event) => {
    if (window.innerWidth < 981 || prefersReducedMotion) return;

    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    element.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
  });

  element.addEventListener("mouseleave", () => {
    element.style.transform = "";
  });
});

document.querySelectorAll(".tilt-card").forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    if (window.innerWidth < 981 || prefersReducedMotion) return;

    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 10;
    const rotateX = ((y / rect.height) - 0.5) * -10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

document.querySelectorAll(".filter-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    document.querySelectorAll(".filter-btn").forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    document.querySelectorAll(".project-card").forEach((card, index) => {
      const matched = filter === "all" || card.dataset.category === filter;

      if (matched) {
        card.classList.remove("hide");
        card.animate(
          [
            { opacity: 0, transform: "translateY(18px) scale(0.98)" },
            { opacity: 1, transform: "translateY(0) scale(1)" }
          ],
          {
            duration: 420,
            delay: index * 45,
            easing: "cubic-bezier(.2,.8,.2,1)"
          }
        );
      } else {
        card.classList.add("hide");
      }
    });
  });
});

document.querySelectorAll(".project-card").forEach((card) => {
  const openButton = card.querySelector(".project-open");

  openButton.addEventListener("click", () => {
    modalTitle.textContent = card.dataset.title;
    modalDesc.textContent = card.dataset.desc;
    projectModal.classList.add("open");
    projectModal.setAttribute("aria-hidden", "false");
  });
});

document.querySelectorAll("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", closeModal);
});

function closeModal() {
  projectModal.classList.remove("open");
  projectModal.setAttribute("aria-hidden", "true");
}

function openCommandPalette() {
  commandPalette.classList.add("open");
  commandPalette.setAttribute("aria-hidden", "false");
  setTimeout(() => commandInput.focus(), 80);
}

function closeCommandPalette() {
  commandPalette.classList.remove("open");
  commandPalette.setAttribute("aria-hidden", "true");
}

openCommand.addEventListener("click", openCommandPalette);

document.querySelectorAll("[data-close-command]").forEach((button) => {
  button.addEventListener("click", closeCommandPalette);
});

document.querySelectorAll("[data-suggest]").forEach((button) => {
  button.addEventListener("click", () => {
    commandInput.value = button.dataset.suggest;
    commandInput.focus();
  });
});

document.addEventListener("keydown", (event) => {
  const isCommandK = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";

  if (isCommandK) {
    event.preventDefault();
    openCommandPalette();
  }

  if (event.key === "Escape") {
    closeModal();
    closeCommandPalette();
  }
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const name = formData.get("name").trim();
  const email = formData.get("email").trim();
  const message = formData.get("message").trim();

  if (!name || !email || !message) {
    formMessage.textContent = "모든 항목을 입력해주세요.";
    formMessage.style.color = "#fca5a5";
    return;
  }

  formMessage.textContent = "완료되었습니다. 곧 멋진 제안으로 답변드릴게요!";
  formMessage.style.color = "#86efac";

 contactForm.animate(
    [
      { transform: "translateY(0)" },
      { transform: "translateY(-4px)" },
      { transform: "translateY(0)" }
    ],
    { duration: 380, easing: "ease-out" }
  );

  contactForm.reset();
});

window.addEventListener("mousemove", (event) => {
  if (prefersReducedMotion) return;

  const x = (event.clientX / window.innerWidth - 0.5) * 24;
  const y = (event.clientY / window.innerHeight - 0.5) * 24;

  document.querySelectorAll(".hero-gradient").forEach((blob, index) => {
    const depth = index === 0 ? 1 : -0.8;
    blob.style.translate = `${x * depth}px ${y * depth}px`;
  });

  document.querySelectorAll(".floating-badge").forEach((badge, index) => {
    const depth = index === 0 ? -0.5 : 0.7;
    badge.style.translate = `${x * depth}px ${y * depth}px`;
  });
});

function initThreeBackground() {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas || !window.THREE) return;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 8;

  const particlesCount = window.innerWidth < 768 ? 550 : 950;
  const positions = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 18;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    size: 0.026,
    color: 0x8b5cf6,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }

  window.addEventListener("resize", resize);
  resize();

  function animate() {
    points.rotation.y += 0.0009;
    points.rotation.x += 0.00035;

    const scroll = window.scrollY / Math.max(document.body.scrollHeight - window.innerHeight, 1);
    points.rotation.z = scroll * 0.8;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  if (!prefersReducedMotion) animate();
  else renderer.render(scene, camera);
}

initThreeBackground();