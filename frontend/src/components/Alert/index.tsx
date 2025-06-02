import cn from 'classnames'
import React from 'react'
import css from './index.module.scss'

export const Alert = ({ color, children }: { color: 'red' | 'green' | 'blue'; children: React.ReactNode }) => {
  return (
    <div className={css.alertWrapper}>
      <div
        className={cn({
          [css.alert]: true,
          [css[color]]: true,
        })}
      >
        {children}
      </div>
    </div>
  )
}
