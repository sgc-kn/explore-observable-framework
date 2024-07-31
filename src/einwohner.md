---
theme: dashboard
title: Einwohnerzahlen
toc: false
---

```js
const einwohner_csv = FileAttachment("data/einwohner.csv").csv();
const map_csv = FileAttachment("data/map.csv").csv();
const stadtteile_geojson = FileAttachment("data/stadtteile.geo.json").json();
const familienstand_csv = FileAttachment("data/familienstand.csv").csv();
```

# Einwohner in Konstanz

<h2></h2>

```js
const stadtteil_check_input = Inputs.toggle({
  label: "Filtern aktivieren",
  value: false,
});
const stadtteil_check = Generators.input(stadtteil_check_input);
```

```js
const stadtteil_select_input = Inputs.select(
  (stadtteil_check) ? stadtteile_geojson.features : [ 'Gesamte Stadt' ],
  {
    label: "Stadtteil:",
    format: (x) => (stadtteil_check) ? x.properties.STT_NAME : x,
    disabled: !stadtteil_check,
  }
);
const stadtteil_select = Generators.input(stadtteil_select_input);
```

```js
const map = Plot.plot({
  width,
  projection: {
    type: "mercator",
    domain: stadtteile_geojson,
  },
  marks: [
    Plot.geo(stadtteile_geojson, {
      fill: (x) => (
        (!stadtteil_check ||
          (x.properties.STT == stadtteil_select.properties.STT)
        )
        ? "var(--theme-foreground-focus)"
        : "var(--theme-foreground-muted)"
      ),
      stroke: "var(--theme-background)",
      strokeWidth: 2,
    }),
  ],
})
```

```js
const maxYear = Math.max(...einwohner_csv.map((x) => x.Jahr));
```

<div class="grid grid-cols-2">
  <div class="card">
    <h2>Stadtteile</h2>
    <h3>Dieses Dashboard kann auf Stadtteile gefiltert werden.</h3>
    ${stadtteil_check_input}
    ${stadtteil_select_input}
    ${map}
  </div>
  <div class="card">
    <h2>Kennzahlen für das Jahr ${maxYear}</h2>
    <h3>${stadtteil_check ?
    `Stadtteil ${stadtteil_select.properties.STT_NAME}` : stadtteil_select}</h3>

    ToDo
  </div>
</div>
