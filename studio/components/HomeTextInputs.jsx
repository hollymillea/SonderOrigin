import {TextArea} from '@sanity/ui'
import {set, useFormValue} from 'sanity'

// Keep the existing line arrays so the website can read edits immediately.
export function LinesTextInput({value, onChange, readOnly, id, schemaType}) {
  return (
    <TextArea
      id={id}
      aria-label={schemaType.title}
      value={(value || []).join('\n')}
      readOnly={readOnly}
      rows={3}
      onChange={(event) => onChange(set(event.currentTarget.value.split('\n')))}
    />
  )
}

export function HeadingTextInput(props) {
  return props.renderDefault({...props, value: props.value ?? 'Selected artists'})
}

export function CountCheckboxInput(props) {
  return props.renderDefault({...props, value: props.value ?? true})
}

export function ShowreelSourceInput(props) {
  const existingUrl = useFormValue(['showreelUrl'])
  return props.renderDefault({...props, value: props.value ?? (existingUrl ? 'link' : 'off')})
}
