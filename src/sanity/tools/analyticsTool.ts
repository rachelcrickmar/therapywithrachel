import { ChartUpwardIcon } from "@sanity/icons/ChartUpward";
import { AnalyticsDashboard } from "./AnalyticsDashboard";

export function analyticsTool() {
  return {
    title: "Analytics",
    name: "analytics",
    icon: ChartUpwardIcon,
    component: AnalyticsDashboard,
  };
}
