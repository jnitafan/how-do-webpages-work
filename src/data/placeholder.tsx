import React from "react";

const placeholderHTML = () => {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <title>HTML Template with Image and Tables and stuff</title>

        <link
          href="https://fonts.googleapis.com/css2?family=Roboto&display=swap"
          rel="stylesheet"
        />
      </head>

      <body>
        <header>
          <h1>Welcome to HTML Example</h1>
          <p>
            This page demonstrates a simple layout with a placeholder image and
            structured tables for illustrative purposes.
          </p>
        </header>

        <main>
          <section>
            <h2>Example Placeholder Image</h2>
            <img
              src="https://placehold.co/600x400/EEE/31343C"
              alt="Placeholder showing example content"
            />
            <p>
              The image above is a generic placeholder used for design layout
              purposes.
            </p>
          </section>

          <section>
            <h2>Simple Data Table</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>001</td>
                  <td>Alice</td>
                  <td>Active</td>
                </tr>
                <tr>
                  <td>002</td>
                  <td>Bob</td>
                  <td>Inactive</td>
                </tr>
                <tr>
                  <td>003</td>
                  <td>Charlie</td>
                  <td>Pending</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section>
            <h2>Product Inventory Table</h2>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Price (USD)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Laptop</td>
                  <td>Electronics</td>
                  <td>15</td>
                  <td>999.99</td>
                </tr>
                <tr>
                  <td>Notebook</td>
                  <td>Stationery</td>
                  <td>120</td>
                  <td>2.49</td>
                </tr>
                <tr>
                  <td>Desk Chair</td>
                  <td>Furniture</td>
                  <td>30</td>
                  <td>89.95</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={2}>Total Items</td>
                  <td>165</td>
                  <td>—</td>
                </tr>
              </tfoot>
            </table>
          </section>
        </main>

        <footer>
          <p>&copy; 2025 Generic Company. All rights reserved.</p>
        </footer>
      </body>
    </html>
  )
}

export default placeholderHTML;