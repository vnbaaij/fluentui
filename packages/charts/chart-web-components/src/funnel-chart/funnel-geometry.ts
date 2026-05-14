import type { FunnelDataPoint } from './funnel-chart.options.js';

export interface SimpleFunnelDataPoint extends FunnelDataPoint {
  value: number;
}

export function isSimpleFunnelDataPoint(dataPoint: FunnelDataPoint): dataPoint is SimpleFunnelDataPoint {
  return Number.isFinite(dataPoint.value);
}

export interface FunnelSegmentGeometry {
  pathD: string;
  textX: number;
  textY: number;
  availableWidth: number;
}

interface SubValue {
  category: string;
  value: number;
  color: string;
}

interface Stage {
  subValues: SubValue[];
}

export function getVerticalFunnelSegmentGeometry({
  d,
  i,
  data,
  maxValue,
  funnelWidth,
  funnelHeight,
  isRTL,
}: {
  d: SimpleFunnelDataPoint;
  i: number;
  data: SimpleFunnelDataPoint[];
  maxValue: number;
  funnelWidth: number;
  funnelHeight: number;
  isRTL: boolean;
}): FunnelSegmentGeometry {
  const segmentHeight = funnelHeight / data.length;
  const widthScale = (value: number) => (value / maxValue) * funnelWidth;
  const topWidth = widthScale(d.value);
  const bottomWidth = i < data.length - 1 ? widthScale(data[i + 1].value) : 0;
  const xOffset = (funnelWidth - topWidth) / 2;
  const nextXOffset = (funnelWidth - bottomWidth) / 2;
  const xStart = isRTL ? funnelWidth - xOffset : xOffset;
  const xEnd = isRTL ? funnelWidth - nextXOffset : nextXOffset;

  const isLastSegment = i === data.length - 1;
  const textY = isLastSegment ? i * segmentHeight + segmentHeight * 0.33 : i * segmentHeight + segmentHeight / 2;
  const textX = funnelWidth / 2;

  let availableWidth: number;
  if (isLastSegment) {
    const yFromTop = textY - i * segmentHeight;
    const widthAtY = topWidth * (1 - yFromTop / segmentHeight);
    availableWidth = Math.max(widthAtY * 0.8, 0);
  } else {
    availableWidth = Math.min(topWidth, bottomWidth) * 0.9;
  }

  const pathD = `M${xStart},${i * segmentHeight}
    L${funnelWidth - xStart},${i * segmentHeight}
    L${funnelWidth - xEnd},${(i + 1) * segmentHeight}
    L${xEnd},${(i + 1) * segmentHeight}
    Z`;
  return { pathD, textX, textY, availableWidth };
}

export function getHorizontalFunnelSegmentGeometry({
  d,
  i,
  data,
  maxValue,
  funnelWidth,
  funnelHeight,
  isRTL,
}: {
  d: SimpleFunnelDataPoint;
  i: number;
  data: SimpleFunnelDataPoint[];
  maxValue: number;
  funnelWidth: number;
  funnelHeight: number;
  isRTL: boolean;
}): FunnelSegmentGeometry {
  const segmentWidth = funnelWidth / data.length;
  const heightScale = (value: number) => (value / maxValue) * funnelHeight;
  const leftHeight = heightScale(d.value);
  const rightHeight = i < data.length - 1 ? heightScale(data[i + 1].value) : 0;
  const yOffset = (funnelHeight - leftHeight) / 2;
  const nextYOffset = (funnelHeight - rightHeight) / 2;
  const x0 = isRTL ? funnelWidth - (i + 1) * segmentWidth : i * segmentWidth;
  const x1 = isRTL ? funnelWidth - i * segmentWidth : (i + 1) * segmentWidth;

  const isLastSegment = i === data.length - 1;
  let textX: number;
  let textY: number;
  let availableWidth = segmentWidth * 0.8;

  if (isLastSegment) {
    textX = x0 + (x1 - x0) * 0.25;
    textY = funnelHeight / 2;
    const segmentArea = (leftHeight * segmentWidth) / 2;
    if (leftHeight < 40 || segmentArea < 800) {
      availableWidth = 0;
    } else {
      availableWidth = (x1 - x0) * 0.75 * 0.6;
    }
  } else {
    textX = (x0 + x1) / 2;
    textY = funnelHeight / 2;
    const minHeight = Math.min(leftHeight, rightHeight);
    availableWidth = minHeight > 20 ? segmentWidth * 0.8 : 0;
  }

  const pathD = `M${x0},${yOffset}
    L${x1},${nextYOffset}
    L${x1},${funnelHeight - nextYOffset}
    L${x0},${funnelHeight - yOffset}
    Z`;
  return { pathD, textX, textY, availableWidth };
}

