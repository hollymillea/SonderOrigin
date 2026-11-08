export function orderedArtists(artists, references = []) {
  const byId = new Map()
  for (const artist of artists) {
    const id = artist._id.replace(/^drafts\./, '')
    const existing = byId.get(id)
    if (!existing || artist._id.startsWith('drafts.')) byId.set(id, {...artist, id})
  }
  const result = []
  const seen = new Set()
  for (const reference of references || []) {
    const id = reference?._ref?.replace(/^drafts\./, '')
    if (!byId.has(id) || seen.has(id)) continue
    seen.add(id)
    result.push(byId.get(id))
  }
  for (const [id, artist] of byId) {
    if (!seen.has(id)) result.push(artist)
  }
  return result
}

export function moveArtist(artists, from, to) {
  const next = [...artists]
  next.splice(to, 0, next.splice(from, 1)[0])
  return next
}
