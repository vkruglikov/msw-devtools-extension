import { clsx } from 'clsx'
import React, { FC } from 'react'

import { BackgroundResponseMessage, MessageType } from '@msw-devtools/core'

import PausedIcon from './pause.svg'
import PlayIcon from './play.svg'
import TrashIcon from './trash.svg'

import styles from './ConfigListButtons.module.css'

type ConfigNames = Extract<
  BackgroundResponseMessage,
  { type: MessageType.Status; payload: any }
>['payload']['configNames']

export const ConfigListButtons: FC<{
  list?: ConfigNames
  activeKey?: ConfigNames[0]['key']
  onRemove: (key: ConfigNames[0]['key']) => void
  onSetActive: (key: ConfigNames[0]['key']) => void
}> = ({ list, onSetActive, activeKey, onRemove }) => {
  if (!list?.length) return

  return (
    <div className={styles.wrapper}>
      {list.map(({ name, key, passthrough }) => {
        const isActive = key === activeKey || (passthrough && !activeKey)

        return (
          <div
            className={clsx(styles.item, {
              [styles.active]: isActive
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
              onClick={() => {
                onRemove(key)
              }}
              disabled={passthrough && !isActive}
              className={styles.button}
            >
              {passthrough ? (
                isActive ? (
                  <PlayIcon fill="#fff" width={14} height={14} />
                ) : (
                  <PausedIcon fill="#fff" width={14} height={14} />
                )
              ) : (
                <TrashIcon fill="#fff" width={14} height={14} />
              )}
            </button>
          </div>
        )
      })}
    </div>
  )
}
