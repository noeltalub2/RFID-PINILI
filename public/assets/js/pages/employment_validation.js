!(function () {
	"use strict";
	class e {
		static initValidation() {
			One.helpers("jq-validation"),
				jQuery(".employment-validation").validate({
					rules: {
						department: {
							required: true,
						},
						designation: {
							required: true,
						},
						joined_date: {
							required: true,
							date: true,
						},

						exit_date: {
					
							date: true,
						},
					},
					messages: {
						department: {
							required: "Please select department",
						},
						designation: {
							required: "Please select designation",
						},
						joined_date: {
							required: "Please select date",
						},

					
					},
					submitHandler: function (form) {
						One.layout('header_loader_on');
						// Collecting form data manually
						const department = document.querySelector(
							'select[name="department"]'
						).value;
						const designation = document.querySelector(
							'select[name="designation"]'
						).value;
						const joined_date = document.querySelector(
							'input[name="joined_date"]'
						).value;
						const exit_date = document.querySelector(
							'input[name="exit_date"]'
						).value;
						const uuid =
							document.querySelector('input[name="uuid"]').value;

						// Create a JSON object with the form data
						const data = {
							uuid,
							department,
							designation,
							joined_date,
							exit_date,
						};

						fetch("/admin/employee/employment", {
							method: "POST",
							headers: {
								"Content-Type": "application/json", // Send JSON data
							},
							body: JSON.stringify(data), // Convert data to JSON string
						})
							.then((response) => response.json())
							.then((data) => {
								One.layout('header_loader_off');
								if (data.success) {
									One.helpers("jq-notify", {
										type: "success",
										icon: "fa fa-check me-1",
										message:
											"Employment details updated successfully!",
									});
								} else {
									One.helpers("jq-notify", {
										type: "danger",
										icon: "fa fa-times-circle me-1",
										message:
											"Failed to update employment details. Please try again.",
									});
								}
							})
							.catch((error) => {
								One.layout('header_loader_off');
								One.helpers("jq-notify", {
									type: "danger",
									icon: "fa fa-times-circle me-1",
									message:
										"An error occurred. Please try again.",
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
