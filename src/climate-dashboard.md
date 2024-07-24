---
theme: dashboard
title: Klima Dashboard
toc: false
---

# Klima Dashboard

```js
const lswtData = FileAttachment("data/cds-lswt.csv").csv({typed: true});
const lswtColor = "var(--theme-foreground-focus)";

function lswtPlot(data, {width} = {}) {
  return Plot.plot({
    title: "Oberflächentemperatur des Bodensees",
    width,
    height: 300,
    x: {label: "Zeit"},
    y: {grid: true, label: "Temperatur (℃)"},
    marks: [
      Plot.lineY(data, {
        x: "time",
        y: "temperature",
        stroke: lswtColor,
        // tip: "x"
      }),
      Plot.crosshairX(data, {x: "time", y: "temperature"}),
    ]
  });
}
```

<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => lswtPlot(lswtData, {width}))}
  </div>
</div>
