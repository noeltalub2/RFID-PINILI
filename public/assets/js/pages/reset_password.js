!(function () {
    "use strict";
    class e {
        static initValidation() {
            One.helpers("jq-validation");
            jQuery(".reset-password").validate({
                rules: {
                  
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
                submitHandler: function (form,event) {
                    event.preventDefault(); // Prevent default form submission
                    e.handleFormSubmit(form);
                }
            });
        }

        static handleFormSubmit(form) {
       
            // Clear previous custom server-side errors
            jQuery(".error").remove();
            const token = document.querySelector('#token').value;
            const confirm_password = document.querySelector('#confirm_password').value;
            const new_password = document.querySelector('#new_password').value;

            const data = {
                token,
                confirm_password,
                new_password,
            };

            fetch("/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // Send JSON data
                },
                body: JSON.stringify(data),
            })
            .then((response) => response.json())
            .then((data) => {
             
                if (data.success) {
                    // Reset the form
                    form.reset();

                    // Show the success notification
                    One.helpers("jq-notify", {
                        type: "success",
                        icon: "fa fa-check me-1",
                        message: data.msg
                    });

                    setInterval(() => {
                        window.location.href = '/signin'
                    },3000)

        
                    
                }  else {
                    One.helpers("jq-notify", {
                        type: "danger",
                        icon: "fa fa-times-circle me-1",
                        message: data.msg,
                    });
                }
            })
            .catch((error) => {
             
                One.helpers("jq-notify", {
                    type: "danger",
                    icon: "fa fa-times-circle me-1",
                    message: "An error occurred. Please try again.",
                });
                console.error("Error:", error);
            });
        }



        static init() {
            this.initValidation();
        }
    }
    One.onLoad(() => e.init());
})();
