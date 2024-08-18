import { app } from 'electron'

const getAppTempDir = () => {
  return app.getPath('temp')
}

const getAppUserDataDir = () => {
  return app.getPath('userData')
}

export { getAppTempDir, getAppUserDataDir }
