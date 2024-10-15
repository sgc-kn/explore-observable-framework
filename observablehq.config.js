// Dynamic Page Footer
import * as child_process from 'child_process';

const now = new Date();
const date = now.toLocaleDateString('de-DE');
const time = now.toLocaleTimeString('de-DE', {hour: '2-digit', minute:'2-digit'});
const repo = 'https://github.com/sgc-kn/explore-observable-framework'

var footer = `Seite erstellt am ${date} um ${time} Uhr.`

if (process.env.GITHUB_SHA) {
  // we're likely in a CI build
  const hash = process.env.GITHUB_SHA
  const branch = process.env.GITHUB_REF.replace('/refs/heads', '')
  if (branch == 'main') {
    footer += ` <a href="${repo}">Quellcode auf Github.</a>`
  } else {
    footer += ` <a href="${repo}/tree/${branch}">Quellcode auf Github.</a>`
  }
  footer += ` <a href="${repo}/tree/${hash}">Version: ${hash.substring(0, 8)}</a>`
} else {
  const revision = child_process
    .execSync('git describe --all --long --dirty')
    .toString().trim().replace('heads/', '')
  footer += ` Version: ${revision}`
}

const header = `
<div style="display: flex; justify-content: space-between; width: 100%">
  <div style="display: flex; align-items: center">
    <img style="height: 2rem"
         src="assets/skn-logo.svg"
         alt="Logo der Stadtverwaltung Konstanz"
         /><b>Stadtdaten Konstanz</b>
  </div>
  <div>
    <a href="${repo}">
      <img style="height: 1.5rem"
           src="assets/github-logo.svg"
           alt="Github Logo"
           />
    </a>
  </div>
</div>
`

// Observable Configuration
// See https://observablehq.com/framework/config for documentation.

export default {
  // The project’s title; used in the sidebar and webpage titles.
  title: "Stadtdaten Konstanz",

  home: 'Navigation',
  header,

  // The pages and sections in the sidebar. If you don’t specify this option,
  // all pages will be listed in alphabetical order. Listing pages explicitly
  // lets you organize them into sections and have unlisted pages.
  // pages: [
  //   {
  //     name: "Examples",
  //     pages: [
  //       {name: "Dashboard", path: "/example-dashboard"},
  //       {name: "Report", path: "/example-report"}
  //     ]
  //   }
  // ],

  // Content to add to the head of the page, e.g. for a favicon:
  head: `
    <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
    <link rel="icon" type="image/png" href="/assets/favicon.png">
  `,

  toc: {
    label: 'Inhaltsverzeichnis',
  },

  // The path to the source root.
  root: "src",

  // Some additional configuration options and their defaults:
  // theme: "default", // try "light", "dark", "slate", etc.
  // header: "", // what to show in the header (HTML)
  // footer: "Built with Observable.", // what to show in the footer (HTML)
  // sidebar: true, // whether to show the sidebar
  // toc: true, // whether to show the table of contents
  // pager: true, // whether to show previous & next links in the footer
  // output: "dist", // path to the output root for build
  // search: true, // activate search
  // linkify: true, // convert URLs in Markdown to links
  // typographer: false, // smart quotes and other typographic improvements
  // cleanUrls: true, // drop .html from URLs

  pager: false,
  cleanUrls: false,
  footer,
};
