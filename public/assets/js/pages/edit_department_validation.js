(function () {
    "use strict";
    class e {
        static initValidation() {
            One.helpers("jq-validation");
            jQuery(".edit-department-validation").validate({
                rules: {
                    department: {
                        required: true,
                        minlength: 2
                    },
                    contact_number: {
                        required: true,
                        minlength: 11,
                        digits: true,
                    },
                    room_location: {
                        required: true,
                        minlength: 2
                    },
                },
                messages: {
                    department: {
                        required: "Please enter the department name",
                        minlength: "The department name must consist of at least 2 characters"
                    },
                    contact_number: {
                        required: "Please enter the contact number",
                        minlength: "The contact number must consist of at least 11 digits",
                        digits: "Please enter a valid contact number"
                    },
                    room_location: {
                        required: "Please enter the room location",
                        minlength: "The room location must consist of at least 2 characters"
                    }
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

            const departmentId = document.querySelector('#edit-department-id').value;
            const department = document.querySelector('#edit-department-input').value;
            const contact_number = document.querySelector('#edit-contact-input').value;
            const room_location = document.querySelector('#edit-roomnumber-input').value;

            const data = {
                department_id: departmentId,
                department,
                contact_number,
                room_location
            };

            fetch("/admin/department/edit/", {
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
                    const modal = document.querySelector('#modal-edit-department'); // Replace with your modal's ID
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
                        message: "Department updated successfully!",
                    });

                    // Delay the redirection to allow the notification to be seen
                    setTimeout(() => {
                        window.location.href = "/admin/department"; // Redirect to the department page
                    }, 2500); // Adjust delay as needed (2500ms = 2.5 seconds)
                    
                } else if (data.errors) {
                    e.addServerErrors(data.errors);
                } else {
                    One.helpers("jq-notify", {
                        type: "danger",
                        icon: "fa fa-times-circle me-1",
                        message: "Failed to update department. Please try again.",
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
            const validator = jQuery(".edit-department-validation").validate();
            
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


function editDepartment(departmentId) {
    $(".error").remove(); // Remove any existing error messages
    $(".is-invalid").removeClass("is-invalid"); // Remove any invalid class if applied
    $.ajax({
        url: "/admin/department/" + departmentId + "/edit/",
        method: "GET",
        success: function (data) {
            if (data.success && data.data) {
                const department = data.data;

                $("#edit-department-id").val(department.dp_id);
                $("#edit-department-input").val(department.department);
                $("#edit-contact-input").val(department.contact_number);
                $("#edit-roomnumber-input").val(department.room_location);

                // Show the modal using Bootstrap 5 API
                const modal = new bootstrap.Modal(document.getElementById('modal-edit-department'));
                modal.show();
            } else {
                console.error("Invalid response format");
            }
        },
        error: function (error) {
            console.error("Failed to fetch department data", error);
        },
    });
}

// Ensure that the functions are globally available
window.editDepartment = editDepartment;
