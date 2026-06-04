import { useCallback, useEffect, useRef, useState } from "react";

type PopoverPosition = {
  left: number;
  top: number;
  maxHeight: number;
};

export const useSkillPopover = () => {
  const [openedTaskId, setOpenedTaskId] = useState<number | null>(null);
  const [popoverPosition, setPopoverPosition] = useState<PopoverPosition | null>(null);
  const skillTriggerRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const closePopover = useCallback(() => {
    setOpenedTaskId(null);
    setPopoverPosition(null);
  }, []);

  const syncPopoverPosition = useCallback((taskId: number) => {
    const trigger = skillTriggerRefs.current[taskId];
    if (!trigger) return false;

    const rect = trigger.getBoundingClientRect();
    const maxLeft = window.innerWidth - 158;

    setPopoverPosition({
      left: Math.max(8, Math.min(rect.left - 8, maxLeft)),
      top: rect.top - 8,
      maxHeight: Math.max(120, window.innerHeight - rect.top),
    });

    return true;
  }, []);

  const togglePopover = (taskId: number) => {
    if (openedTaskId === taskId) {
      closePopover();
      return;
    }

    if (!syncPopoverPosition(taskId)) return;
    setOpenedTaskId(taskId);
  };

  useEffect(() => {
    if (openedTaskId === null) return;

    let animationFrameId: number | null = null;

    const updatePopoverPosition = () => {
      animationFrameId = null;
      syncPopoverPosition(openedTaskId);
    };

    const requestPopoverPositionUpdate = () => {
      if (animationFrameId !== null) return;
      animationFrameId = window.requestAnimationFrame(updatePopoverPosition);
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (!(event.target instanceof Element)) return;
      if (event.target.closest("[data-skill-select-menu]")) return;

      closePopover();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("resize", requestPopoverPositionUpdate);
    window.addEventListener("scroll", requestPopoverPositionUpdate, true);

    return () => {
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }

      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("resize", requestPopoverPositionUpdate);
      window.removeEventListener("scroll", requestPopoverPositionUpdate, true);
    };
  }, [closePopover, openedTaskId, syncPopoverPosition]);

  return {
    openedTaskId,
    popoverPosition,
    skillTriggerRefs,
    closePopover,
    togglePopover,
  };
};
