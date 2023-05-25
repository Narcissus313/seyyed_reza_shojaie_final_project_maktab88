const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{4,}$/;

const profileData = document.getElementById("profile-data");
const newPasswordDiv = document.getElementById("newPasswordDiv");
const editInfoBtn = document.getElementById("editInfoBtn");
const saveInfoBtn = document.getElementById("saveInfoBtn");
const inputFirstName = document.getElementById("inputFirstName");
const inputLastName = document.getElementById("inputLastName");
const inputUsername = document.getElementById("inputUsername");
const inputPhoneNumber = document.getElementById("inputPhoneNumber");
const genderSelection = document.getElementById("genderSelection");
const genderDiv = document.getElementById("genderDiv");
const saveChangedPasswordBtn = document.getElementById(
	"saveChangedPasswordBtn"
);
const deleteAccountBtn = document.getElementById("deleteAccountBtn");
const uploadAvatarBtn = document.getElementById("uploadAvatarBtn");
const inputOldPassword = document.getElementById("inputOldPassword");
const inputNewPassword = document.getElementById("inputNewPassword");
const inputNewPasswordConfirm = document.getElementById(
	"inputNewPasswordConfirm"
);
const fileInput = document.getElementById("avatar");
const uploadButton = document.getElementById("updateAvatarBtn");
const removeAvatarBtn = document.getElementById("removeAvatarBtn");

genderDiv.innerHTML = ``;
genderDiv.innerHTML = `
    <select class="form-select form-select-lg text-black fs-6"
        aria-label=".form-select-lg example" id="genderSelection" disabled>
        <option value=" not-set" selected>${userData.gender}</option>
        <option value=" male">male</option>
        <option value="female">female</option>
    </select>
`;

const showAlert = (successStatus, text) => {
	let alert = document.getElementById("alertBox");
	let alertText = document.getElementById("alertText");
	let status = "success";

	alert.classList.remove("alert-success");
	alert.classList.remove("alert-danger");
	if (!successStatus) status = "danger";
	alert.classList.add("alert-" + status);
	alertText.innerHTML = text;

	alert.classList.remove("d-none");
	setTimeout(() => {
		alert.classList.add("d-none");
	}, 2500);
};

uploadButton.addEventListener("click", async (event) => {
	event.preventDefault();
	const file = fileInput.files[0];

	if (!file) return showAlert(false, "Please upload your avatar first");

	const formData = new FormData();
	formData.append("avatar", file);
	// console.log('formData: ', formData);

	try {
		const response = await fetch(
			"http://localhost:3000/user/uploadAvatar",
			{
				method: "POST",
				body: formData,
			}
		);
		const result = await response.json();
		showAlert(result.success, result.message);

		if (result.success) {
			setTimeout(() => {
				window.location.href = "http://localhost:3000/user/dashboard";
			}, 1000);
		}
	} catch (error) {
		console.error(error);
	}
});

editInfoBtn.addEventListener("click", (e) => {
	e.preventDefault();
	editInfoBtn.classList.add("d-none");
	saveInfoBtn.classList.remove("d-none");
	newPasswordDiv.classList.remove("d-none");

	// inputOldPassword.removeAttribute("disabled");
	// inputOldPassword.classList.remove("text-bg-light");
	// inputOldPassword.classList.add("text-bg-white");

	// inputNewPassword.removeAttribute("disabled");
	// inputNewPassword.classList.remove("text-bg-light");
	// inputNewPassword.classList.add("text-bg-white");

	// inputNewPasswordConfirm.removeAttribute("disabled");
	// inputNewPasswordConfirm.classList.remove("text-bg-light");
	// inputNewPasswordConfirm.classList.add("text-bg-white");

	inputFirstName.removeAttribute("disabled");
	inputFirstName.classList.remove("text-bg-light");
	inputFirstName.classList.add("text-bg-white");

	inputLastName.removeAttribute("disabled");
	inputLastName.classList.remove("text-bg-light");
	inputLastName.classList.add("text-bg-white");

	inputPhoneNumber.removeAttribute("disabled");
	inputPhoneNumber.classList.remove("text-bg-light");
	inputPhoneNumber.classList.add("text-bg-white");

	genderDiv.innerHTML = `
    <select class="form-select form-select-lg text-black fs-6"
        aria-label=".form-select-lg example" id="genderSelection">
        <option value="not-set" selected>not-set</option>
        <option value="male">male</option>
        <option value="female">female</option>
    </select>
`;
});

