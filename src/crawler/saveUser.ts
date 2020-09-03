import { UserModel } from "../database";

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
      if (err) {
        reject(err);
      }
      resolve(userDoc);
      // saved!
    });
  });
}
