import { readFile } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(
      process.cwd(),
      "public",
      "production-area-inspection-github.zip",
    );
    const data = await readFile(filePath);
    return new Response(data, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition":
          'attachment; filename="production-area-inspection-github.zip"',
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return Response.json({ error: "zip_missing" }, { status: 404 });
  }
}
