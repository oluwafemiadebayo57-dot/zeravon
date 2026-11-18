// src/app/api/send/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { to, subject, html } = await req.json();

    // Ensure 'to' is always an array
    const recipients = Array.isArray(to) ? to : [to];

    const { data, error } = await resend.emails.send({
      // Updated to use your custom domain email
      from: 'Zeravon <info@zeravon.org>', 
      to: recipients,
      subject: subject,
      html: html,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Server Error in /api/send:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}