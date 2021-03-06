import React from "react"
import { useField } from "formik"
import { FormField, Label } from "semantic-ui-react"

const VersatileInput = ({ label, ...props }) => {
  const [field, meta] = useField(props)
  return (
    <FormField error={meta.touched && !!meta.error}>
      <label>{label}</label>
      <input {...field} {...props} />
      {meta.touched && meta.error ? (
        <Label ribbon color='red'>
          {meta.error}
        </Label>
      ) : null}
    </FormField>
  )
}

export default VersatileInput
