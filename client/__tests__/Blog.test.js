import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
// eslint-disable-next-line no-unused-vars
import { prettyDOM } from '@testing-library/dom'
import Blog from '../components/Blog'

describe('<Blog />', () => {
  let user = {
    username: 'userone',
    name: 'John Doe'
  }

  let blog = {
    title: 'Testing frontend with jest',
    author: 'Jack Nerd',
    url: 'www.codeacademy.com',
    likes: 5,
    user: {
      username: 'testandy',
      name: 'Andy Andersson'
    }
  }

  test('renders basic view as default', () => {
    const component = render(
      <Blog blog={blog} />
    )

    //const basic = component.container.querySelector('.basicDiv')
    //console.log(prettyDOM(basic))

    expect(component.container).toHaveTextContent('Testing frontend with jest by Jack Nerd')
    expect(component.container).not.toHaveTextContent('www.codeacademy.com')
    expect(component.container).not.toHaveTextContent('likes')
  })

  test('renders detailed views, when button is clicked', () => {
    const component = render(
      <Blog user={user} blog={blog} />
    )
    const button = component.container.querySelector('.showDetails')
    fireEvent.click(button)

    //const details = component.container.querySelector('.detailsDiv')
    //console.log(prettyDOM(details))

    expect(component.container).toHaveTextContent('Testing frontend with jest by Jack Nerd')
    expect(component.container).toHaveTextContent('www.codeacademy.com')
    expect(component.container).toHaveTextContent('likes 5')
  })

  test('clicking like button twice calls event handler twice', () => {
    const mockHandler = jest.fn()
    const component = render(
      <Blog user={user} blog={blog} like={mockHandler} />
    )

    const buttonShow = component.container.querySelector('.showDetails')
    fireEvent.click(buttonShow)

    const buttonLike = component.container.querySelector('.addLike')
    fireEvent.click(buttonLike)
    fireEvent.click(buttonLike)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})