# THE INVITATION — Canva art direction and asset plan

## Art direction: Surreal Artistic Cyberpunk
A corrupted gallery / research facility with your handmade paintings becoming architectural surfaces. Blackened steel, indigo concrete, red illuminated cables, cyan structural lighting, acid orange and violet accents. Keep your artwork's physical marks intact; do not regenerate it.

## Canva deliverables (recommended export)

| Asset | Recommended dimensions | Export | Game use |
|---|---|---|---|
| Entrance mural | 2048 × 2048 px | PNG or JPG | Wall surface; design without perspective so it can be mapped onto geometry |
| Floor graphic | 2048 × 2048 px | PNG | Repeating floor texture; design edges to tile seamlessly |
| Security signage | 1024 × 512 px | PNG | Sign or decal on door and terminals |
| Sector 01 environment | 2048 × 1024 px | PNG | Identity mural and artwork collage |
| Sector 02 environment | 2048 × 1024 px | PNG | Résumé archive visual motifs |
| Sector 03 environment | 2048 × 1024 px | PNG | Residential simulation backdrop |
| Sector 04 environment | 2048 × 1024 px | PNG | Aura: saturated arcade-inspired panels |
| Sector 05 environment | 2048 × 1024 px | PNG | Napoleon: volcanic workshop backdrop |
| UI panels / HUD | 1920 × 1080 px | Transparent PNG | Decoration behind accessible live HTML text |
| Creature silhouette | 1024 × 1024 px | Transparent PNG | Layered environmental cutout, not a 3D character model |
| Storyboard | 1920 × 1080 px | PNG or PDF | Reference for geometry, lighting, and scene composition; not a literal 3D mesh |

## Important
- Export artwork and textures separately; don't bake project descriptions or résumé text into wall images.
- Canva drawings are 2D. They become textures, decals or transparent layers on modelled 3D geometry. They do not automatically generate full 3D architecture.
- For a mural, send a clean straight-on version plus a separate storyboard showing placement.
- For textures, aim for 1024 or 2048 px and compress files to keep web loading fast.
- Replace images in `public/art/` with your own high-quality exports, or add new files and reference them in `src/World.tsx`.
- The Pinterest creature illustration is reference only and is not packaged in the game.

## Next iteration
Replace the existing procedural wall materials with Canva-authored murals and add a proper neon cable network, timed rhythm hacking, and spatially changing corridors after the entrance hall is approved.
