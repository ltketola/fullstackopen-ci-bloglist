import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import AddNewBlog from '../components/AddNewBlog'

test('<AddNewBlog /> ceates a new blog', () => {
  const createBlog = jest.fn()

  const component = render(
    <AddNewBlog createBlog={createBlog} />
  )

  const title = component.container.querySelector('#title')
  const author = component.container.querySelector('#author')
  const url = component.container.querySelector('#url')
  const form = component.container.querySelector('form')

  fireEvent.change(title, {
    target: { value: 'Testing frontend with jest' }
  })
  fireEvent.change(author, {
    target: { value: 'Jack Nerd' }
  })
  fireEvent.change(url, {
    target: { value: 'www.codeacademy.com' }
  })
  fireEvent.submit(form)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Testing frontend with jest')
  expect(createBlog.mock.calls[0][0].author).toBe('Jack Nerd')
  expect(createBlog.mock.calls[0][0].url).toBe('www.codeacademy.com')
})