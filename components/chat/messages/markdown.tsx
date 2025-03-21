import { cn } from "@/lib/utils"
import Link from 'next/link'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { CodeBlock } from "./code-block"

const components: Partial<Components> = {
  pre: ({ children }) => <>{children}</>,
  code: ({ node, className, children, ...rest }) => {
    const match = /language-(\w+)/.exec(className || '')
    if (match) {
      const code = String(children).replace(/\n$/, '')
      return <CodeBlock code={code} language={match[1]} />
    }
    return (
      <code {...rest} className={cn(className, "text-xs bg-inline-code text-inline-code-foreground rounded-md px-[3px] py-[2px] w-fit")}>
        {children}
      </code>
    )
  },
  ol: ({ node, children, ...props }) => {
    return (
      <ol className="list-decimal list-outside mx-4 text-sm my-1 p-1" {...props}>
        {children}
      </ol>
    )
  },
  li: ({ node, children, ...props }) => {
    return (
      <li className="mx-2 my-3" {...props}>
        {children}
      </li>
    )
  },
  ul: ({ node, children, ...props }) => {
    return (
      <ul className="list-decimal list-outside mx-4 text-sm my-1 p-1" {...props}>
        {children}
      </ul>
    )
  },
  strong: ({ node, children, ...props }) => {
    return (
      <span className="font-semibold" {...props}>
        {children}
      </span>
    )
  },
  a: ({ node, children, ...props }) => {
    return (
      // @ts-expect-error
      <Link
        className="text-blue-500 hover:underline"
        target="_blank"
        rel="noreferrer"
        {...props}
      >
        {children}
      </Link>
    )
  },
  h1: ({ node, children, ...props }) => {
    return (
      <h1 className="text-3xl font-semibold mt-5 mb-2" {...props}>
        {children}
      </h1>
    )
  },
  h2: ({ node, children, ...props }) => {
    return (
      <h2 className="text-2xl font-semibold mt-5 mb-2" {...props}>
        {children}
      </h2>
    )
  },
  h3: ({ node, children, ...props }) => {
    return (
      <h3 className="text-xl font-semibold mt-4 mb-2" {...props}>
        {children}
      </h3>
    )
  },
  h4: ({ node, children, ...props }) => {
    return (
      <h4 className="text-lg font-semibold mt-4 mb-2" {...props}>
        {children}
      </h4>
    )
  },
  h5: ({ node, children, ...props }) => {
    return (
      <h5 className="text-base font-semibold mt-3 mb-2" {...props}>
        {children}
      </h5>
    )
  },
  h6: ({ node, children, ...props }) => {
    return (
      <h6 className="text-sm font-semibold mt-3 mb-3" {...props}>
        {children}
      </h6>
    )
  },
  p: ({ node, children, ...props }) => {
    return (
      <h6 className="text-sm" {...props}>
        {children}
      </h6>
    )
  },
}

const remarkPlugins = [remarkGfm]
export const Markdown = ({ children }: { children: string }) => {
  return (
    <ReactMarkdown remarkPlugins={remarkPlugins} components={components}>
      {children}
    </ReactMarkdown>
  )
}

Markdown.displayName = "Markdown"