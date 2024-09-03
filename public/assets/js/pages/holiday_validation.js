(function () {
	"use strict";
	class e {
		static initValidation() {
			One.helpers("jq-validation");
			jQuery(".holiday-validation").validate({
				rules: {
                    month: {
                        required: true,
                        min: 1,
                        max: 12,
                    },
                    day: {
                        required: true,
                        min: 1,
                        max: 31,
                    },
                    description: { 
                        required: true, 
                        minlength: 3 
                    },
                },
                messages: {
                    month: {
                        required: "Please select a month.",
                        min: "The month value must be between 1 and 12.",
                        max: "The month value must be between 1 and 12.",
                    },
                    day: {
                        required: "Please enter the day.",
                        min: "The day value must be between 1 and 31.",
                        max: "The day value must be between 1 and 31.",
                    },
                    description: {
                        required: "Please enter the holiday description.",
                        minlength: "The holiday description must consist of at least 3 characters.",
                    },
                },
                
				submitHandler: function (form, event) {
					event.preventDefault(); // Prevent default form submission
					e.handleFormSubmit(form);
				},
			});
		}

		static handleFormSubmit(form) {
			One.layout('header_loader_on');
			// Clear previous custom server-side errors
			jQuery(".error").remove();

			const month =
				document.querySelector("#monthSelect").value;
			const day = document.querySelector("#daySelect").value;
            const description = document.querySelector("#addDescription").value;

			const data = {
				day,
				month,
                description
			};

			fetch("/admin/holiday", {
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
						const modal = document.querySelector(
							"#modal-block-normal"
						); // Replace with your modal's ID
						if (modal) {
							const modalInstance =
								bootstrap.Modal.getInstance(modal); // Bootstrap 5
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
							message: "Holiday added successfully!",
						});

						// Delay the redirection to allow the notification to be seen
						setTimeout(() => {
							window.location.href = "/admin/holiday"; // Redirect to the department page
						}, 2500); // Adjust delay as needed (2000ms = 2 seconds)
					} else if (data.errors) {
						e.addServerErrors(data.errors);
					} else {
						One.helpers("jq-notify", {
							type: "danger",
							icon: "fa fa-times-circle me-1",
							message:
								"Failed to add holiday. Please try again.",
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
			const validator = jQuery(".holiday-validation").validate();

			// Prepare the errors object
			const errorMessages = {};
			errors.forEach((error) => {
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
