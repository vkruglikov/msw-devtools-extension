import React, { FC, PropsWithChildren } from 'react'

export const DocsLink: FC<PropsWithChildren> = ({ children }) => {
  return (
    <a
      className="text-primary"
      onClick={(e) => {
        if (chrome.tabs) {
          e.preventDefault()
          chrome.tabs.create({
            url: e.currentTarget.getAttribute('href')!
          })
        }
      }}
      target="_blank"
      referrerPolicy="no-referrer"
      href="https://github.com/vkruglikov/msw-devtools-extension"
    >
      {children}
    </a>
  )
}
