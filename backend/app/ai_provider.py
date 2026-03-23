from abc import ABC, abstractmethod

import anthropic

from app.config import AI_MAX_TOKENS, AI_MODEL, ANTHROPIC_API_KEY


class AIProvider(ABC):
    """Abstract base for AI theme generation providers."""

    @abstractmethod
    def generate(self, system_prompt: str, user_prompt: str) -> str:
        """Send prompts to the AI and return the raw text response."""
        ...


class AnthropicProvider(AIProvider):
    """Anthropic Claude implementation of the AI provider."""

    def __init__(self) -> None:
        self.client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
        self.model = AI_MODEL
        self.max_tokens = AI_MAX_TOKENS

    def generate(self, system_prompt: str, user_prompt: str) -> str:
        response = self.client.messages.create(
            model=self.model,
            max_tokens=self.max_tokens,
            system=system_prompt,
            messages=[{"role": "user", "content": user_prompt}],
        )
        return response.content[0].text


def get_ai_provider() -> AIProvider:
    """Factory that returns the configured AI provider."""
    return AnthropicProvider()
