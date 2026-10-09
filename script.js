document.addEventListener("DOMContentLoaded", () => {
  const splash = document.getElementById("splash-screen");
  const logo = document.querySelector(".splash-logo");

  if (!splash || !logo) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (reduceMotion) {
    splash.remove();
    return;
  }

  gsap
    .timeline({
      onComplete: () => splash.remove(),
    })
    .to(logo, {
      opacity: 1,
      duration: 0.7,
      ease: "power2.out",
    })
    .to(splash, {
      opacity: 0,
      duration: 0.7,
      delay: 0.4,
      ease: "power2.inOut",
    });
});

/* =========================================
   H Design Studio — Navbar
========================================= */

const siteHeader = document.getElementById("siteHeader");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const aboutSection = document.getElementById("studio");

if (siteHeader && menuToggle && navLinks) {
  let lastScrollY = window.scrollY;
  let ticking = false;

  /* =====================================
       Update Navbar on Scroll
    ===================================== */

  function updateNavbar() {
    const currentScrollY = window.scrollY;
    const difference = currentScrollY - lastScrollY;
    const menuOpen = navLinks.classList.contains("active");

    /* Scrolled navbar state */

    siteHeader.classList.toggle("nav-scrolled", currentScrollY > 60);

    /* =================================
           Glass Effect After About Section
        ================================= */

    if (aboutSection) {
      const aboutBottom = aboutSection.getBoundingClientRect().bottom;

      siteHeader.classList.toggle("glass-active", aboutBottom <= 0);
    } else {
      siteHeader.classList.remove("glass-active");
    }

    /* =================================
           Hide / Show Navbar
        ================================= */

    
/* Navbar visibility based on scroll direction */

if (currentScrollY < 80 || menuOpen) {
    // Always show navbar at the top or when menu is open
    siteHeader.classList.remove("nav-hidden");

} else if (currentScrollY > lastScrollY + 5) {
    // Scrolling DOWN: hide navbar
    siteHeader.classList.add("nav-hidden");
} else if (currentScrollY < lastScrollY - 5) {
    // Scrolling UP: show navbar
    siteHeader.classList.remove("nav-hidden");
}


    lastScrollY = currentScrollY;
    ticking = false;
  }

  /* =====================================
       Scroll Event
    ===================================== */

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    },
    { passive: true },
  );

  window.addEventListener("resize", () => {
    window.requestAnimationFrame(updateNavbar);
  });

  /* =====================================
       Mobile Menu Toggle
    ===================================== */

  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("active");

    menuToggle.setAttribute("aria-expanded", String(isOpen));

    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation",
    );

    siteHeader.classList.remove("nav-hidden");
  });

  /* =====================================
       Close Mobile Menu on Link Click
    ===================================== */

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");

      menuToggle.setAttribute("aria-expanded", "false");

      menuToggle.setAttribute("aria-label", "Open navigation");
    });
  });

  /* Initial Navbar State */

  updateNavbar();
}

/* =====================================
   H Design Studio - Scroll Hero
===================================== */

