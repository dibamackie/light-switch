# First Light

An experimental Next.js and Three.js web experience where a physical wall switch controls a barn lamp and the page theme.

## Assets

Place the Khronos glTF sample model here:

```text
public/models/AnisotropyBarnLamp.glb
```

The app checks for that exact file at runtime. If it is missing, it uses a small procedural barn-lamp fallback so development stays usable without silently swapping to an unrelated asset.

Optional audio files can be added here:

```text
public/audio/switch-click.mp3
public/audio/electrical-hum.mp3
```

Missing audio files are ignored and do not affect the experience.

## Commands

```bash
npm install
npm run dev
npm run lint
npm run build
```
