import React from 'react'
import { mount } from 'enzyme'
import Blog from './blog.component'

describe('<Blog />', () => {
    const blog = {
        title: 'test1',
        author: 'test2',
        likes: 3,
        user: {
            name: 'testuser'
        }
    }

    test('renders only title by default', () => {
        const blogComponent = mount(<Blog blog={blog} />)
        const clickable = blogComponent.find('.clickable')
        const renderAllContent = blogComponent.find('.renderAllContent')
        expect(clickable.text()).toContain(`${blog.title} ${blog.author}`)
        expect(renderAllContent.text()).not.toContain(`added by`)
    })

    test('renders everything after click', () => {
        const blogComponent = mount(<Blog blog={blog} />)
        const clickable = blogComponent.find('.clickable')

        clickable.simulate('click')

        const renderAllContent = blogComponent.find('.renderAllContent')
        expect(renderAllContent.text()).toContain(`added by`)
    })
})