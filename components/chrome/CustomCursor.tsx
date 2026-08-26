
"use client";

import { useEffect, useRef } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dotRef.current || !ringRef.current) {
      return;
    }

    /*
     * Assign after the null check.
     * TypeScript now knows these are real HTMLDivElements
     * for the rest of this effect.
     */
    const dot = dotRef.current;
    const ring = ringRef.current;

    let mouseX = -100;
    let mouseY = -100;

    let ringX = -100;
    let ringY = -100;

    let frameId = 0;

    function movePointer(event: PointerEvent) {
      mouseX = event.clientX;
      mouseY = event.clientY;

      /*
       * The center dot tracks the pointer directly.
       */
      dot.style.transform =
        `translate3d(${mouseX}px, ${mouseY}px, 0)`;

      const target =
        event.target instanceof Element
          ? event.target
          : null;

      const interactive = Boolean(
        target?.closest("a, button"),
      );

      ring.classList.toggle(
        "cursor-ring--active",
        interactive,
      );
    }

    function animateRing() {
      /*
       * The ring deliberately trails the pointer.
       *
       * Lower value = softer / floatier.
       * Higher value = tighter / faster.
       */
      const easing = 0.20;

      ringX += (mouseX - ringX) * easing;
      ringY += (mouseY - ringY) * easing;

      ring.style.transform =
        `translate3d(${ringX}px, ${ringY}px, 0)`;

      frameId =
        window.requestAnimationFrame(animateRing);
    }

    function hideCursor() {
      dot.classList.add("cursor-hidden");
      ring.classList.add("cursor-hidden");
    }

    function showCursor() {
      dot.classList.remove("cursor-hidden");
      ring.classList.remove("cursor-hidden");
    }

    window.addEventListener(
      "pointermove",
      movePointer,
    );

    document.documentElement.addEventListener(
      "mouseleave",
      hideCursor,
    );

    document.documentElement.addEventListener(
      "mouseenter",
      showCursor,
    );

    frameId =
      window.requestAnimationFrame(animateRing);

    return () => {
      window.removeEventListener(
        "pointermove",
        movePointer,
      );

      document.documentElement.removeEventListener(
        "mouseleave",
        hideCursor,
      );

      document.documentElement.removeEventListener(
        "mouseenter",
        showCursor,
      );

      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        className="cursor-ring"
        aria-hidden="true"
      />

      <div
        ref={dotRef}
        className="cursor-dot"
        aria-hidden="true"
      />
    </>
  );
}