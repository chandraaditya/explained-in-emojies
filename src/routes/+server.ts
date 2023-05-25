import { OPEN_AI_ORG } from '$env/static/private';
import { OPEN_AI_API_KEY } from '$env/static/private';

import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

import { ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from 'openai';
const configuration = new Configuration({
  apiKey: OPEN_AI_API_KEY,
  organization: OPEN_AI_ORG
});
const openai = new OpenAIApi(configuration);

export const POST = (async ({ request }) => {
  const rj = await request.json();
  const messages = rj['message'];

  try {
    const response = await getOpenAIResponse(messages);
    return Promise.resolve(json({ message: response }));
  } catch (e) {
    return Promise.reject({ error: 'error' });
  }
}) satisfies RequestHandler;

async function getOpenAIResponse(message: string): Promise<string> {
  const mToSend = message + '. Remember, you can only use emojis no other characters.';
  console.log(mToSend)
  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {role: ChatCompletionRequestMessageRoleEnum.System, content: 'Your job is to explain the topic the best you can ONLY using emojis. Explain everything clearly and use as many emojis as required. Do not include any other text.' },
        {role: ChatCompletionRequestMessageRoleEnum.User, content: mToSend}
      ]
    });
    if (completion.data.choices.length == 0) {
      return Promise.reject('No response.');
    }
    if (completion.data.choices[0].message == null) {
      return Promise.reject('No response.');
    }
    return Promise.resolve(completion.data.choices[0].message.content);
  } catch (e) {
    return Promise.reject('Error.');
  }
}