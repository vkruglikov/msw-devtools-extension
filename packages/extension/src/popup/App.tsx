import React, {
  ChangeEventHandler,
  ComponentProps,
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import { validateJsonConfig, ValidationError } from '@msw-devtools/json-config'
import { LocalStorageConfigKey } from '@msw-devtools/core'

import packageJson from '../../package.json'

import { getStatus, removeConfig, saveTo, setActiveConfig } from './utils'

import { Alert } from './Alert/Alert'
import { Button } from './Button/Button'
import { Status } from './Status/Status'
import { DocsLink } from './DocsLink'
import { ConfigListButtons } from './ConfigListButtons/ConfigListButtons'

import { useCheckHandlerAvailability } from './useCheckHandlerAvailability'

import styles from './App.module.css'

export const App = () => {
  const [uploadButtonState, setUploadButtonState] = useState<{
    status: 'pending' | 'error' | 'idle'
    issues?: ValidationError['issues']
  }>({
    status: 'idle'
  })
  const [status, setStatus] = useState<Awaited<ReturnType<typeof getStatus>>>()

  const [host, setHost] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)

  const [handleStatus, setHandleStatus] =
    useState<ComponentProps<typeof Status>['type']>('pending')
  const [configStatus, setConfigStatus] =
    useState<ComponentProps<typeof Status>['type']>('pending')

  const fetchStatuses = useCallback(async () => {
    setStatus(await getStatus(host))
  }, [host])

  useCheckHandlerAvailability(status, fetchStatuses)

  useEffect(() => {
    if (!status) return

    setHandleStatus(status.hasHandle ? 'success' : 'error')
    setConfigStatus(status.hasConfig ? 'success' : 'error')
    setHost(status.host)
  }, [status])

  const handleSetActive = async (key: LocalStorageConfigKey) => {
    if (!host) return

    await setActiveConfig(host, key)
    fetchStatuses()
  }

  const handleRemoveConfig = async (key: LocalStorageConfigKey) => {
    if (!host) return

    await removeConfig(host, key)
    fetchStatuses()
  }

  const handleLoadFiles: ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    inputRef.current!.value = ''

    setUploadButtonState({
      status: 'pending'
    })

    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        const jsonData = JSON.parse(event.target?.result as string)
        const jsonConfig = validateJsonConfig(jsonData)

        if (!host) throw new Error('Host is not defined')

        await saveTo(host, jsonConfig)
        setUploadButtonState({
          status: 'idle'
        })
        fetchStatuses()
      } catch (e) {
        if (e instanceof ValidationError) {
          setUploadButtonState({
            status: 'error',
            issues: e.errors
          })
        } else {
          setUploadButtonState({
            status: 'error'
          })
        }
        console.error(e)
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
                return <>Msw handler has been detected</>
              default:
                return (
                  <>
                    Msw handler has not been detected, please follow the{' '}
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
                return <>Active JSON config has been detected</>
              default:
                return !status?.configNames.length ? (
                  <>JSON config hasn't been detected</>
                ) : (
                  <>Active JSON config hasn't been detected</>
                )
            }
          })()}
        </Status>
        <ConfigListButtons
          onRemove={handleRemoveConfig}
          onSetActive={handleSetActive}
          activeKey={status?.activeConfig}
          list={status?.configNames}
        />
      </Alert>
      <input
        className={styles.fileInput}
        type="file"
        ref={inputRef}
        onChange={handleLoadFiles}
        accept=".json"
      />
      <Button
        disabled={uploadButtonState.status === 'pending' || !host}
        onClick={() => inputRef.current!.click()}
      >
        {uploadButtonState.status === 'pending' && 'Saving...'}
        {uploadButtonState.status === 'error' && (
          <Status type="error">
            {uploadButtonState.issues?.map((err, index) => (
              <Fragment key={index}>
                {`${err.path.join('.')}:${err.message}`}
                <br />
              </Fragment>
            )) || 'Failed to upload JSON config'}
          </Status>
        )}
        {uploadButtonState.status === 'idle' && 'Upload JSON config'}
      </Button>
      <div className={styles.footer}>
        For more details, visit <DocsLink>Github</DocsLink> (v
        {packageJson.version})
      </div>
    </div>
  )
}
