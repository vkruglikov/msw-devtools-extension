import React, { FC } from 'react'
import { clsx } from 'clsx'

import {
  BackgroundResponseMessage,
  LocalStorageConfigKey,
  MessageType
} from '@msw-devtools/core'

import TrashIcon from './trash.svg'

import styles from './ConfigListButtons.module.css'

export const ConfigListButtons: FC<{
  list?: Extract<
    BackgroundResponseMessage,
    { type: MessageType.Status; payload: any }
  >['payload']['configNames']
  activeKey?: LocalStorageConfigKey
  onRemove: (key: LocalStorageConfigKey) => void
  onSetActive: (key: LocalStorageConfigKey) => void
}> = ({ list, onSetActive, activeKey, onRemove }) => {
  if (!list) return

  const listEntries = Object.entries(list)
  if (!listEntries.length) return

  return (
    <div className={styles.wrapper}>
      {listEntries.map(([name, { key }], index) => (
        <div
          className={clsx(styles.item, {
            [styles.active]: key === activeKey
          })}
          key={key}
        >
          <button
            onClick={() => onSetActive(key)}
            title="Click to chose"
            className={styles.button}
          >
            {name}
          </button>
          <button
            onClick={() => onRemove(key)}
            title="Click to remove"
            className={styles.button}
          >
            <TrashIcon />
          </button>
        </div>
      ))}
    </div>
  )
}
