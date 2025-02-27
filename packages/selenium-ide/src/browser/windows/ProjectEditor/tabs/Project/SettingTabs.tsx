import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import React, { useContext, useEffect, useState } from 'react'
import { context } from 'browser/contexts/config-settings-group'

function a11yProps(name: string) {
  return {
    'aria-controls': `tabpanel-${name}`,
    id: `${name}`,
  }
}

const SettingsTabs: React.FC = () => {
  const [languageMap, setLanguageMap] = useState<any>({
    configTab: { project: 'Project', system: 'System', outPut: 'outPut' },
  })

  useEffect(() => {
    window.sideAPI.system.getLanguageMap().then((result) => {
      setLanguageMap(result)
    })
  }, [])
  return (
    <Tabs
      aria-label="Selenium IDE workflows"
      className="not-draggable"
      indicatorColor="primary"
      onChange={(_e, group) => {
        window.sideAPI.state.set('editor.configSettingsGroup', group)
      }}
      textColor="inherit"
      value={useContext(context)}
      variant="fullWidth"
    >
      <Tab
        label={languageMap.configTab.project}
        value="project"
        {...a11yProps('project')}
      />
      <Tab
        label={languageMap.configTab.system}
        value="system"
        {...a11yProps('system')}
      />
      <Tab
        label={languageMap.configTab.outPut}
        value="outPut"
        {...a11yProps('outPut')}
      />
    </Tabs>
  )
}

export default SettingsTabs
