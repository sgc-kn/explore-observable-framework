import * as Plot from "npm:@observablehq/plot";

export function map_plot(data, stt_id, width) {
  return Plot.plot({
    width,
    projection: {
      type: "mercator",
      domain: data,
    },
    marks: [
      Plot.geo(data, {
        fill: (x) => (
          (stt_id == 0 || (x.properties.STT_ID == stt_id))
          ? "var(--theme-foreground-focus)"
          : "var(--theme-foreground-muted)"
        ),
        stroke: "var(--theme-background)",
        strokeWidth: 1.5,
      }),
    ],
  })
}
