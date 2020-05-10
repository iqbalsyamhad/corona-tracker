module.exports = function(angka) {    
    return Number(angka).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
}