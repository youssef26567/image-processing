import supertest from 'supertest'
import app from '../index'
import path from 'path'
import image from '../routes/api/image-process'

import fs from 'fs-extra'

// create a request object
const request = supertest(app)

describe('Test endpoint response', () => {
  it('test server is work', async () => {
    const response = await request.get('/')
    expect(response.status).toBe(200)
  })

  it('test api with request parameter endpoint  result 200', async () => {
    // eslint-disable-next-line prettier/prettier
    const response = await request.get(
      "/api?filename=1&width=600&height=600"
    )
    expect(response.status).toBe(200)
  })

  it('test api without request parameter endpoint  result 400', async () => {
    const response = await request.get('/api')
    expect(response.status).toBe(400)
  })

  it('test api with some request parameter  endpoint result 400', async () => {
    const response = await request.get('/api?filename=1&height=600')
    expect(response.status).toBe(400)
  })
})

describe('test processing Image', () => {
  it('test Image processed was successfully created', async () => {
    const unresized = path.resolve(__dirname, '../../images/unresized images', '1' + '.jpg')
    const resized = path.resolve(__dirname, '../../images/resized', '1' + '350' + '450' + '.jpg')
    const width = 4500
    const height = 450
    await image(unresized, resized, width, height)
    const photo = (await fs.readFile(resized)).buffer

    expect(photo).toBeInstanceOf(ArrayBuffer)
  })
})
