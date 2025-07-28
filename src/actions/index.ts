import { defineAction } from 'astro:actions'
import { z } from 'astro:schema'
import { Resend } from 'resend'

const resend = new Resend(import.meta.env.RESEND_API_KEY)

export const server = {
  sendEmail: defineAction({
    accept: 'form',
    input: z.object({
      name: z.string(),
      email: z.string().email(),
      subject: z.string(),
      message: z.string(),
    }),
    handler: async ({ name, email, subject, message }) => {
      const { data, error } = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: 'hectormtg@gmail.com',
        subject: `Pesonal Portfolio Inquiry | ${name}`,
        html: `<div>
        <p>Client Name: <strong>${name}</strong></p>
        <p>Email: <strong>${email}</strong></p>
        <p>Subject: <strong>${subject}</strong></p>
        <p>Message: <strong>${message}</strong></p>
        </div>`,
      })

      if (error) {
        throw error
      }

      return data
    },
  }),
}
