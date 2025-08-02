import nodemailer from "nodemailer";

export async function sendEmail(to: string, subject: string, text: string) {
	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.EMAIL,
			pass: process.env.EMAIL_APP_PASSWORD,
		},
	});

	const mailOptions = {
		from: `"Leetbro Server" ${process.env.EMAIL}`,
		to,
		subject,
		text,
	};

	try {
		const info = await transporter.sendMail(mailOptions);
		console.log("Email sent:", info.response);
	} catch (err) {
		console.error("Error sending email:", err);
		throw err;
	}
}
