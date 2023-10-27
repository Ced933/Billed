/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import {ROUTES_PATH} from "../constants/routes.js";
import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import {localStorageMock} from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store" 
import router from "../app/Router.js";

jest.mock('../app/Store', () => mockStore)

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then new bill icon in vertical layout should be highlighted", async () => {
      // se connecter en tant que employé 
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
    const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
      // initialisation de newBill 
      const newBill = new NewBill({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage,
      });
      // simule l'appel de fonction lorsqu'on clique sur newbill handleChangeFile s'enclanche
      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
    })
  })
})
