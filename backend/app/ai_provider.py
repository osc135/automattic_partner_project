from abc import ABC, abstractmethod

import anthropic
import google.generativeai as genai
import openai

from app.config import (
    AI_MAX_TOKENS,
    AI_MODEL,
    ANTHROPIC_API_KEY,
    COLOR_GENERATION_MODEL,
    GEMINI_API_KEY,
    OPENAI_API_KEY,
)


class AIProvider(ABC):
    """Abstract base for AI theme generation providers."""

    @abstractmethod
    def generate(self, system_prompt: str, user_prompt: str) -> str:
        """Send prompts to the AI and return the raw text response."""
        ...


class GeminiProvider(AIProvider):
    """Google Gemini implementation — main provider."""

    def __init__(self, model: str = "gemini-2.0-flash") -> None:
        genai.configure(api_key=GEMINI_API_KEY)
        self.model = genai.GenerativeModel(model)

    def generate(self, system_prompt: str, user_prompt: str) -> str:
        response = self.model.generate_content(
            f"{system_prompt}\n\n{user_prompt}"
        )
        return response.text


class AnthropicProvider(AIProvider):
    """Anthropic Claude implementation — fallback provider."""

    def __init__(self) -> None:
        self.client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
        self.model = "claude-sonnet-4-20250514"
        self.max_tokens = AI_MAX_TOKENS

    def generate(self, system_prompt: str, user_prompt: str) -> str:
        response = self.client.messages.create(
            model=self.model,
            max_tokens=self.max_tokens,
            system=system_prompt,
            messages=[{"role": "user", "content": user_prompt}],
        )
        return response.content[0].text


class OpenAIProvider(AIProvider):
    """OpenAI implementation — for cheap color extraction."""

    def __init__(self, model: str = "gpt-4o-mini") -> None:
        self.client = openai.OpenAI(api_key=OPENAI_API_KEY)
        self.model = model

    def generate(self, system_prompt: str, user_prompt: str) -> str:
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
        )
        return response.choices[0].message.content or ""


def get_ai_provider() -> AIProvider:
    """Factory that returns the main AI provider.

    Gemini by default, falls back to Anthropic.
    """
    if GEMINI_API_KEY:
        return GeminiProvider(model=AI_MODEL)
    return AnthropicProvider()


def get_color_provider() -> AIProvider:
    """Factory that returns the cheap OpenAI provider for color extraction."""
    return OpenAIProvider(model=COLOR_GENERATION_MODEL)
