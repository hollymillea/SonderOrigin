import {useEffect, useMemo, useState} from 'react'
import {Box, Button, Card, Flex, Spinner, Stack, Text} from '@sanity/ui'
import {set, useClient} from 'sanity'
import {moveArtist, orderedArtists} from './artist-order.mjs'

const artistFilter = '*[_type == "artist" && !(_id in path("versions.**"))]'
const query = `${artistFilter} | order(_createdAt asc, name asc){_id,name,"portraitUrl":portrait.asset->url}`

export function ArtistOrderInput({value, onChange, readOnly, id}) {
  const baseClient = useClient({apiVersion: '2026-10-19'})
  const client = useMemo(() => baseClient.withConfig({useCdn: false, perspective: 'drafts'}), [baseClient])
  const [artists, setArtists] = useState(null)
  const [error, setError] = useState(false)
  const [retry, setRetry] = useState(0)
  const list = useMemo(() => orderedArtists(artists || [], value), [artists, value])

  useEffect(() => {
    let disposed = false
    let request = 0
    const refresh = async () => {
      const current = ++request
      try {
        const next = await client.fetch(query)
        if (!disposed && current === request) {
          setArtists(next)
          setError(false)
        }
      } catch {
        if (!disposed && current === request) setError(true)
      }
    }
    const subscription = client.withConfig({perspective: 'raw'}).listen(artistFilter, {}, {
      includeResult: false, events: ['mutation', 'reconnect'],
    }).subscribe({next: refresh, error: () => { if (!disposed) setError(true) }})
    refresh()
    return () => {
      disposed = true
      subscription.unsubscribe()
    }
  }, [client, retry])

  const move = (from, to) => {
    if (readOnly || error || from < 0 || from >= list.length || to < 0 || to >= list.length || from === to) return
    onChange(set(moveArtist(list, from, to).map((artist) => {
      const existing = value?.find((reference) => reference._ref === artist.id)
      return existing || {_type: 'reference', _key: artist.id, _ref: artist.id, _weak: true}
    })))
  }

  if (error) return <Card padding={3} tone="critical" radius={2}>
    <Stack space={3}>
      <Text size={1}>Couldn’t load artists.</Text>
      <Button text="Try again" mode="ghost" onClick={() => setRetry((attempt) => attempt + 1)} />
    </Stack>
  </Card>
  if (!artists) return <Flex padding={3} gap={3} align="center"><Spinner /><Text size={1}>Loading artists…</Text></Flex>
  if (!list.length) return <Text size={1} muted>Create your first artist in Artists.</Text>

  return <Stack id={id} space={2} role="list" aria-label="Artist order">
    {list.map((artist, index) => (
      <Card key={artist.id} role="listitem" padding={3} border radius={2}
        draggable={!readOnly}
        onDragStart={(event) => {
          event.dataTransfer.setData('text/plain', artist.id)
          event.dataTransfer.effectAllowed = 'move'
        }}
        onDragOver={(event) => { if (!readOnly) event.preventDefault() }}
        onDrop={(event) => {
          event.preventDefault()
          move(list.findIndex((item) => item.id === event.dataTransfer.getData('text/plain')), index)
        }}>
        <Flex align="center" gap={3}>
          <Text muted aria-hidden="true">↕</Text>
          {artist.portraitUrl && <img src={`${artist.portraitUrl}?w=80&h=80&fit=crop&auto=format`} alt="" width={40} height={40} style={{objectFit: 'cover', borderRadius: 4}} draggable={false} />}
          <Box flex={1}><Text size={1}>{artist.name || 'New artist'}</Text></Box>
          <Button text="↑" mode="bleed" aria-label={`Move ${artist.name || 'artist'} up`} disabled={readOnly || index === 0} onClick={() => move(index, index - 1)} />
          <Button text="↓" mode="bleed" aria-label={`Move ${artist.name || 'artist'} down`} disabled={readOnly || index === list.length - 1} onClick={() => move(index, index + 1)} />
        </Flex>
      </Card>
    ))}
  </Stack>
}
