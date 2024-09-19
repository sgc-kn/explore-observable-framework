# Random Walk

This notebook visualizes the data defined in `src/data/random.json.py`.
The Python script simulates a random walk and returns the result as json.

Let's first load and show the script itself.

```js
const data_loader = FileAttachment("data.json.py").text();
```

```js
display('\n' + data_loader)
```

Now, let's have a look at the data:

```js
const data = FileAttachment("data.json").json();
```

```js
display(data)
```

---

We can write arbitrary **Markdown** here by the way!

And create plots with Observable Plot. This is a basic timeseries plot:

```js
Plot.plot({
  style: "overflow: visible;",
  marks: [
    Plot.line(data, {x: "step", y: "value"})
  ]
})
```