(() => {
  const heroSection = document.querySelector(".hero-section");
  const canvas = document.getElementById("heroCanvas");
  const heroContent = heroSection.querySelector(".hero-content");

  if (!heroSection || !canvas) return;

  const context = canvas.getContext("2d", {
    alpha: false,
  });

  if (!context) return;

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  const frameCount = 40;
  const frames = new Array(frameCount);

  let currentFrame = -1;
  let targetFrame = 0;
  let smoothFrame = 0;
  let ticking = false;
  let animationRunning = false;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // Change this path only if your folder has a different name.
  const framePath = (index) => {
    const number = String(index + 1).padStart(3, "0");

    return `hero-frames/ezgif-frame-${number}.jpg`;
  };

  // Resize canvas for the current screen.
  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(rect.width * pixelRatio);
    canvas.height = Math.round(rect.height * pixelRatio);

    currentFrame = -1;
    renderFrame(targetFrame);
  }

  // Draw an image with background-size: cover behaviour.
  function drawImageCover(image) {
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const imageRatio = image.width / image.height;
    const canvasRatio = canvasWidth / canvasHeight;

    let drawWidth;
    let drawHeight;
    let offsetX;
    let offsetY;

    if (imageRatio > canvasRatio) {
      drawHeight = canvasHeight;
      drawWidth = drawHeight * imageRatio;
    } else {
      drawWidth = canvasWidth;
      drawHeight = drawWidth / imageRatio;
    }

    offsetX = (canvasWidth - drawWidth) / 2;
    offsetY = (canvasHeight - drawHeight) / 2;

    context.clearRect(0, 0, canvasWidth, canvasHeight);

    context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
  }

  // Display the requested frame.
  function renderFrame(index) {
    const safeIndex = Math.max(0, Math.min(frameCount - 1, Math.round(index)));


    const image = frames[safeIndex];

    if (!image || !image.complete || !image.naturalWidth) {
      return;
    }

    if (currentFrame === safeIndex) return;

    drawImageCover(image);
    currentFrame = safeIndex;
  }

  /* =====================================
   Smooth Hero Frame Animation
===================================== */

  function startSmoothAnimation() {
    if (animationRunning) return;

    animationRunning = true;

    function animate() {
      const difference = targetFrame - smoothFrame;

      smoothFrame += difference * 0.18;

      if (Math.abs(targetFrame - smoothFrame) < 0.05) {
        smoothFrame = targetFrame;
      }

      renderFrame(Math.round(smoothFrame));

      if (Math.abs(targetFrame - smoothFrame) > 0.05) {
        requestAnimationFrame(animate);
      } else {
        animationRunning = false;
      }
    }

    requestAnimationFrame(animate);
  }

  // Calculate frame based on scroll position.
  function updateHero() {
    ticking = false;

    if (reducedMotion.matches) {
      renderFrame(0);
      return;
    }

    const rect = heroSection.getBoundingClientRect();

    const scrollDistance = heroSection.offsetHeight - window.innerHeight;

    if (scrollDistance <= 0) {
      renderFrame(0);
      return;
    }

    const progress = Math.max(0, Math.min(1, -rect.top / scrollDistance));

    
/* Hero text moves upward and fades on scroll */

if (heroContent) {
    const textProgress = Math.min(1, progress / 0.25);

    const easedProgress =
        textProgress * textProgress * (3 - 2 * textProgress);

    heroContent.style.opacity = String(1 - easedProgress);

    heroContent.style.translate =
        `0 ${-80 * easedProgress}px`;
}



    targetFrame = progress * (frameCount - 1);
    startSmoothAnimation();
  }

  function requestHeroUpdate() {
    if (ticking) return;

    ticking = true;

    window.requestAnimationFrame(updateHero);
  }

  // Load all frames.
  function loadFrames() {
    for (let index = 0; index < frameCount; index++) {
      const image = new Image();

      frames[index] = image;

      image.onload = () => {
        if (index === Math.round(smoothFrame)) {
          currentFrame = -1;
          renderFrame(index);
        }
      };

      image.onerror = () => {
        console.warn("Unable to load:", framePath(index));
      };

      image.src = framePath(index);
    }
  }

  window.addEventListener("scroll", requestHeroUpdate, { passive: true });

  window.addEventListener("resize", () => {
    resizeCanvas();
    requestHeroUpdate();
  });

  reducedMotion.addEventListener?.("change", requestHeroUpdate);

  resizeCanvas();
  loadFrames();
  requestHeroUpdate();
})();



/* =========================================
   H DESIGN STUDIO - ABOUT SCROLL REVEAL
========================================= */

(() => {

    const studioSection =
        document.querySelector(".studio-section");

    if (!studioSection) return;

    const studioObserver = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    studioSection.classList.add(
                        "studio-visible"
                    );

                    studioObserver.unobserve(
                        studioSection
                    );
                }

            });

        },
        {
            threshold: 0.25
        }
    );

    studioObserver.observe(studioSection);

})();




/* =========================================
   Navbar Color: Hero / Studio
========================================= */

(() => {
    const header = document.getElementById("siteHeader");
    const studio = document.getElementById("studio");

    if (!header || !studio) return;

    function updateNavbarTheme() {
        const studioTop = studio.getBoundingClientRect().top;

        // Switch to dark when Studio reaches the navbar
        const switchPoint = header.getBoundingClientRect().bottom;

        header.classList.toggle(
            "nav-dark",
            studioTop <= switchPoint
        );
    }

    window.addEventListener("scroll", updateNavbarTheme, {
        passive: true
    });

    window.addEventListener("resize", updateNavbarTheme);

    updateNavbarTheme();
})();



/* =========================================================
   SERVICES SCROLL ANIMATION
========================================================= */