saveInfoBtn.addEventListener("click", async (e) => {
	const firstName = inputFirstName.value.trim();
	const lastName = inputLastName.value.trim();
	const username = inputUsername.value.trim();
	let gender = "";
	var options = ["male", "female", "not-set"];
	for (const option of options) {
		if (option === document.getElementById("genderSelection").value)
			gender = option;
	}

	const phoneNumber = document
		.getElementById("inputPhoneNumber")
		.value.trim();

	if (firstName.length < 3 || firstName.length > 30)
		return showAlert(
			false,
			"First name must be at least 3 characters and at most 30"
		);

	if (lastName.length < 3 || lastName.length > 30)
		return showAlert(
			false,
			"Last name must be at least 3 characters and at most 30"
		);

	let data = {
		firstName,
		lastName,
		gender,
		username,
		phoneNumber,
	};

	try {
		const response = await fetch("http://localhost:3000/user/update", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		const result = await response.json();
		showAlert(result.success, result.message);

		if (result.success) {
			inputFirstName.disabled = true;
			inputFirstName.classList.remove("text-bg-white");
			inputFirstName.classList.add("text-bg-light");

			inputLastName.disabled = true;
			inputLastName.classList.remove("text-bg-white");
			inputLastName.classList.add("text-bg-light");

			inputPhoneNumber.disabled = true;
			inputPhoneNumber.classList.remove("text-bg-white");
			inputPhoneNumber.classList.add("text-bg-light");

			document
				.getElementById("genderSelection")
				.setAttribute("disabled", "disabled");

			saveInfoBtn.classList.add("d-none");
			editInfoBtn.classList.remove("d-none");
		}
	} catch (error) {
		console.log("Error:", error.message);
	}
});

saveChangedPasswordBtn.addEventListener("click", async (e) => {
	const username = inputUsername.value.trim();
	const oldPassword = inputOldPassword.value.trim();
	const newPassword = document
		.getElementById("inputNewPassword")
		.value.trim();
	const newPasswordConfirm = document
		.getElementById("inputNewPasswordConfirm")
		.value.trim();

	if (!newPassword.match(passwordRegex))
		return showAlert(
			false,
			"Password must be at least 4 characters and alphanumeric"
		);

	if (newPassword !== newPasswordConfirm)
		return showAlert(false, "Passwords do not match");

	data = { username, oldPassword, newPassword, newPasswordConfirm };
	console.log("data: ", data);

	try {
		const response = await fetch(
			"http://localhost:3000/user/updatePassword",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			}
		);

		const result = await response.json();
		console.log("result: ", result);
		showAlert(result.success, result.message);
	} catch (error) {
		console.log("Error:", error.message);
	}
});

deleteAccountBtn.addEventListener("click", async (e) => {
	const deleteStatus = confirm(
		"Are you sure you want to delete your account?"
	);

	if (deleteStatus === true) {
		try {
			const response = await fetch(
				"http://localhost:3000/user/deleteUser",
				{
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			const result = await response.json();
			console.log("result: ", result);
			showAlert(result.success, result.message);
			if (result.success) {
				setTimeout(() => {
					window.location.href = "http://localhost:3000/user/login";
				}, 1000);
			}
		} catch (error) {
			console.log("Error:", error.message);
		}
	}
});

removeAvatarBtn.addEventListener("click", async (e) => {
	e.preventDefault();
	console.log(userData);
	if (!userData.avatar)
		return showAlert(false, "Please upload your avatar first");

	const confirmStatus = confirm(
		"Are you sure you want to delete your avatar?"
	);
	if (!confirmStatus) return;

	try {
		const response = await fetch(
			"http://localhost:3000/user/removeAvatar",
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		const result = await response.json();
		console.log("result: ", result);
		showAlert(result.success, result.message);
		if (result.success) {
			setTimeout(() => {
				window.location.href = "http://localhost:3000/user/dashboard";
			}, 1000);
		}
	} catch (error) {
		console.log("Error:", error.message);
	}
});
