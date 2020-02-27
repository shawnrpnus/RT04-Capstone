const jsog = require("jsog");

const getCustomerFromLocalStorage = () => {
  let customer = localStorage.getItem("customer");
  if (customer) {
    customer = jsog.parse(customer);
    return customer;
  } else {
    return null;
  }
};

// customer is the object BEFORE jsog.decode
const saveCustomerToLocalStorage = customerObj => {
  localStorage.setItem("customer", jsog.stringify(customerObj));
};

const removeCustomerFromLocalStorage = () => {
  localStorage.removeItem("customer");
};
export default {
  getCustomerFromLocalStorage,
  saveCustomerToLocalStorage,
  removeCustomerFromLocalStorage
};
