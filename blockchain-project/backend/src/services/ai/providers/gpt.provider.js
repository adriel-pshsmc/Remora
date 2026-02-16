import OpenAI from "openai";

export default class GPTProvider {
  constructor(apiKey) {
    this.client = new OpenAI({ apiKey });
    this.providerName = "GPT";
  }

  async generateText(prompt, options = {}) {
    const response = await this.client.chat.completions.create({
      model: options.model || "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: options.temperature || 0.7
    });

    return {
      text: response.choices[0].message.content,
      tokensUsed: response.usage.total_tokens,
      model: options.model || "gpt-4",
      provider: this.providerName
    };
  }
}
