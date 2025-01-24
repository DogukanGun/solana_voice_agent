import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/app/helper/PrismaHelper';


export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        // Handle GET request
        prisma.registeredUsers.findFirst({
            where: {
                user_wallet: req.body.user_wallet
            },
            select: {
                user_wallet: true
            }
        }).then(user => {
            if(!user) {
                res.status(404).json({ error: 'User not found'})
                return
            }
            res.status(200).json({ message: 'User check successful', user });
        }).catch(error => {
            res.status(500).json({ error: 'User check failed', details: error });
        });


    } else {
        // Handle any other HTTP method
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}