# Overview:

**Spree Commerce** (https://demo.spreecommerce.org/) is an open-source eCommerce platform. It
provides standard shopping workflows including user registration, product browsing, cart
management, and checkout with payment capabilities.

# Challenge:

Write automated tests using **Playwright** (in the language of your choice for the **Spree Commerce
demo store** covering **UI** test scenarios as listed below. Commit your code to a **GitHub** or **GitLab**
repository and share the project link as a response.

# UI Test Scenarios:

1. **Navigate** to the Spree Commerce demo store.
2. Click on the user icon and **Sign Up** as a new user from the registration page from
    the side menu. (Log out if needed)
3. **Log in** with the newly registered user credentials.
4. **Browse products** and **open a product detail page**.
5. **Add the product to cart**.
6. **Go to the cart** and verify the product details (name, quantity, price).
7. **Proceed to checkout** and complete the following:
    ○ Add a shipping address.
    ○ Select a shipping method.
    ○ Verify the different delivery and pricing options.
    ○ Select a payment method. (Kindly refer test card details on the checkout)
    ○ Complete the order.
8. **Verify the order confirmation** page is shown with an order number and success
    message.
9. Add **assertions** at each key step (e.g., URL validation, UI messages, order
    confirmation, etc.).
**BONUS Challenge - CI Integration:**
● Integrate the created Playwright test automation framework in Gitlab or Github
Pipelines and enable the test execution to be triggered from the pipeline.
**Considerations:**
Kindly consider below points while developing the test.
● Naming conventions, modularization, reusability and readability of code with
appropriate project structure.


