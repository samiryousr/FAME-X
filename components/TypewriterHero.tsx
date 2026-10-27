"use client";

import { useEffect, useState } from "react";

type TypewriterHeroProps = {
  text: string;
  speed?: number;
  className?: string;
};

export default function TypewriterHero({
  text,
  speed = 80,
  className,
}: TypewriterHeroProps) {
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    let characterIndex = 0;
    let timer: ReturnType<typeof setTimeout>;

    setTypedText("");

    const typeNextCharacter = () => {
      characterIndex += 1;
      setTypedText(text.slice(0, characterIndex));

      if (characterIndex < text.length) {
        timer = setTimeout(typeNextCharacter, Math.max(0, speed));
      }
    };

    if (text.length > 0) {
      timer = setTimeout(typeNextCharacter, Math.max(0, speed));
    }

    return () => clearTimeout(timer);
  }, [text, speed]);

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {typedText}
        <span className="relative -top-1 ml-1 inline-block origin-center scale-x-50 animate-pulse text-[#a6f45d]">▋</span>
      </span>
    </span>
  );
}
