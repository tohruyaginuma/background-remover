export const runtime = "nodejs";

type ReplicatePrediction = {
  id: string;
  status: "starting" | "processing" | "succeeded" | "failed" | "canceled";
  output: string | null;
  error: string | null;
  urls: { get: string; cancel: string };
};

const json = (body: object, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const POST = async (req: Request): Promise<Response> => {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) return json({ error: "API token not configured" }, 500);

  let incoming: FormData;
  try {
    incoming = await req.formData();
  } catch {
    return json({ error: "Invalid form data" }, 400);
  }

  const file = incoming.get("image_file");
  if (!(file instanceof File)) return json({ error: "image_file is required" }, 400);

  // Convert file to base64 data URI so Replicate can accept it without a public URL
  const arrayBuf = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuf).toString("base64");
  const dataUri = `data:${file.type};base64,${base64}`;

  // Create prediction with Prefer: wait for synchronous response (up to 60 s)
  // Retry up to 2 times on 429 (rate limit resets in ~15 s)
  let createRes!: Response;
  for (let attempt = 0; attempt < 3; attempt++) {
    createRes = await fetch(
      "https://api.replicate.com/v1/models/bria/remove-background/predictions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Prefer: "wait",
        },
        body: JSON.stringify({ input: { image: dataUri } }),
      },
    );
    if (createRes.status !== 429) break;
    await new Promise((r) => setTimeout(r, 15_000));
  }

  if (!createRes.ok) {
    let message = "Replicate API error";
    try {
      const body = await createRes.json();
      message = body.detail ?? body.title ?? message;
    } catch {
      // non-JSON error body
    }
    return json({ error: message }, createRes.status);
  }

  const prediction: ReplicatePrediction = await createRes.json();

  // If Prefer: wait timed out the server returns status 202 with status "processing"
  // Poll until done (max ~60 s additional wait)
  let result = prediction;
  let attempts = 0;
  while (result.status === "starting" || result.status === "processing") {
    if (attempts++ > 30) return json({ error: "Prediction timed out" }, 504);
    await new Promise((r) => setTimeout(r, 2000));
    const pollRes = await fetch(result.urls.get, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!pollRes.ok) return json({ error: "Failed to poll prediction" }, 502);
    result = await pollRes.json();
  }

  if (result.status !== "succeeded" || !result.output) {
    return json({ error: result.error ?? "Background removal failed" }, 500);
  }

  // Fetch the output PNG from Replicate's CDN and proxy it to the client
  const imageRes = await fetch(result.output);
  if (!imageRes.ok) return json({ error: "Failed to fetch result image" }, 502);

  const buf = await imageRes.arrayBuffer();
  return new Response(buf, { headers: { "Content-Type": "image/png" } });
};
