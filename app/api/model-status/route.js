import { access } from "node:fs/promises";
import path from "node:path";

export async function GET() {
  const modelPath = path.join(process.cwd(), "public", "models", "AnisotropyBarnLamp.glb");

  try {
    await access(modelPath);
    return Response.json({ hasLampModel: true });
  } catch {
    return Response.json({ hasLampModel: false });
  }
}
