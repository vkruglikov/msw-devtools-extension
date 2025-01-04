import React, { ButtonHTMLAttributes, FC } from 'react'

import styles from './LinkButton.module.css'

export const LinkButton: FC<ButtonHTMLAttributes<HTMLButtonElement>> = (
  props
) => {
  return <button {...props} className={styles.wrapper} />
}
