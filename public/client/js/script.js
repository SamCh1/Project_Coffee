// sort
const sort = document.querySelector("[sort]")
if(sort){
    let url = new URL(window.location.href);
    const sortSelect = sort.querySelector("[sort-select");
    const sortClear = sort.querySelector("[sort-clear]")

    sortSelect.addEventListener("change",() => {
        const [sortKey, sortValue] = sortSelect.value.split("-");
        url.searchParams.set("sortKey", sortKey);
        url.searchParams.set("sortValue", sortValue);
        window.location.href = url.href;
    });

    sortClear.addEventListener("click", () => {
        url.searchParams.delete("sortKey");
        url.searchParams.delete("sortValue");
        window.location.href = url.href;
    });

    const sortKey = url.searchParams.get("sortKey");
    const sortValue = url.searchParams.get("sortValue");

    if(sortKey && sortValue){
        const string = `${sortKey}-${sortValue}`;
        const optionSelected = sortSelect.querySelector(`option[value="${string}"]`)
        optionSelected.selected = true;
    }
}

