!(function () {
    "use strict";
    class e {
        static initValidation() {
            One.helpers("jq-validation");
            jQuery(".password-validation").validate({
                rules: {
                    current_password: {
                        required: true,
                    },
                    new_password: {
                        required: true,
                        minlength: 6,
                    },
                    confirm_password: {
                        required: true,
                        minlength: 6,
                        equalTo: "#new_password",
                    },
                },
                messages: {
                    current_password: {
                        required: "Please enter your current password",
                    },
                    new_password: {
                        required: "Please enter a new password",
                        minlength: "Your new password must be at least 6 characters long",
                    },
                    confirm_password: {
                        required: "Please confirm your new password",
                        minlength: "Your confirmation password must be at least 6 characters long",
                        equalTo: "New password and confirmation password do not match",
                    },
                },
                submitHandler: function (form) {
                    e.handleFormSubmit(form);
                }
            });
        }

        static handleFormSubmit(form) {
            One.layout('header_loader_on');
            // Clear previous custom server-side errors
            jQuery(".error").remove();

            const current_password = document.querySelector('#current_password').value;
            const new_password = document.querySelector('#new_password').value;

            const data = {
                current_password,
                new_password,
            };

            fetch("/profile/change-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // Send JSON data
                },
                body: JSON.stringify(data),
            })
            .then((response) => response.json())
            .then((data) => {
                One.layout('header_loader_off');
                if (data.success) {
                    // Reset the form
                    form.reset();

                    // Show the success notification
                    One.helpers("jq-notify", {
                        type: "success",
                        icon: "fa fa-check me-1",
                        message: "Password changed successfully!",
                    });

        
                    
                } else if (data.errors) {
                    e.addServerErrors(data.errors);
                } else {
                    One.helpers("jq-notify", {
                        type: "danger",
                        icon: "fa fa-times-circle me-1",
                        message: "Failed to change password. Please try again.",
                    });
                }
            })
            .catch((error) => {
                One.layout('header_loader_off');
                One.helpers("jq-notify", {
                    type: "danger",
                    icon: "fa fa-times-circle me-1",
                    message: "An error occurred. Please try again.",
                });
                console.error("Error:", error);
            });
        }

        static addServerErrors(errors) {
            // Use jQuery Validation's `showErrors` method to add the server-side errors
            const validator = jQuery(".password-validation").validate();
            
            // Prepare the errors object
            const errorMessages = {};
            errors.forEach(error => {
                errorMessages[error.field] = error.msg;
            });

            // Show the errors
            validator.showErrors(errorMessages);
        }

        static init() {
            this.initValidation();
        }
    }
    One.onLoad(() => e.init());
})();
