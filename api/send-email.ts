import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: any, res: any) {
if (req.method !== "POST") {
return res.status(405).json({
error: "Method not allowed",
});
}

try {
const {
customerEmail,
customerName,
orderId,
total,
} = req.body;


if (!customerEmail || !customerName || !orderId || total === undefined) {
  return res.status(400).json({
    error: "Missing required order information",
  });
}

const { data, error } = await resend.emails.send({
  from: "Best Couture <onboarding@resend.dev>",
  to: [customerEmail],
  subject: `Best Couture Order Confirmation #${orderId}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px;">
      <h1 style="color: #222;">Thank you for your order!</h1>

      <p>Hello ${customerName},</p>

      <p>
        Your Best Couture order has been received successfully.
      </p>

      <div style="background: #f7f7f7; padding: 20px; margin: 25px 0;">
        <p><strong>Order Number:</strong> #${orderId}</p>
        <p><strong>Order Total:</strong> ₦${Number(total).toLocaleString()}</p>
        <p><strong>Status:</strong> Pending</p>
      </div>

      <p>
        We will contact you with further information about your delivery.
      </p>

      <p>Thank you for shopping with Best Couture.</p>

      <p>
        <strong>Best Couture</strong>
      </p>
    </div>
  `,
});

if (error) {
  console.error("RESEND ERROR:", error);

  return res.status(500).json({
    error: error.message,
  });
}

return res.status(200).json({
  success: true,
  data,
});


} catch (error: any) {
console.error("EMAIL SERVER ERROR:", error);


return res.status(500).json({
  error: error.message || "Unable to send email",
});


}
}
