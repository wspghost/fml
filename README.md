# THE INVITATION — Prototype 04 / THE ARCADE

A browser-based first-person portfolio experience using React, TypeScript, Three.js and React Three Fiber.

## Run locally

1. Install Node.js 20 or newer.
2. Run `npm install` in this folder.
3. Run `npm run dev`.
4. Open the local address printed by Vite (usually http://localhost:5173).

## Deploy

Upload the **contents of this folder** into the `the-invitation-prototype` directory in your existing GitHub repository. In Vercel, keep Root Directory set to `the-invitation-prototype`, Framework Preset `Vite`. A new commit triggers a new deployment.

## Current story and gameplay

- **2D home screen:** first artwork from START.pdf, with interactive STAR / START and the red-outlined woman / ABOUT ME.
- **Exterior:** spawn on a dark road, walk toward the building facade based on START.pdf page 2, then walk through the central doorway.
- **Interior:** a dark 3D room with a glowing red thread that leads to an arcade cabinet.
- **Cabinet:** press E to open song selection; cycle between **RESIDENTIAL**, **AURA**, and **VOLCANA**.
- **Rhythm prototype:** each track has its own input sequence and pace; press the displayed arrow (or click its on-screen button). Score and clear state are recorded locally. This is an input-sequence demo, not yet a musically synchronized DDR game.
- **Portfolio:** each track offers a direct project information overlay; project content is placeholder pending the actual work.

## Controls

- WASD: move
- Mouse: look around (click to capture cursor)
- Shift: sprint
- E: interact with arcade cabinet when close and looking at it
- Esc: pause / release cursor
- Arrow keys or WASD: input notes during rhythm mode

## Artwork and accuracy

The 2D title image and exterior wall derive from the user's supplied PDF. The title image has been cropped to the page-1 composition and retains the physical painting. The outlined figure is an SVG hit area hand-traced to the available raster image; it may need pixel-level adjustments in a later iteration. The red outline is **not** a replacement for the drawing.

The 3D building facade uses texture slices and a real doorway. The road is a simplified modeled surface; the PDF road photograph is a reference, not a literal perspective-correct ground texture.

## Next steps

- Replace the placeholder portfolio overlays with drawings, project images, and descriptions.
- Upload an isolated high-resolution cutout/mask of the illustrated woman to perfect her red silhouette.
- Add custom song audio and beat maps for real rhythm synchronization.
- Improve environment meshes, exterior road props, character movement feel, and lighting.

## Limitations

The browser game is a prototype. It has not yet been visually validated on every device. Desktop Chrome/Edge with WebGL and keyboard/mouse is the intended test environment.
