// hàm chuyển đổi từ số sang dạng hiển thị tiền VND
const ConvertToVnd = (number) => {
    if (!number) return 0;
    return number.toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace('.000', '')
}

export { ConvertToVnd };