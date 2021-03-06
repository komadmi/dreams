package ru.racelog3.e2e_tests

abstract class AuthBaseTest : BaseTest() {
    protected open fun checkSignInPanelControls() {
        checkText(createID(AUTH_MODE_LABEL, "SI"), "Войти", "Check the label of Auth form for Sign In")
        checkText(createID(AUTH_SUBMIT_BUTTON, "SI"), "ДАВИ НА ГАЗ!!!",
                "Check the submit button of Auth form for Sign In")
        checkText(createID(AUTH_CHANGE_MODE_LINK, "SI"), "Нет аккаунта? Создать",
                "Check the change link label of Auth form for Sign In")
    }

    protected open fun checkSignUpPanelControls() {
        checkText(createID(AUTH_MODE_LABEL, "SU"), "Зарегистрироваться", "Check the label of Auth form for Sign Up")
        checkText(createID(AUTH_SUBMIT_BUTTON, "SU"), "ДАВИ НА ГАЗ!!!",
                "Check the submit button of Auth form for Sign Up")
        checkText(createID(AUTH_CHANGE_MODE_LINK, "SU"), "Есть аккаунт? Войти",
                "Check the change link label of Auth form for Sign Up")
    }

    protected open fun checkProfilePanelControls() {
        checkText(PROFILE_NAME, "Valentino Rossi", "Check the user's name on Profile page")
        checkText(PROFILE_EMAIL, "valentino.rossi@yamaha.jp", "Check the user's email on Profile page")
        checkText(PROFILE_ROLE, "Администратор", "Check the user's role on Profile page")

        clickElement(RACER_PROFILES_LIST_EXPAND_BUTTON)

        checkText(createID(RACER_PROFILE_NAME, "1"), "", "Check the name of new racer profile")
        checkText(createID(RACER_PROFILE_BIKE_NUMBER, "1"), "", "Check the bike number of new racer profile")

        checkText(ADMIN_RACE_INFO_HEADER, "Управление гонками", "Check the name of Race Management section")
        clickElement(ADMIN_RACE_INFO_EXPAND_BUTTON)
    }
}