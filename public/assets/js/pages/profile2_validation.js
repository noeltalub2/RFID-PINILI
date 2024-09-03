!(function () {
    "use strict";
    class e {
        static initValidation() {
            One.helpers("jq-validation");

 

            jQuery(".profile2-validation").validate({
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
               
              
                    birthday: {
                        required: true,
                        date: true
                    },
                    password: {
                        required: true,
                        minlength: 6
                    },
                    confirm_password: {
                        required: true,
                        equalTo: "#password"
                    },
                    department: {
                        required: true
                    },
                    designation: {
                        required: true
                    },
                    joined_date: {
                        required: true,
                        date: true
                    },
                    username: {
                        required: true,
                        minlength: 2,
                        remote: {
                            url: '/admin/employee/check-username',
                            type: 'POST',
                            data: {
                                username: function () {
                                    return $("#username").val();
                                },
                                uuid: function () {
                                    return $("#uuid").val(); // Adjust based on your UUID input
                                }
                            },
                            dataType: 'json',
                            async: true, // Ensures that the request is asynchronous
                            dataFilter: function (response) {
                                // Handle response to check if the username is available
                                var json = JSON.parse(response);
                                return json.available ? "true" : "false";
                            }
                        }
                    },
                    email: {
                        required: true,
                        email: true,
                        remote: {
                            url: '/admin/employee/check-email',
                            type: 'POST',
                            data: {
                                email: function () {
                                    return $("#email").val();
                                },
                                uuid: function () {
                                    return $("#uuid").val(); // Adjust based on your UUID input
                                }
                            },
                            dataType: 'json',
                            async: true, // Ensures that the request is asynchronous
                            dataFilter: function (response) {
                                // Handle response to check if the email is available
                                var json = JSON.parse(response);
                                return json.available ? "true" : "false";
                            }
                        }
                    },
                    phonenumber: {
                        required: true,
                        minlength: 11,
                        remote: {
                            url: '/admin/employee/check-phonenumber',
                            type: 'POST',
                            data: {
                                phonenumber: function () {
                                    return $("#phonenumber").val();
                                },
                                uuid: function () {
                                    return $("#uuid").val(); // Adjust based on your UUID input
                                }
                            },
                            dataType: 'json',
                            async: true, // Ensures that the request is asynchronous
                            dataFilter: function (response) {
                                // Handle response to check if the phone number is available
                                var json = JSON.parse(response);
                                return json.available ? "true" : "false";
                            }
                        }
                    },
                    rfid: {
                        required: true,
                        minlength: 10,
                        remote: {
                            url: '/admin/employee/check-rfid',
                            type: 'POST',
                            data: {
                                rfid: function () {
                                    return $("#rfid").val();
                                },
                                uuid: function () {
                                    return $("#uuid").val(); // Adjust based on your UUID input
                                }
                            },
                            dataType: 'json',
                            async: true, // Ensures that the request is asynchronous
                            dataFilter: function (response) {
                                // Handle response to check if the username is available
                                var json = JSON.parse(response);
                                return json.available ? "true" : "false";
                            }
                        }
                    },
                    // Other rules and fields
                },
                messages: {
                    password: {
                        required: "Please enter a password",
                        minlength: "Your password must consist of at least 6 characters"
                    },
                    confirm_password: {
                        required: "Please confirm your password",
                        equalTo: "Passwords do not match"
                    },
                 
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
                    department: {
                        required: "Please select department"
                    },
                    designation: {
                        required: "Please select designation"
                    },
                    joined_date: {
                        required: "Please select date"
                    },
                    username: {
                        remote: "Username is already taken.",
                        required: "Please enter your username",
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

                    rfid: {
                        remote: "RFID Card is already registered.",
                        required: "Please enter RFID Card",
                    },
                    // Other messages
                },
                submitHandler: function (form) {
                    One.layout('header_loader_on');
                    const formData = new FormData(form); // Collect form data
        
                    fetch('/admin/employee/', {
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
                                    message: 'Account created successfully!'
                                });
                                setTimeout(() => {
                                    window.location.href = '/admin/employee';
                                }, 2000); // Adjust delay if needed
                            } else {
                                One.helpers('jq-notify', {
                                    type: 'danger',
                                    icon: 'fa fa-check me-1',
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
