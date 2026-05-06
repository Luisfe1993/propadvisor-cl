"use client";

import { useScrollspy, ScrollspyNav, ReadingProgress, GuiaSections } from "./GuiaSections";

export function GuiaSectionsWrapper() {
  const active = useScrollspy();

  return (
    <>
      <ReadingProgress />
      <div className="flex gap-10 mt-8">
        <ScrollspyNav active={active} />
        <div className="flex-1 min-w-0">
          <GuiaSections />
        </div>
      </div>
    </>
  );
}
