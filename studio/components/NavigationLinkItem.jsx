import {Box, Checkbox, Flex} from '@sanity/ui'
import {set} from 'sanity'

// A Show checkbox beside each header link, so links can be hidden from the list
// without opening them.
export function NavigationLinkItem(props) {
  const {value, inputProps, readOnly} = props
  const shown = value?.show !== false
  return (
    <Flex align="center" gap={2}>
      <Box flex={1}>{props.renderDefault(props)}</Box>
      <Box paddingRight={2}>
        <Checkbox
          checked={shown}
          readOnly={readOnly}
          aria-label={`Show ${value?.label || 'link'} in the header`}
          title="Show in header"
          onChange={(event) => inputProps.onChange(set(event.currentTarget.checked, ['show']))}
        />
      </Box>
    </Flex>
  )
}
