!(function () {
	"use strict";
	class e {
		static initValidation() {
			One.helpers("jq-validation");
			jQuery(".request-password").validate({
				rules: {
					email: {
						required: true,
						email: true,
					},
				},
				messages: {
					email: {
						required: "Please enter your email",
					},
				},
				submitHandler: function (form, event) {
					event.preventDefault(); // Prevent default form submission
					e.handleFormSubmit(form);
				},
			});
		}

		static handleFormSubmit(form) {
			// Get the submit button and spinner elements
			const submitButton = document.querySelector("#submit-button");
			const buttonText = document.querySelector("#button-text");
			const spinner = document.querySelector("#spinner");
			const emailIcon = document.querySelector("#email-icon");

			// Disable the button and show the spinner
			submitButton.disabled = true;
			buttonText.style.display = "none";
			emailIcon.style.display = "none";
			spinner.classList.remove("d-none");

			// Clear previous custom server-side errors
			jQuery(".error").remove();

			const email = document.querySelector("#email").value;

			const data = {
				email,
			};

			fetch("/request-reset", {
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
							message: data.msg,
						});
					} else if (data.errors) {
						e.addServerErrors(data.errors);
					} else {
						One.helpers("jq-notify", {
							type: "danger",
							icon: "fa fa-times-circle me-1",
							message: "Failed to request password. Please try again.",
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
				})
				.finally(() => {
					// Re-enable the button and hide the spinner
					submitButton.disabled = false;
					buttonText.style.display = "inline";
					emailIcon.style.display = "inline";
					spinner.classList.add("d-none");
				});
		}

		static addServerErrors(errors) {
			// Use jQuery Validation's `showErrors` method to add the server-side errors
			const validator = jQuery(".request-password").validate();

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
