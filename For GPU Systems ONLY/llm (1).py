from langchain_community.chat_models import ChatOllama
import json
import re


class OllamaLLM:
    def __init__(self):
        self.llm = ChatOllama(
            model="llama3",
            temperature=0.7
        )

    def _extract_json(self, text: str):
        try:
            text = re.sub(r"```json|```", "", text)
            start = text.find("{")
            end = text.rfind("}") + 1
            if start == -1 or end == 0:
                return None
            json_str = text[start:end]
            return json.loads(json_str)
        except Exception as e:
            print("JSON Parse Error:", e)
            return None

    def invoke(self, prompt: str):
        try:
            full_prompt = f"""You are an expert startup analyst and investor pitch writer.

You MUST return your response in exactly two parts:

PART 1 — A valid JSON object with this exact structure (fill every field with real, detailed content):
{{
  "market": {{
    "summary": "2-3 sentences about the market opportunity",
    "size": "specific market size with numbers",
    "growth_rate": "CAGR and growth projections"
  }},
  "customer_segments": [
    {{
      "name": "Segment name",
      "description": "2-3 sentences describing this customer segment"
    }},
    {{
      "name": "Segment name",
      "description": "2-3 sentences describing this customer segment"
    }}
  ],
  "buying_behavior": "2-3 sentences about how customers make purchasing decisions",
  "market_trends": [
    "Detailed trend 1 with context",
    "Detailed trend 2 with context",
    "Detailed trend 3 with context"
  ],
  "competitive_landscape": [
    "Key competitor or dynamic 1",
    "Key competitor or dynamic 2",
    "Key competitor or dynamic 3"
  ],
  "entry_barriers": [
    "Barrier 1 with explanation",
    "Barrier 2 with explanation"
  ],
  "market_risks": [
    "Risk 1 with explanation",
    "Risk 2 with explanation",
    "Risk 3 with explanation"
  ],
  "financials": {{
    "revenue_projections": ["Year 1 projection", "Year 2 projection", "Year 3 projection"],
    "cost_structure": ["Cost item 1", "Cost item 2"],
    "roi": "Expected ROI percentage and timeline"
  }},
  "key_insights": [
    "Key insight 1",
    "Key insight 2"
  ]
}}

PART 2 — After the JSON, write exactly this separator on its own line:
### NARRATIVE ###

Then write a long, persuasive investor pitch speech in first person (We believe..., Imagine...).
- Structure: Hook → Problem → Solution → Market Opportunity → Competitive Advantage → Financials → Call to Action
- At least 6 paragraphs, professional keynote style
- Include a line: "Funding Ask: $[specific amount]"
- Use real numbers and data from the context
- Do NOT repeat any JSON in this section

Now analyze the following:
{prompt}"""

            response = self.llm.invoke(full_prompt)
            raw = response.content if hasattr(response, "content") else str(response)

            print("=== RAW LLM OUTPUT (first 300 chars) ===")
            print(raw[:300])
            print("=========================================")

            # Split on the separator
            if "### NARRATIVE ###" in raw:
                parts = raw.split("### NARRATIVE ###", 1)
                json_part = parts[0].strip()
                narrative_part = parts[1].strip()
            else:
                # Fallback: try to find JSON block, rest is narrative
                json_match = re.search(r'\{[\s\S]*\}', raw)
                if json_match:
                    json_part = json_match.group()
                    narrative_part = raw[json_match.end():].strip()
                else:
                    json_part = ""
                    narrative_part = raw.strip()

            parsed_json = self._extract_json(json_part) if json_part else None

            # If narrative is empty or too short, log it for debugging
            if not narrative_part or len(narrative_part) < 100:
                print("⚠️  WARNING: Narrative is empty or too short.")
                print("narrative_part value:", repr(narrative_part[:200]))

            return {
                "structured_data": parsed_json if parsed_json else {},
                "narrative": narrative_part if narrative_part else ""
            }

        except Exception as e:
            print("LLM Error:", e)
            return {
                "structured_data": {},
                "narrative": ""
            }


def get_llm():
    return OllamaLLM()