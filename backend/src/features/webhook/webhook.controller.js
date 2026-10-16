import { agentAssistantService } from '../agents/assistant/agentAssistant.service.js';

const handledMessageIds = new Set();

export async function verifyWebhook(req, res, next) {
  const { mode, token, challenge } = {
    mode: req.query['hub.mode'],
    token: req.query['hub.verify_token'],
    challenge: req.query['hub.challenge'],
  };

  const myVerifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

  if (mode === 'subscribe' && token === myVerifyToken) {
    console.log('WEBHOOK_VERIFIED');
    return res.status(200).send(challenge);
  } else {
    console.log('forbidden');
    return res.sendStatus(403);
  }
}

export async function receiveWebhook(req, res, next) {
  const message = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

  if (!message || message.type !== 'text' || !message.text?.body) {
    return res.sendStatus(200);
  }

  const from = message?.from;
  const text = message?.type === 'text' ? message.text?.body : undefined;

  if (handledMessageIds.has(message.id)) {
    return res.sendStatus(200);
  }

  handledMessageIds.add(message.id);

  res.sendStatus(200);
  try {
    const service = await agentAssistantService();
    const answer = await service.agentService(from, text);

    await service.fetchResponseToUser(from, answer);
  } catch (error) {
    console.dir(error.errInfo, { depth: null });
    console.error(error);
  }
}
