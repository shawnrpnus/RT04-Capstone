export default class CreateContactUsRequest {
  contactUsCategory;
  customerEmail;
  content;
  firstName;
  lastName;

  constructor(contactUsCategory, customerEmail, content, firstName, lastName) {
    this.customerEmail = customerEmail;
    this.content = content;
    this.contactUsCategory = contactUsCategory;
    this.firstName = firstName;
    this.lastName = lastName;
  }
}
