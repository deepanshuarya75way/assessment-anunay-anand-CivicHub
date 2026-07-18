export class ContentParser {
  static parseMentions(text: string): string[] {
    const mentionRegex = /@([a-zA-Z0-9_]+)/g;
    const mentions = new Set<string>();
    let match;
    while ((match = mentionRegex.exec(text)) !== null) {
      mentions.add(match[1]);
    }
    return Array.from(mentions);
  }

  static parseHashtags(text: string): string[] {
    const hashtagRegex = /#([a-zA-Z0-9_]+)/g;
    const hashtags = new Set<string>();
    let match;
    while ((match = hashtagRegex.exec(text)) !== null) {
      hashtags.add(match[1].toLowerCase());
    }
    return Array.from(hashtags);
  }

  static extractUrls(text: string): string[] {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = new Set<string>();
    let match;
    while ((match = urlRegex.exec(text)) !== null) {
      urls.add(match[1]);
    }
    return Array.from(urls);
  }
}
