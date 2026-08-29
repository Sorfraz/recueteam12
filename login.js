/* =========================================================
   SENTINELMESH
   ADMIN LOGIN SYSTEM
   ========================================================= */


/* =========================================================
   LOGIN CREDENTIALS
   ========================================================= */

const DEMO_EMAIL = "sorfrazmondal@gmail.com";
const DEMO_PASSWORD = "Sorfraz@2006";


/* =========================================================
   GET ELEMENTS
   ========================================================= */

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const rememberInput = document.getElementById("remember");
const loginMessage = document.getElementById("loginMessage");
const eyeIcon = document.getElementById("eyeIcon");


/* =========================================================
   SHOW / HIDE PASSWORD
   ========================================================= */

function togglePassword() {

    if (!passwordInput) return;

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

        if (eyeIcon) {
            eyeIcon.classList.remove("fa-eye");
            eyeIcon.classList.add("fa-eye-slash");
        }

    } else {

        passwordInput.type = "password";

        if (eyeIcon) {
            eyeIcon.classList.remove("fa-eye-slash");
            eyeIcon.classList.add("fa-eye");
        }

    }
}


/* =========================================================
   MAKE FUNCTION AVAILABLE TO HTML
   ========================================================= */

window.togglePassword = togglePassword;


/* =========================================================
   FORGOT PASSWORD
   ========================================================= */

function forgotPassword(event) {

    event.preventDefault();

    alert(
        "Forgot your password?\n\n" +
        "Please contact the system administrator " +
        "to reset your SentinelMesh admin password."
    );
}

window.forgotPassword = forgotPassword;


/* =========================================================
   DISPLAY LOGIN MESSAGE
   ========================================================= */

function showMessage(message, type) {

    if (!loginMessage) return;

    loginMessage.textContent = message;

    loginMessage.className =
        "login-message " + type;
}


/* =========================================================
   LOGIN FUNCTION
   ========================================================= */

function loginUser(event) {

    event.preventDefault();


    /* -----------------------------------------
       GET USER INPUT
    ----------------------------------------- */

    const email =
        emailInput.value.trim();

    const password =
        passwordInput.value;


    /* -----------------------------------------
       CLEAR PREVIOUS MESSAGE
    ----------------------------------------- */

    showMessage("", "");


    /* -----------------------------------------
       VALIDATION
    ----------------------------------------- */

    if (email === "") {

        showMessage(
            "Please enter your email address.",
            "error"
        );

        emailInput.focus();

        return;
    }


    if (password === "") {

        showMessage(
            "Please enter your password.",
            "error"
        );

        passwordInput.focus();

        return;
    }


    /* -----------------------------------------
       CHECK LOGIN CREDENTIALS
    ----------------------------------------- */

    if (
        email === DEMO_EMAIL &&
        password === DEMO_PASSWORD
    ) {

        /* Successful Login */

        showMessage(
            "Login successful. Opening Command Center...",
            "success"
        );


        /* -----------------------------------------
           SAVE LOGIN SESSION
        ----------------------------------------- */

        if (rememberInput && rememberInput.checked) {

            localStorage.setItem(
                "sentinelmeshRemember",
                "true"
            );

            localStorage.setItem(
                "sentinelmeshEmail",
                email
            );

        } else {

            sessionStorage.setItem(
                "sentinelmeshLoggedIn",
                "true"
            );

        }


        /* -----------------------------------------
           REDIRECT TO DASHBOARD
        ----------------------------------------- */

        setTimeout(function() {

            window.location.href = "dashboard.html";

        }, 900);


    } else {

        /* -----------------------------------------
           INVALID LOGIN
        ----------------------------------------- */

        showMessage(
            "Invalid email or password.",
            "error"
        );


        passwordInput.value = "";

        passwordInput.focus();

    }

}


/* =========================================================
   CONNECT LOGIN FORM
   ========================================================= */

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        loginUser
    );

}


/* =========================================================
   LOAD REMEMBERED EMAIL
   ========================================================= */

function loadRememberedUser() {

    const remembered =
        localStorage.getItem(
            "sentinelmeshRemember"
        );

    const savedEmail =
        localStorage.getItem(
            "sentinelmeshEmail"
        );


    if (
        remembered === "true" &&
        savedEmail
    ) {

        emailInput.value = savedEmail;

        if (rememberInput) {
            rememberInput.checked = true;
        }

    }

}


/* =========================================================
   RUN WHEN PAGE LOADS
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadRememberedUser();

    }
);