const user = {
    _id: "5a437a1f514ab7f168ddf139",
    username: "tester",
    name: "Testing",
}

const blogs = [
    {
        id: "5a451df7571c224a31b5c8ce",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        user
    },
    {
        id: "5a451df7571c224a31b5c8cf",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        user
    },
    {
        id: "5a451df7571c224a31b5c8c1",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        user
    },
]

const getAll = () => {
    return Promise.resolve(blogs)
}

export default { getAll, blogs }