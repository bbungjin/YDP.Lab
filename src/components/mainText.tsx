import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function FancyText() {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current) return;
    const ctx = gsap.context(() => {
      const container = textRef.current as HTMLDivElement;
      gsap.set(container, { perspective: 600 });

      const letters = container.querySelectorAll("span");

      letters.forEach((letter, i) => {
        const ch = (letter.textContent || "").trim();

        switch (ch) {
          case "Y": {
            gsap.fromTo(
              letter,
              { opacity: 0, y: 80, rotateX: -180, transformOrigin: "50% 100%" },
              { opacity: 1, y: 0, rotateX: 0, duration: 1, delay: 0.1, ease: "back.out(1.7)" }
            );
            break;
          }
          case "D": {
            gsap.fromTo(
              letter,
              { opacity: 0, y: -80, rotateY: 180, transformOrigin: "0% 50%" },
              { opacity: 1, y: 0, rotateY: 0, duration: 1, delay: 0.2, ease: "back.out(1.5)" }
            );
            break;
          }
          case "P": {
            const tl = gsap.timeline({ delay: 0.3 });
            tl.fromTo(letter, { y: -40, opacity: 0 }, { y: 0, duration: 0.001, ease: "expo.in" })
              .to(letter, { y: -20, duration: 0.22, opacity: 1, ease: "power1.in" })
              .to(letter, { y: 0, duration: 0.32, opacity: 1, ease: "bounce.out" });
            break;
          }
          case ".": {
            letter.textContent = ".";
            const tl = gsap.timeline({ delay: 0.4 });
            tl.fromTo(
              letter,
              { scaleY: 1.6, opacity: 0, transformOrigin: "50% 100%" },
              { scaleY: 1, opacity: 0, duration: 0.3, ease: "back.out(2)" }
            )
              .to(letter, { y: -6, duration: 0.15, opacity: 1, ease: "power1.out" })
              .add(() => { letter.textContent = "."; }) // ← 여기서 즉시 실행됨
              .to(letter, { y: 0, duration: 0.2, ease: "bounce.out" });
            break;
          }
          case "L": {
            gsap.fromTo(
              letter,
              { x: -40, skewX: -20, opacity: 0 },
              { x: 0, skewX: 0, opacity: 1, duration: 0.8, delay: 0.5, ease: "power3.out" }
            );
            break;
          }
          case "a": {
            const tl = gsap.timeline({ delay: 0.6 });
            tl.fromTo(letter, { scale: 0.6, opacity: 0 }, { scale: 1.08, opacity: 1, duration: 0.42, ease: "back.out(2)" })
              .to(letter, { scale: 1, duration: 0.18, ease: "power2.out" });
            break;
          }
          case "b": {
            gsap.fromTo(
              letter,
              { rotate: -45, y: 30, opacity: 0 },
              { rotate: 0, y: 0, opacity: 1, duration: 0.9, delay: 0.7, ease: "elastic.out(1, 0.5)" }
            );
            break;
          }
          default: {
            gsap.fromTo(
              letter,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.6, delay: i * 0.04, ease: "power2.out" }
            );
          }
        }
      });
    }, textRef);

    return () => ctx.revert();
  }, []);

  const text = "YDP.Lab";

  return (
    <div
      ref={textRef}
      className="text-4xl font-bold flex gap-1"
    >
      {text.split("").map((char, i) => (
        <span key={i} className="inline-block">
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </div>
  );
}
