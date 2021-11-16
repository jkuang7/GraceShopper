import React from "react";
import { connect } from "react-redux";
// eslint-disable-next-line no-unused-vars
import { Link } from "react-router-dom";
import { fetchVideosByIds } from "../../store/videos";
import { fetchCartByUser } from "../../store/orders";

export class ShoppingCart extends React.Component {
  constructor(props) {
    super(props);

    const localCart = JSON.parse(localStorage.getItem("graceShopperCart"));

    this.state = {
      cartContents: localCart || [],
      cartTotalCost: 0,
      userId: 0,
    };

    this.handleCartCheckout = this.handleCartCheckout.bind(this);
    this.handleRemoveFromCart = this.handleRemoveFromCart.bind(this);
  }

  async componentDidMount() {
    //If a userid is found (user logged in), reflect in state.
    //Otherwise, userId defaults to 0 (guest user)
    this.props.user.id ? this.setState({ userId: this.props.user.id }) : null;

    //If a user is logged in, querry the db for any saved cart (incomplete orders), and merge with any locally stored cart.
    console.log(this.props);

    if (this.state.userId > 0) {
      console.log("user", this.state.userId);
      await this.props.getUserCart(this.state.userId);
      let userCart = this.props.orders.map((item) => item.videoId);
      let newCart = userCart.concat(this.state.cartContents);
      localStorage.setItem("graceShopperCart", newCart);
      this.setState({ cartContents: newCart });
      console.log(this.state.cartContents);
    }

    await this.props.getVideosInfo(this.state.cartContents);

    if (this.state.cartContents.length > 0) {
      let total = this.props.videos.reduce((a, b) => ({
        price: a.price + b.price,
      }));
      this.setState({ cartTotalCost: total.price });
    }
  }

  async handleRemoveFromCart(videoId) {
    const cart = this.state.cartContents;
    let cartItem = cart.findIndex((video) => video === videoId);
    cart.splice(cartItem, 1);
    this.setState({ cartContents: cart });
    let cartItems = JSON.stringify(this.state.cartContents);
    localStorage.setItem("graceShopperCart", cartItems);
    await this.props.getVideosInfo(this.state.cartContents);

    //Update displayed subtotal when items are removed
    let total =
      this.props.videos.length > 0
        ? this.props.videos.reduce((a, b) => ({
            price: a.price + b.price,
          }))
        : { price: 0 };
    this.setState({ cartTotalCost: total.price });

    //Add routing to remove from user db as well
  }

  async handleCartCheckout() {
    // await this.props.checkout();
    console.log("Checkout!");

    //clear cart from localStorage and set state cart to []
    window.localStorage.removeItem("graceShopperCart");
    this.setState({ cartContents: [] });
  }

  render() {
    const { handleRemoveFromCart, handleCartCheckout } = this;

    let cart = this.props.videos;

    const cartContentsView = cart.map((video) => {
      return (
        <div className="single-cart-item" key={video.id}>
          <Link to={`/videos/${video.id}`}>
            <img className="video-preview" src={video.imageURL} />
            <div className="video-details">
              {video.title}
              {/* {video.description} */}
            </div>
          </Link>
          <div>
            {" "}
            <button
              className="remove-from-cart-button"
              type="button"
              onClick={() => handleRemoveFromCart(video.id)}
            >
              Remove from cart
            </button>
          </div>
          <div className="video-price">{video.price} KREM</div>
        </div>
      );
    });

    const checkoutView = (
      <div className="checkout-card">
        <section className="checkout-top-half"></section>
        <section className="checkout-bottom-half">
          Subtotal: {`$${this.state.cartTotalCost}`}
          <button
            className="checkout-button"
            type="button"
            onClick={() => handleCartCheckout()}
          >
            Checkout
          </button>
        </section>
      </div>
    );

    return (
      <div>
        <h1>Your Cart:</h1>
        <section className="all-cart-products">
          {" "}
          {cart.length > 0 ? cartContentsView : <h2>Your cart is empty!</h2>}
        </section>

        <section className="checkout-box">{checkoutView}</section>
        {/* <section className="recommendations">(optional)</section> */}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth,
    videos: state.videos,
    orders: state.orders,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getVideosInfo: (videoArray) => dispatch(fetchVideosByIds(videoArray)),
    getUserCart: (userId) => dispatch(fetchCartByUser(userId)),
    // removeFromCart: (productId) =>
    // checkOut: () =>
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ShoppingCart);
