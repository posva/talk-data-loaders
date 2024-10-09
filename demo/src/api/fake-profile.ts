import { mande } from 'mande'

const delay = (t: number) => new Promise((r) => setTimeout(r, t))

const ghUsers = mande('https://api.github.com/users')

const profiles = {
  yyx990803: {
    name: 'Evan You',
    imageURL: '/yyx990803.jpeg',
  },
  posva: {
    name: 'Eduardo San Martin Morote',
    imageURL: '/posva.jpeg',
  },
} satisfies Record<string, { name: string; imageURL: string }>

const followerCount = {
  posva: '5.9k',
  yyx990803: '101k',
} satisfies Record<keyof typeof profiles, string>

export async function getProfileInfo(id: string) {
  const p = ghUsers
    .get<{ login: string; avatar_url: string }>(id, {
      signal: AbortSignal.timeout(500),
    })
    .then(
      (u) =>
        ({
          name: u.login,
          imageURL: u.avatar_url,
        }) satisfies typeof profiles.posva,
    )
    .catch(() => null)

  const [_, profile] = await Promise.all([delay(500), p])
  if (profile) {
    return profile
  }
  if (id in profiles) {
    return profiles[id as keyof typeof profiles]
  }
  throw new Error('not found')
}

export async function getFollowerCount(id: string) {
  const p = ghUsers
    .get<{ followers: number }>(id, {
      signal: AbortSignal.timeout(2000),
    })
    .then((u) => u.followers)
    .then((followers) => `${(followers / 1000).toFixed(1)}k`)
    // ignore data if it fails
    .catch(() => null)
  // public GitHub API to get a profile
  const [_, count] = await Promise.all([delay(2000), p])
  if (count) {
    return count
  }
  if (id in followerCount) {
    return followerCount[id as keyof typeof followerCount]
  }
  throw new Error('not found')
}
