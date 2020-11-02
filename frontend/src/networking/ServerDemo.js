
import React, { Component } from 'react';
import { AppRegistry, SectionList, StyleSheet, Text, View, Alert, Platform } from 'react-native';
const IpAddress = '192.168.0.31';
const apiGetAllProducts = 'http://' + IpAddress + ':3001/list_all_products';
const apiInsertNewProduct = 'http://' + IpAddress + ':3001/insert_new_product';
const apiUpdateAProduct = 'http://' + IpAddress + ':3001/update_a_product';
const apiDeleteAProduct = 'http://' + IpAddress + ':3001/delete_a_product';
const apiGetAllCategories = 'http://' + IpAddress + ':3001/list_all_categories';
const registerUser = 'http://' + IpAddress + ':3001/register';
const apiUpdateUser = 'http://' + IpAddress + ':3001/update_user';
const apiUpdatePassword = 'http://' + IpAddress + ':3001/update_password';
const apiCheckout = 'http://' + IpAddress + ':3001/checkout_product';

async function getProductsFromServer() {
    try {
        let response = await fetch(apiGetAllProducts);
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
async function login(username, password) {
    try {
        if (!username || !password) {
            return 'empty';
        } else {
            const user_name = username;
            const pass_word = password;
            let response = await fetch(`http://${IpAddress}:3001/login?username=${user_name}&password=${pass_word}`);
            let responseJson = await response.json();
            return responseJson.data;
        }
    } catch (error) {
        console.error(`Error is : ${error}`);
    }
}
async function register(username, password, gioi_tinh, ngay_sinh, email, sdt, dia_chi) {
    try {
        if (!username || !password || !gioi_tinh || !ngay_sinh || !email || !sdt || !dia_chi) {
            return 'empty';
        } else {
            let response = await fetch(registerUser, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                    gioi_tinh: gioi_tinh,
                    ngay_sinh: ngay_sinh,
                    email: email,
                    sdt: sdt,
                    dia_chi: dia_chi
                })
            });
            let responseJson = await response.json();
            return responseJson.result;
        }
    } catch (error) {
        console.error(`Error is : ${error}`);
    }
}
async function myAccount(user_name) {
    try {
        let response = await fetch(`http://${IpAddress}:3001/my_account?username=${user_name}`);
        let responseJson = await response.json();
        return responseJson.data;
    } catch {
        console.error(`Error is : ${error}`);
    }
}
async function update_user(username, gioi_tinh, ngay_sinh, email, sdt, dia_chi) {
    try {
        if (!gioi_tinh || !ngay_sinh || !email || !sdt || !dia_chi) {
            return 'empty';
        } else {
            let response = await fetch(apiUpdateUser, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    gioi_tinh: gioi_tinh,
                    ngay_sinh: ngay_sinh,
                    email: email,
                    sdt: sdt,
                    dia_chi: dia_chi
                })
            });
            let responseJson = await response.json();
            return responseJson.result;
        }
    } catch (error) {
        console.error(`Error is : ${error}`);
    }
}
async function update_password(username, old_password, new_password, confirm_password) {
    try {
        if (!old_password || !new_password || !confirm_password) {
            return 'empty';
        } else {
            if (new_password != confirm_password) {
                return 'confirm_failed';
            } else {
                let response = await fetch(apiUpdatePassword, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: username,
                        old_password: old_password,
                        new_password: new_password,
                    })
                });
                let responseJson = await response.json();
                return responseJson.result;
            }
        }
    } catch (error) {
        console.error(`Error is : ${error}`);
    }
}
async function productDetail(product_name) {
    try {
        let response = await fetch(`http://${IpAddress}:3001/list_product_with_productname?name=${product_name}`);
        let responseJson = await response.json();
        return responseJson.data;
    } catch {
        console.error(`Error is : ${error}`);
    }
}
async function insertNewProductToServer(params) {
    try {
        let response = await fetch(apiInsertNewProduct, {
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
async function updateAProduct(params) {
    try {
        let response = await fetch(apiUpdateAProduct, {
            method: 'PUT',
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
async function DeleteAProduct(params) {
    try {
        let response = await fetch(apiDeleteAProduct, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: params
            })
        });
        console.log(params)
        let responseJson = await response.json();
        return responseJson.result;
    } catch (error) {
        console.error(`Error is : ${error}`);
    }
}
async function getCategoriesFromServer(params) {
    try {
        let response = await fetch(apiGetAllCategories);
        let responseJson = await response.json();
        return responseJson.data;
    } catch (error) {
        console.error(`Error is : ${error}`);
    }
}
async function checkout(username, name_product, username_order, sdt_order, dia_chi_order, price_product, quantity) {
    try {
        let response = await fetch(apiCheckout, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                name_product: name_product,
                username_order: username_order,
                sdt_order: sdt_order,
                dia_chi_order: dia_chi_order,
                price_product: price_product,
                quantity: quantity
            })
        });
        let responseJson = await response.json();
        return responseJson.result;
    } catch (error) {
        console.error(`Error is : ${error}`);
    }
}
async function historyOrder(user_name) {
    try {
        let response = await fetch(`http://${IpAddress}:3001/list_history_order?username=${user_name}`);
        let responseJson = await response.json();
        return responseJson.data;
    } catch {
        console.error(`Error is : ${error}`);
    }
}
async function listUSers() {
    try {
        let response = await fetch(`http://${IpAddress}:3001/list_all_users`);
        let responseJson = await response.json();
        return responseJson.data;
    } catch {
        console.error(`Error is : ${error}`);
    }
}
async function managementOrder() {
    try {
        let response = await fetch(`http://${IpAddress}:3001/list_order_users`);
        let responseJson = await response.json();
        return responseJson.data;
    } catch {
        console.error(`Error is : ${error}`);
    }
}
async function modifiedOrder(order_id, trang_thai) {
    try {
        let response = await fetch(`http://${IpAddress}:3001/modified_order`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                order_id: order_id,
                trang_thai: trang_thai
            })
        });
        let responseJson = await response.json();
        return responseJson.result;
    } catch (error) {
        console.error(`Error is : ${error}`);
    }
}
export { getProductsFromServer };
export { insertNewProductToServer };
export { updateAProduct };
export { DeleteAProduct };
export { getCategoriesFromServer };
export { getProductsWithCategoryFromServer };
export { login };
export { register };
export { myAccount };
export { productDetail };
export { update_user };
export { checkout };
export { update_password };
export { historyOrder };
export { listUSers };
export { managementOrder };
export { modifiedOrder };