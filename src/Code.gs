function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Excel Engineering Assistant');
}

/**
 * Public-safe server-side request handler.
 * Sensitive prompt architecture and secret values are stored outside this file.
 */
function runBuild(request) {
  const req = request && typeof request === 'object' ? request : {};

  const accessKey = String(req.accessKey == null ? '' : req.accessKey).trim();
  const userText = String(req.userText == null ? '' : req.userText).trim();
  const sessionId = String(req.sessionId == null ? '' : req.sessionId).trim();

  if (!accessKey) throw new Error('Missing Access Key.');
  if (!userText) throw new Error('Missing request.');

  const props = PropertiesService.getScriptProperties();

  const allowedKeys = JSON.parse(
    props.getProperty('PUBLIC_SAFE_ACCESS_KEYS_JSON') || '{}'
  );

  const isValid = Object.values(allowedKeys).includes(accessKey);
  if (!isValid) throw new Error('Invalid Access Key.');

  const MAX_INPUT_CHARS = 4000;
  if (userText.length > MAX_INPUT_CHARS) {
    throw new Error('Request too long. Please shorten it and try again.');
  }

  if (!sessionId || sessionId.length > 80 || !/^s-[a-z0-9-]+$/i.test(sessionId)) {
    throw new Error('Invalid session.');
  }

  const cache = CacheService.getScriptCache();

  const rateKey = 'rate_' + accessKey;
  const current = Number(cache.get(rateKey) || '0');
  const MAX_REQ_PER_MIN = 6;

  if (current >= MAX_REQ_PER_MIN) {
    throw new Error('Rate limit exceeded. Please wait one minute and try again.');
  }

  cache.put(rateKey, String(current + 1), 60);

  const apiKey = props.getProperty('AI_SERVICE_API_KEY');
  if (!apiKey) {
    throw new Error('Server misconfigured: missing API key.');
  }

  const protectedSystemInstructions = props.getProperty('PROTECTED_SYSTEM_INSTRUCTIONS');
  if (!protectedSystemInstructions || !String(protectedSystemInstructions).trim()) {
    throw new Error('Server misconfigured: missing protected instructions.');
  }

  const sessionKey = 'chat_' + accessKey + '_' + sessionId;
  const cachedHistoryRaw = cache.get(sessionKey);

  let storedHistory = [];

  if (cachedHistoryRaw) {
    try {
      const parsed = JSON.parse(cachedHistoryRaw);
      if (Array.isArray(parsed)) storedHistory = parsed;
    } catch (e) {
      storedHistory = [];
    }
  }

  const MAX_HISTORY_ITEMS = 10;
  const MAX_HISTORY_CHARS_PER_ITEM = 1500;

  const historyMessages = storedHistory
    .slice(-MAX_HISTORY_ITEMS)
    .map(function (msg) {
      return {
        role: msg && msg.role === 'assistant' ? 'assistant' : 'user',
        content: String(msg && msg.content ? msg.content : '')
          .trim()
          .slice(0, MAX_HISTORY_CHARS_PER_ITEM)
      };
    })
    .filter(function (msg) {
      return msg.content;
    });

  historyMessages.push({
    role: 'user',
    content: userText.slice(0, MAX_HISTORY_CHARS_PER_ITEM)
  });

  const payload = {
    model: 'gpt-4.1',
    messages: [
      { role: 'system', content: protectedSystemInstructions },
      ...historyMessages
    ],
    temperature: 0.2,
    max_completion_tokens: 700
  };

  const response = UrlFetchApp.fetch('https://api.openai.com/v1/chat/completions', {
    method: 'post',
    contentType: 'application/json',
    headers: {
      Authorization: 'Bearer ' + apiKey
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });

  const status = response.getResponseCode();
  const body = response.getContentText();

  if (status < 200 || status >= 300) {
    console.error('AI service error', status, body);

    if (status === 401) throw new Error('Service configuration error.');
    if (status === 429) throw new Error('Service is busy or quota-limited.');
    if (status >= 500) throw new Error('Service temporarily unavailable.');

    throw new Error('Request failed. Please retry.');
  }

  const data = JSON.parse(body);
  const message =
    data &&
    data.choices &&
    data.choices[0] &&
    data.choices[0].message &&
    data.choices[0].message.content;

  if (!message) return 'No response content.';

  const updatedHistory = [
    ...historyMessages,
    {
      role: 'assistant',
      content: String(message).slice(0, MAX_HISTORY_CHARS_PER_ITEM)
    }
  ].slice(-MAX_HISTORY_ITEMS);

  cache.put(sessionKey, JSON.stringify(updatedHistory), 21600);

  const MAX_OUTPUT_CHARS = 12000;

  if (message.length > MAX_OUTPUT_CHARS) {
    return (
      message.slice(0, MAX_OUTPUT_CHARS) +
      '\n\n[OUTPUT TRUNCATED — response exceeded the size limit.]'
    );
  }

  return message;
}
