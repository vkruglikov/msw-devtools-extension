import {
  JsonData,
  JsonEditor as JsonEditorCore,
  githubDarkTheme
} from 'json-edit-react'
import React, { FC } from 'react'

import { ValidationError, validateJsonConfig } from '@msw-devtools/json-config'

import styles from './JsonEditor.module.css'

export const JsonEditor = <T extends JsonData>({
  editMode,
  rootName = '',
  collapse,
  value,
  onChange
}: {
  value: T
  onChange?: (value: T) => void
  editMode?: boolean
  collapse?: number
  rootName?: string
}) => {
  return (
    <JsonEditorCore
      indent={2}
      rootName={rootName}
      collapse={collapse}
      collapseAnimationTime={100}
      showCollectionCount="when-closed"
      className={styles.wrapper}
      {...(!editMode && {
        restrictEdit: true,
        restrictAdd: true,
        restrictDelete: true,
        restrictTypeSelection: true,
        restrictDrag: true
      })}
      errorMessageTimeout={3000}
      onUpdate={({ newData }) => {
        try {
          validateJsonConfig(newData)
          onChange?.(newData as T)
        } catch (e) {
          console.error(e)
          if (e instanceof ValidationError) {
            return e.errors
              .map(
                (error) =>
                  `${error.message}: ${error.path.map((path) => `[${path}]`).join('')}`
              )
              .join('\n')
          } else {
            return e?.toString() || 'Unknown error'
          }
        }
      }}
      theme={githubDarkTheme}
      data={value}
    />
  )
}
