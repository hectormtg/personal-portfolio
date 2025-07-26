export interface IProject {
  title: string
  type: string
  stack: string
  url?: string
  thumbnail: string
  images: Array<string>
  unavailable?: boolean
  summary?: string
}
