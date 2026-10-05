import nodemailer from "nodemailer";

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Only signed-in users may trigger emails (stops strangers abusing this endpoint)
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  const supabaseUrl = (process.env.VITE_SUPABASE_URL || "").trim();
  const supabaseKey = (process.env.VITE_SUPABASE_KEY || "").trim();

  if (!token) return res.status(401).json({ error: "Not signed in" });

  const userCheck = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: { Authorization: `Bearer ${token}`, apikey: supabaseKey },
  });
  if (!userCheck.ok) return res.status(401).json({ error: "Invalid session" });

  const { customerEmail, customerName, phone, address, orderId, total } = req.body || {};
  if (!customerEmail || !customerName || !orderId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const { GMAIL_USER, GMAIL_APP_PASSWORD, ADMIN_EMAIL } = process.env;
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    return res.status(500).json({ error: "Email service is not configured" });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
  });

  const amount = Number(total || 0).toLocaleString("en-NG");

  try {
    // Confirmation to the customer
    await transporter.sendMail({
      from: `"Best Couture" <${GMAIL_USER}>`,
      to: customerEmail,
      subject: `Your Best Couture order #${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto;">
          <h2>Thank you for your order, ${escapeHtml(customerName)}!</h2>
          <p>We've received your order and will start processing it shortly.</p>
          <p><strong>Order number:</strong> #${escapeHtml(orderId)}</p>
          <p><strong>Total:</strong> ₦${amount}</p>
          <p><strong>Delivery address:</strong> ${escapeHtml(address)}</p>
          <p>You can track it anytime under <strong>My Orders</strong> on our website.</p>
          <p>Best Couture</p>
        </div>`,
    });

    // Copy to the shop owner
    await transporter.sendMail({
      from: `"Best Couture" <${GMAIL_USER}>`,
      to: ADMIN_EMAIL || GMAIL_USER,
      subject: `New order #${orderId} from ${customerName}`,
      html: `
        <h2>New order received</h2>
        <p><strong>Order:</strong> #${escapeHtml(orderId)}</p>
        <p><strong>Customer:</strong> ${escapeHtml(customerName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(customerEmail)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
        <p><strong>Address:</strong> ${escapeHtml(address)}</p>
        <p><strong>Total:</strong> ₦${amount}</p>`,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("SEND EMAIL ERROR:", error);
    return res.status(500).json({ error: "Failed to send email" });
  }
}