import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/app/helper/PrismaHelper';
import { generateRandomString } from '@/lib/random';
import { withAdmin } from '@/middleware/withAdmin';


const handler = async(req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        const codes = await prisma.specialUserCodes.findMany();
        res.status(200).json({ code: codes });
        return;
    } else {
         // Handle POST request
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }
}

export default withAdmin(handler);