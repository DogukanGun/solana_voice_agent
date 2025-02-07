# NexWallet

## Overview

NexWallet is a cutting-edge platform that combines blockchain technology with artificial intelligence to provide a seamless and intelligent wallet management experience. It supports multiple blockchain networks and offers unique features such as AI-driven transaction signing.

## Key Features

- **Multi-Chain Support**: Solana, Base, Ethereum, Arbitrum, and more.
- **AI-Driven Interactions**: Text and voice command capabilities.
- **Unique Transaction Signing**: First platform to offer AI agent transaction signing.
- **Real-Time Data Integration**: Utilizes Cookie DataSwarm API for up-to-date blockchain data.
- **Robust Security**: Advanced authentication and security measures.

## Technical Documentation

### Architecture Overview

- **Frontend and Backend**: Built using Next.js, providing both frontend and backend functionalities.

### Agent Kits

- **SolanaAgentKit**: Facilitates interactions with the Solana blockchain.
- **CdpAgentkit**: Used for Base network interactions.

### AI Agent Configuration

- **AI Models**: Powered by OpenAI's GPT-4o, configured using the `createAgent` function.

### Database and API Integration

- **Prisma ORM**: Used for database interactions.
- **API Endpoints**: Detailed integration with external APIs for enhanced functionality.

## Codebase Insights

- **Solana Onchain Bot**: The README.md file describes the Solana Onchain Bot, which provides chat and voice interfaces for interacting with the SEND AI framework. It highlights modifications for transaction signing.
- **Base Network API**: The `pages/api/bot/base.ts` file configures the CDP AgentKit for the Base network, handling wallet data and initializing the agent for on-chain interactions.
- **Solana Network API**: The `pages/api/bot/solana.ts` file sets up the SolanaAgentKit, enabling transaction signing and interaction with the Solana blockchain.
- **Chat API**: The `pages/api/chat.ts` file handles chat interactions, determining if a message is about executing a blockchain transaction and processing it accordingly.
- **Knowledge Agent**: The `knowledge/createReactAgent.ts` file creates a knowledge-based AI agent using tools from the Cookie and Eigenlayer APIs.

For more detailed technical insights, please refer to the codebase and documentation within this repository.

## Main changes done in SEND AI

- SolanaAgentKit now includes a callback mechanism.
    <img width="629" alt="Screenshot 2025-01-23 at 15 21 08" src="https://github.com/user-attachments/assets/ed8d88d2-4525-4e8f-afe5-b8e5b30fd2b3" />

- Private keys are no longer mandatory; public keys can also be used. When using a public key, the UI mode variable must be set to true.
    <img width="480" alt="Screenshot 2025-01-23 at 15 21 14" src="https://github.com/user-attachments/assets/dba0a627-f5dd-4da8-a161-929b26764a96" />




## DEMO VIDEO 

https://www.loom.com/share/5aa7e2277b2f42fb891cb44bdf8d4a90?sid=0df78a3a-3dd9-4765-aebb-cfb3f9b1a9ce
