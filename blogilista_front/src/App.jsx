import { useState, useEffect, useContext } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'
import { Alert, Button, Table, Navbar, Nav } from 'react-bootstrap'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Users from './components/Users'
import User from './components/User'
import NotificationContext from './NotificationContext'

const Notification = () => {
  const [notification] = useContext(NotificationContext)

  if (!notification || !notification.message) {
    return
  }

  return (
    <Alert variant={notification.type === 'success' ? 'success' : 'danger'}>
      {notification.message}
    </Alert>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [visible, setVisible] = useState(false)
  const [users, setUsers] = useState([])
  const [notification, notificationDispatch] = useContext(NotificationContext)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    userService.getAll().then((users) => setUsers(users))
  }, [])

  const toggleVisibility = () => setVisible(!visible)

  const updateBlogLikes = (id) => {
    const blog = blogs.find((b) => b.id === id)
    const changedBlog = { ...blog, likes: blog.likes + 1 }

    blogService
      .update(id, changedBlog)
      .then((returnedBlog) =>
        setBlogs(blogs.map((blog) => (blog.id !== id ? blog : returnedBlog)))
      )
      .catch(() => {
        notificationDispatch({
          type: 'SHOW',
          payload: {
            message: `Blog '${blog.title}' by ${blog.author} was already removed from server`,
            type: 'danger'
          },
        })
        setTimeout(() => notificationDispatch({ type: 'HIDE' }), 3000)
      })
  }

  const removeBlog = (id, title, author) => {
    if (window.confirm(`Remove blog ${title} by ${author}`)) {
      blogService
        .remove(id)
        .then(() => setBlogs(blogs.filter((blog) => blog.id !== id)))
    }
  }

  const addBlog = (blogObject) => {
    blogService.create(blogObject).then((returnedBlog) => {
      setBlogs(blogs.concat(returnedBlog))
      notificationDispatch({
        type: 'SHOW',
        payload: {
          message: `a new blog ${blogObject.title} by ${blogObject.author} added`,
          type: 'success'
        },
      })
      toggleVisibility()
      setTimeout(() => notificationDispatch({ type: 'HIDE' }), 3000)
    })
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      setUser(user)
      setUsername('')
      setPassword('')
      notificationDispatch({
        type: 'SHOW',
        payload: {
          message: `welcome ${username}`,
          type: 'success'
        },
      })
      setTimeout(() => notificationDispatch({ type: 'HIDE' }), 5000)
    } catch (exception) {
      notificationDispatch({
        type: 'SHOW',
        payload: {
          message: 'wrong username or password',
          type: 'danger'
        },
      })
      setTimeout(() => notificationDispatch({ type: 'HIDE' }), 3000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.clear()
    setUser(null)
    setUsername('')
    setPassword('')
  }

  const blogForm = () => {
    blogs.sort((a, b) => b.likes - a.likes)

    return (
      <div className="container">
        <Togglable buttonLabel="new blog" visible={visible}>
          <BlogForm createBlog={addBlog} />
        </Togglable>
        <Table striped>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog.id}>
                <td>
                  <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    )
  }

  const padding = {
    padding: 5,
  }

  return (
    <Router>
      <div className="container">
        {user && (
          <><Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link as="span">
                  <Link style={padding} to="/">
                    blogs
                  </Link>
                </Nav.Link>
                <Nav.Link as="span">
                  <Link style={padding} to="/users">
                    users
                  </Link>
                </Nav.Link>
                <Nav.Link as="span">
                  <em style={padding}>{user.name} logged in</em>
                </Nav.Link>
                <Nav.Link as="span">
                  <Button variant="primary" onClick={handleLogout}>
                    logout
                  </Button>
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Navbar><Notification /></>
        )}
        <h2>blogs</h2>
        {!user ? (
          <>
            <Notification />
            <LoginForm
              username={username}
              password={password}
              handleUsernameChange={({ target }) => setUsername(target.value)}
              handlePasswordChange={({ target }) => setPassword(target.value)}
              handleSubmit={handleLogin} />
          </>
        ) : (
          <Routes>
            <Route path="/" element={blogForm()} />
            <Route path="/users" element={<Users users={users} />} />
            <Route path="/users/:id" element={<User users={users} />} />
            <Route
              path="/blogs/:id"
              element={
                <Blog
                  blogs={blogs}
                  updateBlogLikes={updateBlogLikes}
                  removeBlog={removeBlog}
                  user={user}
                />
              }
            />
          </Routes>
        )}
      </div>
    </Router>
  )
}

export default App