export function getStackedVerticalFunnelSegmentGeometry({
  i,
  k,
  stages,
  totals,
  maxTotal,
  funnelWidth,
  funnelHeight,
}: {
  i: number;
  k: number;
  stages: Stage[];
  totals: number[];
  maxTotal: number;
  funnelWidth: number;
  funnelHeight: number;
}): FunnelSegmentGeometry {
  const segmentHeight = funnelHeight / stages.length;
  const cur = stages[i];
  const next = stages[i + 1] || { subValues: [] };
  const curTotal = totals[i] || 1;
  const nextTotal = totals[i + 1] || 0;

  let cumTop = 0;
  let cumBot = 0;
  for (let idx = 0; idx < k; idx++) {
    const v = cur.subValues[idx];
    const vNext = next.subValues?.find((x: SubValue) => x.category === v.category);
    cumTop += (v.value / curTotal) * (curTotal / maxTotal) * funnelWidth;
    cumBot += (vNext ? vNext.value / nextTotal : 0) * (nextTotal / maxTotal) * funnelWidth;
  }
  const v = cur.subValues[k];
  const vNext = next.subValues?.find((x: SubValue) => x.category === v.category);
  const topW = (v.value / curTotal) * (curTotal / maxTotal) * funnelWidth;
  const botW = (vNext ? vNext.value / nextTotal : 0) * (nextTotal / maxTotal) * funnelWidth;
  const topStart = (funnelWidth - (curTotal / maxTotal) * funnelWidth) / 2 + cumTop;
  const topEnd = topStart + topW;
  const botStart = (funnelWidth - (nextTotal / maxTotal) * funnelWidth) / 2 + cumBot;
  const botEnd = botStart + botW;
  const textX = (topStart + topEnd + botStart + botEnd) / 4;

  const isLastSegment = i === stages.length - 1;
  const textY = isLastSegment ? i * segmentHeight + segmentHeight * 0.33 : (i + 0.5) * segmentHeight;

  let availableWidth: number;
  if (isLastSegment) {
    const yFromTop = textY - i * segmentHeight;
    availableWidth = topW * (1 - yFromTop / segmentHeight);
  } else {
    availableWidth = Math.min(topW, botW);
  }

  const pathD = `M${topStart},${i * segmentHeight}
    L${topEnd},${i * segmentHeight}
    L${botEnd},${(i + 1) * segmentHeight}
    L${botStart},${(i + 1) * segmentHeight}
    Z`;
  return { pathD, textX, textY, availableWidth };
}

