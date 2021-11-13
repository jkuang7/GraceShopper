import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

// import { fetchUser, fetchUserVideos } from '../redux/user';

class UserProfile extends React.Component {
  //REDUX - Gets User and Associated Videos From DB
  // componentDidMount() {
  //   try {
  //     this.props.getUser(this.props.match.params.userId);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  render() {
    const user = this.props.user;

    return (
      <div>
        <section>
          <h2>User Profile</h2>
          <img
            className='profile-picture'
            src='/icons/profile-picture-placeholder.png'
          />
          <h3>Name: {user.firstName + ' ' + user.lastName}</h3>
          <h3>Email: To Get From Props</h3>
        </section>
        <section>
          <h2>Your Products</h2>
          {user.videos.map((video) => {
            return (
              <div key={video.id}>
                <Link to={`/videos/${video.id}`}>
                  <img src={video.imageUrl} />
                  <div>
                    <h3>{video.title}</h3>
                    <h4>{video.description}</h4>
                  </div>
                </Link>
              </div>
            );
          })}
        </section>
      </div>
    );
  }
}

// const mapState = (state) => ({
//   user: state.user,
// });

// const mapDispatch = (dispatch) => ({
//   getUser: (userId) => dispatch(fetchUser(userId)),
// });

//connect(mapStateToProps, mapDispatchToProps)(UserProfile) -> export default once db connected

export default UserProfile;