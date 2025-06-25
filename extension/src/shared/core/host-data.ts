
type HostData = {
  id: string
  /**
   * 名称.
   */
  name: string
  /**
   * ossId.
   */
  ossId: string
  /**
   * 保存的远程存储的 key.
   */
  remoteKey: string
  /**
   * 更新时间(时间戳)
   */
  updateDate: number
}

const HOST_DATA_KEY_PREFIX = '$hostData$:'

export const listHostData = async (host?: string | null): Promise<HostData[]> => {
  if (!host) {
    return []
  }
  const key = HOST_DATA_KEY_PREFIX + host
  const result = await chrome.storage.sync.get(key)
  const data = result[key]
  if (!data) {
    return []
  }
  return JSON.parse(data) as HostData[]
}

export const getHostDataById = async (host: string | null, id: string | null): Promise<HostData | undefined> => {
  if (!id) {
    return undefined
  }
  const data = await listHostData(host)
  return data.find(item => item.id === id)
}

export const listSavedSites = async (): Promise<string[]> => {
  return (await chrome.storage.sync.getKeys()).filter(v => v.startsWith(HOST_DATA_KEY_PREFIX)).map(v => v.substring(HOST_DATA_KEY_PREFIX.length))
}

export const saveHostData = async (host: string, data: HostData): Promise<void> => {
  const key = HOST_DATA_KEY_PREFIX + host
  await chrome.storage.sync.set({
    [key]: JSON.stringify([...await listHostData(host), data])
  })
}

export const deleteHostData = async (host: string, hostDataId: string): Promise<void> => {
  const data = await listHostData(host)
  const i = data.findIndex(item => item.id === hostDataId)
  if (i < 0) {
    return
  }
  data.splice(i, 1)
  if (data.length === 0) {
    await chrome.storage.sync.remove(HOST_DATA_KEY_PREFIX + host)
    return
  }
  await chrome.storage.sync.set({
    [HOST_DATA_KEY_PREFIX + host]: JSON.stringify(data)
  })
}

export const updateHostData = async (host: string, id: string, data: Partial<HostData>) => {
  let updateCnt = 0
  const replace: Partial<HostData> = {}
  if (data.name) {
    replace.name = data.name
    updateCnt++
  }
  if (data.ossId) {
    replace.ossId = data.ossId
    updateCnt++
  }
  if (updateCnt == 0) {
    return
  }
  const hostDataItems = await listHostData(host)
  const i = hostDataItems.findIndex(item => item.id === id)
  if (i < 0) {
    throw new Error(`Host data with id ${id} not found`)
  }
  const oldEntity = hostDataItems[i]
  hostDataItems.splice(i, 1)

  const newEntity: HostData = {
    ...oldEntity,
    ...replace
  }

  hostDataItems.push(newEntity)

  await chrome.storage.sync.set({
    [HOST_DATA_KEY_PREFIX + host]: JSON.stringify(hostDataItems)
  })

}