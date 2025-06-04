import cn from 'classnames'
import type { FormikProps } from 'formik'
import { useState, useRef, useEffect } from 'react'
import css from './index.module.scss'

export const Select = ({
  name,
  label,
  options,
  formik,
}: {
  name: string
  label: string
  formik: FormikProps<any>
  options: string[]
}) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const value = formik.values[name]
  const error = formik.errors[name] as string | undefined
  const touched = formik.touched[name]
  const invalid = !!touched && !!error
  const disabled = formik.isSubmitting
  const valid = !invalid && !!value

  const selectedLabel = value ? value[0].toUpperCase() + value.slice(1) : 'Select an option'

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (option: string) => {
    formik.setFieldValue(name, option)
    setOpen(false)
  }

  return (
    <div className={css.selectWrapper} ref={ref}>
      <label htmlFor={name} className={css.label}>
        {label}
      </label>
      <div className={cn(css.selectBox, { [css.open]: open, [css.invalid]: invalid, [css.valid]: valid })}>
        <button type="button" className={css.selected} onClick={() => setOpen(!open)} disabled={disabled}>
          {selectedLabel}
          <span className={cn(css.arrow, { [css.arrowOpen]: open })} />
        </button>
        {open && (
          <div className={css.options}>
            {options.map((option) => (
              <div
                key={option}
                className={cn(css.option, { [css.active]: value === option })}
                onClick={() => handleSelect(option)}
              >
                {option[0].toUpperCase() + option.slice(1)}
              </div>
            ))}
          </div>
        )}
      </div>
      {invalid && <div className={css.error}>{error}</div>}
    </div>
  )
}
