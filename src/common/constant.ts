export const Html = {
    confirmEmail: (otp: string) => `<body style="display: flex; justify-content: center;">
    <div style="width: 25%; position: absolute; margin: 0; top: 50%;
        -ms-transform: translateY(-50%);
        transform: translateY(-50%);">
        <div>
            <h3 style="text-align: center; text-transform: uppercase; padding: 8px 12px;">
                Confirm Your Email Address
            </h3>
            <div>
                <p style="text-align: left; text-transform: none;">
                    Hello there !
                </p>
            </div>
            <div>
                <p style="text-align: left; text-transform: none;">
                    Thank you for using event management application.
                    Just use this OTP below to complete your sign up request.
                </p>
            </div>
            <div>
                <p style="text-align: left; text-transform: none;">
                    Remember, never share this OTP with anyone, not even if application ask
                    to you and it expires in few minutes.
                </p>
            </div>
            <div style="text-align: center; width: 50%; font-weight: bold;
                border-radius: 8px;
                color: #ffffff; background: #0d6efd; letter-spacing: 4px;
                margin: auto">
                <h4 style="margin: auto; padding: 12px 16px; ">${otp}</h4>
            </div>
            <div>
                <p style="text-align: justify; text-transform: none;">
                    Cheer, Peace out.
                </p>
            </div>
            <div>
                <p style="text-align: center; text-transform: none;">
                    From Team Cook With Love <span style="color: #dc3545;">&hearts;</span>
                </p>
            </div>
        </div>
    </div>
</body>`,
    resetPassword: (otp: string) => ` <body style="display: flex; justify-content: center;">
    <div style="width: 25%; position: absolute; margin: 0; top: 50%;
        -ms-transform: translateY(-50%);
        transform: translateY(-50%);">
        <div>
            <h3 style="text-align: center; text-transform: uppercase; padding: 8px 12px;">
                Confirm Reset Password
            </h3>
            <div>
                <p style="text-align: left; text-transform: none;">
                    Hello there !
                </p>
            </div>
            <div>
                <p style="text-align: left; text-transform: none;">
                    Thank you for using event management application.
                    Just use this OTP below to complete your reset password request.
                </p>
            </div>
            <div>
                <p style="text-align: left; text-transform: none;">
                    Remember, never share this OTP with anyone, not even if application ask
                    to you and it expires in few minutes.
                </p>
            </div>
            <div style="text-align: center; width: 50%; font-weight: bold;
                border-radius: 8px;
                color: #ffffff; background: #0d6efd; letter-spacing: 4px;
                margin: auto">
                <h4 style="margin: auto; padding: 12px 16px; ">${otp}</h4>
            </div>
            <div>
                <p style="text-align: justify; text-transform: none;">
                    Cheer, Peace out.
                </p>
            </div>
            <div>
                <p style="text-align: center; text-transform: none;">
                    From Team Cook With Love <span style="color: #dc3545;">&hearts;</span>
                </p>
            </div>
        </div>
    </div>
</body>`,
};

export const OtpType = {
    ConfirmEmail: 1,
    ResetPassword: 2,
};

export const UploadImage = {
    image: 1,
    avatar: 2,
};
