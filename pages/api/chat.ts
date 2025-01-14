import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req;

    switch (method) {
        case 'GET':
            // Handle GET request

            break;

        case 'POST':
            // Handle POST request
            const { caption } = req.body;
            if (!caption || typeof caption !== "string") {
                return res.status(400).json({ error: "Caption is required and should be a string." });
            }

            const openai = new OpenAI(
                {
                    apiKey:process.env.OPEN_API_KEY
                }
            );
            const completions = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "assistant",
                        content: "You are communicating with the user on a phone, so your answers should not be too long and go directly to the essence of the sentences.",
                    },
                    {
                        role: "user",
                        content: caption,
                    }
                ],
            })
            const message = completions.choices[0].message;

            if (!message) {
                return res.status(500).json({ error: "Failed to generate a response." });
            }

            if (!message.content) {
                return res.status(500).json({ error: "Failed to generate a response." });
            }
            // Convert the message to speech
            const mp3 = await openai.audio.speech.create({
                model: "tts-1",
                voice: "alloy",
                input: message.content!!,
            });

            // Convert audio data to buffer and return it
            const buffer = Buffer.from(await mp3.arrayBuffer());

            res.setHeader("Content-Type", "audio/mp3");
            res.setHeader("Content-Disposition", `attachment; filename="speech.mp3"`);
            res.status(200).send(buffer);
            break;

        default:
            // Handle unsupported methods
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
            break;
    }
}

export default handler;