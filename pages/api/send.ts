import { Resend } from 'resend';
import EmailTemplate from '@/components/EmailTemplate';

const resend = new Resend(process.env.RESEND_API_KEY);

export const runtime = 'edge';

export default async function sendMail(req: Request) {
    const { name, email, message } = await req.json();

    console.log( 'Email:', email);
    console.log( 'Name:', name);
    console.log( 'Message:', message);

    const { data, error } = await resend.emails.send({
        from: 'notificaciones@alius.dev',
        to: ['bruno@alius.dev'],
        subject: `Nuevo mensaje de ${name} (${email})`,
        html: EmailTemplate({
            name: name,
            email: email,
            message: message,
        }),
    });

    if (error) {
        return new Response(JSON.stringify(error), { status: 400 });
    }

    return new Response(JSON.stringify(data), { status: 200 });
};