export function getStackedHorizontalFunnelSegmentGeometry({
  i,
  k,
  stages,
  totals,
  maxTotal,
  funnelWidth,
  funnelHeight,
}: {
  i: number;
  k: number;
  stages: Stage[];
  totals: number[];
  maxTotal: number;
  funnelWidth: number;
  funnelHeight: number;
}): FunnelSegmentGeometry {
  const segmentWidth = funnelWidth / stages.length;
  const cur = stages[i];
  const next = stages[i + 1] || { subValues: [] };
  const curTotal = totals[i] || 1;
  const nextTotal = totals[i + 1] || 0;

  let cumTop = 0;
  let cumBot = 0;
  for (let idx = 0; idx < k; idx++) {
    const v = cur.subValues[idx];
    const vNext = next.subValues?.find((x: SubValue) => x.category === v.category);
    cumTop += (v.value / curTotal) * (curTotal / maxTotal) * funnelHeight;
    cumBot += (vNext ? vNext.value / nextTotal : 0) * (nextTotal / maxTotal) * funnelHeight;
  }
  const v = cur.subValues[k];
  const vNext = next.subValues?.find((x: SubValue) => x.category === v.category);
  const topH = (v.value / curTotal) * (curTotal / maxTotal) * funnelHeight;
  const botH = (vNext ? vNext.value / nextTotal : 0) * (nextTotal / maxTotal) * funnelHeight;
  const leftStart = i * segmentWidth;
  const leftEnd = (i + 1) * segmentWidth;
  const topStart = (funnelHeight - (curTotal / maxTotal) * funnelHeight) / 2 + cumTop;
  const topEnd = topStart + topH;
  const botStart = (funnelHeight - (nextTotal / maxTotal) * funnelHeight) / 2 + cumBot;
  const botEnd = botStart + botH;

  const isLastSegment = i === stages.length - 1;
  let textX: number;
  let textY: number;
  let availableWidth: number;

  if (isLastSegment) {
    textX = leftStart + (leftEnd - leftStart) * 0.25;
    textY = (topStart + topEnd) / 2;
    const segmentArea = (topH * segmentWidth) / 2;
    availableWidth = topH < 24 || segmentArea < 600 ? 0 : (leftEnd - leftStart) * 0.5 * 0.8;
  } else {
    textX = (leftStart + leftEnd) / 2;
    textY = (topStart + topEnd + botStart + botEnd) / 4;
    const avgHeight = (topH + botH) / 2;
    availableWidth = avgHeight < 20 ? 0 : Math.abs(leftEnd - leftStart) * 0.9;
  }

  const pathD = `M${leftStart},${topStart}
    L${leftEnd},${botStart}
    L${leftEnd},${botEnd}
    L${leftStart},${topEnd}
    Z`;
  return { pathD, textX, textY, availableWidth };
}

/**
 * Computes whether segment value text should be shown and at what position.
 */
export function getSegmentTextProps({
  availableWidth,
  minTextWidth = 24,
  textX,
  textY,
  value,
}: {
  availableWidth: number;
  minTextWidth?: number;
  textX: number;
  textY: number;
  value: number;
}): {
  show: boolean;
  x: number;
  y: number;
  value: number;
} {
  return {
    show: availableWidth > minTextWidth && availableWidth > 0,
    x: textX,
    y: textY,
    value,
  };
}

/**
 * Returns a contrasting text color (black or white) for a given hex fill color.
 */
export function getContrastTextColor(hexColor: string): string {
  if (!hexColor || !hexColor.startsWith('#')) {
    return '#000000';
  }
  const normalized = hexColor.replace('#', '');
  if (normalized.length !== 6) {
    return '#000000';
  }
  const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  const r = toLinear(parseInt(normalized.slice(0, 2), 16) / 255);
  const g = toLinear(parseInt(normalized.slice(2, 4), 16) / 255);
  const b = toLinear(parseInt(normalized.slice(4, 6), 16) / 255);
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.179 ? '#000000' : '#ffffff';
}

/**
 * Returns true when the data array uses stacked sub-values for every stage.
 */
export function isStackedFunnelData(data: FunnelDataPoint[]): boolean {
  return Array.isArray(data) && data.length > 0 && data.every(stage => Array.isArray(stage.subValues));
}

/**
 * Returns the stage geometry params for stacked mode.
 */
export function buildStackedGeometryParams(data: FunnelDataPoint[]): {
  stages: Array<{ subValues: SubValue[] }>;
  totals: number[];
  maxTotal: number;
} {
  const stages = data.map(s => ({
    subValues: (s.subValues ?? []) as SubValue[],
  }));
  const totals = stages.map(s => s.subValues.reduce((sum, sv) => sum + sv.value, 0));
  const maxTotal = Math.max(...totals);
  return { stages, totals, maxTotal };
}
