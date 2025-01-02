import React, { FC, PropsWithChildren } from 'react'

import styles from './Alert.module.css'

export const Alert: FC<PropsWithChildren> = (props) => {
  return <div className={styles.wrapper} {...props} />
}
