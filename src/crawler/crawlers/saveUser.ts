import { UserModel } from "../../database";

/**
 * save the user to the MongoDB
 * @param user the user object from weibo or comment for subcomment
 */
export function saveUser(user: any) {
  return new Promise((resolve, reject) => {
    const {
      id,
      screenName,
      profileUrl,
      gender,
      followersCount,
      followCount,
      profileImageUrl,
      avatarHd,
    } = user;
    const userDoc = new UserModel({
      _id: id,
      id,
      screenName,
      profileUrl,
      gender,
      followersCount,
      followCount,
      profileImageUrl,
      avatarHd,
    });

    userDoc.save(function (err) {
      if (err&&err.code!==11000) {
        reject(err);
      }
      resolve(userDoc);
      // saved!
    });
  });
}
