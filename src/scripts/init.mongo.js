db = new Mongo().getDB('bookmarks')

db.bookmarks.remove({})

db.bookmarks.insert([
  {
    name: 'fastmail',
    url: 'fastmail.com',
    author: 'Lockwood',
    tags: 'email,personal,business',
    private: true,
    created: new Date().getTime(),
    comment: 'main email app'
  },
  {
    name: 'feedly',
    url: 'feedly.com',
    author: 'Lockwood',
    tags: 'news,tech,personal',
    private: false,
    created: new Date().getTime(),
    comment: 'my news feed'
  }
])
