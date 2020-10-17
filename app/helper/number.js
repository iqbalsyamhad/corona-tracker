module.exports = function(number) {    
    return Number(number).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
}