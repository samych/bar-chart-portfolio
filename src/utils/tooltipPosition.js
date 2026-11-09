/** Position a floating tooltip inside its chart container. */
export function getTooltipPosition(event) {
  const target = event.currentTarget;
  const container = target.ownerSVGElement?.parentElement;
  if (!container) return { x: 8, y: 24 };

  const bounds = container.getBoundingClientRect();
  const targetBounds = target.getBoundingClientRect();
  const keyboard = event.type === "focus";
  const pointerX = keyboard
    ? targetBounds.right - bounds.left
    : event.clientX - bounds.left;
  const pointerY = keyboard
    ? targetBounds.top + targetBounds.height / 2 - bounds.top
    : event.clientY - bounds.top;

  const margin = 8;
  const tooltipWidth = Math.min(240, Math.max(0, bounds.width - 2 * margin));
  const tooltipHalfHeight = 32;
  return {
    x: Math.max(margin, Math.min(pointerX + 12, bounds.width - tooltipWidth - margin)),
    y: Math.max(tooltipHalfHeight + margin, Math.min(pointerY, bounds.height - tooltipHalfHeight - margin)),
  };
}
