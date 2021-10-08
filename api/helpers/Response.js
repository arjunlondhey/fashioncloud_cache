
module.exports = {
  /*
  * Format the data to API response format.
  */
  generateResponse: function (action, data) {
    return {
      meta: {
        action: action
      },
      data: data
    };
  }
}