import React, { useState } from 'react'

import { Button } from '@msw-devtools/extension/src/popup/Button/Button'

import { JsonEditor } from './components/JsonEditor/JsonEditor'

import exampleConfig from '@msw-devtools/json-config/src/example.json'

import { Status } from '@msw-devtools/extension/src/popup/Status/Status'
import { Alert } from '@msw-devtools/extension/src/popup/Alert/Alert'
import { Input } from '@msw-devtools/extension/src/popup/Input/Input'

import MswLogo from '../../../media/msw-logo.svg'
import ExtensionScreenStatuses from '../../../media/extension/statuses.png'
import ExtensionScreenConfigs from '../../../media/extension/multi-configs.png'

import styles from './App.module.css'
import { JsonConfig } from '@msw-devtools/json-config'

export const App = () => {
  const [json, setJson] = useState<JsonConfig>(exampleConfig as JsonConfig)
  const [requestInput, setRequestInput] = useState<string>('/profile')
  const [response, setResponse] = useState<{
    status: number
    body: any
    headers?: Record<string, string>
  } | null>(null)

  const handleClickAddPath = () => {
    setJson((json) => {
      return {
        ...json,
        handlers: {
          ...json.handlers,
          [`/request-${new Date().getTime()}`]: {
            method: 'GET',
            body: {},
            init: {
              headers: {
                ['Content-Type']: 'application/json'
              }
            }
          }
        }
      }
    })
  }

  const handleDownload = () => {
    if (!json) {
      return
    }

    const jsonString = JSON.stringify(json, null, 2)

    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = 'msw-json-config.json'
    link.click()

    URL.revokeObjectURL(url)
  }

  return (
    <div className={styles.wrapper}>
      <center>
        <a
          target="_blank"
          style={{
            all: 'unset',
            cursor: 'pointer'
          }}
          href="https://github.com/vkruglikov/msw-devtools-extension?tab=readme-ov-file#get-started-"
        >
          <MswLogo />
        </a>
        <h1>MSW Devtools Extension</h1>
      </center>
      <h2>
        1. If you haven't installed MSW, please follow the{' '}
        <a
          target="_blank"
          href="https://github.com/vkruglikov/msw-devtools-extension?tab=readme-ov-file#get-started-"
        >
          getting started guide
        </a>
      </h2>
      <p>
        You need to install MSW, initialize mswjs/browser with a service worker,
        and install the @msw-devtools/connect package.
      </p>
      <h2>
        2. Install MSW Devtools Chrome extension following the{' '}
        <a
          target="_blank"
          href="https://github.com/vkruglikov/msw-devtools-extension?tab=readme-ov-file#install-chrome-extension"
        >
          getting started guide
        </a>
      </h2>
      <p>
        Install the MSW Devtools Extension from the Chrome Web Store or directly
        in your browser by downloading the extension build from the repository.
      </p>
      <h2>3. Create your MSW Json configuration based on an example</h2>
      <div className={styles.controlButtons}>
        <Button className={styles.controlButton} onClick={handleClickAddPath}>
          Add handler
        </Button>
      </div>
      <JsonEditor collapse={2} value={json} onChange={setJson} editMode />
      <Button onClick={handleDownload}>Download</Button>
      <h2>4. Upload MSW JSON config to the extension</h2>
      <p>
        You can upload multiple configurations for one host and switch between
        them without refreshing the tab.
      </p>
      <div>
        <img width={300} src={ExtensionScreenStatuses} />
        <img width={300} src={ExtensionScreenConfigs} />
      </div>
      <h2>5. Try to handle a request</h2>
      <p>
        If everything is set up correctly, the request will be handled through
        MSW using the uploaded JSON config.
      </p>
      <Input
        value={requestInput}
        onChange={(e) => setRequestInput(e.currentTarget.value)}
        type="text"
      />
      <Button
        onClick={async () => {
          try {
            const response = await fetch(requestInput)
            const text = await response.text()

            try {
              setResponse({
                status: response.status,
                headers: Object.fromEntries(response.headers),
                body: JSON.parse(text)
              })
            } catch (e) {
              setResponse({
                status: response.status,
                headers: Object.fromEntries(response.headers),
                body: text
              })
            }
          } catch (e) {
            setResponse({
              status: 500,
              body: e?.toString() || 'Unknown error'
            })
          }
        }}
      >
        Request
      </Button>
      <Status
        type={
          response?.status && response.status >= 200 && response.status < 300
            ? 'success'
            : 'error'
        }
      >
        {response?.status ? `Status: ${response.status}` : 'No request yet'}
      </Status>
      {response?.headers && (
        <Alert>
          {Object.entries(response.headers).map(([key, value]) => (
            <div key={key}>
              {key}: {value}
            </div>
          ))}
        </Alert>
      )}
      <JsonEditor value={response?.body} />
    </div>
  )
}
