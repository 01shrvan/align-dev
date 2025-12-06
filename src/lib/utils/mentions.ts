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
    
    if (mention === 'aligners') {
      tagMentions.push(mention);
    } else {
      userMentions.push(mention);
    }
  }

  return {
    userMentions: [...new Set(userMentions)],
    tagMentions: [...new Set(tagMentions)]
  };
}

export function linkifyMentions(text: string): string {
  return text.replace(/@([\w-]+)/g, (match, mention) => {
    if (mention.toLowerCase() === 'aligners') {
      return `<span class="inline-flex items-center gap-1 text-primary font-semibold bg-primary/10 px-1.5 py-0.5 rounded cursor-default" title="All Aligners">@aligners</span>`;
    }
    return `<a href="/users/${mention}" class="text-primary font-semibold hover:underline">@${mention}</a>`;
  });
}