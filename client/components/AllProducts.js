import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
// import {fetchProducts, addProductToCart} from "....." redux function pathing

export class AllProducts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videoCategoryFilter: "All", //this.state dependent on state from header selector, will
      //connect later
    };
    this.handleAddToCart = this.handleAddToCart.bind(this);
  }

  //Uncomment when redux is set up
  // componentDidMount() {
  //   this.props.getProducts();
  // }

  async handleAddToCart(productId) {
    await this.props.addToCart(productId);
  }

  render() {
    const { handleAddToCart } = this;
    const products = this.props.products || [];
    let filteredProducts =
      this.state.videoCategoryFilter !== "All"
        ? products.filter(
            (product) => product.category === this.state.videoCategoryFilter
          )
        : products;

    const productsToShow =
      filteredProducts &&
      filteredProducts.map((product) => {
        return (
          <div className="single-video-card" key={product.id}>
            <Link to={`/videos/${product.id}`}>
              <img
                className="graceShopperLogo"
                src="/icons/video-preview-placeholder.png"
              />
              <div className="video-details">
                {product.title}
                {product.details}
                <button
                  className="add-to-cart-button"
                  type="button"
                  onClick={() => handleAddToCart(product.id)}
                >
                  Add to cart
                </button>
              </div>
              <div className="video-price">{product.price}</div>
            </Link>
          </div>
        );
      });

    return (
      <div>
        <h1>All Products:</h1>
        <section className="all-product-cards">
          {products.length > 0 ? (
            productsToShow.length > 0 ? (
              productsToShow
            ) : (
              <h2>
                There are no videos in the database matching the search
                parameters
              </h2>
            )
          ) : (
            <h2>There are no videos in the database</h2>
          )}
        </section>
      </div>
    );
  }
}

// const mapStateToProps = (state) => {
//   return {
//     products: state.products
//   };
// };

// const mapDispatchToProps = (dispatch) => {
//   return {
//     getProducts: () => dispatch(fetchProducts()),
//     addToCart: (productId) => dispatch(addProductToCart(productId)),
//   };
// };

// export default connect(mapStateToProps, mapDispatchToProps)(AllProducts)