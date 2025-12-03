const dummy = blogs => 1

const totalLikes = blogs => blogs.reduce((previous, blog) => previous + blog.likes, 0)

const favouriteBlog = blogs => {
  let favourite = {}

  blogs.forEach(blog => {
    const likes = favourite.likes || 0
    if (blog.likes > likes) favourite = blog
  })

  return favourite
}

const mostBlogs = blogs => {
  let authors = {}
  let maxBlogAuthor = {}

  blogs?.forEach(blog => {
    authors[blog.author] = authors[blog.author] ? authors[blog.author] + 1 : 1
  })

  for (const author in authors) {
    const authorBlogCount = authors[author]
    if (!maxBlogAuthor.blogs || authorBlogCount > maxBlogAuthor.blogs) {
      maxBlogAuthor = {
        author: author,
        blogs: authorBlogCount
      }
    }
  }

  return maxBlogAuthor
}

const mostLikes = blogs => {
  let authors = {}
  let maxLikeAuthor = {}

  blogs?.forEach(blog => {
    authors[blog.author] = authors[blog.author] ? authors[blog.author] + blog.likes : blog.likes
  })

  for (const author in authors) {
    const authorLikesCount = authors[author]
    if (!maxLikeAuthor.likes || authorLikesCount > maxLikeAuthor.likes) {
      maxLikeAuthor = {
        author: author,
        likes: authorLikesCount
      }
    }
  }

  return maxLikeAuthor
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}