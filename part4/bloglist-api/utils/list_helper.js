
const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    let totalLikes = blogs.reduce(function(prev, cur) {
        return prev + cur.likes;
    }, 0)
    return totalLikes
}

const favoriteBlog = (blogs) => {
    let blogsCopy = [...blogs]
    blogsCopy.sort(function(a,b) {
        if(a.likes > b.likes) return 1
        else if(a.likes < b.likes) return -1
        return 0
    })
    return blogsCopy[blogsCopy.length-1]
}

const mostBlogs = (blogs) => {
    let blogsCopy = [...blogs]
    let authors = {}
    blogsCopy.map(blog => {
        if(authors[blog.author]) {
            authors[blog.author]++
        } else {
            authors[blog.author] = 1
        }
    })
    let biggestAuthor = {}
    let aux = 0
    Object.entries(authors).forEach(
        ([key, value]) => {
            if(value > aux) {
                aux = value
                biggestAuthor = {
                    author: key,
                    blogs: value
                }
            }
        }
    )
    return biggestAuthor
}

const mostLikes = (blogs) => {
    let blogsCopy = [...blogs]
    let authors = {}
    blogsCopy.map(blog => {
        if(authors[blog.author]) {
            authors[blog.author] += blog.likes
        } else {
            authors[blog.author] = blog.likes
        }
    })
    let biggestAuthor = {}
    let aux = 0
    Object.entries(authors).forEach(
        ([key, value]) => {
            if(value > aux) {
                aux = value
                biggestAuthor = {
                    author: key,
                    likes: value
                }
            }
        }
    )
    return biggestAuthor
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}