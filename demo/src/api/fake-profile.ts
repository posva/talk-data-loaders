const delay = (t: number) => new Promise((r) => setTimeout(r, t))

const profiles = {
  yyx: {
    name: 'Evan You',
    imageURL: '...',
  },
  posva: {
    name: 'Eduardo San Martin Morote',
    imageURL: '...',
  },
} satisfies Record<string, { name: string; imageURL: string }>

const followerCount = {
  posva: 5200,
  yyx: 54044,
} satisfies Record<keyof typeof profiles, number>

export async function getProfileInfo(id: string) {
  await delay(500)
  if (id in profiles) {
    return profiles[id as keyof typeof profiles]
  }
  throw new Error('not found')
}

export async function getFollowerCount(id: string) {
  await delay(3000)
  if (id in followerCount) {
    return followerCount[id as keyof typeof followerCount]
  }
  throw new Error('not found')
}
