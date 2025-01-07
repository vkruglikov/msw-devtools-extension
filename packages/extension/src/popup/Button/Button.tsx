import { clsx } from 'clsx'
import React, { ButtonHTMLAttributes, FC } from 'react'

import styles from './Button.module.css'

export const Button: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  className,
  ...props
}) => {
  return <button {...props} className={clsx(styles.wrapper, className)} />
}
