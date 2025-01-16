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
            const { caption, messageHistory } = req.body;
            if (!caption || typeof caption !== "string") {
                return res.status(400).json({ error: "Caption is required and should be a string." });
            }

            const openai = new OpenAI(
                {
                    apiKey:process.env.OPEN_AI_KEY
                }
            );
            const completions = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: "So user will send you a text. Now you have to decide that message is about executing a transaction in blockchain or not.If it is, then only return this  (${user_message} represents user's message) \"{text:${user_message}, op:sol_ai}\" . Otherwise, answer question normally.",
                    },
                    ...messageHistory,
                    {
                        role: "user",
                        content: caption,
                    }
                ],
            })
            const message = completions.choices[0].message;
            console.log(message)

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
                input: message.content || "",
            });

            // Convert audio data to buffer and return it
            const buffer = Buffer.from(await mp3.arrayBuffer());
            const base64Audio = buffer.toString("base64");

            res.status(200).json({
                text: message.content || "",
                audio: base64Audio,
            });
            break;

        default:
            // Handle unsupported methods
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
            break;
    }
}

export default handler;