function intToBin(number) {
  return (+number).toString(2).padStart(8, '0');
};

module.exports = {
  intToBin,
}
