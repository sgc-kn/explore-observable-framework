# Patrik's Test

We load the data as defined in `src/data/pkel-test.csv.py`. This Python
script extracts a relevant subset of `data/merged_speed.csv`.

```js
const data = FileAttachment("data/pkel-test.csv").csv({typed: true});
```

The table has the following columns.

```js
display(data.columns)
```

The framework allows us to render the whole table.

```js
Inputs.table(data)
```

---

We can also write arbitrary **Markdown**.

And create plots with Observable Plot. This is a basic scatter plot.

```js
Plot.dot(data, {x: "Durchschnittsgeschwindigkeit", y: "Hoechstgeschwindigkeit"}).plot()
```
