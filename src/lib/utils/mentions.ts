export function extractMentions(text: string): {
  userMentions: string[];
  tagMentions: string[];
} {
  const mentionRegex = /@([\w-]+)/g;
  const matches = text.matchAll(mentionRegex);

  const userMentions: string[] = [];
  const tagMentions: string[] = [];

  for (const match of matches) {
    const mention = match[1].toLowerCase();

    if (mention === "aligners") {
      tagMentions.push(mention);
    } else {
      userMentions.push(mention);
    }
  }

  return {
    userMentions: [...new Set(userMentions)],
    tagMentions: [...new Set(tagMentions)],
  };
}
