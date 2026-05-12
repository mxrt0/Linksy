import type { TrafficSource } from "./TrafficSource";

export type ReferrerStat = {
  source: TrafficSource;
  count: number;
};

export type DeviceStat = {
  device: "Mobile" | "Desktop";
  count: number;
}