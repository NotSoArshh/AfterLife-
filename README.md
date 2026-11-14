# AFTERLIFE — The Forgotten Space Museum

> **Thirteen missions. Six destinations. Decades of hardware still out there.**

**[Open the live website](https://notsoarshh.github.io/AfterLife-/)**

AFTERLIFE is an immersive, interactive museum for the human-made objects that remain on the Moon, Mars, and beyond. It turns forgotten spacecraft, abandoned landers, rovers, instruments, and orbital relics into a visual journey through the history of exploration.

Built for the NASA Space Apps Challenge theme **“Abandoned but not Forgotten”**, the experience combines archival imagery, mission timelines, destination guides, hardware profiles, and carefully sourced historical context.

## What you can explore

- **Mission archive** — Browse the objects and missions left across the solar system.
- **Interactive timeline** — Follow decades of landings, operations, discoveries, and mission endings.
- **Moon, Mars, and beyond** — Explore each destination through a dedicated visual guide.
- **Hardware gallery** — Learn about the landers, rovers, instruments, and spacecraft that made exploration possible.
- **Source library** — Trace the research back to NASA, NSSDCA, JPL, and the NASA Image and Video Library.
- **Responsive museum interface** — Designed for both large screens and mobile devices, with motion-reduction support.

## Tech stack

- React 19
- TypeScript
- Vite
- React Router
- Framer Motion
- GSAP
- Three.js

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL shown by Vite.

## Production build

```bash
npm run build
npm run preview
```

## Data and credits

Mission facts and source links are maintained in [`src/data`](./src/data). Images and historical references come from public NASA resources, including the [NASA Image and Video Library](https://images.nasa.gov/), [NASA Science](https://science.nasa.gov/), [NASA/JPL](https://www.jpl.nasa.gov/), and [NSSDCA](https://nssdc.gsfc.nasa.gov/).

## Deployment

The site is deployed automatically to GitHub Pages from the `main` branch via [`.github/workflows/deploy-pages.yml`](./.github/workflows/deploy-pages.yml).

**Live website:** https://notsoarshh.github.io/AfterLife-/

## License

This project is an educational and creative web experience. NASA names, imagery, and materials remain subject to their respective usage guidelines and source attributions.
