!(function () {
    "use strict";
    class e {
        static initValidation() {
            One.helpers("jq-validation");

            jQuery(".profile3-validation").validate({
                rules: {
                    firstname: {
                        required: true,
                        minlength: 2
                    },
                    middlename: {
                        required: true,
                        minlength: 2
                    },
                    lastname: {
                        required: true,
                        minlength: 2
                    },
                    gender: {
                        required: true
                    },
                    address: {
                        required: true,
                        minlength: 5
                    },
                    email: {
                        required: true,
                        email: true,
                        remote: {
                            url: '/check-email',
                            type: 'POST',
                            data: {
                                email: function () {
                                    return $("#email").val();
                                },
                                uuid: function () {
                                    return $('input[name="uuid"]').val(); // Adjust if necessary
                                }
                            },
                            dataType: 'json',
                            async: true, // Ensures that the request is asynchronous
                            dataFilter: function (response) {
                                var json = JSON.parse(response);
                                return json.available ? "true" : "false";
                            }
                        }
                    },
                    phonenumber: {
                        required: true,
                        minlength: 11,
                        remote: {
                            url: '/check-phonenumber',
                            type: 'POST',
                            data: {
                                phonenumber: function () {
                                    return $("#phonenumber").val();
                                },
                                uuid: function () {
                                    return $('input[name="uuid"]').val(); // Adjust if necessary
                                }
                            },
                            dataType: 'json',
                            async: true, // Ensures that the request is asynchronous
                            dataFilter: function (response) {
                                var json = JSON.parse(response);
                                return json.available ? "true" : "false";
                            }
                        }
                    },
                    // Other rules and fields
                },
                messages: {
                    firstname: {
                        required: "Please enter your first name",
                        minlength: "Your first name must consist of at least 2 characters"
                    },
                    middlename: {
                        required: "Please enter your middle name",
                        minlength: "Your middle name must consist of at least 2 characters"
                    },
                    lastname: {
                        required: "Please enter your last name",
                        minlength: "Your last name must consist of at least 2 characters"
                    },
                    gender: {
                        required: "Please select your gender"
                    },
                    address: {
                        required: "Please enter your address",
                        minlength: "Your address must consist of at least 5 characters"
                    },
             
                    birthday: {
                        required: "Please select your birthday",
                        date: "Please enter a valid date"
                    },
                    email: {
                        remote: "Email is already taken.",
                        required: "Please enter your email address",
                    },
                    phonenumber: {
                        required: "Please enter your phone number",
                         minlength: "Please enter a valid phone number",
                        remote: "Phone number is already taken."
                    },
                    // Other messages
                },
                submitHandler: function (form) {
                    One.layout('header_loader_on');
                    const formData = new FormData(form); // Collect form data
        
                    fetch('/profile', {
                        method: 'POST',
                        body: formData,
                    })
                        .then(response => response.json())
                        .then(data => {
                            One.layout('header_loader_off');
                            if (data.success) {
                                One.helpers('jq-notify', {
                                    type: 'success',
                                    icon: 'fa fa-check me-1',
                                    message: 'Account updated successfully!'
                                });
                            } else {
                                One.helpers('jq-notify', {
                                    type: 'danger',
                                    icon: 'fa fa-times-circle me-1',
                                    message: 'Failed to update user details. Please try again.'
                                });
                            }
                        })
                        .catch(error => {
                            One.layout('header_loader_off');
                            One.helpers('jq-notify', {
                                type: 'danger',
                                icon: 'fa fa-times-circle me-1',
                                message: 'An error occurred. Please try again.'
                            });
                            console.error('Error:', error);
                        });
                }
            });
        }
        static init() {
            this.initValidation();
        }
    }
    One.onLoad(() => e.init());
})();
