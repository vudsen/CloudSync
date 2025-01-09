import { createContext } from 'react'
import type { OSS } from '@/oss/type'

type MyContext = {
  oss: OSS
}

const PopupContext = createContext<MyContext>({
  // assign later
  oss: (null as never)
})

export const CONTAINER_HEIGHT = 500

export default PopupContext