import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    })

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <Form onSubmit={addBlog}>
      <Form.Group>
        <Form.Label>Title</Form.Label>
        <Form.Control
          data-testid="title"
          value={newTitle}
          onChange={(event) => setNewTitle(event.target.value)}
          placeholder="Title of the blog"
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Author</Form.Label>
        <Form.Control
          data-testid="author"
          value={newAuthor}
          onChange={(event) => setNewAuthor(event.target.value)}
          placeholder="Author of the blog"
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>URL</Form.Label>
        <Form.Control
          data-testid="url"
          value={newUrl}
          onChange={(event) => setNewUrl(event.target.value)}
          placeholder="URL of the blog"
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Create
      </Button>
    </Form>
  )
}

export default BlogForm
