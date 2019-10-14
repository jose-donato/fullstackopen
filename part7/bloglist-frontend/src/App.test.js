import React from 'react'
import { mount } from 'enzyme'
import App from './App'
import Blog from './components/blog/blog.component'
jest.mock('./services/blogs')
import blogService from './services/blogs'

describe('<App />', () => {
  test('renders only login if user is not logged into the application', () => {
    const app = mount(<App />)
    app.update()
    const blogComponents = app.find(Blog)
    expect(blogComponents.length).toEqual(0)
    const title = app.find('h2')
    expect(title.text()).toEqual('log in to application')
  })

  test('renders blogs if user is logged in', async () => {
    const user = {
      username: 'tester',
      token: '123123',
      name: 'Testing'
    }
    localStorage.setItem('user', JSON.stringify(user))

    const app = await mount(<App />)
    app.update()
    const blogComponents = app.find(Blog)
    expect(blogComponents.length).toEqual(blogService.blogs.length)
  })
})