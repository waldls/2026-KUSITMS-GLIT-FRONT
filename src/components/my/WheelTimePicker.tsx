"use client";

import Picker, { type PickerValue } from "react-mobile-picker";

import {
  getAvailableHours,
  getAvailableMinutes,
  MERIDIEMS,
  normalizeAlarmTime,
  type TimeValue,
} from "@/lib/utils/alarmTime";

export type { Meridiem, TimeValue } from "@/lib/utils/alarmTime";

const ITEM_H = 32;
const HEIGHT = 174;
const ANGLES = [0, 16, 30];

const itemStyle = (
  i: number,
  selectedIdx: number,
  align: "left" | "center" | "right",
): React.CSSProperties => {
  const dist = Math.abs(i - selectedIdx);
  const angle = Math.sign(i - selectedIdx) * ANGLES[Math.min(dist, 2)]!;
  return {
    display: "block",
    textAlign: align,
    lineHeight: "140%",
    letterSpacing: "-0.025em",
    transition: "font-size 0.1s ease, opacity 0.1s ease, transform 0.1s ease",
    fontWeight: dist === 0 ? 500 : 400,
    fontSize: dist === 0 ? 20 : dist === 1 ? 18 : 15,
    color: dist === 0 ? "#FFFFFF" : "#BFBFBF",
    opacity: dist === 0 ? 1 : dist === 1 ? 0.5 : 0.35,
    transform: `perspective(600px) rotateX(${angle}deg)`,
  };
};

interface WheelTimePickerProps {
  value: TimeValue;
  disabled: boolean;
  onChange: (value: TimeValue) => void;
}

const WheelTimePicker = ({ value, disabled, onChange }: WheelTimePickerProps) => {
  const normalizedValue = normalizeAlarmTime(value);
  const availableHours = getAvailableHours(normalizedValue.meridiem);
  const availableMinutes = getAvailableMinutes(normalizedValue);

  const hourIdx = availableHours.indexOf(normalizedValue.hour);
  const minuteIdx = availableMinutes.indexOf(normalizedValue.minute);
  const meridiemIdx = MERIDIEMS.indexOf(normalizedValue.meridiem);

  return (
    <div className="relative overflow-hidden" style={{ height: HEIGHT }}>
      <div
        className="pointer-events-none absolute inset-x-0 z-10 h-8"
        style={{
          top: (HEIGHT - ITEM_H) / 2,
          background: "rgba(255, 255, 255, 0.08)",
          borderRadius: "0.475rem",
        }}
      />
      <style>{`.wtp > div:last-child > div { background: transparent !important; }`}</style>
      <div className={disabled ? "pointer-events-none" : undefined}>
        <Picker
          className="wtp"
          value={normalizedValue as unknown as PickerValue}
          onChange={v => onChange(normalizeAlarmTime(v as unknown as TimeValue))}
          height={HEIGHT}
          itemHeight={ITEM_H}
          style={{ gap: 24 }}
          wheelMode="normal">
          <Picker.Column name="hour" style={{ flex: "0 0 3rem" }}>
            {availableHours.map((h, i) => (
              <Picker.Item key={h} value={h}>
                {() => <span style={itemStyle(i, hourIdx, "right")}>{h}</span>}
              </Picker.Item>
            ))}
          </Picker.Column>
          <Picker.Column name="minute" style={{ flex: "0 0 3rem" }}>
            {availableMinutes.map((m, i) => (
              <Picker.Item key={m} value={m}>
                {() => (
                  <span style={itemStyle(i, minuteIdx, "center")}>
                    {String(m).padStart(2, "0")}
                  </span>
                )}
              </Picker.Item>
            ))}
          </Picker.Column>
          <Picker.Column name="meridiem" style={{ flex: "0 0 3rem" }}>
            {MERIDIEMS.map((mer, i) => (
              <Picker.Item key={mer} value={mer}>
                {() => <span style={itemStyle(i, meridiemIdx, "left")}>{mer}</span>}
              </Picker.Item>
            ))}
          </Picker.Column>
        </Picker>
      </div>
    </div>
  );
};

export default WheelTimePicker;
