"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// This module is lazy-loaded only on the homepage, on devices allowing motion.
export default function ScrollScenes() {
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
      () => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: ".hero",
              start: "top top",
              end: "bottom top",
              scrub: 1,
            },
          })
          .to(".orbital-art", { y: 90, rotation: 12, ease: "none" }, 0)
          .to(".hero-coordinate", { y: -35, ease: "none" }, 0);
        gsap.fromTo(
          ".work-progress",
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: "#work",
              start: "top 65%",
              end: "bottom 45%",
              scrub: true,
            },
          },
        );
        const projectVisuals = gsap.utils.toArray<HTMLElement>(
          "#work .project-visual",
        );
        if (projectVisuals.length > 0) {
          gsap.fromTo(
            projectVisuals,
            { y: 24 },
            {
              y: 0,
              stagger: 0.12,
              ease: "none",
              scrollTrigger: {
                trigger: "#work",
                start: "top 75%",
                end: "center 60%",
                scrub: 1,
              },
            },
          );
        }
      },
    );
    return () => media.revert();
  }, []);
  return null;
}
