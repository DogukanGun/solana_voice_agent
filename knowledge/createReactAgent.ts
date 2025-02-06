
import { createAgent, LLMConfig } from '@/pages/api/bot/agentHelpers';
import { GetAgentByContractAddressTool } from './cookie/tools/getAgentByContractAddressTool';
import { GetAgentByTwitterUsernameTool } from './cookie/tools/getAgentByTwitterUsernameTool';
import { GetAgentsPagedTool } from './cookie/tools/getAgentsPagedTool';
import { SearchTweetsTool } from './cookie/tools/searchTweetsTool';
import { createEigenTools } from './eigenlayer/tools';
import { StructuredToolInterface } from '@langchain/core/tools';

export type agent = 'cookie' | 'eigenlayer';

export function createKnowledgeReactAgent(
    agentName: LLMConfig, 
    messageModifier: string,
    agents: agent[],
    isOnchain: boolean
) {
    let tools: StructuredToolInterface[] = [];
    if(agents.includes('eigenlayer')) {
        createEigenTools(process.env.GRAPH_API_KEY!)
        .forEach((tool)=>{
            tools.push(tool)
        })
    }
    if(agents.includes('cookie')) {
        [
            new GetAgentByTwitterUsernameTool(),
            new GetAgentsPagedTool(),
            new SearchTweetsTool(),
            new GetAgentByContractAddressTool(),
        ].forEach((tool)=>{
            tools.push(tool)
        })
    }
    return createAgent(agentName, tools, messageModifier, isOnchain);
} 