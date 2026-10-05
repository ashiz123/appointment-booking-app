import { agentAssistantService } from './assistant/agentAssistant.service.js';

export const requestToAgent = async (req, res, next) => {
  try {
    const { prompt } = req.body;
    const service = await agentAssistantService();
    const data = await service.agentService(prompt);
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
};
