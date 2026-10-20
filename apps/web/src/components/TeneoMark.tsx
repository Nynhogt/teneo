"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type TeneoMarkProps = {
  className?: string;
  idle?: boolean;
};

export default function TeneoMark({ className, idle = false }: TeneoMarkProps) {
  const root = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

      timeline
        .from(".mark-float", { scale: 0.94, opacity: 0, duration: 0.7 }, 0)
        .from(".mark-plane", { x: 170, opacity: 0, duration: 0.8 }, 0.05)
        .from(".mark-tri", { x: -220, opacity: 0, duration: 0.75 }, 0.1)
        .from(
          ".mark-stem",
          {
            scaleY: 0,
            opacity: 0,
            svgOrigin: "854 886",
            duration: 0.7,
          },
          0.15
        )
        .from(".mark-foot", { x: -170, y: 50, opacity: 0, duration: 0.7 }, 0.34)
        .from(
          ".mark-block",
          {
            y: -190,
            opacity: 0,
            rotation: -7,
            svgOrigin: "1008 540",
            duration: 0.85,
          },
          0.3
        );

      if (idle) {
        gsap.to(".mark-float", {
          y: -8,
          duration: 2.8,
          delay: 1.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    },
    { scope: root }
  );

  return (
    <svg
      ref={root}
      className={className ? `teneo-mark ${className}` : "teneo-mark"}
      viewBox="509 325 564 561"
      aria-hidden="true"
      focusable="false"
    >
      <g className="mark-float">
        <polygon
          className="mark-secondary mark-plane"
          points="790,443 943,443 1073,540 918,540"
        />
        <rect
          className="mark-primary mark-stem"
          x="790"
          y="443"
          width="128"
          height="443"
        />
        <polygon
          className="mark-secondary mark-foot"
          points="660,800 790,800 918,886 790,886"
        />
        <polygon
          className="mark-primary mark-block"
          points="943,325 1073,422 1073,540 943,443"
        />
        <polygon
          className="mark-secondary mark-tri"
          points="509,443 661,443 661,545"
        />
      </g>
    </svg>
  );
}
