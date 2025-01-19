import { SolanaAgentKit } from "../../solana-agent-kit/agent"


const sign = () => {
  const agent = new SolanaAgentKit("","https://api.mainnet-beta.solana.com",{OPENAI_API_KEY: process.env.OPENAI_API_KEY})
  agent.onSignTransaction = async (transaction) => {
    console.log(transaction)
    return transaction; // returning the transaction as a string
  }
}