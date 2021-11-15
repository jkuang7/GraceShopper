const router = require('express').Router();
const {
  User,
  Video,
  Order,
  OrderVideo,
  ShoppingCart,
  UserOwnedVideo,
} = require('../db/index');

// GET /api/users
router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

/*
  // Shopping Cart of videos for some given user
    const videos = await Video.findAll({
      include: {
        model: ShoppingCart,
        where: {
          userId: req.params.id,
        },
      },
    });
    let user = await User.findByPk(req.params.id);
    user = { ...user, shoppingCart: videos };
    res.json(user);

  - Finding Videos that a User owns?
    const videos = await Video.findAll({
      include: {
        model: UserOwnedVideo,
        where: {
          userId: req.params.id,
        }
      }
    });
    let user = await User.findByPk(req.params.id);
    user = {...user, videos: videos};
    res.json(user);
*/

// GET /api/users/userId
router.get('/:userId', async (req, res, next) => {
  try {
    const videos = await Video.findAll({
      include: {
        model: UserOwnedVideo,
        where: {
          userId: req.params.userId,
        },
      },
    });
    let user = await User.findOne({
      where: { id: req.params.userId },
    });
    user = { ...user, ownedVideos: videos };
    res.json(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
