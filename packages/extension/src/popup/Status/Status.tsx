import React, { FC, PropsWithChildren } from 'react'
import { clsx } from 'clsx'

import styles from './Status.module.css'

export const Status: FC<
  PropsWithChildren<{
    type: 'success' | 'error' | 'pending'
  }>
> = ({ type, children }) => {
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
