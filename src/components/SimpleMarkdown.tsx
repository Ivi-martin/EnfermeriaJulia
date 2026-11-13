import React from 'react';

interface SimpleMarkdownProps {
  content: string;
  className?: string;
}

function renderInlineFormatting(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={idx} className="font-extrabold text-stone-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code key={idx} className="px-1.5 py-0.5 rounded bg-stone-100 text-emerald-900 font-mono text-[11px]">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return (
        <em key={idx} className="italic">
          {part.slice(1, -1)}
        </em>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

export const SimpleMarkdown: React.FC<SimpleMarkdownProps> = ({ content, className = '' }) => {
  if (!content || !content.trim()) {
    return <p className="text-xs text-stone-400 italic">Sin contenido de texto todavía.</p>;
  }

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];
  let orderedItems: string[] = [];

  const flushLists = (keyPrefix: string) => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`${keyPrefix}-ul`} className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-stone-700 leading-relaxed">
          {listItems.map((item, i) => (
            <li key={i}>{renderInlineFormatting(item)}</li>
          ))}
        </ul>
      );
      listItems = [];
    }
    if (orderedItems.length > 0) {
      elements.push(
        <ol key={`${keyPrefix}-ol`} className="list-decimal pl-5 space-y-1 text-xs sm:text-sm text-stone-700 leading-relaxed">
          {orderedItems.map((item, i) => (
            <li key={i}>{renderInlineFormatting(item)}</li>
          ))}
        </ol>
      );
      orderedItems = [];
    }
  };

  lines.forEach((rawLine, index) => {
    const line = rawLine.trimEnd();
    const trimmed = line.trim();

    if (!trimmed) {
      flushLists(`line-${index}`);
      return;
    }

    if (trimmed === '---' || trimmed === '***') {
      flushLists(`hr-${index}`);
      elements.push(<hr key={`hr-${index}`} className="border-stone-200 my-3" />);
      return;
    }

    if (trimmed.startsWith('### ')) {
      flushLists(`h3-${index}`);
      elements.push(
        <h4 key={`h3-${index}`} className="text-sm sm:text-base font-extrabold text-[#1e3b2b] pt-2">
          {renderInlineFormatting(trimmed.slice(4))}
        </h4>
      );
      return;
    }

    if (trimmed.startsWith('## ')) {
      flushLists(`h2-${index}`);
      elements.push(
        <h3 key={`h2-${index}`} className="text-base sm:text-lg font-black text-stone-900 pt-3 border-b border-stone-100 pb-1">
          {renderInlineFormatting(trimmed.slice(3))}
        </h3>
      );
      return;
    }

    if (trimmed.startsWith('# ')) {
      flushLists(`h1-${index}`);
      elements.push(
        <h2 key={`h1-${index}`} className="text-lg sm:text-xl font-black text-stone-900 pt-2">
          {renderInlineFormatting(trimmed.slice(2))}
        </h2>
      );
      return;
    }

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
      if (orderedItems.length > 0) flushLists(`sw-${index}`);
      listItems.push(trimmed.slice(2));
      return;
    }

    const orderedMatch = trimmed.match(/^\d+\.\s+(.*)$/);
    if (orderedMatch) {
      if (listItems.length > 0) flushLists(`sw-o-${index}`);
      orderedItems.push(orderedMatch[1]);
      return;
    }

    if (trimmed.startsWith('> ')) {
      flushLists(`bq-${index}`);
      elements.push(
        <blockquote
          key={`bq-${index}`}
          className="border-l-4 border-emerald-500 bg-emerald-50/60 px-3 py-2 rounded-r-xl text-xs sm:text-sm text-emerald-950 italic"
        >
          {renderInlineFormatting(trimmed.slice(2))}
        </blockquote>
      );
      return;
    }

    flushLists(`p-${index}`);
    elements.push(
      <p key={`p-${index}`} className="text-xs sm:text-sm text-stone-700 leading-relaxed">
        {renderInlineFormatting(trimmed)}
      </p>
    );
  });

  flushLists('end');

  return <div className={`space-y-2.5 ${className}`}>{elements}</div>;
};
