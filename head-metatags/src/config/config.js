/* eslint-disable */
(($) => {
  // populate inputs when configuration is loaded
  window.setValues = (values) => {
     const inputs = document.querySelectorAll('input');

     inputs.forEach((input) => {
        const name = input.name;

        if (name) {
           const value = values && values[name];
           const $input = $(input);

           $input.val(value);
           $input.trigger('change');
        }
     });
  };

  window.getValues = () => {
    const values = {};
    const inputs = document.querySelectorAll('input');

    inputs.forEach((input) => {
       const name = input.name;

       if (name) {
          const inputValue = input.value;
          values[name] = inputValue;
       }
    });

    return values;
 };
})(jQuery);