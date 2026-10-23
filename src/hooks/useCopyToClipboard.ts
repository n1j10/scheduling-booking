import { useState } from 'react';

// const { copied, copy } = useCopyToClipboard();
// copied is true for 2 seconds after copying
export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return { copied, copy };
}
