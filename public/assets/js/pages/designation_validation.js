(function () {
    "use strict";
    class e {
        static initValidation() {
            One.helpers("jq-validation");
            jQuery(".designation-validation").validate({
                rules: {
                    department: {
                        required: true,
                    
                    },
                    designation: {
                        required: true,
                        minlength: 2
                    },
                 
                },
                messages: {
                    department: {
                        required: "Please enter the department name",
                        minlength: "The department name must consist of at least 2 characters"
                    },
                    designation: {
                        required: "Please enter the department name",
                        minlength: "The designation name must consist of at least 2 characters"
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

            const department = document.querySelector('#departmentSelect').value;
            const designation = document.querySelector('#designationSelect').value;


            const data = {
                department,
                designation
            };

            fetch("/admin/designation/", {
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
                     // Close the modal
                     const modal = document.querySelector('#modal-block-normal'); // Replace with your modal's ID
                     if (modal) {
                         const modalInstance = bootstrap.Modal.getInstance(modal); // Bootstrap 5
                         if (modalInstance) {
                             modalInstance.hide(); // Close the modal
                         }
                     }
 
                     // Reset the form
                     form.reset();
 
                     // Show the success notification
                     One.helpers("jq-notify", {
                         type: "success",
                         icon: "fa fa-check me-1",
                         message: "Designation added successfully!",
                     });

                       // Delay the redirection to allow the notification to be seen
                    setTimeout(() => {
                        window.location.href = "/admin/designation"; // Redirect to the department page
                    }, 2500); // Adjust delay as needed (2000ms = 2 seconds)
                    
                } else if (data.errors) {
                    e.addServerErrors(data.errors);
                } else {
                    One.helpers("jq-notify", {
                        type: "danger",
                        icon: "fa fa-times-circle me-1",
                        message: "Failed to add department. Please try again.",
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
            const validator = jQuery(".designation-validation").validate();
            
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
