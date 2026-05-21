import { createContext } from "react";

export type CalendarType = "default" | "page";
export const CalendarContext = createContext<CalendarType>("default");
