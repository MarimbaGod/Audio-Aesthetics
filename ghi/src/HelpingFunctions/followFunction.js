export const handleFollow = async (userId, updateFollowerCount) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_HOST}/api/users/follow/${userId}`, {
        method: 'POST',
        credentials: 'include',
    });
    if (response.ok) {
      updateFollowerCount()
    }
    else {
      const errorData = await response.json();
      console.error('Failed to follow the user:', errorData.message);
    }
  } catch (error) {
    console.error('Error while following the user:', error);
  }
};

export const handleUnfollow = async (userId, updateFollowerCount) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_HOST}/api/users/unfollow/${userId}`, {
        method: 'POST',
        credentials: 'include',
    });
    if (response.ok) {
      updateFollowerCount()
    } else {
      const errorData = await response.json();
      console.error('Failed to unfollow the user:', errorData.message);
    }
  } catch (error) {
    console.error('Error while unfollowing the user:', error);
  }
};
