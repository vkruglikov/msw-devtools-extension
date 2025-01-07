import { clsx } from 'clsx'
import React, { FC, PropsWithChildren, ReactNode } from 'react'

import styles from './Status.module.css'

export const Status: FC<{
  type: 'success' | 'error' | 'pending'
  children: Exclude<ReactNode, undefined>
}> = ({ type, children }) => {
  return (
    <div
      className={clsx(styles.status, {
        [styles[type]]: !!styles[type]
      })}
    >
      <div className={styles.icon} />
      <div>{children}</div>
    </div>
  )
}
