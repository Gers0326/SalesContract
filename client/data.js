document.addEventListener("DOMContentLoaded", () => {
    App.init();
});

const salesForm = document.getElementById("salesForm");

salesForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const productName = salesForm["name"].value;
    const price = salesForm["price"].value;
    const addressee = salesForm["addressee"].value;
    // const description = salesForm["description"].value;
    console.log({
        "product name": productName,
        "price": price,
        "addressee": addressee
    })
    salesForm.reset();
    App.comprar(productName,price,addressee)
  });