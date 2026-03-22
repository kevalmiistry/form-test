import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { useAppForm } from '#/hooks/demo.form'

export const Route = createFileRoute('/demo/form/showcase')({
  component: ShowcaseForm,
})

const accountTypes = [
  { label: 'Personal', value: 'personal' },
  { label: 'Business', value: 'business' },
]

const countries = [
  { label: 'United States', value: 'US' },
  { label: 'Canada', value: 'CA' },
  { label: 'United Kingdom', value: 'UK' },
]

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').check(z.email('Invalid email')),
  accountType: z.string(),
  companyName: z.string(),
  taxId: z.string(),
  country: z.string(),
  state: z.string(),
  bio: z.string(),
  agreeToTerms: z.boolean(),
})

function ShowcaseForm() {
  const form = useAppForm({
    defaultValues: {
      name: '',
      email: '',
      accountType: '',
      companyName: '',
      taxId: '',
      country: '',
      state: '',
      bio: '',
      agreeToTerms: false,
    },
    validators: {
      onBlur: schema,
    },
    onSubmit: ({ value }) => {
      console.log(value)
      alert(JSON.stringify(value, null, 2))
    },
  })

  return (
    <div
      className="flex items-center justify-center min-h-screen p-4 text-white"
      style={{
        backgroundImage:
          'radial-gradient(50% 50% at 5% 40%, #90ee90 0%, #006400 70%, #0a1a0a 100%)',
      }}
    >
      <div className="w-full max-w-2xl p-8 rounded-xl backdrop-blur-md bg-black/50 shadow-xl border-8 border-black/10">
        <h1 className="text-2xl font-bold mb-6">Feature Showcase Form</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-6"
        >
          {/* ── 1. Passthrough props: placeholder, maxLength, disabled ── */}
          <div className="space-y-1">
            <p className="text-sm text-green-300 font-semibold uppercase tracking-wide">
              Passthrough Props Demo
            </p>
          </div>

          <form.AppField name="name">
            {(field) => (
              <field.TextField
                label="Name"
                placeholder="Enter your full name..."
                maxLength={50}
                autoComplete="name"
              />
            )}
          </form.AppField>

          <form.AppField name="email">
            {(field) => (
              <field.TextField
                label="Email"
                placeholder="you@example.com"
                className="border-green-400/50"
              />
            )}
          </form.AppField>

          {/* ── 2. Conditional rendering based on another field ── */}
          <div className="space-y-1 pt-4 border-t border-white/10">
            <p className="text-sm text-green-300 font-semibold uppercase tracking-wide">
              Conditional Fields Demo
            </p>
          </div>

          <form.AppField name="accountType">
            {(field) => (
              <field.Select
                label="Account Type"
                values={accountTypes}
                placeholder="Select account type..."
              />
            )}
          </form.AppField>

          {/* Show company fields only when accountType is "business" */}
          <form.Subscribe
            selector={(state) => state.values.accountType}
            children={(accountType) =>
              accountType === 'business' ? (
                <div className="space-y-4 pl-4 border-l-2 border-green-400/40">
                  <p className="text-xs text-green-200/70">
                    These fields appear only for Business accounts
                  </p>
                  <form.AppField name="companyName">
                    {(field) => (
                      <field.TextField
                        label="Company Name"
                        placeholder="Acme Corp"
                      />
                    )}
                  </form.AppField>
                </div>
              ): null
            }
          />

          {/* ── Multi-field conditional: Tax ID shown only when accountType=business AND country is selected ── */}
          {/* ShallowSubscribe: like form.Subscribe but with shallow comparison */}
          <form.Subscribe
            // form={form}
            selector={(state) => ({
              accountType: state.values.accountType,
              country: state.values.country,
            })}
          >
            {({ accountType, country }) =>
              accountType === 'business' &&
              country !== '' && (
                <div className="space-y-4 pl-4 border-l-2 border-yellow-400/40">
                  <p className="text-xs text-yellow-200/70">
                    Tax ID appears only when Account Type is Business AND a
                    Country is selected (currently: {country})
                  </p>
                  <form.AppField name="taxId">
                    {(field) => (
                      <field.TextField
                        label={`Tax ID (${country})`}
                        placeholder={
                          country === 'US'
                            ? 'XX-XXXXXXX'
                            : country === 'UK'
                              ? 'GB XXX XXXX XX'
                              : 'Enter tax ID'
                        }
                        maxLength={country === 'US' ? 10 : 15}
                      />
                    )}
                  </form.AppField>
                </div>
              )
            }
          </form.Subscribe>

          <form.AppField name="country">
            {(field) => (
              <field.Select
                label="Country"
                values={countries}
                placeholder="Select a country..."
              />
            )}
          </form.AppField>

          {/* Show state field only when country is "US" */}
          <form.Subscribe selector={(state) => state.values.country}>
            {(country) =>
              country === 'US' && (
                <form.AppField name="state">
                  {(field) => (
                    <field.TextField
                      label="State"
                      placeholder="e.g. California"
                    />
                  )}
                </form.AppField>
              )
            }
          </form.Subscribe>

          <form.AppField name="bio">
            {(field) => (
              <field.TextArea
                label="Bio"
                placeholder="Tell us about yourself..."
                rows={4}
                maxLength={300}
              />
            )}
          </form.AppField>

          {/* ── 3. Custom disabled on submit button ── */}
          <div className="space-y-1 pt-4 border-t border-white/10">
            <p className="text-sm text-green-300 font-semibold uppercase tracking-wide">
              Custom Button Disable Demo
            </p>
            <p className="text-xs text-green-200/70">
              Button stays disabled until the form is valid and has been
              modified
            </p>
          </div>

          <div className="flex justify-end">
            <form.Subscribe
              selector={(state) => state.canSubmit && state.isDirty}
            >
              {(canSubmitAndDirty) => (
                <form.AppForm>
                  <form.SubscribeButton
                    label="Submit"
                    disabled={!canSubmitAndDirty}
                  />
                </form.AppForm>
              )}
            </form.Subscribe>
          </div>
        </form>
      </div>
    </div>
  )
}
