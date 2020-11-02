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
async function getListNotification() {
  try {
    let response = await fetch(`${IpAddress}/list_all_notification`);
    let responseJson = await response.json();
    return responseJson.data;
  } catch (error) {
    console.error(`Error is : ${error}`);
  }
}
async function getProductsWithCategoryFromServer(params) {
  try {
    const category_name = params;
    let response = await fetch(`http://${IpAddress}:3001/list_products_with_category?category_name=${category_name}`);
    let responseJson = await response.json();
    return responseJson.data;
  } catch (error) {
    console.error(`Error is : ${error}`);
  }
}
export { getListPost, getListNotification };