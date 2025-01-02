import React, {
  ChangeEventHandler,
  ComponentProps,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import { validate } from '@msw-devtools/json-config'

import packageJson from '../../package.json'

import { getStatus, saveTo } from './utils'

import { Alert } from './Alert/Alert'
import { Button } from './Button/Button'
import { Status } from './Status/Status'
import { DocsLink } from './DocsLink'

import styles from './App.module.css'

export const App = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [host, setHost] = useState<string>()

  const [handleStatus, setHandleStatus] =
    useState<ComponentProps<typeof Status>['type']>('pending')
  const [configStatus, setConfigStatus] =
    useState<ComponentProps<typeof Status>['type']>('pending')
  const [verificationStatus, setVerificationStatus] =
    useState<ComponentProps<typeof Status>['type']>('pending')
  const inputRef = useRef<HTMLInputElement>(null)

  const fetchStatuses = useCallback(async () => {
    setHandleStatus('pending')
    setConfigStatus('pending')
    setVerificationStatus('pending')
    setHost(undefined)

    const statuses = await getStatus()

    setHandleStatus(statuses.hasHandle ? 'success' : 'error')
    setConfigStatus(statuses.hasConfig ? 'success' : 'error')
    setVerificationStatus(statuses.configIsValid ? 'success' : 'error')
    setHost(statuses.host)
  }, [])

  useEffect(() => {
    fetchStatuses()
  }, [fetchStatuses])

  const handleLoadFiles: ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    inputRef.current!.value = ''

    setIsLoading(true)
    setVerificationStatus('pending')

    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        const jsonData = JSON.parse(event.target?.result as string)
        const jsonConfig = validate(jsonData)
        await saveTo(jsonConfig)
        setConfigStatus('success')
        setVerificationStatus('success')
      } catch (e) {
        setVerificationStatus('error')
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>{host}</div>
      <Alert>
        <Status type={handleStatus}>
          {(() => {
            switch (handleStatus) {
              case 'success':
                return <>Handler has been detected</>
              default:
                return (
                  <>
                    Handler has not been detected, please follow the{' '}
                    <DocsLink>getting started guide</DocsLink>
                  </>
                )
            }
          })()}
        </Status>
        <Status type={configStatus}>
          {(() => {
            switch (configStatus) {
              case 'success':
                return <>JSON config has been detected</>
              default:
                return <>Upload JSON file with mocks</>
            }
          })()}
        </Status>
        {verificationStatus !== 'pending' && (
          <Status type={verificationStatus}>
            {(() => {
              switch (verificationStatus) {
                case 'success':
                  return <>JSON config is valid</>
                default:
                  return <>Invalid JSON, please check the format</>
              }
            })()}
          </Status>
        )}
      </Alert>
      <input
        className={styles.fileInput}
        type="file"
        ref={inputRef}
        onChange={handleLoadFiles}
        accept=".json"
      />
      <Button disabled={isLoading} onClick={() => inputRef.current!.click()}>
        {isLoading ? 'Saving...' : 'Upload json file'}
      </Button>
      <div className={styles.footer}>
        For more details, visit <DocsLink>Github</DocsLink> (v
        {packageJson.version})
      </div>
    </div>
  )
}
