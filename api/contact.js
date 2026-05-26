// api/contact.js — Vercel Serverless Function
// Receives form submissions and sends them via Resend

export default async function handler(req, res) {
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, email, company, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: 'Taurus Contact Form <onboarding@resend.dev>',
                to: [process.env.CONTACT_EMAIL || 'martinezloredaven@gmail.com'],
                reply_to: email,
                subject: `New Inquiry from ${name}${company ? ` — ${company}` : ''}`,
                html: `
                    <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #f9fafb; border-radius: 12px;">
                        <h2 style="color: #0f172a; margin-bottom: 8px; font-size: 22px;">New Client Inquiry</h2>
                        <p style="color: #64748b; font-size: 13px; margin-bottom: 32px; border-bottom: 1px solid #e2e8f0; padding-bottom: 16px;">
                            Received via taurus website contact form
                        </p>

                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 10px 0; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; width: 120px;">Name</td>
                                <td style="padding: 10px 0; color: #0f172a; font-weight: 600;">${name}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em;">Email</td>
                                <td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #00F5D4; text-decoration: none;">${email}</a></td>
                            </tr>
                            ${company ? `
                            <tr>
                                <td style="padding: 10px 0; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em;">Subject</td>
                                <td style="padding: 10px 0; color: #0f172a;">${company}</td>
                            </tr>` : ''}
                        </table>

                        <div style="margin-top: 24px; padding: 20px; background: #ffffff; border-radius: 8px; border-left: 3px solid #00F5D4;">
                            <p style="color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px;">Message</p>
                            <p style="color: #1e293b; line-height: 1.7; white-space: pre-wrap;">${message}</p>
                        </div>

                        <p style="font-size: 11px; color: #94a3b8; margin-top: 32px; text-align: center;">
                            Taurus — Success Engineered · Butuan City, Philippines
                        </p>
                    </div>
                `,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Resend error:', error);
            return res.status(500).json({ error: 'Failed to send email. Please try again.' });
        }

        return res.status(200).json({ success: true, message: 'Message sent successfully!' });

    } catch (err) {
        console.error('Server error:', err);
        return res.status(500).json({ error: 'Server error. Please try again later.' });
    }
}
