import React, { FC } from 'react'

import styles from './ConfigListButtons.module.css'

import TrashIcon from './trash.svg'
import {
  BackgroundResponseMessage,
  LocalStorageConfigKey,
  MessageType
} from '@msw-devtools/core'
import { clsx } from 'clsx'

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

  return (
    <div className={styles.wrapper}>
      {Object.entries(list).map(([name, { key }], index) => (
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
