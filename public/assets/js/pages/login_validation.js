!(function () {
	"use strict";
	class e {
		static initValidation() {
			One.helpers("jq-validation");
			
           
			// Custom method to check if username is available
			jQuery.validator.addMethod(
				"usernameAvailable",
				function (value, element) {
					let isAvailable = false;
					const uuid = jQuery('input[name="uuid"]').val();

					// AJAX call to validate username
					jQuery.ajax({
						url: "/admin/employee/check-username", // Replace with your actual endpoint
						type: "POST",
						data: { username: value, uuid: uuid },
						dataType: "json",
						async: false,
						success: function (response) {
							isAvailable = response.available;
						},
					});

					return isAvailable;
				},
				"Username is already taken."
			);

			jQuery(".login-validation").validate({
				rules: {
					username: {
						required: true,
						minlength: 3,
						usernameAvailable: true,
					},
					password: { required: true, minlength: 6 },
				},
				messages: {
					username: {
						required: "Please enter a username",
						minlength:
							"Your username must be at least 3 characters long",
						usernameAvailable: "Username is already taken",
					},
					password: {
						required: "Please enter a new password",
						minlength:
							"Your password must be at least 6 characters long",
					},
				},
				submitHandler: function (form) {
					One.layout('header_loader_on');
					const uuid =
						document.querySelector('input[name="uuid"]').value;
					const password = document.querySelector(
						'input[name="password"]'
					).value;
					const username = document.querySelector(
						'input[name="username"]'
					).value;

					const data = {
						uuid,
						username,
						password,
					};

					fetch("/admin/employee/login", {
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
								One.helpers("jq-notify", {
									type: "success",
									icon: "fa fa-check me-1",
									message: "Account updated successfully!",
								});
							} else {
								One.helpers("jq-notify", {
									type: "danger",
									icon: "fa fa-times-circle me-1",
									message:
										"Failed to update user details. Please try again.",
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
				},
			});
		}
		static init() {
			this.initValidation();
		}
	}
	One.onLoad(() => e.init());
})();
