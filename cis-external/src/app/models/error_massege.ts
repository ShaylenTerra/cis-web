export const error_messege = {
    'password': [
        { type: 'required', message: 'Password is required' },
        { type: 'minlength', message: 'Password must be at least 6 chars long' },
        { type: 'strong', message: 'Password Contain at least 1 uppercase, 1 lowercase, & 1 number' }
    ],
    'Password': [
        { type: 'required', message: 'Password is required' },
        { type: 'minlength', message: 'Password must be at least 6 chars long' },
        { type: 'strong', message: 'Password Contain at least 1 uppercase, 1 lowercase, & 1 number' }
    ],
    'pswd': [
        { type: 'required', message: 'Password is required' },
        { type: 'minlength', message: 'Password must be at least 6 chars long' },
        { type: 'strong', message: 'Password Contain at least 1 uppercase, 1 lowercase, & 1 number' }
    ],
    'confirm_password': [
        { type: 'required', message: 'Confirm password is required' },
        { type: 'mustMatch', message: 'Passwords must be matched' }
    ],
    'old_password': [
        { type: 'required', message: 'Old password is required' }
    ]
};
