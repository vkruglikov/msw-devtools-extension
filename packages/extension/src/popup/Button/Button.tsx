import React, { ButtonHTMLAttributes, FC } from 'react'

import styles from './Button.module.css'

export const Button: FC<ButtonHTMLAttributes<HTMLButtonElement>> = (props) => {
  return <button {...props} className={styles.wrapper} />
}
