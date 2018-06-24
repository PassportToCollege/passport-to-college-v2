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
          if (storage)
            heroPromises.push(storage.ref("posts/heros").child(`${snapshot.id}.png`).getDownloadURL());
          
            let post = snapshot.data();
          post.id = snapshot.id;

          posts.push(post);
        });

        if (storage) {
          return Promise.all(heroPromises).then(urls => {
            for (let post of posts) {
              post.hero = urls.find(url => {
                return url.indexOf(post.id) > -1;
              });
            }
  
            dispatch(postsGetDone(posts));
          });
        }

        dispatch(postsGetDone(posts));
      })
      .catch(error => {
        Console.log(error);
        dispatch(postsGetFailed(error));
      })
  };
};

export const doGetPostsByState = (state = "all") => {
  return dispatch => {
    if (state === "all")
      return doPostsGet();

    if (state !== "archived" || state !== "draft")
      return dispatch(postsGetFailed({ message: "unknown post state provided" }));
    
    dispatch(postsGetInitiated());

    let postRef;
    if (state === "archived") {
      postRef = db.collection("posts")
        .where("state.archived", "==", true)
    } else {
      postRef = db.collection("posts")
        .where("state.draft", "==", true)
    }

    return postRef.orderBy("createdAt", "desc")
      .get()
      .then(snapshots => {
        if (snapshots.empty)
          return dispatch(postsGetFailed({ message: "no posts found" }));

        let posts = [];
        let heroPromises = [];

        snapshots.forEach(snapshot => {
          if (storage)
            heroPromises.push(storage.ref("posts/heros").child(`${snapshot.id}.png`).getDownloadURL());
          
            let post = snapshot.data();
          post.id = snapshot.id;

          posts.push(post);
        });

        if (storage) {
          return Promise.all(heroPromises).then(urls => {
            for (let post of posts) {
              post.hero = urls.find(url => {
                return url.indexOf(post.id) > -1;
              });
            }
  
            dispatch(postsGetDone(posts));
          });
        }

        dispatch(postsGetDone(posts));
      })
      .catch(error => {
        Console.log(error);
        dispatch(postsGetFailed(error));
      });
  }
}

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

export const postsGetMostRecentByCategoryInititated = category => {
  return {
    type: types.POSTS_GET_MOST_RECENT_BY_CATEGORY_INITIATED,
    category
  }
};

export const postsGetMostRecentByCategoryFailed = (error, category) => {
  return {
    type: types.POSTS_GET_MOST_RECENT_BY_CATEGORY_FAILED,
    error, category
  }
};

export const postsGetMostRecentByCategoryDone = (more, category) => {
  return {
    type: types.POSTS_GET_MOST_RECENT_BY_CATEGORY_DONE,
    more, category
  }
};

export const doPostsGetMostRecentByCategory = (category, options) => {
  return dispatch => {
    dispatch(postsGetMostRecentByCategoryInititated(category));

    category = category || {};
    options = options || {};

    const catKey = Object.keys(category);

    let query = db.collection("posts");
    for (let key of catKey) {
      if (category[key])
        query = query.where(`category.${key}`, "==", true);
    }

    return query.where("state.published", "==", true)
      .orderBy("publishedOn", "desc")
      .limit(5)
      .get()
      .then(snapshots => {
        if (snapshots.empty)
          return dispatch(postsGetMostRecentByCategoryFailed({ message: "no posts found" }, category));

        let posts = [];
        let heroPromises = [];

        snapshots.forEach(snapshot => {
          let post = snapshot.data();
          post.id = snapshot.id;

          if (options.exclude.indexOf(post.id) > -1) {
            return null;
          } else {
            if (storage)
              heroPromises.push(storage.ref("posts/heros").child(`${snapshot.id}.png`).getDownloadURL());
            
            posts.push(post);
          }
        });

        if (!posts.length)
          return dispatch(postsGetMostRecentByCategoryFailed({ message: "no posts found" }, category)); 

        if (Storage) {
          return Promise.all(heroPromises).then(urls => {
            for (let post of posts) {
              post.hero = urls.find(url => {
                return url.indexOf(post.id) > -1;
              });
            }
  
            dispatch(postsGetMostRecentByCategoryDone(posts, category));
          });
        }

        dispatch(postsGetMostRecentByCategoryDone(posts, category));
      })
      .catch(error => {
        Console.log(error);
        dispatch(postsGetMostRecentByCategoryFailed(error, category));
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

    if (category  && category !== "all") {
      postRef = db.collection("posts")
        .where("state.published", "==", true)
        .where(`category.${category}`, "==", true)
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

            if (storage)
              heroPromises.push(storage.ref("posts/heros").child(`${snapshot.id}.png`).getDownloadURL());
  
            authorPromises.push(db.collection("users").doc(post.author).get());
            posts.push(post);
          });

          if (storage) {
            return Promise.all(heroPromises).then(urls => {
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

                if (storage)
                  heroPromises.push(storage.ref("posts/heros").child(`${snapshot.id}.png`).getDownloadURL());
                
                authorPromises.push(db.collection("users").doc(post.author).get());
                posts.push(post);
              });

              if (storage) {
                return Promise.all(heroPromises).then(urls => {
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