(() => {

    const showcase = document.querySelector(".services-showcase");

    if (!showcase) return;

    const cards = document.querySelectorAll(
        ".services-showcase .service-card"
    );

    if (!cards.length) return;


    function updateServices() {

        const rect = showcase.getBoundingClientRect();

        const viewportHeight = window.innerHeight;

        /*
            Calculate the scroll distance
            through the Services showcase.
        */
        const totalDistance =
            showcase.offsetHeight - viewportHeight;

        const scrolled = Math.max(
            0,
            Math.min(totalDistance, -rect.top)
        );

        const progress =
            totalDistance > 0
                ? scrolled / totalDistance
                : 0;

        /*
            Each service receives an equal
            portion of the scroll distance.
        */
        const serviceProgress = progress * cards.length;


        cards.forEach((card, index) => {

            const localProgress =
                serviceProgress - index;


            /* =====================================
               MOBILE — OVERLAPPING CARDS
            ===================================== */

            if (window.innerWidth <= 768) {

                if (localProgress <= 0) {

                    // Upcoming card stays outside on the right
                    card.style.transform = "translateX(120%)";
                    card.style.zIndex = index + 1;

                } else if (localProgress < 1) {

                    // New card slides over the previous card
                    const remaining = 1 - localProgress;
                    const translateX = remaining * 120;

                    card.style.transform =
                        `translateX(${translateX}%)`;

                    card.style.zIndex = index + 10;

                } else {

                    // Completed cards stay stacked underneath
                    card.style.transform = "translateX(0)";
                    card.style.zIndex = index + 1;

                }

                return;
            }


            /* =====================================
               DESKTOP — ORIGINAL ANIMATION
            ===================================== */

            if (localProgress <= 0) {

                card.style.transform =
                    "translateX(120%) translateY(-50%)";

                card.style.zIndex = index + 1;

                return;
            }

            if (localProgress < 1) {

                const remaining = 1 - localProgress;
                const translateX = remaining * 120;

                card.style.transform =
                    `translateX(${translateX}%) translateY(-50%)`;

                card.style.zIndex = index + 10;

                return;
            }

            // Completed cards remain in their stacked positions
            card.style.transform =
                "translateX(0) translateY(-50%)";

            card.style.zIndex = index + 1;

        });

    }


    /* =========================================
       PERFORMANCE — SCROLL & RESIZE
    ========================================= */

    let ticking = false;

    function requestUpdate() {

        if (ticking) return;

        ticking = true;

        window.requestAnimationFrame(() => {

            updateServices();

            ticking = false;

        });

    }


    window.addEventListener(
        "scroll",
        requestUpdate,
        { passive: true }
    );

    window.addEventListener(
        "resize",
        requestUpdate
    );

    // Initial positioning
    updateServices();

})();


/* =========================================================
   PROJECTS PARALLAX + MOUSE MOVEMENT
   Keep your existing Projects JavaScript below this line.
========================================================= */


/* =========================================================
   PROJECTS PARALLAX + MOUSE MOVEMENT
========================================================= */

(() => {

    const projects =
        document.querySelectorAll(
            ".projects-section .project"
        );

    if (!projects.length) return;


    let ticking = false;


    /* =====================================================
       SCROLL PARALLAX
    ===================================================== */

    function updateProjectParallax() {

        if (window.innerWidth <= 768) {

            projects.forEach((project) => {

                project.style.transform =
                    "translate3d(0, 0, 0)";

            });

            ticking = false;

            return;
        }


        projects.forEach((project, index) => {

            const rect =
                project.getBoundingClientRect();


            const viewportCenter =
                window.innerHeight / 2;


            const projectCenter =
                rect.top + rect.height / 2;


            const distance =
                projectCenter - viewportCenter;


            /*
             * Each image gets a slightly
             * different parallax speed.
             */

            const speeds = [
                0.025,
                0.040,
                0.020,
                0.035,
                0.028,
                0.045,
                0.022,
                0.038,
                0.026
            ];


            const movement =
                distance * speeds[index % speeds.length];


            project.style.transform =
                `translate3d(0, ${movement}px, 0)`;

        });


        ticking = false;
    }


    function requestParallaxUpdate() {

        if (ticking) return;

        ticking = true;

        window.requestAnimationFrame(
            updateProjectParallax
        );

    }


    window.addEventListener(
        "scroll",
        requestParallaxUpdate,
        { passive: true }
    );


    window.addEventListener(
        "resize",
        requestParallaxUpdate
    );


    updateProjectParallax();


    /* =====================================================
       MOUSE FOLLOW
    ===================================================== */

    projects.forEach((project) => {

        const image =
            project.querySelector(".project-image");

        const img =
            project.querySelector("img");


        if (!image || !img) return;


        image.addEventListener(
            "mousemove",
            (event) => {

                if (window.innerWidth <= 768) return;


                const rect =
                    image.getBoundingClientRect();


                const x =
                    event.clientX - rect.left;


                const y =
                    event.clientY - rect.top;


                const xPercent =
                    (x / rect.width) - 0.5;


                const yPercent =
                    (y / rect.height) - 0.5;


                const moveX =
                    xPercent * 10;


                const moveY =
                    yPercent * 10;


                img.style.transform =
                    `
                    translate3d(
                        ${moveX}px,
                        ${moveY}px,
                        0
                    )
                    scale(1.07)
                    `;

            }
        );


        image.addEventListener(
            "mouseleave",
            () => {

                img.style.transform =
                    `
                    translate3d(0, 0, 0)
                    scale(1.03)
                    `;

            }
        );

    });

})();




