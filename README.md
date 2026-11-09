# Student origins — React + D3 dashboard

A responsive data visualisation dashboard showing the geographical distribution of students in the first cohort of the D3 + React course.

## Features
- Three automatically computed indicators: total students, countries, and largest share.
- Responsive horizontal bar chart and Eurostat GISCO choropleth map.
- Linked selection between charts; hover, touch/click and keyboard focus tooltips.
- Shared country-code lookup and tooltip positioning utilities.
- Local GISCO 2024 GeoJSON datasets and CSV in `public/data/`.

## Run locally

```bash
npm install
npm run dev
```

## Quality checks

```bash
npm run lint
npm run build
```

## Deploy to GitHub Pages

Set `base` in `vite.config.js` to `"/YOUR_REPOSITORY_NAME/"` if publishing at `https://USERNAME.github.io/YOUR_REPOSITORY_NAME/`, then run `npm run build`. Deploy the `dist/` directory with your preferred GitHub Pages workflow. For a root-domain deployment, keep Vite's default base (`/`). All data URLs use `import.meta.env.BASE_URL`.

## Source
Eurostat GISCO 2024, 20M, EPSG:4326 boundary and region datasets. Student data: course sample CSV.
