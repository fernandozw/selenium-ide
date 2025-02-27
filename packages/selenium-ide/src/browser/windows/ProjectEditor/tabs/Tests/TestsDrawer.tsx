import List from '@mui/material/List'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import React, { FC, useContext, useEffect, useState } from 'react'
import Drawer from 'browser/components/Drawer/Wrapper'
import EditorToolbar from 'browser/components/Drawer/EditorToolbar'
import RenamableListItem from 'browser/components/Drawer/RenamableListItem'
import TestCreateDialog from './TestCreateDialog'
import { context as activeTestContext } from 'browser/contexts/active-test'
import { context as suitesContext } from 'browser/contexts/suites'
import { context as testsContext } from 'browser/contexts/tests'
import { context as testResultsContext } from 'browser/contexts/playback-test-results'

const {
  state: { setActiveTest: setSelected, setActiveSuite },
  tests: { rename },
} = window.sideAPI

const TestsDrawer: FC = () => {
  const { activeSuiteID, activeTestID } = useContext(activeTestContext)
  const suites = useContext(suitesContext)
  const tests = useContext(testsContext)
  const testResults = useContext(testResultsContext)
  const [confirmNew, setConfirmNew] = React.useState(false)
  const testList = activeSuiteID
    ? suites
        .find((s) => s.id === activeSuiteID)
        ?.tests.map((id) => tests.find((t) => t.id === id)!) ?? tests
    : tests
  const safeSuiteID = suites.find((s) => s.id === activeSuiteID)?.id ?? ''
  const [languageMap, setLanguageMap] = useState<any>({
    testsTab: {
      allTests: '[All tests]',
      deleteNotice: 'Delete this test?',
      tooltip:
        'double click to modify the name,right click to export or delete test case',
      notDeleteNotice: 'only one test case is not allowed to be deleted!',
    },
  })

  useEffect(() => {
    window.sideAPI.system.getLanguageMap().then((result) => {
      setLanguageMap(result)
    })
  }, [])
  return (
    <Drawer>
      <TestCreateDialog open={confirmNew} setOpen={setConfirmNew} />
      <Stack>
        <EditorToolbar
          onAdd={() => setConfirmNew(true)}
          onRemove={
            tests.length > 1
              ? () => {
                  const doDelete = window.confirm(
                    languageMap.testsTab.deleteNotice
                  )
                  if (doDelete) {
                    window.sideAPI.tests.delete(activeTestID)
                  }
                }
              : () => {
                  window.confirm(languageMap.testsTab.notDeleteNotice)
                }
          }
        />
        <FormControl size="small">
          <Select
            MenuProps={{
              anchorOrigin: {
                horizontal: 'center',
                vertical: 'top',
              },
              transformOrigin: {
                horizontal: 'center',
                vertical: 'bottom',
              },
            }}
            className="flex-initial"
            displayEmpty
            onChange={(e) => setActiveSuite(e.target.value as string)}
            placeholder="[All tests]"
            sx={{ bottom: 0 }}
            value={safeSuiteID}
          >
            <MenuItem value="">{languageMap.testsTab.allTests}</MenuItem>
            {suites.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
      <List className="flex-col flex-1 overflow-y" dense>
        {testList
          .slice()
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(({ id, name }) => {
            const testState = testResults[id]?.state
            return (
              <Tooltip title={languageMap.testsTab.tooltip}>
                <RenamableListItem
                  id={id}
                  key={id}
                  name={name}
                  onContextMenu={() => {
                    window.sideAPI.menus.open('testManager', [id])
                  }}
                  rename={rename}
                  selected={id === activeTestID}
                  setSelected={setSelected}
                  state={testState}
                />
              </Tooltip>
            )
          })}
      </List>
    </Drawer>
  )
}

export default TestsDrawer
