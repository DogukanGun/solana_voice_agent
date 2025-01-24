import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/app/helper/PrismaHelper';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ error: 'Code is required' });
    }

    if (req.method === 'GET') {
        // Handle any other HTTP method
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    try {
        const userCode = await prisma.specialUserCodes.findFirst({
            where: {
                code: code,
                is_used: false,
            },
        });

        if (userCode) {
            return res.status(200).json({ exists: true });
        } else {
            return res.status(404).json({ exists: false });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}