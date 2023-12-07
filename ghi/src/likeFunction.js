export const handleLike = async (postId) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_HOST}/api/posts/${postId}/like`, {
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
    } else {
      const errorData = await response.json();
      console.error('Failed to like the post:', errorData.message);
    }
  } catch (error) {
    console.error('Error while liking the post:', error);
  }
};

export const handleUnlike = async (postId) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_HOST}/api/posts/${postId}/unlike`, {
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
    } else {
      const errorData = await response.json();
      console.error('Failed to like the post:', errorData.message);
    }
  } catch (error) {
    console.error('Error while liking the post:', error);
  }
};
