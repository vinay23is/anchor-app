const MOCK_RESPONSES = [
  "Building something while everything feels uncertain takes more courage than most people realize. You're not stuck — you're in the hardest part, and that's real. Keep going, one small thing at a time.",
  "The gap between where you are and where you want to be feels enormous right now, but you're still showing up. That's not nothing — that's actually everything. Give yourself credit for that.",
  "Nobody tells you how exhausting it is to keep trying when results aren't coming. You're carrying a lot quietly. It's okay to feel the weight of it and still move forward.",
  "Some days okayish is the honest answer, and that's enough. You don't need to perform being fine. Just being here and checking in means something.",
  "The pressure you're under is real — it's not in your head. And the fact that you're still building, still trying, still showing up says more about you than any outcome right now.",
];

export async function getAIResponse(message, mood, recentMoods) {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  const index = Math.floor(Math.random() * MOCK_RESPONSES.length);
  return MOCK_RESPONSES[index];
}
