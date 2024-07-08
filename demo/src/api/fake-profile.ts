const delay = (t: number) => new Promise((r) => setTimeout(r, t))

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
  posva: '5.7k',
  yyx990803: '100k',
} satisfies Record<keyof typeof profiles, string>

export async function getProfileInfo(id: string) {
  await delay(500)
  if (id in profiles) {
    return profiles[id as keyof typeof profiles]
  }
  throw new Error('not found')
}

export async function getFollowerCount(id: string) {
  await delay(2000)
  if (id in followerCount) {
    return followerCount[id as keyof typeof followerCount]
  }
  throw new Error('not found')
}
