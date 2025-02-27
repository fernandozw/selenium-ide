import FormHelperText from '@mui/material/FormHelperText'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import { context } from 'browser/contexts/config'
import { VerboseBoolean } from '@seleniumhq/side-api'
import React, { FC, useContext, useEffect, useState } from 'react'
import DriverSelector from './DriverSelect'

export interface MiniProjectShape {
  id: string
  name: string
}

const SystemSettings: FC = () => {
  const config = useContext(context)
  const [languageMap, setLanguageMap] = useState<any>({
    systemConfig: {
      theme: 'Theme preference',
      themeHelper: 'restart required to take effect',
      commandInsert: 'New command insert preference',
      camelCase: 'Camel case various names in UI',
      ignoreErrors: 'Ignore Certificate/SSL errors',
      codeExport: 'Disable code export compatibility mode',
    },
  })

  useEffect(() => {
    window.sideAPI.system.getLanguageMap().then((result) => {
      setLanguageMap(result)
    })
  }, [])
  return (
    <Stack className="p-4" spacing={1}>
      <FormControl>
        <InputLabel id="themePref">{languageMap.systemConfig.theme}</InputLabel>
        <FormHelperText>{languageMap.systemConfig.themeHelper}</FormHelperText>
        <Select
          id="themePref"
          label="Theme preference"
          name="themePref"
          value={config.system.themePref}
          onChange={(e: any) => {
            window.sideAPI.state.toggleUserPrefTheme(e.target.value)
          }}
        >
          <MenuItem value="System">System</MenuItem>
          <MenuItem value="Light">Light</MenuItem>
          <MenuItem value="Dark">Dark</MenuItem>
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel id="insertNewCommandPref">
          {languageMap.systemConfig.commandInsert}
        </InputLabel>
        <Select
          id="insertNewCommandPref"
          label="Insert new command placement preference"
          name="insertNewCommandPref"
          value={config.system.insertCommandPref}
          onChange={(e: any) => {
            window.sideAPI.state.toggleUserPrefInsert(e.target.value)
          }}
        >
          <MenuItem value="After">After</MenuItem>
          <MenuItem value="Before">Before</MenuItem>
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel id="camelCaseNames">
          {languageMap.systemConfig.camelCase}
        </InputLabel>
        <Select
          id="camelCaseNamesPref"
          label="Camel case various names in UI"
          name="camelCaseNamesPref"
          value={config.system.camelCaseNamesPref}
          onChange={(e: any) => {
            window.sideAPI.state.toggleUserPrefCamelCase(e.target.value)
          }}
        >
          <MenuItem value="Yes">Yes</MenuItem>
          <MenuItem value="No">No</MenuItem>
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel id="ignoreSSLErrors">
          {languageMap.systemConfig.ignoreErrors}
        </InputLabel>
        <Select
          id="ignoreCertificateErrorsPref"
          label="Ignore Certificate/SSL errors - Please be aware of the risks of ignoring SSL errors"
          name="ignoreCertificateErrorsPref"
          value={config.system.ignoreCertificateErrorsPref}
          onChange={(e: any) => {
            window.sideAPI.state.toggleUserPrefIgnoreCertificateErrors(
              e.target.value
            )
          }}
        >
          <MenuItem value="Yes">Yes</MenuItem>
          <MenuItem value="No">No</MenuItem>
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel id="disableCodeExportCompat">
          {languageMap.systemConfig.codeExport}
        </InputLabel>
        <Select
          id="disableCodeExportCompatPref"
          label="Disable code export compatibility mode"
          name="ignoreCertificateErrorsPref"
          value={config.system.disableCodeExportCompat}
          onChange={(e) => {
            window.sideAPI.state.toggleUserPrefDisableCodeExportCompat(
              e.target.value as VerboseBoolean
            )
          }}
        >
          <MenuItem value="Yes">Yes</MenuItem>
          <MenuItem value="No">No</MenuItem>
        </Select>
      </FormControl>
      <DriverSelector />
    </Stack>
  )
}

export default SystemSettings
