"use client";

import { useEffect, useRef, useCallback } from "react";

export default function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });
  const raf = useRef<number>(0);
  const isHovering = useRef(false);
  const isPressed = useRef(false);

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const animate = useCallback(() => {
    pos.current.x = lerp(pos.current.x, target.current.x, 0.15);
    pos.current.y = lerp(pos.current.y, target.current.y, 0.15);

    const outer = outerRef.current;
    const inner = innerRef.current;
    if (outer && inner) {
      outer.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%) scale(${isPressed.current ? 0.75 : isHovering.current ? 1.5 : 1})`;
      inner.style.transform = `translate(${target.current.x}px, ${target.current.y}px) translate(-50%, -50%) scale(${isPressed.current ? 1.4 : 1})`;
    }

    raf.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    // Hide on touch devices
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };

    const onDown = (e: MouseEvent) => {
      isPressed.current = true;
      outerRef.current?.classList.add("cursor-pressed");
      innerRef.current?.classList.add("cursor-inner-pressed");

      // Create ripple
      const ripple = document.createElement("div");
      ripple.className = "cursor-ripple";
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      document.body.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    };

    const onUp = () => {
      isPressed.current = false;
      outerRef.current?.classList.remove("cursor-pressed");
      innerRef.current?.classList.remove("cursor-inner-pressed");
    };

    const onEnterInteractive = () => {
      isHovering.current = true;
      outerRef.current?.classList.add("cursor-hover");
    };

    const onLeaveInteractive = () => {
      isHovering.current = false;
      outerRef.current?.classList.remove("cursor-hover");
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);

    // Observe interactive elements
    const interactives = document.querySelectorAll(
      'a, button, [role="button"], input, select, textarea, label',
    );
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", onEnterInteractive);
      el.addEventListener("mouseleave", onLeaveInteractive);
    });

    raf.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", onEnterInteractive);
        el.removeEventListener("mouseleave", onLeaveInteractive);
      });
      cancelAnimationFrame(raf.current);
    };
  }, [animate]);

  // Re-observe interactive elements on DOM changes
  useEffect(() => {
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const observer = new MutationObserver(() => {
      const interactives = document.querySelectorAll(
        'a, button, [role="button"], input, select, textarea, label',
      );
      interactives.forEach((el) => {
        el.addEventListener("mouseenter", () => {
          isHovering.current = true;
          outerRef.current?.classList.add("cursor-hover");
        });
        el.addEventListener("mouseleave", () => {
          isHovering.current = false;
          outerRef.current?.classList.remove("cursor-hover");
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Outer ring — follows mouse with lag */}
      <div ref={outerRef} className="custom-cursor-outer" aria-hidden="true" />
      {/* Inner dot — instant position */}
      <div ref={innerRef} className="custom-cursor-inner" aria-hidden="true" />
    </>
  );
}
