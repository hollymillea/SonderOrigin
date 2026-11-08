import {Button, TextArea} from '@sanity/ui'
import {set, useFormValue} from 'sanity'
import {useIntentLink} from 'sanity/router'

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

export function SharedServicesInput() {
  const link = useIntentLink({intent: 'edit', params: {id: 'about', type: 'about'}})
  return <Button as="a" {...link} text="Edit services in About" mode="ghost" />
}

export function ShortcutField({children}) {
  return children
}
