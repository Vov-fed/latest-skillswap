import cn from 'classnames'
import React from 'react'
import css from './index.module.scss'

export const Button = ({ disabled, children, loading = false, color = 'green', onClick = () => {}}: { disabled?:boolean; children: React.ReactNode; loading?: boolean; color?: string, onClick?: () => void}) => {
  return (
    <button
  className={cn(css.button, css[color], { [css.disabled]: loading || disabled })}
  type="submit"
  onClick={onClick}
  disabled={disabled || loading}>
      {loading ? 'Submitting...' : children}
    </button>
  )
}