/* =========================================================
   SECTORS WE SERVE
   Desktop: existing right-side image + hover
   Mobile: expandable rows with images underneath
========================================================= */

(() => {

    const root = document.getElementById("sectors");

    if (!root) return;

    const wrap = root.querySelector(".sectors-wrap");
    const list = root.querySelector(".sectors-list");
    const panel = root.querySelector(".sectors-panel");

    if (!wrap || !list || !panel) return;

    const buttons = list.querySelectorAll("button");
    const images = panel.querySelectorAll(".sector-image");

    const mobileQuery = window.matchMedia("(max-width: 820px)");
    const hoverQuery = window.matchMedia("(hover: hover)");

    const originalPanelParent = panel.parentElement;
    const originalPanelNextSibling = panel.nextSibling;

    let current = 0;
    let mobileOpenIndex = 0;


    /* =====================================
       UPDATE SELECTED SECTOR
    ===================================== */

    function updateSector(index) {

        current = index;

        buttons.forEach((button, i) => {
            button.setAttribute(
                "aria-pressed",
                String(i === index)
            );
        });

        images.forEach((image, i) => {
            image.classList.toggle("on", i === index);
        });

    }


    /* =====================================
       RESTORE DESKTOP PANEL POSITION
    ===================================== */

    function restorePanel() {

        if (originalPanelNextSibling &&
            originalPanelNextSibling.parentElement === originalPanelParent) {

            originalPanelParent.insertBefore(
                panel,
                originalPanelNextSibling
            );

        } else {

            originalPanelParent.appendChild(panel);

        }

    }


    /* =====================================
       MOBILE ACCORDION
    ===================================== */

    function closeMobilePanel() {

        restorePanel();
        panel.classList.remove("mobile-panel-open");
        mobileOpenIndex = -1;

        buttons.forEach(button => {
            button.setAttribute("aria-pressed", "false");
        });

    }


    function openMobilePanel(index) {

        const button = buttons[index];
        const item = button.closest("li");

        if (!item) return;

        // Put the shared image panel directly after this sector's button
        item.appendChild(panel);

        panel.classList.add("mobile-panel-open");
        mobileOpenIndex = index;

        updateSector(index);

    }


    /* =====================================
       CLICK BEHAVIOR
    ===================================== */

    buttons.forEach((button, index) => {

        button.addEventListener("click", () => {

            if (mobileQuery.matches) {

                // Tapping the open row closes it
                if (mobileOpenIndex === index) {
                    closeMobilePanel();
                    return;
                }

                // Opening another row replaces the previous one
                openMobilePanel(index);
                return;

            }

            // Desktop click behavior remains unchanged
            updateSector(index);

        });


        /* Desktop hover behavior */
        button.addEventListener("mouseenter", () => {

            if (
                !mobileQuery.matches &&
                hoverQuery.matches
            ) {
                updateSector(index);
            }

        });


        /* Desktop keyboard focus behavior */
        button.addEventListener("focus", () => {

            if (!mobileQuery.matches) {
                updateSector(index);
            }

        });

    });


    /* =====================================
       SWITCH BETWEEN MOBILE & DESKTOP
    ===================================== */

    function handleLayoutChange() {

        if (mobileQuery.matches) {

            // Start with the first sector open on mobile
            openMobilePanel(0);

        } else {

            restorePanel();
            panel.classList.remove("mobile-panel-open");

            mobileOpenIndex = -1;
            updateSector(Math.max(0, current));

        }

    }


    mobileQuery.addEventListener("change", handleLayoutChange);


    /* =====================================
       INITIAL STATE
    ===================================== */

    if (mobileQuery.matches) {
        openMobilePanel(0);
    } else {
        updateSector(0);
    }

})();


/* =========================================================
   CTA DRAW ANIMATION + FOOTER YEAR
========================================================= */

(() => {

    const cta =
        document.getElementById("hds-cta");

    const year =
        document.getElementById("hds-year");


    /* =====================================================
       FOOTER YEAR
    ===================================================== */

    if (year) {

        year.textContent =
            new Date().getFullYear();

    }


    /* =====================================================
       CTA ANIMATION
    ===================================================== */

    if (!cta) return;


    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    if (
        reducedMotion ||
        !("IntersectionObserver" in window)
    ) {

        return;

    }


    cta.classList.add("js");


    const observer =
        new IntersectionObserver(
            (entries, observerInstance) => {

                entries.forEach(
                    (entry) => {

                        if (
                            entry.isIntersecting
                        ) {

                            cta.classList.add("in");

                            observerInstance.disconnect();

                        }

                    }
                );

            },
            {
                threshold: 0.3
            }
        );


    observer.observe(cta);

})();