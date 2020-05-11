import React from "react";
import { fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { renderWithReduxAndRouter } from "../../test.utils";
import { emailChecks, passwordChecks } from "./user.sign.container.common";
import UserSignInContainer from "../../../components/user/user.sign-in.container";

test("loads and displays sign-in", async () => {
  await act(async () => {
    const { getByLabelText, getByText } = renderWithReduxAndRouter(<UserSignInContainer />);

    fireEvent.click(getByLabelText("Почта"));
    fireEvent.click(getByLabelText("Пароль"));
    fireEvent.click(getByText("Дави на газ!!!"));
    fireEvent.click(getByText("Нет аккаунта? Создать"));
  });
});

test("sign-in form's checks for Email", async () => {
  await act(async () => {
    await emailChecks(<UserSignInContainer />);
  });
});

test("sign-in form's checks for Password", async () => {
  await act(async () => {
    await passwordChecks(<UserSignInContainer />);
  });
});
