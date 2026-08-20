// Serverless-функция для Vercel: /api/chat
// Проксирует запросы чата к Anthropic API. Ключ хранится в переменной
// окружения ANTHROPIC_API_KEY (задаётся в настройках Vercel) и никогда
// не попадает в браузер посетителя.

const SYSTEM_PROMPT = `You are the AI assistant on the website of RouteX Transportation LLC — a US ground expedite carrier.

Company facts you can use:
- Services: Ground Expedite (core), Dedicated Transport, High-Value Freight.
- Coverage: all 48 contiguous US states, cross-border to Canada and Mexico.
- Dispatch: live 24/7/365, average driver confirmation under 15 minutes.
- Fleet: Sprinter Van (up to 3 skids / 3,500 lbs), Small Straight Truck (4–6 skids / 10,000 lbs), Large Straight Truck (up to 12 skids / 26,000 lbs), Tractor-Trailer (full truckload / 44,000 lbs).
- Every load moves direct — no terminals, no transfers, no consolidation. Real-time GPS tracking.
- Industries: trade shows, automotive & EV, pharma, aerospace, tech, construction, government, manufacturing.
- Contact: phone +1 (440) 447-7478 (24/7), email info@routextransportationllc.com, HQ: 10060 Brecksville Rd, Brecksville, OH 44141.

Rules:
- Be friendly, concise (2-5 sentences), and professional. Answer in the language the visitor writes in.
- You cannot give exact price quotes. For pricing, direct visitors to the quote form on the page or the phone line.
- The site has pages: Home (instant quote form), Services, Drivers (online driver application), About, Contact. Point visitors to the right page when useful.
- Driver recruiting: owner-operators and company drivers welcome (Sprinter Vans, Straight Trucks, Tractor-Trailers). Weekly settlements with next-day Quick Pay option, 24/7 dispatch support. Direct them to the Drivers page application form.
- If the visitor asks for exact pricing, wants to negotiate, has a complex/urgent load, or asks for a person — tell them to tap the "Talk to a human" button right below this chat: a live dispatcher will call them back, and the chat history will be forwarded to the team.
- If asked something unrelated to freight/logistics/the company, politely steer back to how RouteX can help.
- Never invent capabilities the company does not list.`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY is not configured" });
  }

  try {
    const { messages } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages array required" });
    }

    // Санитизация: только role/content, ограничение длины и количества
    const clean = messages
      .slice(-12)
      .filter(m => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .map(m => ({ role: m.role, content: m.content.slice(0, 1000) }));

    if (clean.length === 0 || clean[clean.length - 1].role !== "user") {
      return res.status(400).json({ error: "last message must be from user" });
    }

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages: clean,
      }),
    });

    if (!r.ok) {
      const errText = await r.text();
      console.error("Anthropic API error:", r.status, errText);
      return res.status(502).json({ error: "Upstream AI error" });
    }

    const data = await r.json();
    const reply = (data.content || [])
      .filter(b => b.type === "text")
      .map(b => b.text)
      .join("\n")
      .trim();

    return res.status(200).json({ reply: reply || "Sorry, I couldn't generate a response. Please call +1 (440) 447-7478." });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal error" });
  }
}
