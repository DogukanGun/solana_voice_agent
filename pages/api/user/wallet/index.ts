import { PublicKey } from "@solana/web3.js";
import { NextApiRequest, NextApiResponse } from "next";
import nacl from "tweetnacl";
import { decodeUTF8 } from "tweetnacl-util";
import { prisma } from '@/app/helper/PrismaHelper';
import { PrivyClient } from "@privy-io/server-auth";
import crypto from 'crypto';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const accessToken = req.headers.authorization?.split(' ')[1];

    if (!accessToken) {
        return res.status(400).json({ error: 'Missing parameters' });
    }

    const privy = new PrivyClient(
        process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
        process.env.PRIVY_CLIENT_SECRET!
    );

    try {
        const verificationKey = cleanPEM(process.env.PRIVY_VERIFICATION_KEY!);
        if (!isValidSPKI(verificationKey)) {
            console.error('Invalid PRIVY_VERIFICATION_KEY format');
            return res.status(500).json({ error: 'Invalid verification key format' });
        }

        console.log('Access Token:', accessToken);
        console.log('Verification Key:', verificationKey);

        const verifiedClaims = await privy.verifyAuthToken(
            accessToken,
            verificationKey
        );
        console.log(verifiedClaims);
        const existingWallet = await prisma.arbitrumWallets.findFirst({
            where: {
                wallet_address: verifiedClaims.userId
            }
        });

        if (!existingWallet) {
            const seed = crypto.createHash('sha256').update(verifiedClaims.userId).digest();
            const keyPair = nacl.sign.keyPair.fromSeed(seed);
            const privateKeyBase64 = Buffer.from(keyPair.secretKey).toString('base64');

            await prisma.arbitrumWallets.create({
                data: {
                    wallet_address: verifiedClaims.userId,
                    private_key: privateKeyBase64
                }
            });
        }

        return res.send({ isValid: true });
    } catch (error) {
        console.error('Error during verification:', error);
        return res.status(401).json({ error: 'Invalid signature' });
    }
}

// Function to validate SPKI format
const isValidSPKI = (key: string): boolean => {
    return key.startsWith('-----BEGIN PUBLIC KEY-----') && key.endsWith('-----END PUBLIC KEY-----');
}

// Function to clean up the PEM key
const cleanPEM = (key: string): string => {
    return key.replace(/\\n/g, '\n').replace(/\s+/g, ' ').trim();
}

export default handler;