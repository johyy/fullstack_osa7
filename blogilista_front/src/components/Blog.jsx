import { useParams } from 'react-router-dom'
import { Button } from 'react-bootstrap'

const Blog = ({ blogs, updateBlogLikes, removeBlog, user }) => {
  const { id } = useParams()

  // Jos id on annettu, etsi blogi sen perusteella
  const blog = blogs.find((b) => b.id === id)

  if (!blog) {
    return
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const handleLikeClick = () => {
    updateBlogLikes(blog.id)
  }

  const handleRemoveClick = () => {
    removeBlog(blog.id, blog.title, blog.author)
  }

  return (
    <div style={blogStyle}>
      <h2>
        {blog.title} {blog.author}
      </h2>
      <p>
        <a href={`http://${blog.url}`}>{blog.url}</a>
      </p>
      <p>
        {`likes: ${blog.likes}`}
        <Button variant="primary" onClick={handleLikeClick}>
          like
        </Button>
      </p>
      <p>added by {blog.user.name}</p>
      {user && blog.user.name === user.name && (
        <Button variant="danger" onClick={handleRemoveClick}>
          remove
        </Button>
      )}
      <h3>comments</h3>
      {blog.comments.length > 0 ? (
        <ul>
          {blog.comments.map((comment, i) => (
            <li key={i}>{comment}</li>
          ))}
        </ul>
      ) : (
        <p>no comments yet</p>
      )}

    </div>
  )
}

export default Blog
