"use client";

import { useEffect, useState } from "react";

const LINE_1 = "hi, i'm marie.";
const LINE_2 = "welcome to my portfolio";

const CHAR_DELAY = 55;
const LINE_PAUSE = 400;

export function TypingHero() {
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [phase, setPhase] = useState<"line1" | "pause" | "line2" | "done">("line1");

  useEffect(() => {
    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === "line1") {
      if (line1.length < LINE_1.length) {
        timeout = setTimeout(() => {
          if (!cancelled) setLine1(LINE_1.slice(0, line1.length + 1));
        }, CHAR_DELAY);
      } else {
        timeout = setTimeout(() => {
          if (!cancelled) setPhase("pause");
        }, LINE_PAUSE);
      }
    } else if (phase === "pause") {
      timeout = setTimeout(() => {
        if (!cancelled) setPhase("line2");
      }, 100);
    } else if (phase === "line2") {
      if (line2.length < LINE_2.length) {
        timeout = setTimeout(() => {
          if (!cancelled) setLine2(LINE_2.slice(0, line2.length + 1));
        }, CHAR_DELAY);
      } else {
        timeout = setTimeout(() => {
          if (!cancelled) setPhase("done");
        }, 0);
      }
    }

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [line1, line2, phase]);

  const showCursorOnLine1 = phase === "line1";
  const showCursorOnLine2 = phase === "line2" || phase === "pause" || phase === "done";

  return (
    <div aria-label="hi, i'm marie. welcome to my portfolio.">
      <strong>
        {line1}
        {showCursorOnLine1 && (
          <span
            className="typing-cursor"
            aria-hidden="true"
          />
        )}
      </strong>
      <span>
        {line2}
        {showCursorOnLine2 && (
          <span
            className={`typing-cursor${phase === "done" ? " typing-cursor--blink" : ""}`}
            aria-hidden="true"
          />
        )}
      </span>
    </div>
  );
}