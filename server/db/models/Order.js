const Sequelize = require("sequelize");
const db = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const axios = require("axios");
const { User, OrderVideo, UserOwnedVideo } = require("../index");

const SALT_ROUNDS = 5;

const Order = db.define(
  "order",
  {
    orderId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    isCart: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      isEmpty: false,
    },
  },
  { timestamps: false }
);

Order.addVideoToOrder = async (videoID, userID, Qty) => {
  try {
    await this.create({
      videoID: videoID,
      userID: userID,
      quantity: Qty,
    });
  } catch (err) {
    console.log("Adding to cart error");
  }
};
//use isCart to checkout
/**
 * @TODO
 * Need to update quantity of videos later
 */
Order.checkOut = async (id) => {
  try {
    //Update Order isCart to false
    const ordertoFulfill = await Order.findOne({
      where: { userId: id, isCart: true },
    });

    const fulfilledOrder = await ordertoFulfill.update({
      isCart: false,
    });

    //Create new order for user
    await Order.create({
      userId: id,
      isCart: true,
    });

    return fulfilledOrder.orderId;

    // //Find all ordervideos for past checkout
    // const ordervideos = await OrderVideo.findAll({
    //   // where: {
    //   //   orderId: fulfilledOrder.orderId,
    //   // },
    // });

    // //Find or create user unique videos for user
    // await Promise.all(
    //   ordervideos.map(async (ordervideo) => {
    //     UserOwnedVideo.findOrCreate({
    //       where: {
    //         userId: id,
    //         videoId: ordervideo.videoId,
    //       },
    //     });
    //   })
    // );
    // return newOrder;
  } catch (err) {
    console.log("Error Checking Out");
  }
};

module.exports = Order;
