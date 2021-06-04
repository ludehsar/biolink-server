import axios from 'axios'
import cheerio from 'cheerio'
import fs from 'fs'
import request from 'request'
import path from 'path'
import randToken from 'rand-token'
import { SocialMediaProps } from '../json-types'
import { BACKEND_URL } from '../config'

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
  try {
    request.head(url, () => {
      request(url).pipe(fs.createWriteStream(path)).on('error', errorCallback)
    })
  } catch (err) {
    console.log(err)
  }
}

export const linktreeImportHandler = async (url: string): Promise<LinktreeParsingProps> => {
  const res = await axios.get(url)

  if (res.status !== 200) {
    return Promise.reject(new Error('Invalid url'))
  }

  const html = await res.data
  const $ = cheerio.load(html)

  const imageUrl = $('div[class="sc-bdfBwQ eZNKTD"] > div > div > img')[0].attribs['src']

  const profilePhotoName = `${randToken.generate(20)}-${Date.now().toString()}`

  const directory = path.join(__dirname, `../../assets/profilePhotos/${profilePhotoName}`)

  const result: LinktreeParsingProps = {
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
  }

  download(imageUrl, directory, () => {
    return result
  })

  result.profilePhotoUrl = BACKEND_URL + '/static/profilePhotos/' + profilePhotoName

  return result
}
