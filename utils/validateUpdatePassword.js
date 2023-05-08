const User = require("../models/User");

const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{4,}$/;

const validateUpdatePassword = async (req, res, next) => {
	const { username, oldPassword, newPassword, newPasswordConfirm } = req.body;

	try {
		const user = await User.findOne({ username: username });

		if (!user) {
			return res.json({
				success: false,
				message: "Username does not exist",
			});
		}
		const isMatch = await user.validatePassword(oldPassword);
		if (!isMatch) {
			return res.json({
				success: false,
				message: "Wrong Password",
			});
		}

		if (!newPassword.match(passwordRegex))
			return res.json({
				success: false,
				message:
					"New Password must be at least 4 characters long using alpha numeric pattern",
			});

		if (newPassword !== newPasswordConfirm)
			return res.json({
				success: false,
				message: "Passwords do not match",
			});

		res.locals.password = newPassword;

		// const updatedUser = await User.findByIdAndUpdate(
		// 	user._id,
		// 	{
		// 		password: req.body.newPassword,
		// 	},
		// 	{ new: true }
		// );
		// req.session.user.firstName = user.firstName;
		// req.session.user.lastName = user.lastName;
		// req.session.user.phoneNumber = user.phoneNumber;

		// res.json({ success: true, message: "User updated successfully" });
		next();
	} catch (err) {
		res.redirect(
			url.format({
				pathname: "/user/login",
				query: {
					errorMessage: "Server Error!",
				},
			})
		);
	}
};

module.exports = validateUpdatePassword;
