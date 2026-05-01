import React from 'react';

function renderInline(line) {
  const parts = []
  let remaining = line
  let key = 0
  while (remaining) {
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/)
    if (boldMatch) {
      const idx = remaining.indexOf(boldMatch[0])
      if (idx > 0) parts.push(<span key={key++}>{remaining.slice(0, idx)}</span>)
      parts.push(<strong key={key++} className="font-semibold text-primary">{boldMatch[1]}</strong>)
      remaining = remaining.slice(idx + boldMatch[0].length)
    } else {
      parts.push(<span key={key++}>{remaining}</span>)
      remaining = ''
    }
  }
  return parts
}

export function renderMarkdown(text) {
  if (!text) return null
  const lines = text.split('\n')
  const elements = []
  
  // Track lists: 'ul' or 'ol'
  let listItems = []
  let currentListType = null

  const flushList = () => {
    if (listItems.length > 0) {
      if (currentListType === 'ol') {
        elements.push(
          <ol key={`ol-${elements.length}`} className="list-decimal list-outside space-y-2 mb-6 ml-6 text-base-content/80 marker:text-primary marker:font-bold">
            {listItems.map((li, i) => <li key={i} className="pl-1 leading-relaxed">{renderInline(li)}</li>)}
          </ol>
        )
      } else {
        elements.push(
          <ul key={`ul-${elements.length}`} className="list-disc list-outside space-y-2 mb-6 ml-6 text-base-content/80 marker:text-primary">
            {listItems.map((li, i) => <li key={i} className="pl-1 leading-relaxed">{renderInline(li)}</li>)}
          </ul>
        )
      }
      listItems = []
      currentListType = null
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line.startsWith('### ')) {
      flushList()
      elements.push(<h5 key={i} className="text-lg font-bold mt-6 mb-3 text-base-content tracking-wide">{renderInline(line.slice(4))}</h5>)
    } else if (line.startsWith('## ')) {
      flushList()
      elements.push(<h4 key={i} className="text-xl font-bold mt-8 mb-4 text-primary tracking-wide border-b border-white/10 pb-2">{renderInline(line.slice(3))}</h4>)
    } else if (line.startsWith('# ')) {
      flushList()
      elements.push(<h3 key={i} className="text-2xl font-black mt-10 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">{renderInline(line.slice(2))}</h3>)
    } else if (line.match(/^[-*]\s/)) {
      if (currentListType === 'ol') flushList()
      currentListType = 'ul'
      listItems.push(line.replace(/^[-*]\s/, ''))
    } else if (line.match(/^\d+\.\s/)) {
      if (currentListType === 'ul') flushList()
      currentListType = 'ol'
      listItems.push(line.replace(/^\d+\.\s/, ''))
    } else if (line.trim() === '') {
      flushList()
    } else {
      flushList()
      elements.push(<p key={i} className="mb-4 leading-relaxed text-base-content/80 text-justify">{renderInline(line)}</p>)
    }
  }
  flushList()
  return <div className="markdown-body space-y-4">{elements}</div>
}
