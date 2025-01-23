# Solana Onchain Bot

This application provides two interfaces for interacting with the SEND AI framework: a chat UI and a voice UI. SEND AI is a fork of the package found at [this repository](https://github.com/sendaifun/solana-agent-kit) . Modifications have been made to allow transaction signing directly within the UI. This enables the use of any embedded wallet for this purpose.

## Main changes done in SEND AI

- SolanaAgentKit now includes a callback mechanism.
    <img width="629" alt="Screenshot 2025-01-23 at 15 21 08" src="https://github.com/user-attachments/assets/ed8d88d2-4525-4e8f-afe5-b8e5b30fd2b3" />

- Private keys are no longer mandatory; public keys can also be used. When using a public key, the UI mode variable must be set to true.
    <img width="480" alt="Screenshot 2025-01-23 at 15 21 14" src="https://github.com/user-attachments/assets/dba0a627-f5dd-4da8-a161-929b26764a96" />




## DEMO VIDEO 


https://github.com/user-attachments/assets/1032b5b3-9cca-4c9f-a4a1-b445e2f74935

