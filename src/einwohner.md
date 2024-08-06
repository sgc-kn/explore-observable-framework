---
theme: dashboard
title: Einwohner
toc: false
---

```js
const stadtteile_geojson = FileAttachment("data/stadtteile.geo.json").json();
const einwohner_csv = FileAttachment("data/einwohner.csv").csv({typed: true});
// const map_csv = FileAttachment("data/map.csv").csv();
// const familienstand_csv = FileAttachment("data/familienstand.csv").csv();
```

# Einwohner in Konstanz

<h2></h2>

```js
const stadtteil_check_input = Inputs.toggle({
  label: "Filter aktivieren",
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
const id = stadtteil_check ?
    stadtteil_select.properties.STT_ID : 0 ;
const stt = stadtteil_check ?
    `Stadtteil ${stadtteil_select.properties.STT_NAME}` :
    stadtteil_select;
```

```js
function map_plot(width) {
  return Plot.plot({
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
        strokeWidth: 1.5,
      }),
    ],
  })
}
```

```js
const ts_data = d3.filter(einwohner_csv, (r) => r.STT_ID == id);

const caption = `
  Ich glaube hier sollten wir noch ein paar Worte verlieren. Was sind
  die Achsen? Wo kommen die Daten her? Kann man die irgendwo downloaded?
  Etc...
  `

function ts_plot(width) {
  return Plot.plot({
    width,
    title: "Einwohnerentwicklung",
    caption,
    subtitle: stt,
    marks: [
      Plot.lineY(ts_data, {
        x: "Jahr",
        y: "Einwohner",
        stroke: "var(--theme-foreground-focus)",
      }),
      Plot.crosshairX(ts_data, {x: "Jahr", y: "Einwohner"}),
    ],
  });
}
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
    ${resize((width) => map_plot(width))}
  </div>
  <div class="card">
    <h2>Kennzahlen für das Jahr ${maxYear}</h2>
    <h3>${stt}</h3>

    ToDo
  </div>
</div>

<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => ts_plot(width))}
  </div>
</div>
