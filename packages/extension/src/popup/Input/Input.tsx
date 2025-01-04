import React, { FC, InputHTMLAttributes } from 'react'

import styles from './Input.module.css'

export const Input: FC<InputHTMLAttributes<HTMLInputElement>> = (props) => {
  return <input {...props} className={styles.wrapper} />
}
