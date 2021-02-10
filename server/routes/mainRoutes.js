const express = require("express");
const mainController = require("../controller/mainController");
const actionController = require("../controller/actionController");
const middle = require("../middle/middle");
const router = express.Router();



/********************************GET REQUEST*******************************/

router.route("/posts").get(middle, mainController.allPost);
router.route("/mypost").get(middle, mainController.myPost);
router.route("/userProfile/:id").get(middle, mainController.user);
router.route("/getFollowedPost").get(middle, mainController.allFollowedPost);

/********************************POST REQUEST*******************************/
router.route("/signup").post(mainController.signup);
router.route("/signin").post(mainController.signin);
router.route("/post").post(middle, mainController.post);

/********************************PUT REQUEST*******************************/

router.route("/likes").put(middle, actionController.likes);
router.route("/unlike").put(middle, actionController.unlike);
router.route("/comment").put(middle, actionController.comments);
router.route("/follow").put(middle, actionController.follow);
router.route("/unfollow").put(middle, actionController.unfollow);

/********************************DELETE REQUEST*******************************/

router.route("/deletePost/:postId").delete(middle, actionController.deletePost);


module.exports = router;