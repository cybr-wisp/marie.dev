"use client";

import { useEffect, useState } from "react";

const LINE_1 = "i build software for";
const LINE_2 = "complex problems";

const CHAR_DELAY = 38;
const LINE_PAUSE = 140;

export function TypingHero() {
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [phase, setPhase] = useState<
    "line1" | "pause" | "line2" | "done"
  >("line1");

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === "line1") {
      if (line1.length < LINE_1.length) {
        timeout = setTimeout(() => {
          setLine1(
            LINE_1.slice(0, line1.length + 1),
          );
        }, CHAR_DELAY);
      } else {
        timeout = setTimeout(() => {
          setPhase("pause");
        }, LINE_PAUSE);
      }
    }

    if (phase === "pause") {
      timeout = setTimeout(() => {
        setPhase("line2");
      }, 80);
    }

    if (phase === "line2") {
      if (line2.length < LINE_2.length) {
        timeout = setTimeout(() => {
          setLine2(
            LINE_2.slice(0, line2.length + 1),
          );
        }, CHAR_DELAY);
      } else {
        timeout = setTimeout(() => {
          setPhase("done");
        }, 80);
      }
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [line1, line2, phase]);

  return (
    <span
      className="hero-typing"
      aria-label={`${LINE_1} ${LINE_2}`}
    >
      <span className="hero-typing__line">
        <span aria-hidden="true">
          {line1}
        </span>

        {phase === "line1" && (
          <span
            className="hero-typing__cursor"
            aria-hidden="true"
          />
        )}
      </span>

      <span className="hero-typing__line">
        <span aria-hidden="true">
          {line2}
        </span>

        {(phase === "pause" ||
          phase === "line2" ||
          phase === "done") && (
          <span
            className={`hero-typing__cursor${
              phase === "done"
                ? " hero-typing__cursor--done"
                : ""
            }`}
            aria-hidden="true"
          />
        )}
      </span>
    </span>
  );
}

