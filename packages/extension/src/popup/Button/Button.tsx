import React, { ButtonHTMLAttributes, FC } from 'react'

import styles from './Button.module.css'
import { clsx } from 'clsx'

export const Button: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  className,
  ...props
}) => {
  return <button {...props} className={clsx(styles.wrapper, className)} />
}
