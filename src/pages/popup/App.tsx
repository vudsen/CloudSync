import { useEffect } from 'react'
import { CONTAINER_HEIGHT } from './context'
import StorageList from './StorageList'
import DataAddButton from './DataAddButton'

const App = () => {

  useEffect(() => {
    
  }, [])

  return (
    <div style={{ width: 500, height: CONTAINER_HEIGHT }}>
      <DataAddButton/>
      <StorageList/>
    </div>
  )
}
export default App