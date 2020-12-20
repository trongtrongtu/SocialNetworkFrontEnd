const IpAddress = 'http://localhost:3001';

async function getListPost() {
  try {
    let response = await fetch(`${IpAddress}/list_all_post`);
    let responseJson = await response.json();
    return responseJson.data;
  } catch (error) {
    console.error(`Error is : ${error}`);
  }
}

async function getPostDetail(postId) {
  try {
    let response = await fetch(`${IpAddress}/post_detail?postId=${postId}`);
    let responseJson = await response.json();
    return responseJson.data;
  } catch (error) {
    console.error(`Error is : ${error}`);
  }
}

async function getListNotification() {
  try {
    let response = await fetch(`${IpAddress}/list_all_notification`);
    let responseJson = await response.json();
    return responseJson.data;
  } catch (error) {
    console.error(`Error is : ${error}`);
  }
}

async function getListUsersSuggestions() {
  try {
    let response = await fetch(`${IpAddress}/list_all_users_suggestions`);
    let responseJson = await response.json();
    return responseJson.data;
  } catch (error) {
    console.error(`Error is : ${error}`);
  }
}

async function getProfile(userId) {
  try {
    let response = await fetch(`${IpAddress}/profile?userId=${userId}`);
    let responseJson = await response.json();
    return responseJson.data;
  } catch (error) {
    console.error(`Error is : ${error}`);
  }
}

async function getAuthUser(userId) {
  try {
    let response = await fetch(`${IpAddress}/authUser?userId=${userId}`);
    let responseJson = await response.json();
    return responseJson.data;
  } catch (error) {
    console.error(`Error is : ${error}`);
  }
}

async function getListPostUser(userId) {
  try {
    let response = await fetch(`${IpAddress}/list_all_post_user?userId=${userId}`);
    let responseJson = await response.json();
    return responseJson.data;
  } catch (error) {
    console.error(`Error is : ${error}`);
  }
}

async function addNewPosts(params) {
  try {
    let response = await fetch(`${IpAddress}/create_post`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params)
    });
    let responseJson = await response.json();
    return responseJson.result;
  } catch (error) {
    console.error(`Error is : ${error}`);
  }
}

async function addLike(params) {
  try {
    let response = await fetch(`${IpAddress}/create_like`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params)
    });
    let responseJson = await response.json();
    return responseJson.result;
  } catch (error) {
    console.error(`Error is : ${error}`);
  }
}

export { getListPost, getListNotification, getProfile, getListPostUser, getPostDetail, getAuthUser, getListUsersSuggestions, addNewPosts,addLike };