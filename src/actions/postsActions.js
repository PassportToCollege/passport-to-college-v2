import * as types from "./actionTypes";
import { db, storage } from "../utils/firebase";

const Console = console;

// GET actions
export const postsGetInitiated = () => {
  return {
    type: types.POSTS_GET_INITIATED
  };
};

export const postsGetFailed = (error) => {
  return {
    type: types.POSTS_GET_FAILED,
    error
  };
};

export const postsGetDone = posts => {
  return {
    type: types.POSTS_GET_DONE,
    posts
  };
};

export const doPostsGet = () => {
  return dispatch => {
    dispatch(postsGetInitiated());

    return db.collection("posts")
      .orderBy("createdAt", "desc")
      .get()
      .then(snapshots => {
        if (snapshots.empty)
          return dispatch(postsGetFailed({ message: "no posts found" }));

        let posts = [];
        let heroPromises = [];

        snapshots.forEach(snapshot => {
          heroPromises.push(storage.ref("posts/heros").child(`${snapshot.id}.png`).getDownloadURL());
          let post = snapshot.data();
          post.id = snapshot.id;

          posts.push(post);
        });

        Promise.all(heroPromises).then(urls => {
          for (let post of posts) {
            post.hero = urls.find(url => {
              return url.indexOf(post.id) > -1;
            });
          }

          dispatch(postsGetDone(posts));
        });

      })
      .catch(error => {
        Console.log(error);
        dispatch(postsGetFailed(error));
      })
  };
};

export const postsGetMostRecentInitiated = () => {
  return {
    type: types.POSTS_GET_MOST_RECENT_INITIATED
  };
};

export const postsGetMostRecentFailed = (error) => {
  return {
    type: types.POSTS_GET_MOST_RECENT_FAILED,
    error
  };
};

export const postsGetMostRecentDone = mostRecent => {
  return {
    type: types.POSTS_GET_MOST_RECENT_DONE,
    mostRecent
  };
};

export const doPostsGetMostRecent = () => {
  return dispatch => {
    dispatch(postsGetMostRecentInitiated());

    return db.collection("posts")
      .where("state.published", "==", true)
      .orderBy("publishedOn", "desc")
      .limit(5)
      .get()
      .then(snapshots => {
        if (snapshots.empty)
          return dispatch(postsGetMostRecentFailed({ message: "no posts found" }));

        let posts = [];
        let heroPromises = [];
        let authorPromises = [];

        snapshots.forEach(snapshot => {
          let post = snapshot.data();
          post.id = snapshot.id;

          heroPromises.push(storage.ref("posts/heros").child(`${snapshot.id}.png`).getDownloadURL());
          authorPromises.push(db.collection("users").doc(post.author).get());

          posts.push(post);
        });

        Promise.all(heroPromises).then(urls => {
          for (let post of posts) {
            post.hero = urls.find(url => {
              return url.indexOf(post.id) > -1;
            });
          }

          Promise.all(authorPromises).then(authors => {
            for (let post of posts) {
              post.author = authors.find(author => {
                return author.id === post.author;
              });

              post.author = post.author.data();
            }

            dispatch(postsGetMostRecentDone(posts));
          });
        });

      })
      .catch(error => {
        Console.log(error)
        dispatch(postsGetMostRecentFailed(error));
      })
  };
};

export const postsGetMostRecentByCategoryInititated = categories => {
  return {
    type: types.POSTS_GET_MOST_RECENT_BY_CATEGORY_INITIATED,
    categories
  }
};

export const postsGetMostRecentByCategoryFailed = (error, categories) => {
  return {
    type: types.POSTS_GET_MOST_RECENT_BY_CATEGORY_FAILED,
    error, categories
  }
};

export const postsGetMostRecentByCategoryDone = (more, categories) => {
  return {
    type: types.POSTS_GET_MOST_RECENT_BY_CATEGORY_DONE,
    more, categories
  }
};

