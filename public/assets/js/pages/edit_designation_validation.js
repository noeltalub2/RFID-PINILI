(function () {
    "use strict";
    class e {
        static initValidation() {
            One.helpers("jq-validation");
            jQuery(".edit-designation-validation").validate({
                rules: {
                    designation: {
                        required: true,
                        minlength: 2
                    },
                  
                },
                messages: {
                    designation: {
                        required: "Please enter the designation name",
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

            const department_id = document.querySelector('#edit-department-input').value;
            const designation = document.querySelector('#edit-designation-input').value;
            const designation_id = document.querySelector('#edit-designation-input-hidden').value;
          

            const data = {
                department_id,
                designation,
                designation_id
              
            };

            fetch("/admin/designation/edit/", {
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
                    const modal = document.querySelector('#modal-edit-designation'); // Replace with your modal's ID
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
                        message: "Designation updated successfully!",
                    });

                    // Delay the redirection to allow the notification to be seen
                    setTimeout(() => {
                        window.location.href = "/admin/designation"; // Redirect to the designation page
                    }, 2500); // Adjust delay as needed (2500ms = 2.5 seconds)
                    
                } else if (data.errors) {
                    e.addServerErrors(data.errors);
                } else {
                    One.helpers("jq-notify", {
                        type: "danger",
                        icon: "fa fa-times-circle me-1",
                        message: "Failed to update designation. Please try again.",
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
            const validator = jQuery(".edit-designation-validation").validate();
            
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


function editDesignation(designationId,departmentName) {
    $(".error").remove(); // Remove any existing error messages
    $(".is-invalid").removeClass("is-invalid"); // Remove any invalid class if applied
    $.ajax({
        url: "/admin/designation/" + designationId + "/edit/",
        method: "GET",
        success: function (data) {
            if (data.success && data.data) {
                const designation = data.data;
                $("#department_name").val(designation.department);
                $("#edit-designation-input").val(designation.designation);
        
                $("#edit-department-input").val(designation.department_id);
                $("#edit-designation-input-hidden").val(designation.designation_id);
                // Show the modal using Bootstrap 5 API
                const modal = new bootstrap.Modal(document.getElementById('modal-edit-designation'));
                modal.show();
            } else {
                console.error("Invalid response format");
            }
        },
        error: function (error) {
            console.error("Failed to fetch designation data", error);
        },
    });
}

// Ensure that the functions are globally available
window.editDesignation = editDesignation;
