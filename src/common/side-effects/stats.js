import { db } from "../utils/firebase";

const statsRef = db.collection("stats").doc("all");

export default {
  incrementStats : (statsToUpdate = []) => {
    return new Promise((resolve, reject) => {
      if (!statsToUpdate.length)
        return reject({ message: "no stats provided to update" });

      db.runTransaction(transaction => {
        transaction.get(statsRef)
          .then(stats => {
            const statsData = stats.data();
            let { applications, posts, users } = statsData;

            applications = Object.assign({}, applications, {
              accepted: statsToUpdate.indexOf("applications.accepted") >= 0 ? applications.accepted + 1 : applications.accepted,
              rejected: statsToUpdate.indexOf("applications.rejected") >= 0 ? applications.rejected + 1 : applications.rejected,
              pending: statsToUpdate.indexOf("applications.pending") >= 0 ? applications.pending + 1 : applications.pending,
              draft: statsToUpdate.indexOf("applications.draft") >= 0 ? applications.draft + 1 : applications.draft,
              total: statsToUpdate.indexOf("applications.total") >= 0 ? applications.total + 1 : applications.total,
            });

            posts = Object.assign({}, posts, {
              archived: statsToUpdate.indexOf("posts.archived") >= 0 ? posts.archived + 1 : posts.archived,
              draft: statsToUpdate.indexOf("posts.draft") >= 0 ? posts.draft + 1 : posts.draft,
              published: statsToUpdate.indexOf("posts.published") >= 0 ? posts.published + 1 : posts.published,
              total: statsToUpdate.indexOf("posts.total") >= 0 ? posts.total + 1 : posts.total,
            });

            users = Object.assign({}, users, {
              admins: statsToUpdate.indexOf("users.admins") >= 0 ? users.admins + 1 : users.admins,
              students: statsToUpdate.indexOf("users.students") >= 0 ? users.students + 1 : users.students,
              applicants: statsToUpdate.indexOf("users.applicants") >= 0 ? users.applicants + 1 : users.applicants,
              staff: statsToUpdate.indexOf("users.staff") >= 0 ? users.staff + 1 : users.staff,
              total: statsToUpdate.indexOf("users.total") >= 0 ? users.total + 1 : users.total,
            });

            transaction.update(statsRef, { applications, posts, users });
          })
      })
      .then(() => resolve())
      .catch(error => reject(error))
    });
  },

  decrementStats: (statsToUpdate = []) => {
    return new Promise((resolve, reject) => {
      if (!statsToUpdate.length)
        return reject({
          message: "no stats provided to update"
        });

      db.runTransaction(transaction => {
          transaction.get(statsRef)
            .then(stats => {
              const statsData = stats.data();
              let {
                applications,
                posts,
                users
              } = statsData;

              applications = Object.assign({}, applications, {
                accepted: statsToUpdate.indexOf("applications.accepted") >= 0 ? applications.accepted - 1 : applications.accepted,
                rejected: statsToUpdate.indexOf("applications.rejected") >= 0 ? applications.rejected - 1 : applications.rejected,
                pending: statsToUpdate.indexOf("applications.pending") >= 0 ? applications.pending - 1 : applications.pending,
                draft: statsToUpdate.indexOf("applications.draft") >= 0 ? applications.draft - 1 : applications.draft,
                total: statsToUpdate.indexOf("applications.total") >= 0 ? applications.total - 1 : applications.total,
              });

              posts = Object.assign({}, posts, {
                archived: statsToUpdate.indexOf("posts.archived") >= 0 ? posts.archived - 1 : posts.archived,
                draft: statsToUpdate.indexOf("posts.draft") >= 0 ? posts.draft - 1 : posts.draft,
                published: statsToUpdate.indexOf("posts.published") >= 0 ? posts.published - 1 : posts.published,
                total: statsToUpdate.indexOf("posts.total") >= 0 ? posts.total - 1 : posts.total,
              });

              users = Object.assign({}, users, {
                admins: statsToUpdate.indexOf("users.admins") >= 0 ? users.admins - 1 : users.admins,
                students: statsToUpdate.indexOf("users.students") >= 0 ? users.students - 1 : users.students,
                applicants: statsToUpdate.indexOf("users.applicants") >= 0 ? users.applicants - 1 : users.applicants,
                staff: statsToUpdate.indexOf("users.staff") >= 0 ? users.staff - 1 : users.staff,
                total: statsToUpdate.indexOf("users.total") >= 0 ? users.total - 1 : users.total,
              });

              transaction.update(statsRef, {
                applications,
                posts,
                users
              });
            })
        })
        .then(() => resolve())
        .catch(error => reject(error))
    });
  }
}