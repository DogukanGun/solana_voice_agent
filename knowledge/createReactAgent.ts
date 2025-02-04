
import { createAgent, LLMConfig } from '@/pages/api/bot/agentHelpers';
import { GetAgentByContractAddressTool } from './tools/getAgentByContractAddressTool';
import { GetAgentByTwitterUsernameTool } from './tools/getAgentByTwitterUsernameTool';
import { GetAgentsPagedTool } from './tools/getAgentsPagedTool';
import { SearchTweetsTool } from './tools/searchTweetsTool';

export function createKnowledgeReactAgent(agentName: LLMConfig, messageModifier: string) {
    return createAgent(agentName, [
        new GetAgentByTwitterUsernameTool(),
        new GetAgentsPagedTool(),
        new SearchTweetsTool(),
        new GetAgentByContractAddressTool(),
    ], messageModifier);
} 