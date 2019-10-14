import React from 'react'
import { shallow } from 'enzyme'
import SimpleBlog from './simple-blog.component.jsx'

describe('<SimpleBlog />', () => {
  test('renders the title, author and amount of likes for the blog post', () => {
    const blog = {
      title: 'test1',
      author: 'test2',
      likes: 3
    }

    const blogComponent = shallow(<SimpleBlog blog={blog} />)
    const titleSpan = blogComponent.find('.title')
    const authorSpan = blogComponent.find('.author')
    const likesSpan = blogComponent.find('.likes')

    expect(titleSpan.text()).toContain(`${blog.title}`)
    expect(authorSpan.text()).toContain(`${blog.author}`)
    expect(likesSpan.text()).toContain(`${blog.likes}`)
  })
  test('onClick prop gets called correctly', () => {
    const mockFn = jest.fn()
    const blogComponent = shallow(<SimpleBlog blog={{}} onClick={mockFn} />)
    const likeButton = blogComponent.find('button')
    likeButton.simulate('click')
    likeButton.simulate('click')
    expect(mockFn.mock.calls.length).toEqual(2)
  })
})