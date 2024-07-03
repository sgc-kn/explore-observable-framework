# Einwohner in Konstanz

We load the data as defined in `src/data/pkel-test.csv.py`. This Python
script extracts a relevant subset of `data/merged_speed.csv`.

```js
const data = FileAttachment("data/einwohner.csv").csv();
```

`data` json object:

```js
display(data)
```

The framework allows us to render the whole table.

```js
Inputs.table(data)
```

---

We can also write arbitrary **Markdown**.

And create plots with Observable Plot. This is a basic scatter plot.

```js
Plot.dot(data, {
  x: "Jahr",
  y: "Einwohner"
}).plot()
```
