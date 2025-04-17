import React from 'react'
import SavedSites from './SavedSites.tsx'
import OssProviders from './OssProviders/OssProviders.tsx'

const Overview: React.FC = () => {
  return (
    <div className="box-border p-4">
      <SavedSites/>
      <OssProviders/>
    </div>
  )
}

export default Overview