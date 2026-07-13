# First Light

An experimental Next.js and Three.js web experience about shaping a room through small decisions.

The experience starts dark. A physical wall switch turns on a barn lamp, reveals the room, and then guides the visitor through a minimal sequence:

- choose a wallpaper
- watch a chair enter the space
- choose the chair color
- arrive at the final message

## Assets

Optional local lamp model:

```text
public/models/AnisotropyBarnLamp.glb
```

The app checks for that exact file at runtime. If it is missing, it uses a small procedural barn-lamp fallback so development stays usable without silently swapping to an unrelated asset.

The chair is loaded from the official Three.js glTF sheen example:

```text
https://threejs.org/examples/models/gltf/SheenChair.glb
```

Sound is generated with the Web Audio API, so no audio files are required.

## Editing

Wallpaper and chair color options live in:

```text
config/roomChoices.js
```

The staged interface messages live in:

```text
components/interface/SceneInterface.jsx
```

## Commands

```bash
npm install
npm run dev
npm run lint
npm run build
```
