from langchain_community.chat_models import ChatOllama


class OllamaLLM:
    def __init__(self):
        self.llm = ChatOllama(
            model="mistral",
            temperature=0.9  # 🔥 HIGHER = MORE VARIATION
        )

    def invoke(self, prompt: str):
        try:
            # 🔥 STRONG SYSTEM INSTRUCTION
            full_prompt = f"""
You are an expert startup analyst.

IMPORTANT RULES:
- Every response MUST be different for different startup ideas
- Use real-world reasoning
- Avoid generic statements
- Use competitor names if provided
- Use realistic numbers and examples
- Think like an investor or consultant

Now analyze:

{prompt}
"""

            response = self.llm.invoke(full_prompt)

            # ✅ FIX: convert AIMessage → string
            if hasattr(response, "content"):
                return response.content

            return str(response)

        except Exception as e:
            print("LLM Error:", e)
            return "Error generating response"


def get_llm():
    return OllamaLLM()
