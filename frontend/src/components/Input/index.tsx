import cn from 'classnames'
import { type FormikProps } from 'formik'
import css from './index.module.scss'

export const Input = ({
  name,
  label,
  formik,
  maxWidth,
  type,
  textarea = false,
  props
}: {
  name: string
  label: string
  formik?: FormikProps<any>
  maxWidth?: number | string
  type?: 'text' | 'password' | 'email' | 'number'
  textarea?: boolean
  props?: Record<string, any>
}) => {
  const value = formik?.values[name]
  const error = formik?.errors[name] as string | undefined
  const touched = formik?.touched[name]
  const invalid = !!touched && !!error
  const disabled = formik?.isSubmitting
  const valid = !invalid && !!value

  return (
    <div className={cn({ [css.field]: true, [css.disabled]: disabled })}>
      <label className={css.label} htmlFor={name}>
        {label}
      </label>
      {
      textarea ? 
      <textarea
        className={cn({
          [css.textareaInput]: true,
          [css.input]: true,
          [css.invalid]: invalid,
          [css.valid]: valid,
        })}
        onChange={(e) => {
          void formik?.setFieldValue(name, e.target.value)
        }}
        onBlur={() => {
          void formik?.setFieldTouched(name)
        }}
        value={value}
        name={name}
        id={name}
        disabled={formik?.isSubmitting}
      />
        :
      <input className={cn({ [css.input]: true, [css.invalid]: invalid, [css.valid]: valid,})}
        style={{ maxWidth }} type={type} onChange={(e) => { void formik?.setFieldValue(name, e.target.value)}}
        onBlur={() => { void formik?.setFieldTouched(name) }} value={value} name={name} id={name} disabled={formik?.isSubmitting} {...props}/>
      }
      {invalid && <div className={css.error}>{error}</div>}
    </div>
  )
}