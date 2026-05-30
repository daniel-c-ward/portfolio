function scrollBehavior(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}

function getScrollStep(track: HTMLElement): number {
  const slide = track.querySelector<HTMLElement>("[data-carousel-slide]");
  if (!slide) return track.clientWidth;
  const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || "0");
  return slide.offsetWidth + gap;
}

function bindDragScroll(track: HTMLElement) {
  let isDragging = false;
  let didDrag = false;
  let startX = 0;
  let startScrollLeft = 0;

  track.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "touch" || event.button !== 0) return;

    const target = event.target as HTMLElement;
    if (target.closest("a, button")) return;

    isDragging = true;
    didDrag = false;
    startX = event.clientX;
    startScrollLeft = track.scrollLeft;
    track.classList.add("is-dragging");
    track.setPointerCapture(event.pointerId);
  });

  track.addEventListener("pointermove", (event) => {
    if (!isDragging) return;

    const delta = event.clientX - startX;
    if (Math.abs(delta) > 4) didDrag = true;
    track.scrollLeft = startScrollLeft - delta;
  });

  const stopDragging = (event: PointerEvent) => {
    if (!isDragging) return;

    isDragging = false;
    track.classList.remove("is-dragging");
    if (track.hasPointerCapture(event.pointerId)) {
      track.releasePointerCapture(event.pointerId);
    }
  };

  track.addEventListener("pointerup", stopDragging);
  track.addEventListener("pointercancel", stopDragging);
  track.addEventListener("lostpointercapture", () => {
    isDragging = false;
    track.classList.remove("is-dragging");
  });

  track.addEventListener(
    "click",
    (event) => {
      if (!didDrag) return;
      event.preventDefault();
      event.stopPropagation();
      didDrag = false;
    },
    true,
  );
}

function bindCarousel(carousel: HTMLElement) {
  const track = carousel.querySelector<HTMLElement>("[data-carousel-track]");
  if (!track || carousel.dataset.carouselReady === "true") return;

  carousel.dataset.carouselReady = "true";

  const scrollByStep = (direction: -1 | 1) => {
    track.scrollBy({ left: direction * getScrollStep(track), behavior: scrollBehavior() });
  };

  track.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollByStep(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollByStep(1);
    }
  });

  bindDragScroll(track);
}

function observeCarousel(carousel: HTMLElement) {
  if (carousel.dataset.carouselObserved === "true" || carousel.dataset.carouselReady === "true") {
    return;
  }

  carousel.dataset.carouselObserved = "true";

  if (!("IntersectionObserver" in window)) {
    bindCarousel(carousel);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        bindCarousel(carousel);
        observer.disconnect();
        break;
      }
    },
    { rootMargin: "240px 0px" },
  );

  observer.observe(carousel);
}

export function initCarousels(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>("[data-carousel]").forEach(observeCarousel);
}

if (typeof document !== "undefined") {
  initCarousels();
  document.addEventListener("astro:page-load", () => initCarousels());
}
