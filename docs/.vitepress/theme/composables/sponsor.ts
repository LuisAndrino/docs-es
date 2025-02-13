import { ref, onMounted } from 'vue'

interface Sponsors {
  special: Sponsor[]
  platinum: Sponsor[]
  platinum_china: Sponsor[]
  gold: Sponsor[]
  silver: Sponsor[]
  bronze: Sponsor[]
}

interface Sponsor {
  name: string
  img: string
  url: string
}

// shared data across instances so we load only once.
const data = ref()

const dataHost = 'https://sponsors.vuejs.org'
const dataUrl = `${dataHost}/vite.json`

// no sponsors yet :(
const viteSponsors: Pick<Sponsors, 'gold'> = {
  gold: [],
}

export function useSponsor() {
  onMounted(async () => {
    if (data.value) {
      return
    }

    const result = await fetch(dataUrl)
    const json = await result.json()

    data.value = mapSponsors(json)
  })

  return {
    data,
  }
}

function mapSponsors(sponsors: Sponsors) {
  return [
    {
      tier: 'Patrocinadores Platinum',
      size: 'big',
      items: mapImgPath(sponsors['platinum']),
    },
    {
      tier: 'Patrocinadores Oro',
      size: 'medium',
      items: viteSponsors['gold'].concat(mapImgPath(sponsors['gold'])),
    },
  ]
}

function mapImgPath(sponsors: Sponsor[]) {
  return sponsors.map((sponsor) => ({
    ...sponsor,
    img: `${dataHost}/images/${sponsor.img}`,
  }))
}
