'use server'

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const EMAIL_CONFIG = {
  from: 'Tiny Villa Bali <no-reply@jokoslamet.id>',
  to: 'jokoslamet2207@gmail.com',
}

export async function sendContactEmail(data: {
  name: string
  email: string
  message: string
}) {
  const { error } = await resend.emails.send({
    from: EMAIL_CONFIG.from,
    to: EMAIL_CONFIG.to,
    replyTo: data.email,
    subject: `New message from ${data.name}`,
    text: `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #b8922a; margin-bottom: 4px;">New Message</h2>
        <p style="color: #666; margin-top: 0; font-size: 14px;">Tiny Villa Bali — Contact Form</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p><strong>Message:</strong></p>
        <p style="line-height: 1.7; color: #333;">${data.message.replace(/\n/g, '<br/>')}</p>
      </div>
    `,
  })

  if (error) throw new Error(error.message)
}
