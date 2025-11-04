import { envs } from '../src/config'
import { Server } from '../src/presentation/Server'

jest.mock('../src/presentation/Server', () => {
  return {
    Server: jest.fn().mockImplementation(() => ({
      start: jest.fn() // <- mockeamos start
    }))
  }
})

describe('Testing App.ts', () => {
  it('Should work', async () => {
    await import('../src/app')

    expect(Server).toHaveBeenCalledTimes(1)
    expect(Server).toHaveBeenCalledWith({
      port: envs.PORT,
      publicPath: envs.PUBLIC_PATH,
      routes: expect.any(Function)
    })
  })
})
