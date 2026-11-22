const MAX_LENGTHS = {
  name: 120,
  phone: 60,
  email: 254,
  type: 120,
  message: 3000,
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return res.status(503).json({ error: "Enquiry delivery is not configured yet." });
  }

  let data = req.body;
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch {
      return res.status(400).json({ error: "Invalid form submission." });
    }
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return res.status(400).json({ error: "Invalid form submission." });
  }

  const fields = {};
  for (const [key, maxLength] of Object.entries(MAX_LENGTHS)) {
    fields[key] = typeof data[key] === "string" ? data[key].trim().slice(0, maxLength) : "";
  }
  if (!fields.name || !fields.phone) {
    return res.status(400).json({ error: "Please provide your name and phone number." });
  }

  const text = [
    "New website enquiry",
    `Name: ${fields.name}`,
    `Phone: ${fields.phone}`,
    `Email: ${fields.email || "Not provided"}`,
    `Project type: ${fields.type || "Not provided"}`,
    `Requirement: ${fields.message || "Not provided"}`,
  ].join("\n");

  try {
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text }),
      },
    );
    if (!telegramResponse.ok) {
      console.error("Telegram rejected an enquiry", telegramResponse.status);
      return res.status(502).json({ error: "Could not deliver your enquiry. Please try again." });
    }
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Telegram enquiry delivery failed", error);
    return res.status(502).json({ error: "Could not deliver your enquiry. Please try again." });
  }
};
