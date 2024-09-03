(function () {
    "use strict";
    class e {
        static initValidation() {
            One.helpers("jq-validation");

            jQuery(".rfid-validation").validate({
                rules: {
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
                                // Handle response to check if the RFID is available
                                var json = JSON.parse(response);
                                return json.available ? "true" : "false";
                            }
                        }
                    }
                },
                messages: {
                    rfid: {
                        remote: "RFID Card is already registered.",
                        required: "Please enter RFID Card",
                    }
                },
                submitHandler: function (form) {
                    One.layout('header_loader_on');
                    const uuid = document.querySelector('input[name="uuid"]').value;
                    const rfid = document.querySelector('input[name="rfid"]').value;
                    const status = document.querySelector('input[name="status"]');
                    // Check if the checkbox is checked
                    const isChecked = status.checked;
                    
                    const data = {
                        uuid,
                        rfid,
                        status: isChecked
                    };

                    fetch("/admin/employee/rfid", {
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
                                message: "RFID Card updated successfully!",
                            });
                        } else {
                            One.helpers("jq-notify", {
                                type: "danger",
                                icon: "fa fa-times-circle me-1",
                                message: "Failed to update user details. Please try again.",
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
            });
        }

        static init() {
            this.initValidation();
        }
    }

    One.onLoad(() => e.init());
})();
