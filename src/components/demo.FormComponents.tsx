import type { ComponentProps, ReactNode } from 'react'
import { useStore } from '@tanstack/react-form'
import { shallow } from '@tanstack/react-store'
import type { AnyFormApi } from '@tanstack/react-form'

import { useFieldContext, useFormContext } from '#/hooks/demo.form-context'

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ')
}

export function SubscribeButton({
  label,
  disabled,
  className,
  ...rest
}: { label: string } & Omit<ComponentProps<'button'>, 'type'>) {
  const form = useFormContext()
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <button
          type="submit"
          disabled={isSubmitting || disabled}
          className={cn(
            'px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50',
            className,
          )}
          {...rest}
        >
          {label}
        </button>
      )}
    </form.Subscribe>
  )
}

type FormValues<T> = T extends { store: { get: () => { values: infer V } } }
  ? V
  : never

type FormStoreState<T> = T extends { store: { get: () => infer S } }
  ? S
  : never

export function ShallowSubscribe<
  TForm extends AnyFormApi,
  TSelected,
>({
  form,
  selector,
  children,
}: {
  form: TForm
  selector: (state: FormStoreState<TForm> & { values: FormValues<TForm> }) => TSelected
  children: (selected: TSelected) => ReactNode
}) {
  const selected = useStore(form.store, selector as any, shallow) as TSelected
  return <>{children(selected)}</>
}

function ErrorMessages({
  errors,
}: {
  errors: Array<string | { message: string }>
}) {
  return (
    <>
      {errors.map((error) => (
        <div
          key={typeof error === 'string' ? error : error.message}
          className="text-red-500 mt-1 font-bold"
        >
          {typeof error === 'string' ? error : error.message}
        </div>
      ))}
    </>
  )
}

export function TextField({
  label,
  className,
  ...rest
}: { label: string } & Omit<
  ComponentProps<'input'>,
  'value' | 'onChange' | 'onBlur'
>) {
  const field = useFieldContext<string>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <div>
      <label htmlFor={label} className="block font-bold mb-1 text-xl">
        {label}
        <input
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          className={cn(
            'w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500',
            className,
          )}
          {...rest}
        />
      </label>
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  )
}

export function TextArea({
  label,
  rows = 3,
  className,
  ...rest
}: { label: string } & Omit<
  ComponentProps<'textarea'>,
  'value' | 'onChange' | 'onBlur'
>) {
  const field = useFieldContext<string>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <div>
      <label htmlFor={label} className="block font-bold mb-1 text-xl">
        {label}
        <textarea
          value={field.state.value}
          onBlur={field.handleBlur}
          rows={rows}
          onChange={(e) => field.handleChange(e.target.value)}
          className={cn(
            'w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500',
            className,
          )}
          {...rest}
        />
      </label>
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  )
}

export function Select({
  label,
  values,
  placeholder,
  className,
  ...rest
}: {
  label: string
  values: Array<{ label: string; value: string }>
  placeholder?: string
} & Omit<ComponentProps<'select'>, 'value' | 'onChange' | 'onBlur'>) {
  const field = useFieldContext<string>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <div>
      <label htmlFor={label} className="block font-bold mb-1 text-xl">
        {label}
      </label>
      <select
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        className={cn(
          'w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500',
          className,
        )}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {values.map((value) => (
          <option key={value.value} value={value.value}>
            {value.label}
          </option>
        ))}
      </select>
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  )
}
