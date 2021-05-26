import axios from 'axios'
import cheerio from 'cheerio'
import fs from 'fs'
import request from 'request'
import path from 'path'
import randToken from 'rand-token'

import { SocialMediaProps } from '../models/jsonTypes/BiolinkSettings'

export interface LinktreeParsingProps {
  bio?: string
  profilePhotoUrl?: string
  links?: {
    linkTitle: string
    url: string
  }[]
  socials?: SocialMediaProps[]
}

const download = (url: string, path: string, errorCallback: (err: Error) => void): void => {
  request.head(url, () => {
    request(url).pipe(fs.createWriteStream(path)).on('error', errorCallback)
  })
}

export const linktreeImportHandler = async (url: string): Promise<LinktreeParsingProps> => {
  const res = await axios.get(url)

  if (res.status !== 200) {
    return Promise.reject(new Error('Invalid url'))
  }

  const html = await res.data
  const $ = cheerio.load(html)

  const imageUrl = $('div[class="sc-bdfBwQ eZNKTD"] > div > div > img')[0].attribs['src']

  const profilePhotoUrl = `${randToken.generate(20)}-${Date.now().toString()}`

  const directory = path.join(__dirname, `../../assets/profilePhotos/${profilePhotoUrl}`)

  download(imageUrl, directory, (err) => {
    return Promise.reject(err)
  })

  return {
    bio: $('div[class="sc-bdfBwQ ciojAP"] > p').text().trim() || '',
    links:
      Array.from($('div[class="sc-bdfBwQ pkAuV"] > div > a')).map((element) => ({
        url: element.attribs['href'].trim(),
        linkTitle: $(element).find('p').text().trim(),
      })) || [],
    socials:
      Array.from($('div[class="sc-bdfBwQ kMVUFR"] > div > a')).map((element) => ({
        platform: element.attribs['aria-label'].trim(),
        link: element.attribs['href'].trim(),
      })) || [],
    profilePhotoUrl,
  }
}