export const doPostsGetMostRecentByCategory = (categories, options) => {
  return dispatch => {
    dispatch(postsGetMostRecentByCategoryInititated(categories));

    categories = categories || {};
    options = options || {};

    const catKeys = Object.keys(categories);

    let query = db.collection("posts");
    for (let key of catKeys) {
      if (categories[key])
        query = query.where(`categories.${key}`, "==", true);
    }

    return query.where("state.published", "==", true)
      .orderBy("publishedOn", "desc")
      .limit(5)
      .get()
      .then(snapshots => {
        if (snapshots.empty)
          return dispatch(postsGetMostRecentByCategoryFailed({ message: "no posts found" }, categories));

          let posts = [];
        let heroPromises = [];

        snapshots.forEach(snapshot => {
          let post = snapshot.data();
          post.id = snapshot.id;

          heroPromises.push(storage.ref("posts/heros").child(`${snapshot.id}.png`).getDownloadURL());
          posts.push(post);
        });

        Promise.all(heroPromises).then(urls => {
          for (let post of posts) {
            post.hero = urls.find(url => {
              return url.indexOf(post.id) > -1;
            });
          }

          dispatch(postsGetMostRecentByCategoryDone(posts, categories));
        });
      })
      .catch(error => {
        Console.log(error);
        dispatch(postsGetMostRecentByCategoryFailed(error, categories));
      })
  };
};

export const paginatePostsInitiated = page => {
  return {
    type: types.PAGINATE_POSTS_INITIATED,
    page
  };
};

export const paginatePostsDone = (posts, page) => {
  return {
    type: types.PAGINATE_POSTS_DONE,
    page, posts
  };
};

export const paginatePostsFailed = (error, page) => {
  return {
    type: types.PAGINATE_POSTS_FAILED,
    page, error
  };
};

export const doPostsPaginate = (page, category) => {
  page = parseInt(page, 10);
  
  return dispatch => {
    dispatch(paginatePostsInitiated(page));
    let postRef;

    if (category) {
      postRef = db.collection("posts")
        .where("state.published", "==", true)
        .where(`categories.${category}`, "==", true)
        .orderBy("publishedOn", "desc")
    } else {
      postRef = db.collection("posts")
        .where("state.published", "==", true)
        .orderBy("publishedOn", "desc")
    }

    if (page === 1) {
      return postRef
        .limit(25)
        .get()
        .then(snapshots => {
          if (snapshots.empty)
            return dispatch(paginatePostsFailed({ message: "no posts found" }));

          let posts = [];
          let heroPromises = [];
          let authorPromises = [];

          snapshots.forEach(snapshot => {
            let post = snapshot.data();
            post.id = snapshot.id;

            heroPromises.push(storage.ref("posts/heros").child(`${snapshot.id}.png`).getDownloadURL());
            authorPromises.push(db.collection("users").doc(post.author).get());

            posts.push(post);
          });

          Promise.all(heroPromises).then(urls => {
            for (let post of posts) {
              post.hero = urls.find(url => {
                return url.indexOf(post.id) > -1;
              });
            }

            Promise.all(authorPromises).then(authors => {
              for (let post of posts) {
                post.author = authors.find(author => {
                  return author.id === post.author;
                });

                post.author = post.author.data();
              }

              dispatch(paginatePostsDone(posts, page));
            });
          });

        })
        .catch(error => {
          Console.log(error)
          dispatch(paginatePostsFailed(error));
        });
    } else {
      postRef.limit((page - 1) * 25)
        .get()
        .then(tempSnapshots => {
          const lastVisible = tempSnapshots.docs[tempSnapshots.docs.length - 1];
          
          return postRef.startAfter(lastVisible)
            .limit(25)
            .get()
            .then(snapshots => {
              if (snapshots.empty)
                return dispatch(paginatePostsFailed({ message: "no posts found" }));

              let posts = [];
              let heroPromises = [];
              let authorPromises = [];

              snapshots.forEach(snapshot => {
                let post = snapshot.data();
                post.id = snapshot.id;

                heroPromises.push(storage.ref("posts/heros").child(`${snapshot.id}.png`).getDownloadURL());
                authorPromises.push(db.collection("users").doc(post.author).get());

                posts.push(post);
              });

              Promise.all(heroPromises).then(urls => {
                for (let post of posts) {
                  post.hero = urls.find(url => {
                    return url.indexOf(post.id) > -1;
                  });
                }

                Promise.all(authorPromises).then(authors => {
                  for (let post of posts) {
                    post.author = authors.find(author => {
                      return author.id === post.author;
                    });

                    post.author = post.author.data();
                  }

                  dispatch(paginatePostsDone(posts, page));
                });
              });

            })
            .catch(error => {
              Console.log(error)
              dispatch(paginatePostsFailed(error));
            }) 
        })
        .catch(error => {
          Console.log(error)
          dispatch(paginatePostsFailed(error));
        });
    }
  };
};