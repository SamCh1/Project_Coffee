// Show Alert
const showAlert = document.querySelector("[show-alert]");
if(showAlert) {
  const time = parseInt(showAlert.getAttribute("data-time"));
  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);

  const closeAlert = showAlert.querySelector("[close-alert]");
  closeAlert.addEventListener("click", () => {
    showAlert.classList.add("alert-hidden");
  });
}
// End Show Alert


// Table cart
const tableCart = document.querySelector("[table-cart]")
if(tableCart){
  const inputsQuantity = tableCart.querySelectorAll("input[name='quantity']");

  inputsQuantity.forEach(input => {
    input.addEventListener("change", () => {
      const productId = input.getAttribute("item-id");
      const quantity = input.value;

      window.location.href = `/cart/update/${productId}/${quantity}`;
    });
  });
}
// End table cart

//Pagination
const buttonPagination = document.querySelectorAll("[button-pagination]");
if(buttonPagination.length > 0){
    let url = new URL(window.location.href);
    buttonPagination.forEach(button => {
        button.addEventListener("click", () =>{
            const page = button.getAttribute("button-pagination");
            url.searchParams.set("page", page);
            window.location.href = url.href;
        });
    });
}
//End pagination